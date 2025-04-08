#include <stdint.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <errno.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <netinet/ip.h>

static void die(const char* msg){
    int err = errno;
    fprintf(stderr, "[%d] %s\n", err, msg);
    abort();
}

int main(){
    int fd = socket(AF_INET, SOCK_STREAM, 0);
    if (fd < 0){
        die("socket");
    }

    struct sockaddr_in server_addr = {};
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = ntohs(1234);
    server_addr.sin_addr.s_addr = ntohl(0x7f000001); //localhost

    int rv = connect(fd, (struct sockaddr*)&server_addr, sizeof(server_addr));
    if (rv){
        die("connect()");
    }

    char msg[] = "hello";
    write(fd, msg, strlen(msg));

    char rbuf[64] = {};
    ssize_t n = read(fd, rbuf, sizeof(rbuf) - 1);
    if (n < 0){
        die("read()");
    }
    fprintf(stderr, "server says: %s\n", rbuf); 

    close(fd);

    return 0;

}