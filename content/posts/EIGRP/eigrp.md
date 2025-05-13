+++
title = "EIGRP Protokolü"
date = "2024-01-21T23:44:58+01:00"
tags = ["Cisco", "EIGRP"]
categories = ["Network"]
author = "Soner Sahin"
image = "/images/EIGRP/cover.jpg"
+++

EIGRP (Enchanced Interior Gateway Routing Protocol), Cisco tarafından geliştirilen bir dinamik yönlendirme protokolüdür. Daha sonradan diğer firmaların kullanımına sunulmuştur. RFC7868de tanımlanmıştır. Hem Distance Vector hem de Link State protokol özelliklerini aldığı için Hybrid Protokol olarak da geçer. Bazı özellikleri şöyledir:
- Max 224 hop destekler,
- VLSM destekler, yani subnetting destekler,
- Hem Unicast hem de Multicast çalışır 224.0.0.10,
- Bir ana rota (Succesor), bir de yedek rota (Feasible Succesor) belirlenir,
- Hızlı yakınsama sağlar, alternatif rotalar arasında geçiş hızlıdır,
- Administrative Distance değeri 90'dır,
- Yönlendirme tablosunda değişiklik olduğunda tüm tabloyu değil sadece değişiklik olan kısmı diğer Router'lara gönderir,
-  5 Saniyede bir "Hello" paketi gönderir, 15 saniye "Acknowledgement" paketiyle cevap gelmezse komşuluk düşer,
- EIGRP Paketleri: 
	- Hello: Routerlar kendi aralarında 5 saniyede bir ayakta olduklarını duyurmak için kullandıkları pakettir.
	- Acknowledgement: Yapılan komşulukların onaylanmasında kullanılan pakettir.
	- Update: Ağ topolojisindeki değişiklikler bu paketle duyurulur.
	- Query: Yönlendirme bilgisine gerek duyan Router'lara gönderilir.
	- Reply: Query paketlerine cevaben gönderilen pakettir.
- Bu paketlerin iletiminde RTP(Reliable Transport Protocol) kullanılır,
- Metrik hesaplamada;
	- K1= Bant Genişliği (Bandwidth), 
	- K2= Yük (Load), 
	- K3= Gecikme (Delay),
	- K4= Güvenilirlik (Reliability), 
	- K5= MTU,
- Defaultta Bant Genişliği(Bandwidth) ve Gecikme(Delay) parametlereleri kullanlılarak metrik hesaplanır. Metrik = (Bandwidth + Delay) * 256
- Metrik değerleri aynı olmayan cihazlar komşuluk kuramaz,
- EIGRP Network duyurularında aşağıdaki farklı kullanım şekilleri sunulmuştur. 3'ü de kullanılabilir.
	```
    R1(config-router)# network 192.168.1.0 0.0.0.255        # atası budur
	R1(config-router)# network 192.168.1.0 255.255.255.0    # yeni cihazlar tanıyabiliyor
	R1(config-router)# network 192.168.1.5 0.0.0.0          # ilgili interface duyurulur
	R1(config-router)# network 192.168.1.0
    ```

**UYGULAMA:**

Aşağıdaki topolojiyi uygulayacağız.

![eigrp](/images/EIGRP/1.png)


**1-Cihazlara ve Interfacelere IP'lerini vererek başlayalım.**

**VPC9:**
```
VPCS> ip 192.168.3.10 255.255.255.0 gateway 192.168.3.1
```

**VPC10:**
```
VPCS> ip 192.168.4.10 255.255.255.0 gateway 192.168.4.1
```

**VPC11:**
```
VPCS> ip 192.168.1.10 255.255.255.0 gateway 192.168.1.1
```

**VPC12:**
```
VPCS> ip 192.168.2.10 255.255.255.0 gateway 192.168.2.1
```

**R1:**
```
R1>en
R1#conf t
R1(config)#int e0/0
R1(config-if)#ip address 192.168.3.1 255.255.255.0
R1(config-if)#no sh
R1(config-if)#exit    
R1(config)#int s2/1
R1(config-if)#ip addr 2.2.2.1 255.255.255.0
R1(config-if)#no sh
R1(config-if)#exit
R1(config)#int s2/2
R1(config-if)#ip addr 6.6.6.1 255.255.255.0
R1(config-if)#no sh
R1(config-if)#exit
R1(config)#int s2/0
R1(config-if)#ip addr 1.1.1.1 255.255.255.0
R1(config-if)#no sh
R1(config-if)#exit
```

