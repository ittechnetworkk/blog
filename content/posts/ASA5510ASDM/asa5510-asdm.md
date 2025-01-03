+++
date = '2024-12-02T22:57:40+01:00'
title = 'Cisco ASA ASDM Enable'
tags = ["asa", "cisco", "firewall"]
categories = ["Firewall"]
author = "Soner Sahin"
+++

Merhaba, bu yazımda Cisco ASA 5510 cihazını web arayüzünden yönetebilmek için gerekli konfigürasyonları göstereceğim.

İlk olarak asdm imajını çekiyorum:
```
ASA(config)# show disk0:
ASA(config)# asdm image flash:/asdm-649.bin          
```

HTTP servisini enable ediyorum:
```
ASA# conf t
ASA(config)# http server enable
```

GUI'e erişebilecek network aralığını belirliyorum:
```
ASA(config)# http 192.168.1.0 255.255.255.0 management
```

Username ve Password belirliyorum:
```
ASA(config)# username <User> password <Password> privilege 15
```

Management Interface'ye IP veriyorum:
```
ASA(config)# interface Management0/0
ASA(config)# ip addr 192.168.1.2 255.255.255.0
ASA(config)# no sh
```

Tarayıcımızdan cihazın IP adresine gidecek olursak web arayüzü bizi karşılayacaktır.

Teşekkürler,

İyi Çalışmalar.