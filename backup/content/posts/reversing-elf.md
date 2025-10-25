---
title: "Reversing ELF"
date: 2020-12-07T19:06:00+01:00
draft: false
tags: ["ctf", "re", "IDA", "elfutils", "tryhackme"]
categories: ["ctf", "re", "tryhackme"]
---

Hi,
today I would like to show you how to solve easy RE CTF and how to start with RE,
my directory after finish all challenges looks following:

```
$ tree
.
├── crackme_1
│   ├── crackme1
│   └── flag.txt
├── crackme_2
│   ├── crackme2
│   └── flag.txt
├── crackme_3
│   ├── crackme3
│   └── flag.txt
├── crackme_4
│   ├── crackme4
│   ├── flag.txt
│   └── gdb_cmd
├── crackme_5
│   ├── crackme5
│   ├── flag.txt
│   ├── preload.c
│   └── preload.so
├── crackme_6
│   ├── crackme6
│   └── flag.txt
├── crackme_7
│   ├── crackme7
│   └── flag.txt
└── crackme_8
    ├── crackme8
    ├── flag.txt
    └── gdb_cmd
```

Before we start I would recommend following software
- [r2]()
- [gdb]()

And you can find this game [here](https://tryhackme.com/room/reverselfiles).
Now let's look deeper on each of the challenge. 

### crackme_1 ###
```
$ file crackme1
crackme1: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, for GNU/Linux 2.6.32, BuildID[sha1]=672f525a7ad3c33f190c060c09b11e9ffd007f34, not stripped
```
Okay, file is [ELF](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format), now we try to run it.

```
$ ./crackme1
flag{not_that_kind_of_elf}
```

:) It is enough to run it, nothing special so far.

### crackme_2 ###

```
$ file crackme2
crackme2: ELF 32-bit LSB executable, Intel 80386, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux.so.2, for GNU/Linux 2.6.32, BuildID[sha1]=b799eb348f3df15f6b08b3c37f8feb269a60aba7, not stripped
$ ./crackme2
Usage: ./crackme2 password
$ ./crackme2 aaa
Access denied.
```
Let's look strings in binary
```
$ strings crackme2
/lib/ld-linux.so.2
libc.so.6
_IO_stdin_used
puts
printf
memset
strcmp
...
Usage: %s password
super_secret_password
...
.got.plt
.data
.bss
.comment
```
Nice, we probably have password, let's try it
```
$ ./crackme2 super_secret_password
Access granted.
flag{if_i_submit_this_flag_then_i_will_get_points}
```
Great, second flag is ours.

### crackme_3 ###

```
$ file crackme3
crackme3: ELF 32-bit LSB executable, Intel 80386, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux.so.2, for GNU/Linux 2.6.24, BuildID[sha1]=4cf7250afb50109f0f1a01cc543fbf5ba6204a73, stripped
$ strings crackme3
/lib/ld-linux.so.2
__gmon_start__
libc.so.6
_IO_stdin_used
puts
strlen
malloc
...
Usage: %s PASSWORD
malloc failed
ZjByX3kwdXJfNWVjMG5kX2xlNTVvbl91bmJhc2U2NF80bGxfN2gzXzdoMW5nNQ==
Correct password!
Come on, even my aunt Mildred got this one!
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/
...
.got.plt
.data
.bss
.comment
```

