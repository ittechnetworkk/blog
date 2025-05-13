+++
date = '2024-12-02T22:57:40+01:00'
title = 'Cisco ASA Password Recovery'
tags = ["asa", "cisco", "firewall"]
categories = ["Firewall"]
author = "Soner Sahin"
image = "/images/ASA-SSH/cover.jpg"
+++

Merhabalar bu yazımda Cisco ASA 5500 serisi cihazın password recovery işlemini göstereceğim.

İlk olarak cihaza console kablosu ile bağlanıyorum cihazı başlatıyorum.

Cihaz başlarken aşağıdaki gibi bir ekran geldiğinde "ESC" tuşuna basıp "rommon" moduna geçiyorum.

![asa](/images/ASAPasswordRecovery/1.png)

Bu kısımda "ESC" tuşuna basar basmaz aşağıdaki "rommon" modu karşımıza çıkacaktır.

![asa](/images/ASAPasswordRecovery/2.png)

Password recovery için aşağıdaki komutları sırasıyla yazıyorum:

```
rommon #0> confreg 0x41
rommon #0> confreg
rommon #0> boot
```

"confreg" komutundan sonra çıkan soruları aşağıdaki gibi seçiyorum.

![asa](/images/ASAPasswordRecovery/3.png)

Cihaz boot olduktan sonra da aşağıdaki komutları sırasıyla uyguluyorum:

```
ciscoasa> enable
Password:                                                 #boş
ciscoasa# copy startup-config running-config
ciscoasa# configure terminal
ciscoasa# password <Your-Password>
ciscoasa# enable password <Your-Password>
ciscoasa# username <User> password <Your-Password>
ciscoasa# no config-register
ciscoasa# write memory
ciscoasa# copy running-config startup-config
```

İşlem bu kadar.

İyi Çalışmalar.


