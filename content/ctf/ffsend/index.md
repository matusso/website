---
title: "Firefox Send and storing secrets for decrypting files"
date: 2020-01-27T17:14:31+01:00
draft: true
---

```bash
sqlite> SELECT * FROM webappsstore2 WHERE originKey='moc.xoferif.dnes.:https:443';
|moc.xoferif.dnes.:https:443|moc.xoferif.dnes.:https:443|testpilot_ga__cid|5c78ed8d-ed29-4b22-83ff-160f8298054d
|moc.xoferif.dnes.:https:443|moc.xoferif.dnes.:https:443|referrer|null
|moc.xoferif.dnes.:https:443|moc.xoferif.dnes.:https:443|firstAction|download
|moc.xoferif.dnes.:https:443|moc.xoferif.dnes.:https:443|totalDownloads|1
|moc.xoferif.dnes.:https:443|moc.xoferif.dnes.:https:443|ab_experiments|{"signin_button_color":"blue"}
|moc.xoferif.dnes.:https:443|moc.xoferif.dnes.:https:443|totalUploads|5
|moc.xoferif.dnes.:https:443|moc.xoferif.dnes.:https:443|32178375d6b52065|{"id":"32178375d6b52065","url":"https://send.firefox.com/download/32178375d6b52065/#DLpa502g4oXZGH7_4SPrVw","name":"image.png","size":692611,"manifest":{"files":[{"name":"image.png","size":692611,"type":"image/png"}]},"time":2456,"speed":282007.7361563518,"createdAt":1578399173137,"expiresAt":1578485573137,"secretKey":"DLpa502g4oXZGH7_4SPrVw","ownerToken":"87dcea342699d8fc5283","dlimit":1,"dtotal":0,"hasPassword":false,"timeLimit":86400}
```
