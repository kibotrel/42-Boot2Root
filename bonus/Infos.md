# Informations

Here are some information we got during the project, some could be useful and some others not, we don't really know.

## Forum

* > Oct 5 13:31:19 BornToSecHackMe sshd[20199]: reverse mapping checking getaddrinfo for ppp-253-14.20-151.wind.it [151.20.14.253] failed - POSSIBLE BREAK-IN ATTEMPT!
  
  This was found in the forum post where we got `lmezard` credentials. It could be a message triggered by a potential attack via [`ssh`](https://linux.die.net/man/1/ssh). In most case this is a false positive.

* > Oct 5 14:57:56 BornToSecHackMe sudo: root : TTY=pts/0 ; PWD=/home/admin ; USER=root ; COMMAND=/usr/sbin/service vsftpd restart

  Found like above one, this gives us information that sometimes, user `admin` restart service for [`ftp`](https://linux.die.net/man/1/ftp) using [`sudo`](https://linux.die.net/man/8/sudo) meaning that if we could get his credentials we could potentially harm the machine.

## PHPMyAdmin

Database `forum_db`, table `mlf2_userdata` gives us a lot of details.

| user_id | user_type | user_name | user_pw | user_email | email_contact |
| :-: | :-: | :-: | :-: | :-: | :-: |
| 1	| 2	| admin |	ed0fd64f25f3bd3a54f8d272ba93b6e76ce7f3d0516d551c28 | admin@borntosec.net | 1 |
| 2	| 0	| qudevide | a12e059d6f4c21c6c5586283c8ecb2b65618ed0a0dc1b302a2 | qudevide@borntosec.net | 0 |
| 3	| 0	| thor | d30668b779542d60c4cde29e7170148198b1623f4453866797 | thor@borntosec.net | 0 |
| 4	| 0	| wandre | f8562b53084d60efa4208fa50d1ef753ef18e089d2dd56c4ed | wandre@borntosec.net | 0 |
| 5	| 0	| lmezard | 0171e7dbcbf4bd21a732fa859ea98a2950b4f8aa1e5365dc90 | laurie@borntosec.net | 0 |
| 6	| 0	| zaz | f10b3271bf523f12ebd58ef8581c851991bf0d4b4c4bf49d7c | zaz@borntosec.net | 0 |

- User `admin` has a special type and a contact email.
- Users `qudevide` and `wandre` weren't used at all during our exploits.
- As `root` if we find how `user_pw` are hashed, we could access all accounts.

## Possible leads

- [CVE-2021-3156 sudoedit vulnerability](https://blog.qualys.com/vulnerabilities-threat-research/2021/01/26/cve-2021-3156-heap-based-buffer-overflow-in-sudo-baron-samedit).
- IMAP logs from `zaz` session.