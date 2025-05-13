+++
date = '2024-04-21T22:57:40+01:00'
title = 'Port Security'
tags = ["portsecurity"]
categories = ["Network"]
author = "Soner Sahin"
image = "/images/port-sec/cover.jpg"
+++

Port Security, yetkisiz cihazların networke erişimini engellemek için kullanılır. Layer 2 seviyesinde uygulanır. Switch portlarına bağlanabilecek cihazların MAC adresleri bazında güvenliği sağlanır. Port Security uygulanacak switch portu ya access ya da trunk olamalıdır. Cihaz'a default olarak geldiği gibi Port Security yapılmaz, hata verir.
Konfigürasyon interface altında yapılır.

Switch'de boşta bulunan portları kapatmak güvenliğin ilk adımıdır.

3 Yöntem vardır;
**1- MAC Adresi Manuel Belirlenebilir.**
```
switchport port-security mac-address 0000.1111.2222.3333
switchport port-security maximum 2       (Max. 2 MAC Adresine izin verir.)
```

**2- MAC Adresi Dinamik Olarak Öğrenilebiliyor.**
```
switchport port-security                (Default 1 MAC)
```
Burada dinamik olarak öğrenilen MAC adresi RAM'de tutulur. Switch restart edildiğinde konfigürasyon gider. Tekrar yapılması gerekir.

**3- MAC Adresi Dinamik Olarak Öğrenilip Kaydediliyor.**
```
switchport port-security mac-address sticky
```
Bu uygulamada ise MAC adresi kalıcı hafızaya kaydediliyor. Cihaz restart edilse bile konfigürasyon gitmez.


Eğer bir ihlal olursa aşağıdakileri uygulayabiliriz.
**- Portu Kapat ; Shutdown:**
```
switchport port-security violation shutdown
```

Defaultta bu modda gelir. Portu tamamen kapatır. Eski haline getirmek için manuel olarak port açılmalıdır. Eğer bir syslog yapılandırması varsa log atar. 

**- Portu Kısıtla ; Restrict:**
```
switchport port-security violation restrict
```
Portu kısıtlar. Yani paketleri drop eder fakat port açıktır. Log kaydı atar. Doğru cihaz takıldığında otomatik olarak düzelir.

**- Portu Koru ; Protect:**
```
switchport port-security violation protect
```
Portu kapatmaz. Paketleri drop eder. Log atmaz. Doğru cihaz takıldığında düzelir.

**Kontrol;**
```
show port-security ?
```

Teşekkürler,

İyi Çalışmalar