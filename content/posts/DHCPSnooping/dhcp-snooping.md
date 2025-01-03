+++
title = "DHCP Snooping"
date = "2023-12-31T23:44:03+01:00"
tags = ["Cisco", "DHCP", "Snooping"]
categories = ["Network"]
author = "Soner Sahin"
+++

DHCP(Dynamic Host Configuration Protocol), ağdaki cihazlarımıza otomatik olarak IP, DNS, Default Gateway bilgilerini dağıtan servistir. Ağa yeni bir cihaz katıldığında, kablo takılır takılmaz IP almak için Broadcast yayın yapar. Eğer ortamda DHCP servisi varsa o da karşılık verir. Toplam 4 aşamada IP alma işlemi tamamlanır. 

![dhcp](/images/DHCPSnooping/8.png)

Bu paketler Broadcast paketler olduğu için ağdaki herkese ulaşır bu da her zaman için iyi olmayabilir. Örneğin bir network yapısında iki DHCP server aynı anda çalışabilir. Biri istenmeyen, kötü niyetli de olabilir ve cihaza istediği IP, DNS, Default Gateway bilgisi dağıtarak, trafiği istenmeyen şekilde etkileyebilir. DHCP Snooping'i aktif hale getirmek gerekir.
DHCP Server'ın kim ve switch'in hangi portundan bağlı olduğunu bildiğimiz için, switch'e bunu öğretebiliriz ve bu sayede bu kötü senaryonun önüne geçmiş oluruz. 
DHCP Snooping'in yaptığı ise belirli bir port veya portlar üzerinden DHCP trafiğine izin verir geri kalanını engeller. 


**UYGULAMA**
Topoloji:
![[Network/DHCP Snooping/Topoloji.png]]

Yukarıdaki yapıda henüz IP adresi almamış 3 cihaz 2 de DHCP Server bulunuyor.

**1-Öncelikle Server'lara yukarıda yazıldığı gibi kendi statik IP adreslerini verelim.**

**Server1**

![dhcp](/images/DHCPSnooping/1.png)

**Server2**

![dhcp](/images/DHCPSnooping/2.png)


**2-DHCP Server'lara istenildiği gibi Pool oluşturalım ve ON durumuna getirelim.**

**Server1**

![dhcp](/images/DHCPSnooping/3.png)

**Server2**

![dhcp](/images/DHCPSnooping/4.png)


**3-PC'leri IP almaları için DHCP'ye çekelim ve kimden, hangi networkten IP aldıklarına bakalım** 

**PC1:**

![dhcp](/images/DHCPSnooping/5.png)


**PC2:**

![dhcp](/images/DHCPSnooping/6.png)


**PC3:**

![dhcp](/images/DHCPSnooping/7.png)


PC1 ve PC3'de istenmeyen durum gerçekleşti ve sahte olarak yapılandırdığımız DHCP Server'dan IP aldı. 
Şimdi bunu engellemek için DHCP Snooping'i aktif edip doğru olandan IP almalarını sağlayacağız.
Doğru olan Server Fa0/4 portuna bağlı olduğunu biliyoruz.

**Switch1:**
```
Switch>enable 
Switch#configure terminal
Switch(config)#ip dhcp snooping               # DHCP Snooping etkin.
Switch(config)#ip dhcp snooping vlan 1        # Bizim tek vlan'ımız olduğu için.
Switch(config)#interface fastEthernet 0/1     # Bu port güvenli.
Switch(config-if)#ip dhcp snooping trust
```

**4-Cihazların tekrar IP almalarını sağlamak için statik'e çekip tekrar DHCP'ye alalım**

**PC1:**

![dhcp](/images/DHCPSnooping/9.png)


**PC3:**

![dhcp](/images/DHCPSnooping/10.png)

Bu cihazlar da artık doğru DHCP Server'dan IP almış oldular.

Teşekkürler,

İyi Çalışmalar.