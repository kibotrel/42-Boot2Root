# Exploring the ISO.

Since we are given an ISO file to create the vulnerable machine, we could also exploit the ISO directly to make our life easier.

First, using [`mount`](https://linux.die.net/man/8/mount) we'll get access to its filesystem...

```shell
  $> sudo mkdir /mnt/iso
  $> sudo mount -o loop BornToSecHackMe-v1.1.iso /mnt/iso/
  $> ls -l /mnt/iso
  total 10
  dr-xr-xr-x 2 root root 2048 juin  17  2017 casper
  dr-xr-xr-x 2 root root 2048 juin  16  2017 install
  dr-xr-xr-x 2 root root 2048 juin  17  2017 isolinux
  -r--r--r-- 1 root root  844 juin  17  2017 md5sum.txt        
  dr-xr-xr-x 2 root root 2048 juin  16  2017 preseed
  -r--r--r-- 1 root root  201 juin  17  2017 README.diskdefines
  -r--r--r-- 1 root root    0 juin  17  2017 ubuntu
```

> We create a mount point inside `/mnt` which is the default directory to do so. the `loop` option will find an unused device to correspond to the ISO in order to mount it correctly.

All these files are used to rebuild the OS and everything on top along with configurations. This particular ISO, [`casper`](https://manpages.ubuntu.com/manpages/focal/man7/casper.7.html) was used. We should find a [squashfs](https://en.wikipedia.org/wiki/SquashFS) file, it is a compress form of the whole file-system. Using [`unsquashfs`](https://manpages.debian.org/testing/squashfs-tools/unsquashfs.1.en.html) we could retrieve all the files within the file-system...

```shell
  $> sudo unsquashfs /mnt/iso/casper/filesystem.squashfs
  Parallel unsquashfs: Using 1 processor
  61188 inodes (56421 blocks) to write
```

It outputs a `squashfs-root` directory with what you'd expect from a filesystem. Meaning we can retrieve command history from `root` by checking inside `.bash_history` file located in its home.

```shell
  $> sudo cat squashfs-root/root/.bash_history
  ...
  adduser zaz
  646da671ca01bb5d84dbb5fb2238dc8e
  ...
```

> [`adduser`](https://linux.die.net/man/8/adduser) creates a new user for this machine. The password was incorrectly input twice, so we can grab it.

With this credentials pair, we can directly connect to the machine via [`ssh`](https://linux.die.net/man/1/ssh) after fiding machine's IP like in [Writeup 1, part 1](../../writeup1/part1.md). This exploit allow us to skip directly to `zaz` exploit like in [Writeup 1, part 6](../../writeup1/part6.md).
