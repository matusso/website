---
author: "Matus Bursa"
title: ".grsec patch size_overflow"
date: "2016-04-29T20:58:10+01:00"
description: ""
categories: ["vulns"]
tags: ["grsec", "kernel", "DoS"]
ShowToc: true
---

I think you sure know linux kernel patches from [grsecurity](https://grsecurity.net/). 
In follow tweet you can read about size overflow in patch from grsec.

`Tweet was in the meanwhile deleted`.

So what is the problem in this patch? When you change int (signed value) to size_t (unsigned value), you have to be sure you are saving unsigned value.

```C
room = N_TTY_BUF_SIZE - (ldata->read_head - tail);
```

And what happens when the right site will have negative value? Let’s show it on the very simple example
```bash
$ cat test.c
```
```C
#include <stdio.h>

int main(void) {
        size_t a = -15;
        printf("%lu\n", a);
        return 0;
}
```
```bash
$ gcc -Wall test.c -o test
$ ./test
{{ twitter BursaMatus 18446744073709551601}}
```

Small negative value (for example: -15) sets the big unsigned value. For better understand you can read this. And this problem can cause local DoS attack on your system via 100%cpu usage.

__SOLUTION__

You have to check, if the value is not negative, so we can use ternary operator for this quick fix
```C
room = ((N_TTY_BUF_SIZE - (ldata->read_head - tail)) > 0) ? N_TTY_BUF_SIZE - (ldata->read_head - tail) : 0;
```
