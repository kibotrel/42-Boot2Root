# Cannot use SSH?
We can log into the VM directly but not via ssh due to some SSH configuration. We can confirm this via the webshell by checking the file `/etc/ssh/sshd_config` where the current host ssh configuration is located.

```shell
  $> cat /etc/ssh/sshd_config
  ...
  RSAAuthentication yes
  PubkeyAuthentication yes
  #AuthorizedKeysFile     %h/.ssh/authorized_keys
  AllowUsers ft_root zaz thor laurie
  #DenyUsers *
  ...
```

> As it is stated in [sshd configuration](https://linux.die.net/man/5/sshd_config) documentation, `AllowUsers` option is listing all the users that can use ssh to remotely connect to the machine, `lmezard` is not one of them.

Once logged in the VM we can find two files in her home directory, a `README` file and a binary called `fun`.

```shell
  $> cat README
  Complete this little challenge and use the result as password for user 'laurie' to login with ssh
  $> file fun
  fun: POSIX tar archive (GNU)
```

> [`file`](https://linux.die.net/man/1/file) helps us to determine the type of a file, here it tell us it is an archive so we can use [`tar`](https://linux.die.net/man/1/tar) to work with it.

# Take advantage of FTP.

From the `nmap` scan we remember that a [`ftp`](https://linux.die.net/man/1/ftp) service is running... let's connect as `lmezard` to extract files and work on it directly outside of the VM.

```
  $> ftp
  ftp> open
  (to) <NETWORK-IP2>

  Connected to <NETWORK-IP2>.
  220 Welcome on this server    

  Name (<NETWORK-IP2>:<user): lmezard
  331 Please specify the password.
  Password: G!@M6f4Eatau{sF"

  230 Login successful.
  Remote system type is UNIX.
  Using binary mode to transfer files.

  ftp> get fun
  local: fun remote: fun
  200 PORT command successful. Consider using PASV.
  150 Opening BINARY mode data connection for fun (808960 bytes).
  226 Transfer complete.

  ftp> exit
  221 Goodbye.
```

> The `get` command download the requested file from the service to our machine.

# Junk files? Let's rebuild!

After decompressing the archive, we have a directory `ft_fun` with a bunch of weird files in it.

```shell
  $> ls -l ft_fun
  ...
  -rw-r----- 1 kilian kilian    28 août  13  2015 1SDTO.pcap
  -rw-r----- 1 kilian kilian    28 août  13  2015 1TWEB.pcap
  -rw-r----- 1 kilian kilian    28 août  13  2015 1YG75.pcap
  -rw-r----- 1 kilian kilian    44 août  13  2015 1ZNSV.pcap
  -rw-r----- 1 kilian kilian    25 août  13  2015 20L0Z.pcap
  -rw-r----- 1 kilian kilian    44 août  13  2015 257IO.pcap
  -rw-r----- 1 kilian kilian    44 août  13  2015 27RWO.pcap
  -rw-r----- 1 kilian kilian    44 août  13  2015 2AHUV.pcap
  ...
  $> cat ft_fun/27RWO.pcap 
    printf("Hahahaha Got you!!!\n");

    //file308
```

> One of those files is bigger and contains a C main and calls to `getmeXX` functions and a printf call telling us to **digest** the password we'll find.

We understand quickly that we need to write a C file and compile it with all of those little code snippets, sorting them by the comment on the last line of the file giving their order. To automate this tedious process we wrote the following script...

```js
const { readdirSync, readFileSync, writeFileSync } = require('fs')
const { exec, execSync } = require('child_process')

execSync('tar -xf fun')

const files = readdirSync('./ft_fun')
const codePieces = []

for (const file of files) {
  const fileData = readFileSync(`./ft_fun/${file}`).toString()
  const fileNumber = parseInt(fileData.split('\n').at(-1).substring('//file'.length))
  const code = fileData.replace(/(\/\/file\d+)/g, '')

  codePieces.push({ code, fileNumber })
}

codePieces.sort((a, b) => (a.fileNumber > b.fileNumber) ? 1 : -1)

let sourceCode = ''

for (const codePiece of codePieces) {
  sourceCode += codePiece.code
}

writeFileSync('main.c', sourceCode)
exec('gcc main.c ; echo -n $(./a.out | grep PASSWORD | cut -d " " -f4) | sha256sum | cut -d " " -f1', (error, stdout, stderr) => {
  console.log(stdout)
})
```

> This script begins with extracting all the files from the archive, then constructing an array of all the `files` names. Then, it will read the content of each file, extract its position and remove the `//fileXXX` line from the content and finally it will sort everything by their position before creating a string containing the source code before writting it inside `main.c`. Last task is to compile it, then extract the password and digest it with **SHA256**.

```
  $> node lmezard.js 
  330b845f32185747e4f8ca15d40ca59796035c89ea809fb5d30f4da83ecf45a4
```

We now have another credentials pair: `laurie:330b845f32185747e4f8ca15d40ca59796035c89ea809fb5d30f4da83ecf45a4`, usable with ssh this time.