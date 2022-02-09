file /home/zaz/exploit_me
b *0x08048425
r 0000000000000000000000000000
p &system
p &exit
find &system, +999999999, "/bin/sh"
x $esp
info frame