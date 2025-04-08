#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <netinet/ip.h>
#include <assert.h>

static void msg(const char* msg){
    fprintf(stderr, "%s\n", msg);
}

static void die(const char* msg){
    int err = errno;
    fprintf(stderr, "[%d] %s\n", err, msg);
    abort();
}

const size_t k_max_msg = 4096;

static int32_t read_full(int fd, char* buf, size_t n){
    while (n > 0){
        ssize_t rv = read(fd, buf, n);
        if (rv <= 0){
            return -1;
        }
        assert((size_t)rv <= n);
        n -= (size_t)rv;
        buf += rv;
    }
    return 0;
}

static int32_t write_all(int fd, const char* buf, size_t n){
    while (n > 0){
        ssize_t rv = write(fd, buf, n);
        if (rv <= 0){
            return -1;
            }
        assert((size_t)rv <= n);
        n -= (size_t)rv;
        buf += rv;
    }
    return 0;
}

static int32_t one_request(int connfd){
    char rbuf[4 + k_max_msg + 1];
    errno = 0;
    int32_t err = read_full(connfd, rbuf, 4);
    if (err){
        msg(errno == 0 ? "EOF" : "read() error");
        return err;
    }
    uint32_t len = 0;
    memcpy(&len, rbuf, 4);
    if (len > k_max_msg){
        msg("too long");
        return -1;
    }
    err = read_full(connfd, rbuf + 4, len);
    if (err){
        msg("read() error");
        return err;
    }

    fprintf(stderr, "client says: %s\n", rbuf + 4);

    const char* response = "world";
    char wbuf[4 + k_max_msg + 1];
    len = (uint32_t)strlen(response);
    memcpy(wbuf, &len, 4);
    memcpy(wbuf + 4, response, len);
    return write_all(connfd, wbuf, 4 + len);
    
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

    //listen for incoming connections
    rv = listen(fd, SOMAXCONN);
    if (rv){
        die("listen()");
    }

    while (true){
        //accept an incoming connection
        struct sockaddr_in client_addr = {};
        socklen_t len = sizeof(client_addr);
        int connfd = accept(fd, (struct sockaddr *)&client_addr, &len);
        if (connfd < 0){
            continue; //error, just try again
        }

        while (true){
            int32_t err = one_request(connfd);
            if (err){
                    break;
            }
        }
        //close the connection
        close(connfd);
    }

    return 0;


}