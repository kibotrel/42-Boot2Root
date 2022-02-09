# 42-Boot2Root

This project is a small information security challenge. The goal is to exploit whatever is on the machine to become root. The only rule is not to bruteforce password.

We're given a vulnerable ISO on which several program are running. Using known vulnerabilities and reverse engineering we can access ressources that aren't meant to be and make our way through different services.

## Breakdown

| Writeup | Ressources | Exploits |
| :-: | :-: | :-: |
| [1](./writeup1/README.md) | [nmap](https://linux.die.net/man/1/nmaps) \| [dirb](https://www.kali.org/tools/dirb/#:~:text=DIRB%20is%20a%20Web%20Content,can%20use%20your%20custom%20wordlists.) \| [sshd configuration](https://linux.die.net/man/5/sshd_config) \| [file](https://linux.die.net/man/1/file) \| [ftp](https://linux.die.net/man/1/ftp) \| [Hopper](https://www.hopperapp.com/index.html) \| [gdb](https://linux.die.net/man/1/gdb) \| [Bitwise operations](https://en.wikipedia.org/wiki/Bitwise_operation) \| [turtle](https://docs.python.org/3/library/turtle.html) \| [md5sum](https://man7.org/linux/man-pages/man1/md5sum.1.html) \| [EIP register](https://security.stackexchange.com/questions/129499/what-does-eip-stand-for) \| [ESP register](https://stackoverflow.com/questions/21718397/what-are-the-esp-and-the-ebp-registers) \| [ASLR](https://en.wikipedia.org/wiki/Address_space_layout_randomization) \| [Endianness](https://en.wikipedia.org/wiki/Endianness) | [Webshell upload](https://www.netspi.com/blog/technical/network-penetration-testing/linux-hacking-case-studies-part-3-phpmyadmin/) \| [Buffer overflow](https://en.wikipedia.org/wiki/Buffer_overflow) \| [ret2libc attack](https://infosecwriteups.com/ret2libc-attack-in-lin-3dfc827c90c3) |
| [2](./writeup2/README.md) | [syslinux](https://linux.die.net/man/1/syslinux) \| [file](https://linux.die.net/man/1/file) \| [init](https://linux.die.net/man/8/init) | Init override in recovery mode |
| [3](./bonus/writeup3/README.md) | [mount](https://linux.die.net/man/8/mount) \| [casper](https://manpages.ubuntu.com/manpages/focal/man7/casper.7.html) \| [squashfs files](https://en.wikipedia.org/wiki/SquashFS) \| [unsquashfs](https://manpages.debian.org/testing/squashfs-tools/unsquashfs.1.en.html) | Dig through squashfs file |
| [4](./bonus/writeup4/README.md) | [Shell-storm](http://shell-storm.org/shellcode/) \| [NOP instruction](https://en.wikipedia.org/wiki/NOP_(code)#:~:text=In%20computer%20science%2C%20a%20NOP,protocol%20command%20that%20does%20nothing.) | [Shellcode injection](https://en.wikipedia.org/wiki/Shellcode) \| [NOPSlide](https://en.wikipedia.org/wiki/NOP_slide) |
| [5](./bonus/writeup5/README.md) | [httpd](https://linux.die.net/man/8/httpd) \| [ExploitDB](https://www.exploit-db.com/) | [suEXEC information disclosure](https://www.exploit-db.com/exploits/27397) |
| [6](./bonus/writeup6/README.md) | [ExploitDB](https://www.exploit-db.com/) | [Race condition](https://en.wikipedia.org/wiki/Race_condition) \| [Dirty cow](https://www.exploit-db.com/exploits/40839)|

## Credits

Made in collaboration with [@thervieu](https://github.com/thervieu).