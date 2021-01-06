---
title: "Fix Helm Deployment"
date: 2020-01-05T18:43:05+01:00
draft: true
---

```bash
$ for i in $(kubectl -n graylog get secret | awk '{print $1}' | grep sh.helm); do kubectl -n graylog delete secret $i; done
$ kubectl -n graylog delete configmap graylog-dev
$ kubectl -n graylog delete serviceaccount graylog-dev
$ kubectl -n graylog delete rolebinding graylog-dev 
$ kubectl -n graylog delete role graylog-dev
$ kubectl -n graylog delete svc graylog-dev-master
$ kubectl -n graylog delete svc graylog-dev-tcp
$ kubectl -n graylog delete svc graylog-dev-udp
$ kubectl -n graylog delete svc graylog-dev-web
$ helm install --namespace graylog graylog-dev ./ -f values_dev.yaml --set tags.install-mongodb=false --set tags.install-elasticsearch=false
```
