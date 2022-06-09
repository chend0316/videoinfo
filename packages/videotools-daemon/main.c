#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
#include <sys/socket.h>

int main() {
  while (1) {
    fprintf(stderr, "tick");
    sleep(10);
  }
}
