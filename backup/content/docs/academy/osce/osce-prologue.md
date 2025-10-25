---
title: "Prologue"
date: "2020-01-22T14:32:59+01:00"
draft: false
tags: ["offensive-security", "hacking", "ctf"]
categories: ["ctf"]
---


### OSCE Prologue or How to get Secret key to CTP?

If you want to register to CTP, you will need something they call Registration Code and Secret Key.  So firstly, there is interesting file __/fc4.js__
```javascript
function fc4me(srvstr) {
  
   if(!document.pleazfc4me.email.value || !document.pleazfc4me.securitystring.value) {
      alert("Please fill in all the required fields!");
      return false;
   }
   if(document.pleazfc4me.securitystring.value != hexMD5("\x74\x72\x79\x68\x61\x72\x64\x65\x72"+srvstr)) {
      alert("Registration Authorization String not accepted! Try Harder! ");
      return false;
    } else {
      document.pleazfc4me.submit();
    }
   
}
```

So all you need to do is setup some js variables in browser console and call __fc4me(srvstr)__
```javascript
var srvstr='Thursday 23rd of January 2020';
document.pleazfc4me.securitystring.value=hexMD5("\x74\x72\x79\x68\x61\x72\x64\x65\x72"+srvstr);
document.pleazfc4me.email.value="<your_email_address>";
fc4me(srvstr);
``` 

After that you will obtain something like this:

```bash
RW1haWw6IDx5b3VyX2VtYWlsX2FkZHJlc3M+ICwgUmVnaXN0cmF0aW9uIENvZGU6IDx5b3VyX3Jl
Z2lzdHJhdGlvbl9udW1iZXI+IHwgTm93IGRlY29kZSB5b3VyIENUUCBTZWNyZXQgS2V5IGFuZCB5
b3UgYXJlIGRvbmUhIDogXHgzMVx4QzBceDUwXHg2OFx4MjRceDc3XHg3NVx4NzFceDY4XHg3NVx4
MjNceDc5XHgyMFx4NjhceDc4XHg3Nlx4MjRceDI1XHg2OFx4NzVceDc2XHgyMlx4MjNceDY4XHg3
N1x4NzdceDc2XHg3NVx4NjhceDc1XHgyNFx4MjVceDc0XHg2OFx4MjdceDI3XHgyMFx4MjJceDY4
XHgyNFx4NzRceDIzXHgyM1x4NjhceDIwXHg3M1x4NzFceDIwXHg2OFx4NzBceDczXHg3OVx4Nzdc
eDY4XHg3OFx4NzZceDIzXHgyMFx4NjhceDc2XHgyNVx4MjVceDIyXHg2OFx4NzJceDczXHgyN1x4
NzRceDY4XHgyN1x4NzBceDc1XHg3NVx4NjhceDIwXHgyNFx4MjRceDI3XHg2OFx4NzlceDcyXHg3
Nlx4NzVceDY4XHg3N1x4NzNceDc5XHgyN1x4NjhceDI0XHgyMFx4NzRceDc3XHg2OFx4MjdceDIw
XHg3NFx4MjJceDY4XHgyNVx4NzdceDIwXHg3OFx4NjhceDc1XHg3Mlx4NzlceDc0XHg2OFx4NzVc
eDI0XHgyM1x4NzJceDY4XHg3Nlx4MjdceDI0XHgyNFx4NjhceDIyXHg3OVx4NzdceDczXHg2OFx4
NzRceDc5XHg3OFx4MjBceDY4XHgyNVx4MjVceDc2XHg3NFx4NjhceDI1XHg3NFx4NzFceDc2XHg2
OFx4MjdceDc1XHgyM1x4MjNceDY4XHgyNFx4MjJceDIwXHg3N1x4NjhceDIyXHgyNVx4NzNceDc4
XHg2OFx4NzNceDIzXHg3NVx4NzZceDY4XHg3M1x4NzNceDc1XHgyNVx4NTRceDVFXHg4Qlx4RkVc
eDhCXHhEN1x4RkNceEI5XHg4MFx4MDBceDAwXHgwMFx4QkJceDQxXHgwMFx4MDBceDAwXHgzMVx4
QzBceDUwXHhBQ1x4MzNceEMzXHhBQVx4RTJceEZBXHg1NFx4NUVceEND
```

Looks like __BASE64__ encoded text, so we can copy text to file and try to decode it.
```bash
$ cat encoded_raw | base64 -d
```
```bash
Email: <your_email_address> , Registration Code: <your_registration_number> | 
Now decode your CTP Secret Key and you are done! : 
\x31\xC0\x50\x68\x24\x77\x75\x71\x68\x75\x23\x79\x20\x68\x78\x76\x24\x25\x68
\x75\x76\x22\x23\x68\x77\x77\x76\x75\x68\x75\x24\x25\x74\x68\x27\x27\x20\x22
\x68\x24\x74\x23\x23\x68\x20\x73\x71\x20\x68\x70\x73\x79\x77\x68\x78\x76\x23
\x20\x68\x76\x25\x25\x22\x68\x72\x73\x27\x74\x68\x27\x70\x75\x75\x68\x20\x24
\x24\x27\x68\x79\x72\x76\x75\x68\x77\x73\x79\x27\x68\x24\x20\x74\x77\x68\x27
\x20\x74\x22\x68\x25\x77\x20\x78\x68\x75\x72\x79\x74\x68\x75\x24\x23\x72\x68
\x76\x27\x24\x24\x68\x22\x79\x77\x73\x68\x74\x79\x78\x20\x68\x25\x25\x76\x74
\x68\x25\x74\x71\x76\x68\x27\x75\x23\x23\x68\x24\x22\x20\x77\x68\x22\x25\x73
\x78\x68\x73\x23\x75\x76\x68\x73\x73\x75\x25\x54\x5E\x8B\xFE\x8B\xD7\xFC\xB9
\x80\x00\x00\x00\xBB\x41\x00\x00\x00\x31\xC0\x50\xAC\x33\xC3\xAA\xE2\xFA\x54
\x5E\xCC
```

