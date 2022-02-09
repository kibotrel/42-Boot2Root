# Long way.

This breach is a long process that will make us go throw a lot of systems and various vulnerabilities to get an overview of what is available to us. Click on each subcategories to be redirected to the full explanations.

## [1. Identify the machine.](./part1.md)

> First step! In this part we'll cover some advanced [VirtualBox](https://www.virtualbox.org/) settings and with the help of [`nmap`](https://linux.die.net/man/1/nmap) we figure out the IP of this machine.


## [2. Website discovery.](./part2.md)

> Next, using what we found ealier, we discover that a website is running on the machine. Looks like a good place to start our research. With the help of [`dirb`](https://www.kali.org/tools/dirb/#:~:text=DIRB%20is%20a%20Web%20Content,can%20use%20your%20custom%20wordlists.) we'll try to find vulnerable ressources to exploit.

## [3. First user, `lmezard`.](./part3.md)

> Beginning of a serie of 4 users that we'll go through to get root. For this one, we'll need to use [`ftp`](https://linux.die.net/man/1/ftp) to bypass the [`ssh`](https://linux.die.net/man/1/ssh) ban and exctract files from the machine in order to work with them.

## [4. `laurie`, the Bomb minigame.](./part4.md)

> In this part we'll need to reverse engineer small programs to retrieve bits of a password using both [Hopper](https://www.hopperapp.com/) and [`gdb`](https://linux.die.net/man/1/gdb).

## [5. `thor`, Draw the answer.](./part5.md)

> Now, something different, this time, we'll need to use not only text but also images to get further by creating a [turtle](https://docs.python.org/3/library/turtle.html) interpreter.

## [6. `zaz`, Buffer overflow to priveleges escalation.](./part6.md)

> Last step to become root user. In this one we'll a famous vulnerability called [ret2libc]() that allow us to run arbitrary code via overriding the normal instruction list.