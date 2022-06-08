#include <stdlib.h>
#include <stdio.h>
#include <sys/socket.h>

int main() {
  int ret = socket(AF_INET, SOCK_STREAM, 0);
  if (ret == -1) {
    fprintf(stderr, "socket() failed\n");
    exit(-1);
  }
}