There is a string encoded by [base64](https://en.wikipedia.org/wiki/Base64)
```
$ echo "ZjByX3kwdXJfNWVjMG5kX2xlNTVvbl91bmJhc2U2NF80bGxfN2gzXzdoMW5nNQ==" | base64 -d
f0r_y0ur_5ec0nd_le55on_unbase64_4ll_7h3_7h1ng5
```

Just couple of seconds and thirdth flag is on our side.

### crackme_4 ###

```
$ file crackme4
crackme4: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, for GNU/Linux 2.6.24, BuildID[sha1]=862ee37793af334043b423ba50ec91cfa132260a, not stripped
$ strings crackme4
/lib64/ld-linux-x86-64.so.2
libc.so.6
puts
...
password OK
password "%s" not OK
Usage : %s password
This time the string is hidden and we used strcmp
...
```

Nothing special between strings, but we know, binary is using strcmp to compare "passwords"
```
$ ./crackme4
Usage : ./crackme4 password
This time the string is hidden and we used strcmp
$ ./crackme4 AAA
password "AAA" not OK
```

Try to disassemble it and find place, where __strcmp__ is called.
```
$ objdump -D crackme4 | grep call | grep strcmp
  4006d5:       e8 46 fe ff ff          callq  400520 <strcmp@plt>
```

Prepare __gdb_cmd__ file with following content:
```
break * 0x4006D5
run aaa
x/s $rax
```

Let's start gdb with commands from file __gdb_cmd__
```
$ gdb -x gdb_cmd ./crackme4
GNU gdb (GDB) 10.1
...
Undefined command: "import".  Try "help".
Reading symbols from ./crackme4...
(No debugging symbols found in ./crackme4)
Breakpoint 1 at 0x4006d5

Breakpoint 1, 0x00000000004006d5 in compare_pwd ()
0x7fffffffe440: "my_m0r3_secur3_pwd"
(gdb)
```

We can verify this password with the application __crackme4__
```
$ ./crackme4 my_m0r3_secur3_pwd
password OK
```

### crackme_5 ###

```
$ file crackme5
crackme5: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, for GNU/Linux 2.6.32, BuildID[sha1]=a426dcf8ed3de8cb02f3ee4f38ee36b4ed568519, not stripped
```

Again nothing special in strings so I will not give you output of strings command here now. 
Let's look into function names which application is using

```
$ gdb crackme5
GNU gdb (GDB) 10.1
...
Reading symbols from crackme5...
(No debugging symbols found in crackme5)
(gdb) info functions
All defined functions:

Non-debugging symbols:
0x0000000000400528  _init
0x0000000000400560  strncmp@plt
0x0000000000400570  puts@plt
0x0000000000400580  strlen@plt
0x0000000000400590  __stack_chk_fail@plt
0x00000000004005a0  __libc_start_main@plt
0x00000000004005b0  atoi@plt
0x00000000004005c0  __isoc99_scanf@plt
0x00000000004005d0  __gmon_start__@plt
0x00000000004005e0  _start
0x0000000000400610  deregister_tm_clones
0x0000000000400650  register_tm_clones
0x0000000000400690  __do_global_dtors_aux
0x00000000004006b0  frame_dummy
0x00000000004006d6  strcmp_
0x0000000000400773  main
0x000000000040086e  check
0x00000000004008d0  __libc_csu_init
0x0000000000400940  __libc_csu_fini
0x0000000000400944  _fini
```

Okay, looks like __strncmp__ is using for comparing password and your input, so we can override this function, 
let's create __preload.c__ file with following content:
```
#define _GNU_SOURCE

#include <stdio.h>
#include <dlfcn.h>

int strncmp(const char *s1, const char *s2, size_t n) {
    printf("S1: [%s], S2: [%s]\n", s1, s2);
    int (*original_strcmp)(const char*, const char*, size_t);
    original_strcmp = dlsym(RTLD_NEXT, "strcmp");

    return (*original_strcmp)(s1, s2, n);
}
```

Now compile our code and run __crackme5__ with following parameters to load our library:
```
$ gcc -Wall -fPIC -shared -o preload.so preload.c -ldl
$ LD_PRELOAD=./preload.so ./crackme5
Enter your input:
AAA
S1: [AAA], S2: [OfdlDSA|3tXb32~X3tX@sX`4tXtz]
Always dig deeper
```

Nice :) we have another flag.

### crackme_6 ###

```
$ file crackme6
crackme6: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, for GNU/Linux 2.6.24, BuildID[sha1]=022f1a8e479cab9f7263af75bcdbb328bda7f291, not stripped
```

When we look into functions, we can see function called __my_secure_test__ there.
```
$ gdb ./crackme6
GNU gdb (GDB) 10.1
...
Reading symbols from ./crackme6...
(No debugging symbols found in ./crackme6)
(gdb) info functions
All defined functions:

Non-debugging symbols:
0x0000000000400418  _init
0x0000000000400450  puts@plt
0x0000000000400460  printf@plt
0x0000000000400470  __libc_start_main@plt
0x0000000000400480  __gmon_start__@plt
0x0000000000400490  _start
0x00000000004004c0  deregister_tm_clones
0x00000000004004f0  register_tm_clones
0x0000000000400530  __do_global_dtors_aux
0x0000000000400550  frame_dummy
0x000000000040057d  my_secure_test
0x00000000004006d1  compare_pwd
0x0000000000400711  main
0x0000000000400760  __libc_csu_init
0x00000000004007d0  __libc_csu_fini
0x00000000004007d4  _fini
```

This function is starting on address `0x040057d` and finishing on address `0x04006d0`,
so let's find all `cmp` instructions between these two addresses
```
$ objdump -D crackme6  | egrep -e "4005|4006" | grep "cmp "
  400597:       3c 31                   cmp    $0x31,%al
  4005bf:       3c 33                   cmp    $0x33,%al
  4005e7:       3c 33                   cmp    $0x33,%al
  40060f:       3c 37                   cmp    $0x37,%al
  400637:       3c 5f                   cmp    $0x5f,%al
  40065f:       3c 70                   cmp    $0x70,%al
  400684:       3c 77                   cmp    $0x77,%al
  4006a9:       3c 64                   cmp    $0x64,%al
