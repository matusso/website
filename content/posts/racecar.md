---
title: "racecar"
date: 2022-05-02T17:35:00+01:00
author: "Matus Bursa"
tags: ["ctf", "hackthebox", "pwn", "stack", "little-endian", "x86"]
categories: ["ctf", "hackthebox"]
---

Hello hackers, let's solve another CTF from category *easy*. This [challenge](https://app.hackthebox.com/challenges/racecar) 
is about [format string vulnerability](https://web.ecs.syr.edu/~wedu/Teaching/cis643/LectureNotes_New/Format_String.pdf)

First of all I look what type of file is it
```
% file racecar
racecar: ELF 32-bit LSB pie executable, Intel 80386, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux.so.2, for GNU/Linux 3.2.0, BuildID[sha1]=c5631a370f7704c44312f6692e1da56c25c1863c, not stripped
```

So I started [Ghidra](https://ghidra-sre.org/) and look at functions there
![Racecar functions](/img/racecar/racecar_functions.png "Racecar functions")

There are couple of interesting functions with various name and after little bit of time looking at the functions I found the right one
![Racecar car_menu](/img/racecar/racecar_car_menu.png "Racecar car_menu")


As you can see, there is a part where the file *flag.txt* is opened and the content of file is read to memory. Also you can write any message, which is printed then.
```
    __format = (char *)malloc(0x171);
    __stream = fopen("flag.txt","r");
    if (__stream == (FILE *)0x0) {
      printf("%s[-] Could not open flag.txt. Please contact the creator.\n",&DAT_00011548,puVar5);
                    /* WARNING: Subroutine does not return */
      exit(0x69);
    }
    fgets(local_3c,0x2c,__stream);
    read(0,__format,0x170);
    puts(
        "\n\x1b[3mThe Man, the Myth, the Legend! The grand winner of the race wants the whole world to know this: \x1b[0m"
        );
    printf(__format);
```

So directly to the point I printed stack with `%08x`..
![Racecar final](/img/racecar/racecar_final.png "Racecar final")

.. and then convert *hex* values to *ascii*, of course don't forget about [little endian](https://www.geeksforgeeks.org/little-and-big-endian-mystery/).
Now we have a flag and finaly we can take a &#127866; and enjoy it. cheers!