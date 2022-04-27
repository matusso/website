---
title: "Impossible Password"
date: 2020-01-27T19:06:00+01:00
draft: false 
tags: ["ctf", "re", "radare2", "hackthebox", "gdb", "linux", "x86_64"]
categories: ["ctf", "re", "hackthebox"]
---

Welcome here in new year,
I would like to introduce one of easy CTF in reverse engineering category

- [radare2](https://www.radare.org/n/)
- [gdb]

```
$ r2 ./impossible_password.bin
[0x004006a0]> aaa
...
[0x004006a0]> afl
0x004006a0    1 41           entry0
0x00400610    1 6            sym.imp.__libc_start_main
0x004005f0    1 6            sym.imp.putchar
0x00400600    1 6            sym.imp.printf
0x00400620    1 6            sym.imp.srand
0x00400630    1 6            sym.imp.strcmp
0x00400650    1 6            sym.imp.time
0x00400660    1 6            sym.imp.malloc
0x00400670    1 6            sym.imp.__isoc99_scanf
0x00400680    1 6            sym.imp.exit
0x00400690    1 6            sym.imp.rand
0x0040085d    5 283          main
0x0040078d    7 208          fcn.0040078d
0x00400978    5 96           fcn.00400978
0x00400760    8 141  -> 99   entry.init0
0x00400740    3 28           entry.fini0
0x004006d0    4 41           fcn.004006d0
0x00400640    1 6            loc.imp.__gmon_start__
0x004005c0    3 26           fcn.004005c0
```

We can see, that there is some import functions for randomization: `sym.imp.srand`, `sym.imp.rand`. Okay, let's look at the beggining.

```
[0x004006a0]> pdf @ main
...
0x0040085d      55             pushq %rbp
│           0x0040085e      4889e5         %rsp = %rbp
│           0x00400861      4883ec50       subq $0x50,%rsp
│           0x00400865      897dbc         movl %edi,-0x44(%rbp)       ; argc
│           0x00400868      488975b0       %rsi = var_50h              ; argv
│           0x0040086c      48c745f8700a.  $str.SuperSeKretKey = s2    ; 0x400a70 ; "SuperSeKretKey"
...
0x004008ce      e82dfdffff     callq sym.imp.printf        ; int printf(const char *format)
│           0x004008d3      488d45e0       leaq s1,%rax
│           0x004008d7      4889c6         %rax = %rsi
│           0x004008da      bf820a4000     movl $str._20s,%edi         ; 0x400a82 ; "%20s" ; const char *format
│           0x004008df      b800000000     movl $0,%eax
│           0x004008e4      e887fdffff     callq sym.imp.__isoc99_scanf ; int scanf(const char *format)
│           0x004008e9      488d45e0       leaq s1,%rax
│           0x004008ed      4889c6         %rax = %rsi
│           0x004008f0      bf870a4000     movl $str.__s__n,%edi       ; 0x400a87 ; "[%s]\n" ; const char *format
│           0x004008f5      b800000000     movl $0,%eax
│           0x004008fa      e801fdffff     callq sym.imp.printf        ; int printf(const char *format)
│           0x004008ff      488b55f8       -8(%rbp) = %rdx
│           0x00400903      488d45e0       leaq s1,%rax
│           0x00400907      4889d6         %rdx = %rsi                 ; const char *s2
│           0x0040090a      4889c7         %rax = %rdi                 ; const char *s1
│           0x0040090d      e81efdffff     callq sym.imp.strcmp        ; int strcmp(const char *s1, const char *s2)
...
```

So first key we need is `SuperSeKretKey`


