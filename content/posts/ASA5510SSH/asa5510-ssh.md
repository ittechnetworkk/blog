+++
date = '2024-12-01T22:57:40+01:00'
title = 'Cisco ASA SSH Konfigürasyonu'
tags = ["asa", "cisco", "firewall", "ssh"]
author = "Soner Sahin"
+++

Merhabalar, bu yazımda Cisco ASA 5510'a SSH konfigürasyonu yapmayı göstereceğim.

İlk olarak bir kullanıcı oluşturuyorum:
```
ASA# conf t
ASA(config)# username <User> password <Password> privilege 15
```

Kimlik doğrulama modunu ayarlıyorum:
```
ASA(config)# aaa authentication ssh console LOCAL
```

SSH versiyonunu 2 yapıyorum ve timeout değerini ayarlıyorum:
```
ASA(config)# ssh version 2
ASA(config)# ssh timeout 30
```

Bir domain adı ve anahtar çifti yaratıyorum:
```
ASA(config)# domain-name sonersahin.local
ASA(config)# crypto key generate rsa modulus 1024
```

Cihaza SSH yapacak network aralığı belirliyorum, isterseniz sadece belli bir IP adresini de yapabilirsiniz:
```
ASA(config)# ssh 192.168.1.0 255.255.255.0 management
```

Management arayüzüne IP veriyorum:
```
ASA(config)# interface Management0/0
ASA(config)# ip addr 192.168.1.204 255.255.255.0
ASA(config)# no sh
```

Kontrol komutları:
```
ASA# show ssh
ASA# show ssh sessions
ASA# show running-config
```