**R2:**
```
R2>en
R2#conf t
R2(config)#int e0/0
R2(config-if)#ip addr 192.168.4.1 255.255.255.0
R2(config-if)#no sh
R2(config-if)#exit
R2(config)#int s2/0
R2(config-if)#ip addr 1.1.1.2 255.255.255.0
R2(config-if)#no sh
R2(config-if)#exit
R2(config)#int s2/2
R2(config-if)#ip addr 5.5.5.2 255.255.255.0
R2(config-if)#no sh
R2(config-if)#exit
R2(config)#int s2/1
R2(config-if)#ip addr 4.4.4.2 255.255.255.0
R2(config-if)#no sh
R2(config-if)#exit
```

**R3:**
```
R3>en
R3#conf t
R3(config)#int e0/0
R3(config-if)#ip addr 192.168.2.1 255.255.255.0
R3(config-if)#no sh
R3(config-if)#exit
R3(config)#int s2/0
R3(config-if)#ip addr 4.4.4.1 255.255.255.0
R3(config-if)#no sh
R3(config-if)#exit
R3(config)#int s2/2
R3(config-if)#ip addr 6.6.6.1 255.255.255.0
R3(config-if)#no sh
R3(config-if)#exit
R3(config)#int s2/1
R3(config-if)#ip addr 3.3.3.2 255.255.255.0
R3(config-if)#no sh
R3(config-if)#exit

```

**R4:**
```
R4>en
R4#conf t
R4(config)#int e0/0
R4(config-if)#ip addr 192.168.1.1 255.255.255.0
R4(config-if)#no sh
R4(config-if)#exit
R4(config)#int s2/0
R4(config-if)#ip addr 3.3.3.1 255.255.255.0
R4(config-if)#no sh
R4(config-if)#exit
R4(config)#int s2/2
R4(config-if)#ip addr 5.5.5.1 255.255.255.0
R4(config-if)#no sh
R4(config-if)#exit
R4(config)#int s2/1
R4(config-if)#ip addr 2.2.2.2 255.255.255.0
R4(config-if)#no sh
R4(config-if)#exit
```

**2-EIGRP Konfigürasyonunu Yapalım.**

**R1:**
```
R1(config)#router eigrp 10
R1(config-router)#eigrp router-id 1.1.1.1   #IP formatında ve özel olmalı
R1(config-router)#network 192.168.3.0 0.0.0.255
R1(config-router)#network 2.2.2.0 0.0.0.255  
R1(config-router)#network 6.6.6.0 0.0.0.255
R1(config-router)#network 1.1.1.0 0.0.0.255
```

**R2:**
```
R2(config)#router eigrp 10
R2(config-router)#eigrp router-id 2.2.2.2   #IP formatında ve özel olmalı
R2(config-router)#network 192.168.4.0 0.0.0.255
R2(config-router)#network 4.4.4.0 0.0.0.255 
R2(config-router)#network 5.5.5.0 0.0.0.255
R2(config-router)#network 1.1.1.0 0.0.0.255
```

**R3:**
```
R3(config)#router eigrp 10
R3(config-router)#eigrp router-id 3.3.3.3   #IP formatında ve özel olmalı
R3(config-router)#network 192.168.2.0 0.0.0.255
R3(config-router)#network 4.4.4.0 0.0.0.255 
R3(config-router)#network 6.6.6.0 0.0.0.255
R3(config-router)#network 3.3.3.0 0.0.0.255
```

**R4:**
```
R4(config)#router eigrp 10
R4(config-router)#eigrp router-id 4.4.4.4   #IP formatında ve özel olmalı
R4(config-router)#network 192.168.1.0 0.0.0.255
R4(config-router)#network 3.3.3.0 0.0.0.255 
R4(config-router)#network 5.5.5.0 0.0.0.255
R4(config-router)#network 2.2.2.0 0.0.0.255
```

**3-Şimdi birkaç ping testi yapalım.**

VPC9'dan VPC12, VPC10 ve VPC11'e:

![eigrp](/images/EIGRP/2.png)

VPC12'den VPC9, VPC10, VPC11'e:

![eigrp](/images/EIGRP/3.png)

Bütün networkler artık birbirlerini tanıyor.

**4-Son olarak EIGRP tablolarına bakalım.**

A-Neighbor Table:

![eigrp](/images/EIGRP/4.png)


B-Topology Table:

![eigrp](/images/EIGRP/5.png)

C-Routing Table:

![eigrp](/images/EIGRP/6.png)

Teşekkürler,


İyi Çalışmalar.