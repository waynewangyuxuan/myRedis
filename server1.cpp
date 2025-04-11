// stdlib
#include <assert.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <errno.h>
// system
#include <fcntl.h>
#include <poll.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <netinet/ip.h>
// C++
#include <vector>

static void msg(const char* msg){
    fprintf(stderr, "%s\n", msg);
}

static void msg_errno(const char* msg){
    fprintf(stderr, "[%d] %s\n", errno, msg);
}

static void die(const char* msg){
    int err = errno;
    fprintf(stderr, "[%d] %s\n", err, msg);
    abort();
}

//set the file descriptor to non-blocking mode
static void fd_set_nb(int fd){
    errno = 0;
    int flags = fcntl(fd, F_GETFL, 0); //get the file descriptor flags
    if (errno){
        die("fcntl()");
    }
    flags |= O_NONBLOCK; //set the non-blocking flag
    (void)fcntl(fd, F_SETFL, flags); //set the file descriptor flags. (void) does a type cast to void, so that the compiler does not complain about the return value
    if (errno){
        die("fcntl()");
    }
}

const size_t k_max_msg = 32 << 20; //likely larger than the kernel buffer. = 32 * 2^20 = 32MB

struct Conn{
    int fd = -1;
    bool want_read = false;
    bool want_write = false;
    bool want_close = false;
    std::vector<uint8_t> incoming;
    std::vector<uint8_t> outgoing;
};

// append to the back
static void
buf_append(std::vector<uint8_t> &buf, const uint8_t *data, size_t len) {
    buf.insert(buf.end(), data, data + len);
}

//remove from the front
static void buf_consume(std::vector<uint8_t> &buf, size_t len){
    buf.erase(buf.begin(), buf.begin() + len);
}

//application callback when the listening socket is ready
static Conn* handle_accept(int fd){
    //accept
    struct sockaddr_in client_addr = {};
    socklen_t len = sizeof(client_addr);
    int connfd = accept(fd, (struct sockaddr *)&client_addr, &len);
    if (connfd < 0){
        msg_errno("accept() error");
        return nullptr;
    }
    uint32_t ip = client_addr.sin_addr.s_addr;
    fprintf(stderr, "new client from %u.%u.%u.%u\n", ip & 0xff, (ip >> 8) & 0xff, (ip >> 16) & 0xff, (ip >> 24) & 0xff);

    //set the file descriptor to non-blocking mode
    fd_set_nb(connfd);

    //create a new connection object
    Conn* conn = new Conn;
    conn->fd = connfd;
    conn->want_read = true;
    return conn;
}

// process one request if there is enought data
static bool try_one_request(Conn* conn){
    if (conn->incoming.size() < 4){
        return false; //want read
    }
    uint32_t len = 0;
    memcpy(&len, &conn->incoming[0], 4);
    //check if the message is too long, if so, close the connection, because it might cause the server to crash
    if (len > k_max_msg){
        msg("too long");
        conn->want_close = true;
        return false; //want close
    }
    //message body. make sure we have the whole message before processing it
    if (conn->incoming.size() < 4 + len){
        return false; //want read
    }

    const uint8_t* request = &conn->incoming[4];

    //got one request, do something with it
    fprintf(stderr, "client says: %s\n", request);

    //send response
    buf_append(conn->outgoing, (const uint8_t*)&len, 4);
    buf_append(conn->outgoing, request, len);

    buf_consume(conn->incoming, 4 + len);
    //Q: why not just empty the incoming buffer?
    //A: because we want to keep the data in the buffer for future requests, only remove the data that has been processed

    return true;
}

//application callback when the connection is ready for writing
// note: 客户端没有接受的buffer，因为buffer的本意是server的buffer增加sever处理的效率，而不是client的buffer. client outgoing buffer 理解为是server的incoming buffer的一部分
static void handle_write(Conn* conn){
    assert(conn->outgoing.size() > 0);
    ssize_t rv = write(conn->fd, conn->outgoing.data(), conn->outgoing.size()); //write the data to the connection. 
    if (rv <0 && errno == EAGAIN){
        return; //EAGAIN is the error code for "try again later", not ready for writing, 因为pipeline的设计，不是每个request都需要马上返回
    }
    if (rv < 0){
        msg_errno("write() error");
        conn->want_close = true;
        return;
    }
    buf_consume(conn->outgoing, (size_t)rv);
    if (rv == (ssize_t)conn->outgoing.size()){ //all data has been written
        conn->want_write = false;
        conn->want_read = true;
    } //else, we have more data to write, so we don't need to change the want_write flag
}

