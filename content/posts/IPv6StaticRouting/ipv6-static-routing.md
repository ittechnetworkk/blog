+++
date = '2024-06-25T22:57:40+01:00'
title = 'IPv6 Static Routing'
tags = ["ipv6", "routing"]
author = "Soner Sahin"
+++

Static Route hedefe gitmek için manuel olarak yazılan rotadır. Static Route küçük networkler için kullanılabilir. Fakat orta ve büyük networklerde iş yükünü fazlaca artırabilir.


![routing](/images/ipv6-static-routing/1.png)

Bu da diğer Dynamic Routing protokollerinden ayıran bir özelliğidir. Bu demektir ki bir networkte Dynamic Routing Protokolü çalışsa bile öncelik statik olarak yazılan rotadadır.

**Static Route Yazımı:**
Statik rota yazmak oldukça kolaydır. Aşağıda 2 farklı yazımı görebilirsiniz. İkisi de kullanılabilir.

```
Router(config)#ipv6 route 2001:3::/64 2001:2::2
Router(config)#ipv6 route 2001:3::/64 gi0/1
```

Bunun anlamı; ***2001:3::/64*** networküne gitmek için ***2001:2::2*** yolunu kullan.
veya yine ***2001:3::/64*** networküne gitmek için ***gi0/1*** interfacesini kullan.

**Default Rota:**
Default rota, bilmediğin her şeyi ona sor demek.
Yani ben routerda bir default rota yazarsam, router bilmediği her networkü ona soracaktır.
IPv6'da Default Route yazımı şöyledir:

```
Router#conf t
Router(config)#ipv6 route ::0/0 2001:0::1
```

**::0/0** 
değeri bütün networkleri ifade eder. Yani interneti.

**2001:0::1**
Değeri ise çıkışın nereden yapılacağını ifade eder.
Yani bütün networklere gitmek için ***2001:0::1*** bu yolu kullan.

**IPv6 Floating Static Route:**
IPv6 Floating Static Route, bir hedefe birden fazla rotanın bulunmasına denir. Yani hedefe bir ana rota bir veya birden fazla backup rota olmasına denir. Bunu Administrative Distance değerine göre yapılır. 
Defaultta Static Route'un AD değeri 1'dir. Biz aynı hedefe farklı bir yoldan bir statik rota daha yazarsak ve bu rotanın AD değerini 2 yaparsak Floating Static Route yapmış oluruz. Veya aynı hedefe farklı bir rotamız daha varsa onu da yazıp AD değerini 3 yaparsak yine Floating Static Route yapmış oluruz.
Bu AD değerlerini 1-255 arasında verebiliriz.

**IPv6 Static Route LAB:**
Aşağıdaki topolojiyi uygulayacağız.

![routing](/images/ipv6-static-routing/2.png)

Yapılacaklar:
1. Cihazlara hostname ve IP'lerini tanımla,
3. Ana rota ve backup rotaları belirle,
4. Ping ve traceroute testlerini yap.

Başlayalım.


1. **Cihazlara hostname ve IP'lerini tanımla,**

**R1:**
```
Router>enable
Router#conf t
Router(config)#hostname R1
R1(config)#ipv6 unicast-routing 

R1(config)#int e0/2
R1(config-if)#ipv6 addr 2001:10::1/64
R1(config-if)#no sh

R1(config-if)#int e0/1
R1(config-if)#ipv6 addr 2001:2::1/64
R1(config-if)#no sh

R1(config-if)#int e0/0
R1(config-if)#ipv6 addr 2001:1::1/64
R1(config-if)#no sh
R1(config-if)#exit
```

**R2:**
```
Router>enable
Router#conf t
Router(config)#hostname R2
R2(config)#ipv6 unicast-routing 

R2(config)#int e0/0
R2(config-if)#ipv6 addr 2001:2::2/64
R2(config-if)#no sh

R2(config-if)#int e0/2
R2(config-if)#ipv6 addr 2001:20::2/64
R2(config-if)#no sh
R2(config-if)#exit
```

**R3:**
```
Router>enable
Router#conf t
Router(config)#hostname R3
R3(config)#ipv6 unicast-routing 

R3(config)#int e0/1
R3(config-if)#ipv6 addr 2001:20::1/64
R3(config-if)#no sh

R3(config-if)#int e0/0
R3(config-if)#ipv6 addr 2001:1::1/64
R3(config-if)#no sh
R3(config-if)#exit
```

**VPC1:**
```
VPCS> ip 2001:10::10/64     
PC1 : 2001:10::10/64 
```

**VPC2:**
```
VPCS> ip 2001:20::10/64     
PC1 : 2001:20::10/64 
```


Rotaları Belirleyelim:

Network A'dan B'ye giderken;
R3'ü ana rota, R2'yi yedek rota yapalım.

**R1:**
```
R1(config)#ipv6 route 2001:20::/64 2001:1::2 1
R1(config)#ipv6 route 2001:20::/64 2001:2::2 2
```

