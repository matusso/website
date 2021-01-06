---
title: "ret2win"
date: 2021-01-03T19:32:05+07:00
author: burso
---



```
$ PYTHONIOENCODING=utf8 ./ret2win.py
[!] Pwntools does not support 32-bit Python.  Use a 64-bit release.
[+] Starting local process './ret2win32': pid 26910
ret2win by ROP Emporium
x86

For my first trick, I will attempt to fit 56 bytes of user input into 32 bytes of stack buffer!
What could possibly go wrong?
You there, may I have your input please? And don't worry about null bytes, we're using read()!

>
 Thank you!
Well done! Here's your flag:
ROPE{a_placeholder_32byte_flag!}
```

Finally, you can find my python script [here](ret2win.py).
