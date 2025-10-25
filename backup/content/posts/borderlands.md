---
title: "Borderlands"
author: "Matus Bursa"
date: "2020-02-11T16:01:56+01:00"
draft: true
tags: ["ctf", "tryhackme"]
categories: ["ctf", "tryhackme"]
---

```bash
$ nmap -p- -sV 10.10.92.228
Starting Nmap 7.80 ( https://nmap.org ) at 2020-02-11 15:53 CET
Nmap scan report for 10.10.92.228
Host is up (0.070s latency).
Not shown: 65532 filtered ports
PORT     STATE  SERVICE    VERSION
22/tcp   open   ssh        OpenSSH 7.2p2 Ubuntu 4ubuntu2.8 (Ubuntu Linux; protocol 2.0)
80/tcp   open   http       nginx 1.14.0 (Ubuntu)
8080/tcp closed http-proxy
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 296.10 seconds
```

