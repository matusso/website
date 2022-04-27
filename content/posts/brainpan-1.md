---
title: "brainpan 1"
date: "2020-12-07T19:06:00+01:00"
draft: true
tags: ["ctf", "re", "radare2", "nmap", "tryhackme", "metasploit"]
categories: ["ctf", "re", "tryhackme"]
---

Hello again,
today we look at one of my favorites CTF I know.

- [radare2](https://www.radare.org/n/)
- [nmap](https://nmap.org/)
- [metasploit](https://www.metasploit.com/)
- [immunity debugger](https://www.immunityinc.com/products/debugger/)
- [gobuster](https://github.com/OJ/gobuster)

First important information for us is in description of this CTF - __Exploit a buffer overflow vulnerability by analyzing a Windows executable on a Linux machine__
So, `windows` binary is running under `linux` machine. 

```
$ nmap -sS -sV -T5 10.10.243.75
Password:
Starting Nmap 7.91 ( https://nmap.org ) at 2021-01-08 14:44 CET
Nmap scan report for 10.10.243.75
Host is up (0.11s latency).
Not shown: 998 closed ports
PORT      STATE SERVICE VERSION
9999/tcp  open  abyss?
10000/tcp open  http    SimpleHTTPServer 0.6 (Python 2.7.3)
...

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 50.46 seconds
```

After quick view on web __http://10.10.243.75:10000__, we can't see anything unusual. 
let's try to look what is on port `tcp/9999`.

```
$ nc -v 10.10.243.75 9999
10.10.243.75 9999 (distinct) open
_|                            _|
_|_|_|    _|  _|_|    _|_|_|      _|_|_|    _|_|_|      _|_|_|  _|_|_|
_|    _|  _|_|      _|    _|  _|  _|    _|  _|    _|  _|    _|  _|    _|
_|    _|  _|        _|    _|  _|  _|    _|  _|    _|  _|    _|  _|    _|
_|_|_|    _|          _|_|_|  _|  _|    _|  _|_|_|      _|_|_|  _|    _|
                                            _|
                                            _|

[________________________ WELCOME TO BRAINPAN _________________________]
                          ENTER THE PASSWORD

                          >> aaa
                          ACCESS DENIED
```

Great, we find network service where __brainpan__ binary is running, but we don't know this app.
So try to find this file with __gobuster__.

```
$ gobuster dir -u http://10.10.243.75:10000 -w ~/Projects/3rd_party/SecLists/Discovery/Web-Content/directory-list-2.3-medium.txt
===============================================================
Gobuster v3.1.0
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.10.243.75:10000
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                ~/Projects/3rd_party/SecLists/Discovery/Web-Content/directory-list-2.3-medium.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.1.0
[+] Timeout:                 10s
===============================================================
2021/01/08 14:51:03 Starting gobuster in directory enumeration mode
===============================================================
/bin                  (Status: 301) [Size: 0] [--> /bin/]
```

__/bin__ dir looks interesting

```
$ curl http://10.10.243.75:10000/bin/
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 3.2 Final//EN"><html>
<title>Directory listing for /bin/</title>
<body>
<h2>Directory listing for /bin/</h2>
<hr>
<ul>
<li><a href="brainpan.exe">brainpan.exe</a>
</ul>
<hr>
</body>
</html>
$ wget http://10.10.243.75:10000/bin/brainpan.exe
--2021-01-08 14:57:47--  http://10.10.243.75:10000/bin/brainpan.exe
Connecting to 10.10.243.75:10000... connected.
HTTP request sent, awaiting response... 200 OK
Length: 21190 (21K) [application/x-msdos-program]
Saving to: ‘brainpan.exe’

brainpan.exe                                                                    100%[=====================================================================================================================================================================================================>]  20,69K  --.-KB/s    in 0,07s

2021-01-08 14:57:47 (282 KB/s) - ‘brainpan.exe’ saved [21190/21190]
```

File __brainpan.exe__ is downloaded, let's look what's inside.

```
$ file brainpan.exe
brainpan.exe: PE32 executable (console) Intel 80386 (stripped to external PDB), for MS Windows
$ rabin2 -z brainpan.exe
[Strings]
nth paddr      vaddr      len size section type  string
―――――――――――――――――――――――――――――――――――――――――――――――――――――――
0   0x00001400 0x31173000 21  22   .rdata  ascii [get_reply] s = [%s]\n
1   0x00001418 0x31173018 38  39   .rdata  ascii [get_reply] copied %d bytes to buffer\n
2   0x0000143f 0x3117303f 10  11   .rdata  ascii shitstorm\n
3   0x0000144c 0x3117304c 664 665  .rdata  ascii _|                            _|                                        \n_|_|_|    _|  _|_|    _|_|_|      _|_|_|    _|_|_|      _|_|_|  _|_|_|  \n_|    _|  _|_|      _|    _|  _|  _|    _|  _|    _|  _|    _|  _|    _|\n_|    _|  _|        _|    _|  _|  _|    _|  _|    _|  _|    _|  _|    _|\n_|_|_|    _|          _|_|_|  _|  _|    _|  _|_|_|      _|_|_|  _|    _|\n                                            _|                          \n                                            _|\n\n[________________________ WELCOME TO BRAINPAN _________________________]\n                          ENTER THE PASSWORD                              \n\n                          >>
4   0x000016e8 0x311732e8 40  41   .rdata  ascii                           ACCESS DENIED\n
5   0x00001714 0x31173314 41  42   .rdata  ascii                           ACCESS GRANTED\n
6   0x0000173e 0x3117333e 27  28   .rdata  ascii [+] initializing winsock...
7   0x0000175a 0x3117335a 27  28   .rdata  ascii [!] winsock init failed: %d
8   0x00001776 0x31173376 6   7    .rdata  ascii done.\n
9   0x00001780 0x31173380 31  32   .rdata  ascii [!] could not create socket: %d
10  0x000017a0 0x311733a0 27  28   .rdata  ascii [+] server socket created.\n
11  0x000017bc 0x311733bc 19  20   .rdata  ascii [!] bind failed: %d
12  0x000017d0 0x311733d0 25  26   .rdata  ascii [+] bind done on port %d\n
13  0x000017ea 0x311733ea 29  30   .rdata  ascii [+] waiting for connections.\n
14  0x00001808 0x31173408 25  26   .rdata  ascii [+] received connection.\n
15  0x00001822 0x31173422 16  17   .rdata  ascii [+] check is %d\n
16  0x00001833 0x31173433 21  22   .rdata  ascii [!] accept failed: %d
17  0x00001849 0x31173449 17  18   .rdata  ascii [+] cleaning up.\n
18  0x00001860 0x31173460 33  34   .rdata  ascii -LIBGCCW32-EH-3-SJLJ-GTHR-MINGW32
19  0x00001884 0x31173484 44  45   .rdata  ascii w32_sharedptr->size == sizeof(W32_EH_SHARED)
20  0x000018b4 0x311734b4 48  49   .rdata  ascii ../../gcc-3.4.5/gcc/config/i386/w32-shared-ptr.c
21  0x000018e8 0x311734e8 38  39   .rdata  ascii GetAtomNameA (atom, s, sizeof(s)) != 0
```

On address `0x3117303f` is interesting ascii data __shitstorm\n__. Let's start debugging and looks, what functions are there.
```
$ rabin2 -s ./brainpan.exe
[Symbols]

nth paddr       vaddr      bind   type size lib          name
―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
0    0x00000400 0x31171000 GLOBAL FUNC 0                 __gnu_exception_handler@4
1    0x00000550 0x31171150 GLOBAL FUNC 0                 ___mingw_CRTStartup
2    0x00000680 0x31171280 GLOBAL FUNC 0                 _mainCRTStartup
3    0x000006a0 0x311712a0 GLOBAL FUNC 0                 _WinMainCRTStartup
4    0x000006c0 0x311712c0 GLOBAL FUNC 0                 _atexit
5    0x000006d0 0x311712d0 GLOBAL FUNC 0                 __onexit
6    0x000006e0 0x311712e0 GLOBAL FUNC 0                 ___do_sjlj_init
7    0x000006f0 0x311712f0 GLOBAL FUNC 0                 _winkwink
8    0x000006fc 0x311712fc GLOBAL FUNC 0                 _get_reply
9    0x00000763 0x31171363 GLOBAL FUNC 0                 _main
10   0x00000b60 0x31171760 GLOBAL FUNC 0                 ___do_global_dtors
11   0x00000b90 0x31171790 GLOBAL FUNC 0                 ___do_global_ctors
12   0x00000bf0 0x311717f0 GLOBAL FUNC 0                 ___main
13   0x00000c10 0x31171810 GLOBAL FUNC 0                 __pei386_runtime_relocator
14   0x00000c40 0x31171840 GLOBAL FUNC 0                 ___cpu_features_init
15   0x00000d40 0x31171940 GLOBAL FUNC 0                 _fpreset
16   0x00000d40 0x31171940 GLOBAL FUNC 0                 __fpreset
17   0x00000d50 0x31171950 GLOBAL FUNC 0                 ___w32_sharedptr_default_unexpected
18   0x00000d60 0x31171960 GLOBAL FUNC 0                 ___w32_sharedptr_get
19   0x00000e00 0x31171a00 GLOBAL FUNC 0                 ___w32_sharedptr_initialize
20   0x00001150 0x31171d50 GLOBAL FUNC 0                 ___sjlj_init_ctor
21   0x000010a8 0x31171ca8 GLOBAL FUNC 0                 __cexit
22   0x00001108 0x31171d08 GLOBAL FUNC 0                 _free
23   0x000010e0 0x31171ce0 GLOBAL FUNC 0                 _strcmp
24   0x000010c0 0x31171cc0 GLOBAL FUNC 0                 ___p__fmode
```

___get_reply__ looks interesting

```
$ r2 ./brainpan.exe
 -- I accidentally the kernel with radare2.
[0x31171280]> aaa
[x] Analyze all flags starting with sym. and entry0 (aa)
[x] Analyze function calls (aac)
[x] Analyze len bytes of instructions for references (aar)
[x] Check for vtables
[x] Type matching analysis for all functions (aaft)
[x] Propagate noreturn information
[x] Use -AA or aaaa to perform additional experimental analysis.
[0x31171280]> pdf @ sym._get_reply
            ; CALL XREFS from main @ 0x311715e6, 0x31171610
┌ 103: sym._get_reply (void *arg_8h);
│           ; var char *dest @ ebp-0x208
│           ; arg void *arg_8h @ ebp+0x8
│           ; var char *src @ esp+0x4
│           0x311712fc      55             pushl %ebp
│           0x311712fd      89e5           movl %esp,%ebp
│           0x311712ff      81ec18020000   subl $0x218,%esp
│           0x31171305      8b4508         movl arg_8h,%eax
│           0x31171308      89442404       movl %eax,4(%esp)
│           0x3117130c      c70424003017.  movl $str._get_reply__s____s__n,(%esp) ; section..rdata
│                                                                      ; [0x31173000:4]=0x7465675b ; "[get_reply] s = [%s]\n" ; const char *format
│           0x31171313      e8e0090000     calll sym._printf           ; int printf(const char *format)
│           0x31171318      8b4508         movl arg_8h,%eax
│           0x3117131b      89442404       movl %eax,4(%esp)           ; const char *src
│           0x3117131f      8d85f8fdffff   leal dest,%eax
│           0x31171325      890424         movl %eax,(%esp)            ; char *dest
│           0x31171328      e8c3090000     calll sym._strcpy           ; char *strcpy(char *dest, const char *src)
│           0x3117132d      8d85f8fdffff   leal dest,%eax
│           0x31171333      890424         movl %eax,(%esp)            ; const char *s
│           0x31171336      e8ad090000     calll sym._strlen           ; size_t strlen(const char *s)
│           0x3117133b      89442404       movl %eax,4(%esp)
│           0x3117133f      c70424183017.  movl $str._get_reply__copied__d_bytes_to_buffer_n,(%esp) ; [0x31173018:4]=0x7465675b ; "[get_reply] copied %d bytes to buffer\n" ; const char *format
│           0x31171346      e8ad090000     calll sym._printf           ; int printf(const char *format)
│           0x3117134b      8d85f8fdffff   leal dest,%eax
│           0x31171351      c74424043f30.  movl $str.shitstorm_n,4(%esp) ; [0x3117303f:4]=0x74696873 ; "shitstorm\n" ; const char *s2
│           0x31171359      890424         movl %eax,(%esp)            ; const char *s1
│           0x3117135c      e87f090000     calll sym._strcmp           ; int strcmp(const char *s1, const char *s2)
│           0x31171361      c9             leave
└           0x31171362      c3             retl
```

We can see, there is comparing two strings, which one is from buffer and second one is constant string __shitstorm\n__.