//application callback when the connection is ready for reading
static void handle_read(Conn* conn){
    //read some data from the connection
    uint8_t buf[64*1024];
    ssize_t rv = read(conn->fd, buf, sizeof(buf));

    //if 
    if (rv < 0){
        msg_errno("read() error");
        conn->want_close = true;
        return;
    }
    if (rv == 0){
        if (conn->incoming.size() == 0){
        msg("client closed");
        return;
    }else{
        msg("unexpected EOF");
    }
    conn->want_close = true;
    return;
    }

    buf_append(conn->incoming, buf, (size_t)rv);

    //parse requests and generate responses
    //get as many requests as possible before we need to wait for more data and generate responses
    //this is possible because we are using a non-blocking socket
    //this is called a pipeline.
    while (try_one_request(conn)){}

    if (conn->outgoing.size()){
        conn->want_read = false;
        conn->want_write = true;
        return handle_write(conn);  // 不直接返回 // 在设置标志后返回
    }
}

int main(){
    /*fd = file descriptor
    everything is a file in unix, like terminal, openfile, and socket
    you can use read(), write(), close() on them*/
    int fd = socket(AF_INET, SOCK_STREAM, 0);
    if(fd < 0){
        die("socket");
    }
    
    //needed for most server applications
    int val = 1;
    setsockopt(fd, SOL_SOCKET, SO_REUSEADDR, &val, sizeof(val));

    //bind to a port
    struct sockaddr_in server_addr = {};
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = ntohs(1234);
    server_addr.sin_addr.s_addr = ntohl(0); //listen on all interfaces
    int rv = bind(fd, (struct sockaddr*)&server_addr, sizeof(server_addr));
    if (rv){
        die("bind()");
    }

    fd_set_nb(fd); //set the listening file descriptor to non-blocking mode

    //listen for incoming connections
    rv = listen(fd, SOMAXCONN);
    if (rv){
        die("listen()");
    }

    //a map of all client connections, keyed by fd
    std::vector<Conn*> fd2conn;
    //the event loop
    std::vector<struct pollfd> pollfds;
    while (true){
        //prepare the pollfd array
        pollfds.clear();
        //add the listening socket to the pollfd array
        pollfds.push_back((struct pollfd){
            .fd = fd,
            .events = POLLIN,
            .revents = 0,
        });
        //connection sockets
        //collect all the connection sockets that are ready for reading or writing
        for (Conn* conn : fd2conn){
            if (!conn){
                continue;
            }
            //always poll() for error
            struct pollfd pfd = {
                .fd = conn->fd,
                .events = 0,
                .revents = 0,
            };
            if (conn->want_read){
                pfd.events |= POLLIN;
            }
            if (conn->want_write){
                pfd.events |= POLLOUT;
            }
            pollfds.push_back(pfd);
        }

        //wait for readiness
        int rv = poll(pollfds.data(), (nfds_t)pollfds.size(), 0);
        if (rv < 0 && errno == EINTR){
            continue;
        }
        if (rv < 0){
            die("poll");
        }

        //handle listening socket
        if (pollfds[0].revents){
            //new connection 
            if (Conn* conn = handle_accept(fd)){
                //add to the map of connections
                if (fd2conn.size() <= (size_t)conn->fd){
                    fd2conn.resize(conn->fd + 1);
                }
                fd2conn[conn->fd] = conn;
            }
        }

        //handle connection sockets
        for (size_t i = 1; i < pollfds.size(); i++){
            uint32_t ready = pollfds[i].revents;
            if (ready ==0){
                continue;
            }

            Conn* conn = fd2conn[pollfds[i].fd];
            if (ready & POLLIN){
                assert(conn->want_read);
                handle_read(conn); //application logic
            }
            if (ready & POLLOUT){
                assert(conn->want_write);
                handle_write(conn); //application logic
            }

            //close the socket from socket error or application logic
            if ((ready & POLLHUP) || (ready & POLLERR)){ // we need to check both POLLHUP and POLLERR
            //we need to check ready because the socket might be writable and readable at the same time
            //so we need to check both POLLOUT and POLLIN
            //if we only check POLLOUT, we will close the socket when it is writable
            //if we only check POLLIN, we will close the socket when it is readable
            //so we need to check both
            (void)close(conn->fd);
            fd2conn[conn->fd] = NULL;
            delete conn;
            } // for each connection sockets

        } // for each pollfd    
    } // event loop

    return 0;


}