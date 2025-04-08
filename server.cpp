#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <netinet/ip.h>

static void msg(const char* msg){
    fprintf(stderr, "%s\n", msg);
}

static void die(const char* msg){
    int err = errno;
    fprintf(stderr, "[%d] %s\n", err, msg);
    abort();
}

static void do_something(int connfd){
    char rbuf[64] = {};
    ssize_t n = read(connfd, rbuf, sizeof(rbuf) - 1);
    if (n < 0) {
        msg("read() error");
        return;
    }
    fprintf(stderr, "client says: %s\n", rbuf);

    char wbuf[] = "world";
    write(connfd, wbuf, strlen(wbuf));
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

        //handle the connection
        do_something(connfd);

        //close the connection
        close(connfd);
    }

    return 0;


}