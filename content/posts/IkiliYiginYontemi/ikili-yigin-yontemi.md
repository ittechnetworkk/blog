+++
date = '2024-06-06T22:57:40+01:00'
title = 'İkili Yığın Yöntemi'
tags = ["ipv6", "dual-stack"]
author = "Soner Sahin"
+++

Bu yöntem, IPv4'den IPv6'ya geçiş yöntemlerinden biri olan tünelleme tekniğidir. Bu yöntemde, cihazların hem IPv4 hem de IPv6 adreslerini birlikte kullanması yöntemidir. 
Yani IPv4 ile gelen cihaz IPv4, IPv6 ile gelen cihaz IPv6 ile haberleşir.

Uygulamada daha net anlaşılacaktır.

Aşağıdaki topolojiyi uygulayacağım.

![ipv6](/images/IkiliYiginYontemi/1.png)




Yapılacaklar:
1. Router ve VPC'lerin Interface'lerine IPv4 ve IPv6 adreslerini tanımla,
2. Networklerin birbirleriyle haberleşmesi için statik rotalar yaz,
3. Test et.



**1. Router ve VPC'lerin Interface'lerine IPv4 ve IPv6 adreslerini tanımla,**

**R1:**
```
R1#configure terminal 
R1(config)#ipv6 unicast-routing 
R1(config)#interface e0/1
R1(config-if)#ip address 192.168.10.1 255.255.255.0
R1(config-if)#ipv6 addr 2001:10::1/64
R1(config-if)#no sh
R1(config-if)#exit
R1(config)#interface e0/0
R1(config-if)#ip addr 192.168.1.1 255.255.255.0
R1(config-if)#ipv6 addr 2001:1::1/64
R1(config-if)#no sh
R1(config-if)#exit
```

**R2:**
```
R2#configure terminal 
R2(config)#ipv6 unicast-routing 
R2(config)#interface e0/0
R2(config-if)#ip addr 192.168.1.2 255.255.255.0
R2(config-if)#ipv6 addr 2001:1::2/64
R2(config-if)#no sh
R2(config-if)#exit
R2(config)#interface e0/1
R2(config-if)#ip addr 192.168.20.1 255.255.255.0
R2(config-if)#ipv6 addr 2001:20::1/64
R2(config-if)#no sh
R2(config-if)#exit
```


**VPC1:**
```
VPCS> ip 2001:10::10/64                   
PC1 : 2001:10::10/64 
```

**VPC2:**
```
VPCS> ip 192.168.10.10 255.255.255.0 gateway 192.168.10.1
Checking for duplicate address...
VPCS : 192.168.10.10 255.255.255.0 gateway 192.168.10.1
```

**VPC3:**
```
VPCS> ip 2001:20::10/64
PC1 : 2001:20::10/64 
```

**VPC4:**
```
VPCS> ip 192.168.20.10 255.255.255.0 gateway 192.168.20.1
Checking for duplicate address...
VPCS : 192.168.20.10 255.255.255.0 gateway 192.168.20.1
```

**2. Networklerin birbirleriyle haberleşmesi için statik rotalar yaz,**

**R1:**
```
R1(config)#ip route 192.168.20.0 255.255.255.0 192.168.1.2
R1(config)#ipv6 route 2001:20::/64 2001:1::2
```

**R2:**
```
R2(config)#ip route 192.168.10.0 255.255.255.0 192.168.1.1
R2(config)#ipv6 route 2001:10::/64 2001:1::1
```

**3. Test et.**

**VPC1:**
```
VPCS> trace 2001:20::10                       #VPC3

trace to 2001:20::10, 64 hops max
 1 2001:10::1   1.952 ms  2.321 ms  1.847 ms
 2 2001:1::2   3.242 ms  3.188 ms  3.372 ms
 3 2001:20::10   4.848 ms  5.024 ms  5.471 ms
```

**VPC2:**
```
VPCS> ping 192.168.20.10                     #VPC4

84 bytes from 192.168.20.10 icmp_seq=1 ttl=62 time=5.311 ms
84 bytes from 192.168.20.10 icmp_seq=2 ttl=62 time=1.561 ms
84 bytes from 192.168.20.10 icmp_seq=3 ttl=62 time=4.598 ms
84 bytes from 192.168.20.10 icmp_seq=4 ttl=62 time=4.649 ms
84 bytes from 192.168.20.10 icmp_seq=5 ttl=62 time=5.378 ms
```

Peki IPv6 adresi olan bir cihazdan IPv4 adresi verdiğimiz bir cihaza ping atabilir miyiz? 

Evet. IPv4 adresi tanımladığımız cihaza IPv6'nın bir özelliği olan SLAAC yöntemi ile otomatik olarak Router'dan IPv6 adres bilgilerini alıp kendini konfigüre edebilir. 

Örnek olarak VPC4'e `192.168.20.10/24` adresini verdik. Kontrol edersek otomatik olarak networküne uygun IPv6 adresi de almış olduğunu görebiliriz.

**VPC4:**
```
VPCS> show ipv6

NAME              : VPCS[4]
LINK-LOCAL SCOPE  : fe80::250:79ff:fe66:6808/64
GLOBAL SCOPE      : 2001:20::2050:79ff:fe66:6808/64
DNS               : 
ROUTER LINK-LAYER : aa:bb:cc:00:20:10
MAC               : 00:50:79:66:68:08
LPORT             : 20000
RHOST:PORT        : 127.0.0.1:30000
MTU:              : 1500
```

Şimdi VPC2'den VPC4'e gitmeyi deneyelim.

**VPC2:**
```
VPCS> ping 2001:20::2050:79ff:fe66:6808

2001:20::2050:79ff:fe66:6808 icmp6_seq=1 ttl=60 time=22.575 ms
2001:20::2050:79ff:fe66:6808 icmp6_seq=2 ttl=60 time=1.658 ms
2001:20::2050:79ff:fe66:6808 icmp6_seq=3 ttl=60 time=4.149 ms
2001:20::2050:79ff:fe66:6808 icmp6_seq=4 ttl=60 time=4.727 ms
2001:20::2050:79ff:fe66:6808 icmp6_seq=5 ttl=60 time=4.667 ms


VPCS> ping 192.168.20.10

84 bytes from 192.168.20.10 icmp_seq=1 ttl=62 time=4.897 ms
84 bytes from 192.168.20.10 icmp_seq=2 ttl=62 time=1.662 ms
84 bytes from 192.168.20.10 icmp_seq=3 ttl=62 time=2.231 ms
84 bytes from 192.168.20.10 icmp_seq=4 ttl=62 time=1.859 ms
84 bytes from 192.168.20.10 icmp_seq=5 ttl=62 time=4.280 ms


VPCS> ping 2001:20::10

2001:20::10 icmp6_seq=1 ttl=60 time=4.865 ms
2001:20::10 icmp6_seq=2 ttl=60 time=2.019 ms
2001:20::10 icmp6_seq=3 ttl=60 time=4.803 ms
2001:20::10 icmp6_seq=4 ttl=60 time=5.480 ms
2001:20::10 icmp6_seq=5 ttl=60 time=2.077 ms

```

Görüldüğü gibi IPv6'ya geçiş yöntemlerinden biriolan Dual Stack Yöntemi de bu şekildedir.

Router'lara ve cihazlara hem IPv4 hem IPv6 adresleri tanımlayarak iletişim sağlanabilir.


Teşekkürler,

İyi Çalışmalar.