**R2:**
```
R2(config)#ipv6 route 2001:10::/64 2001:2::1
```

**R3:**
```
R3(config)#ipv6 route 2001:10::/64 2001:1::1
```

**Test:**
VPC1'den VPC3'e

```
VPCS> ping 2001:20::10

2001:20::10 icmp6_seq=1 ttl=60 time=27.449 ms
2001:20::10 icmp6_seq=2 ttl=60 time=5.465 ms
2001:20::10 icmp6_seq=3 ttl=60 time=1.093 ms
2001:20::10 icmp6_seq=4 ttl=60 time=5.050 ms
2001:20::10 icmp6_seq=5 ttl=60 time=1.112 ms


VPCS> trace 2001:20::10

trace to 2001:20::10, 64 hops max
 1 2001:10::1   2.522 ms  2.265 ms  2.301 ms
 2 2001:1::2   3.118 ms  3.460 ms  2.884 ms
 3 2001:20::10   4.398 ms  4.472 ms  4.314 ms

```

**R1'in Routing Tablosu:**
```
R1#sh ipv6 route
IPv6 Routing Table - default - 8 entries
Codes: C - Connected, L - Local, S - Static, U - Per-user Static route
       B - BGP, HA - Home Agent, MR - Mobile Router, R - RIP
       H - NHRP, I1 - ISIS L1, I2 - ISIS L2, IA - ISIS interarea
       IS - ISIS summary, D - EIGRP, EX - EIGRP external, NM - NEMO
       ND - ND Default, NDp - ND Prefix, DCE - Destination, NDr - Redirect
       O - OSPF Intra, OI - OSPF Inter, OE1 - OSPF ext 1, OE2 - OSPF ext 2
       ON1 - OSPF NSSA ext 1, ON2 - OSPF NSSA ext 2, la - LISP alt
       lr - LISP site-registrations, ld - LISP dyn-eid, a - Application
C   2001:1::/64 [0/0]
     via Ethernet0/0, directly connected
L   2001:1::1/128 [0/0]
     via Ethernet0/0, receive
C   2001:2::/64 [0/0]
     via Ethernet0/1, directly connected
L   2001:2::1/128 [0/0]
     via Ethernet0/1, receive
C   2001:10::/64 [0/0]
     via Ethernet0/2, directly connected
L   2001:10::1/128 [0/0]
     via Ethernet0/2, receive
S   2001:20::/64 [1/0]
     via 2001:1::2
L   FF00::/8 [0/0]
     via Null0, receive

```


Şimdi ana rotanın portunu kapatıp yedek rotadan gidip gitmeyeceğine bakacağım.

```
VPCS> trace 2001:20::10

trace to 2001:20::10, 64 hops max
 1 2001:10::1   13.759 ms  2.201 ms  2.264 ms
 2 2001:2::2   3.072 ms  3.146 ms  2.824 ms
 3 2001:20::10   16.644 ms  4.822 ms  4.810 ms

```

Portu kapattığımda ise yedek rotadan gittiğini görmüş olduk.

Görüldüğü üzere tek bir statik rota görünüyor. Bunun nedeni ise yazdığımız iki rotadan birinin AD değeri 1 diğerininki 2'ydi. 

Eğer ikisi de aynı değere sahip olsaydı ikiside görünecekti.

Ana rotanın portunu kapattığımda ise R1'in Routing Tablosu aşağıdaki gibi oldu.

```
R1#sh ipv6 rout
IPv6 Routing Table - default - 6 entries
Codes: C - Connected, L - Local, S - Static, U - Per-user Static route
       B - BGP, HA - Home Agent, MR - Mobile Router, R - RIP
       H - NHRP, I1 - ISIS L1, I2 - ISIS L2, IA - ISIS interarea
       IS - ISIS summary, D - EIGRP, EX - EIGRP external, NM - NEMO
       ND - ND Default, NDp - ND Prefix, DCE - Destination, NDr - Redirect
       O - OSPF Intra, OI - OSPF Inter, OE1 - OSPF ext 1, OE2 - OSPF ext 2
       ON1 - OSPF NSSA ext 1, ON2 - OSPF NSSA ext 2, la - LISP alt
       lr - LISP site-registrations, ld - LISP dyn-eid, a - Application
C   2001:2::/64 [0/0]
     via Ethernet0/1, directly connected
L   2001:2::1/128 [0/0]
     via Ethernet0/1, receive
C   2001:10::/64 [0/0]
     via Ethernet0/2, directly connected
L   2001:10::1/128 [0/0]
     via Ethernet0/2, receive
S   2001:20::/64 [2/0]
     via 2001:2::2
L   FF00::/8 [0/0]
     via Null0, receive
```

Ana rota olmadığı için yedek rotanın kuralını gösterdi.

Teşekkürler, 

İyi Çalışmalar.