```

When we convert hex values to characters in [ASCII table](https://www.asciitable.com/), we get __1337_pwd__
```
$ ./crackme6 1337_pwd
password OK
```

### crackme_7 ###

Now we can look on __crackme7__ binary
```
$ file crackme7
crackme7: ELF 32-bit LSB executable, Intel 80386, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux.so.2, for GNU/Linux 2.6.32, BuildID[sha1]=7ee4206d91718e7b0bef16a7c03f8fa49c4a39e7, not stripped
```

Again, nothing special in binary strings, so we look into functions
```
$ r2 crackme7
 -- Mess with the best, Die like the rest
[0x080483c0]> aaa
...
[0x080483c0]> afl
0x080483c0    1 33           entry0
0x08048380    1 6            sym.imp.__libc_start_main
0x08048400    4 43           sym.deregister_tm_clones
0x08048430    4 53           sym.register_tm_clones
0x08048470    3 30           sym.__do_global_dtors_aux
0x08048490    4 43   -> 40   entry.init0
0x080486a6    4 149          sym.giveFlag
0x080487a0    1 2            sym.__libc_csu_fini
0x080483f0    1 4            sym.__x86.get_pc_thunk.bx
0x080487a4    1 20           sym._fini
0x08048740    4 93           sym.__libc_csu_init
0x080484bb   20 491          main
0x08048324    3 35           sym._init
0x08048360    1 6            sym.imp.printf
0x08048370    1 6            sym.imp.puts
0x08048390    1 6            sym.imp.memset
0x080483a0    1 6            sym.imp.__isoc99_scanf
```

Basicaly we want to call function __sym.giveFlag__ on address `0x080486a6`, 
so we need to find where the function is called

```
[0x080483c0]> axt sym.giveFlag
main 0x804867c [CALL] call sym.giveFlag
```

Okay, so function is called in function __main__
```
[0x080483c0]> pdf @ main
```

![reverse2 #1](/img/reverselfiles/crackme7.png)

you can see compare `cmp eax, 0x7a69`
instruction near before calling __giveFlag__ function 
and again when we convert `7a69` hex to decimal, 
then we have a [result](https://www.hexdictionary.com/hex/7A69).

```
$ ./crackme7
Menu:

[1] Say hello
[2] Add numbers
[3] Quit

[>] 31337
Wow such h4x0r!
flag{much_reversing_very_ida_wow}
```

### crackme_8 ###

Okay, now we have last one so let's get basic informations

```
$ file crackme8
crackme8: ELF 32-bit LSB executable, Intel 80386, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux.so.2, for GNU/Linux 2.6.32, BuildID[sha1]=fef76e38b5ff92ed0d08870ac523f9f3f8925a40, not stripped
$ ./crackme8
Usage: ./crackme8 password
$ ./crackme8 abcdef
Access denied.
```

```
$ r2 crackme8
 -- 256 colors ought to be enough for anybody
[0x080483a0]> aaa
...
[0x080483a0]> afl
0x080483a0    1 33           entry0
0x08048360    1 6            sym.imp.__libc_start_main
0x080483e0    4 43           sym.deregister_tm_clones
0x08048410    4 53           sym.register_tm_clones
0x08048450    3 30           sym.__do_global_dtors_aux
0x08048470    4 43   -> 40   entry.init0
0x08048524    4 149          sym.giveFlag
0x08048620    1 2            sym.__libc_csu_fini
0x080483d0    1 4            sym.__x86.get_pc_thunk.bx
0x08048624    1 20           sym._fini
0x080485c0    4 93           sym.__libc_csu_init
0x0804849b    6 137          main
0x08048300    3 35           sym._init
0x08048340    1 6            sym.imp.printf
0x08048350    1 6            sym.imp.puts
0x08048370    1 6            sym.imp.memset
0x08048380    1 6            sym.imp.atoi
[0x080483a0]> axt sym.giveFlag
main 0x8048512 [CALL] call sym.giveFlag
[0x080483a0]> pdf @ main
```

![reverse2 #2](/img/reverselfiles/crackme8.png)

You can see on address `0x080484e4` instruction `cmp eax, 0xcafef00d` so, now we can prepare __gdb__ commands.
Create file called *gdb_cmd* with following content:
```
break * 0x080484E4
r 1
set $eax=3405705229
c
```

Btw, decimal value __3405705229__ in `$eax` register is converted from __cafef00d__ hex.
Now, we can run binary as follows:

```
$ gdb -x gdb_cmd ./crackme8
GNU gdb (GDB) 10.1
...
Undefined command: "import".  Try "help".
Reading symbols from ./crackme8...
(No debugging symbols found in ./crackme8)
Breakpoint 1 at 0x80484e4

Breakpoint 1, 0x080484e4 in main ()
Access granted.
flag{at_least_this_cafe_wont_leak_your_credit_card_numbers}
[Inferior 1 (process 1537622) exited normally]
(gdb)
```

Done, we have the last flag we need. 
h4ppy r3v3r5e! ;)