It is something like binary blob, let's [search it](https://duckduckgo.com/?q=\x31\xc0).
After searching we can think about __shellcode__. So let's save it to file.

```bash
$ python -c 'import sys; sys.stdout.buffer.write(b"\x31\xC0\x50\x68\x24\x77\x75\x71\x68\x75\x23\x79\x20\x68\x78\x76\x24\x25\x68\x75\x76\x22\x23\x68\x77\x77\x76\x75\x68\x75\x24\x25\x74\x68\x27\x27\x20\x22\x68\x24\x74\x23\x23\x68\x20\x73\x71\x20\x68\x70\x73\x79\x77\x68\x78\x76\x23\x20\x68\x76\x25\x25\x22\x68\x72\x73\x27\x74\x68\x27\x70\x75\x75\x68\x20\x24\x24\x27\x68\x79\x72\x76\x75\x68\x77\x73\x79\x27\x68\x24\x20\x74\x77\x68\x27\x20\x74\x22\x68\x25\x77\x20\x78\x68\x75\x72\x79\x74\x68\x75\x24\x23\x72\x68\x76\x27\x24\x24\x68\x22\x79\x77\x73\x68\x74\x79\x78\x20\x68\x25\x25\x76\x74\x68\x25\x74\x71\x76\x68\x27\x75\x23\x23\x68\x24\x22\x20\x77\x68\x22\x25\x73\x78\x68\x73\x23\x75\x76\x68\x73\x73\x75\x25\x54\x5E\x8B\xFE\x8B\xD7\xFC\xB9\x80\x00\x00\x00\xBB\x41\x00\x00\x00\x31\xC0\x50\xAC\x33\xC3\xAA\xE2\xFA\x54\x5E\xCC")' > shellcode
$ ndisasm -b 32 shellcode > shellcode.asm
```

```bash
$ cat shellcode.asm
00000000  31C0              xor eax,eax
00000002  50                push eax
00000003  6824777571        push dword 0x71757724
00000008  6875237920        push dword 0x20792375
0000000D  6878762425        push dword 0x25247678
00000012  6875762223        push dword 0x23227675
00000017  6877777675        push dword 0x75767777
0000001C  6875242574        push dword 0x74252475
00000021  6827272022        push dword 0x22202727
00000026  6824742323        push dword 0x23237424
0000002B  6820737120        push dword 0x20717320
00000030  6870737977        push dword 0x77797370
00000035  6878762320        push dword 0x20237678
0000003A  6876252522        push dword 0x22252576
0000003F  6872732774        push dword 0x74277372
00000044  6827707575        push dword 0x75757027
00000049  6820242427        push dword 0x27242420
0000004E  6879727675        push dword 0x75767279
00000053  6877737927        push dword 0x27797377
00000058  6824207477        push dword 0x77742024
0000005D  6827207422        push dword 0x22742027
00000062  6825772078        push dword 0x78207725
00000067  6875727974        push dword 0x74797275
0000006C  6875242372        push dword 0x72232475
00000071  6876272424        push dword 0x24242776
00000076  6822797773        push dword 0x73777922
0000007B  6874797820        push dword 0x20787974
00000080  6825257674        push dword 0x74762525
00000085  6825747176        push dword 0x76717425
0000008A  6827752323        push dword 0x23237527
0000008F  6824222077        push dword 0x77202224
00000094  6822257378        push dword 0x78732522
00000099  6873237576        push dword 0x76752373
0000009E  6873737525        push dword 0x25757373
000000A3  54                push esp
000000A4  5E                pop esi
000000A5  8BFE              mov edi,esi
000000A7  8BD7              mov edx,edi
000000A9  FC                cld
000000AA  B980000000        mov ecx,0x80
000000AF  BB41000000        mov ebx,0x41
000000B4  31C0              xor eax,eax
000000B6  50                push eax
000000B7  AC                lodsb
000000B8  33C3              xor eax,ebx
000000BA  AA                stosb
000000BB  E2FA              loop 0xb7
000000BD  54                push esp
000000BE  5E                pop esi
000000BF  CC                int3
```

Now we have to edit the file before we can assemble it.
```bash
$ awk '{$1=$2=""; print $0}' shellcode.asm | sed 's/^  //g' > shellcode_edited.asm
```

Save diff to patch file __shellcode.patch__
```patch
--- shellcode.asm	2020-01-23 12:29:31.345434907 +0100
+++ shellcode_diff.asm	2020-01-23 12:28:09.689429680 +0100
@@ -1,3 +1,5 @@
+global _start
+_start:
 xor eax,eax
 push eax
 push dword 0x71757724
@@ -41,10 +43,11 @@
 mov ebx,0x41
 xor eax,eax
 push eax
+decode:
 lodsb
 xor eax,ebx
 stosb
-loop 0xb7
+loop decode
 push esp
 pop esi
 int3
```

And apply the following patch. Then we can assemble it.
```bash
$ patch < shellcode.patch
$ nasm -f elf shellcode.asm
$ ld -m elf_i386 -o key_ed shellcode.o
```

![osce_prologue](/img/osce-prologue.png)

Finally let's find the __secret key__!
```bash
$ gdb ./key_ed
$(gdb) r
$(gdb) x/s $edx
0xffffdbec:	"224d2b47cd29eca6f4bbd507dd75589ac8627fee4eb34385d6a9fa5cea56628f8374aeeff14432f57ddc97ba1286a20ae5bbffac4ed5667447cb97ed4b8ae640"
```
