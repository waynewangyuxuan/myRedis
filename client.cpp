#include <stdint.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
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

const size_t k_max_msg = 4096;

static int32_t query(int fd, const char* text){
    uint32_t len = (uint32_t)strlen(text);
    if (len > k_max_msg){
        return -1;
    }

    char wbuf[4 + k_max_msg];
    memcpy(wbuf, &len, 4);
    memcpy(wbuf + 4, text, len);
    if (int32_t err = write_all(fd, wbuf, 4 + len) < 0){
        return err;
    }

    char rbuf[4 + k_max_msg + 1];
    errno = 0;
    int32_t err = read_full(fd, rbuf, 4);
    if (err){
        msg(errno == 0 ? "EOF" : "read() error");
    }

    memcpy(&len, rbuf, 4);
    if (len > k_max_msg){
        msg("message too long");
        return -1;
    }

    if (int32_t err = read_full(fd, rbuf + 4, len)){
        msg("read() error");
        return err;
    }

    //do something
    printf("server says: %s\n", rbuf + 4);

    return 0;
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

    //multiple requests
    if (int32_t err = query(fd, "hello")){
        goto L_DONE;
    }
    if (int32_t err = query(fd, "hello2")){
        goto L_DONE;
    }
    if (int32_t err = query(fd, "hello3")){
        goto L_DONE;
    }

L_DONE:
    close(fd);
    return 0;

}