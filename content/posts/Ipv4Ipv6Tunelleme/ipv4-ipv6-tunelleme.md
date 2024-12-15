+++
date = '2024-05-31T22:57:40+01:00'
title = 'IPv4 IPv6 Tünelleme'
tags = ["ipv6", "tunnelling"]
author = "Soner Sahin"
+++

Bu yöntem, IPv4'den IPv6'ya geçiş yöntemlerinden biri olan tünelleme tekniğidir. Bu yöntemde, IPv6 networkleri IPv4 üzerinden tünellenerek birbirleriyle haberleşirler. IPv4-IPv6 geçiş aşamalarında kullanılabilecek bu yöntemin yanı sıra Dual Stack, Translation yöntemleri de vardır.

IPv4-IPv6 Tünelleme tekniği için aşağıdaki topolojiyi uygulayacağım.

![ipv6](/images/Ipv4Ipv6Tunelleme/1.png)

Yapılacaklar:
1. Interfacelere IP ver.
2. Sırasıyla tunnel oluştur.
3. Statik route yazarak networkleri haberleştir.
4. Test

**1. Interfacelere IP ver.**
**R1:**
```
R1#configure terminal 
R1(config)#int e0/0
R1(config-if)#ip addr 192.168.3.2 255.255.255.0
R1(config-if)#no sh
R1(config-if)#int e0/1
R1(config-if)#ip addr 192.168.1.1 255.255.255.0
R1(config-if)#no sh
R1(config-if)#int loopback 0
R1(config-if)#ipv6 addr 2001:1::1/64
R1(config-if)#no sh
R1(config-if)#exit
```

**R2:**
```
R2#configure terminal 
R2(config)#int e0/0
R2(config-if)#ip addr 192.168.2.2 255.255.255.0
R2(config-if)#no sh
R2(config-if)#int e0/1
R2(config-if)#ip addr 192.168.1.2 255.255.255.0
R2(config-if)#no sh
R2(config-if)#int loopback 0
R2(config-if)#ipv6 addr 2001:2::1/64
R2(config-if)#no sh
R2(config-if)#exit
```

**R3:**
```
R3#configure terminal 
R3(config)#int e0/0
R3(config-if)#ip addr 192.168.3.1 255.255.255.0
R3(config-if)#no sh
R3(config-if)#int e0/1
R3(config-if)#ip addr 192.168.2.1 255.255.255.0
R3(config-if)#no sh
R3(config-if)#int loopback 0
R3(config-if)#ipv6 addr 2001:3::1/64
R3(config-if)#no sh
R3(config-if)#exit
```


2. **Sırasıyla tunnel oluştur.**

**R1:**
```
R1(config)#int tunnel 1
R1(config-if)#ipv6 addr 2001:10::1/64
R1(config-if)#tunnel source e0/1
R1(config-if)#tunnel destination 192.168.1.2
R1(config-if)#tunnel mode ipv6ip 
R1(config-if)#exit

R1(config)#int tunnel 3
R1(config-if)#ipv6 addr 2001:30::1/64
R1(config-if)#tunnel source e0/0
R1(config-if)#tunnel destination 192.168.3.1 
R1(config-if)#tunnel mode ipv6ip
R1(config-if)#exit
```

**R2:**
```
R2(config)#int tunnel 1
R2(config-if)#ipv6 addr 2001:10::2/64 
R2(config-if)#tunnel source e0/1
R2(config-if)#tunnel destination 192.168.1.1 
R2(config-if)#tunnel mode ipv6ip
R2(config-if)#exit

R2(config)#int tunnel 2
R2(config-if)#ipv6 addr 2001:20::2/64
R2(config-if)#tunnel source e0/0
R2(config-if)#tunnel destination 192.168.2.1
R2(config-if)#tunnel mode ipv6ip
R2(config-if)#exit
```

**R3:**
```
R3(config)#int tunnel 3
R3(config-if)#ipv6 addr 2001:30::2/64
R3(config-if)#tunnel source e0/0
R3(config-if)#tunnel destination 192.168.3.2
R3(config-if)#tunnel mode ipv6ip
R3(config-if)#exit

R3(config)#int tunnel 2
R3(config-if)#ipv6 addr 2001:20::1/64
R3(config-if)#tunnel source e0/1
R3(config-if)#tunnel destination 192.168.2.2
R3(config-if)#tunnel mode ipv6ip
R3(config-if)#exit
```


3. **Statik route yazarak networkleri haberleştir.**

**R1:**
```
R1(config)#ipv6 route 2001:2::0/64 2001:10::2
R1(config)#ipv6 route 2001:3::/64 2001:30::2
```

**R2:**
```
R2(config)#ipv6 route 2001:1::/64 2001:10::1
R2(config)#ipv6 route 2001:3::/64 2001:20::1
```

**R3:**
```
R3(config)#ipv6 route 2001:1::/64 2001:30::1
R3(config)#ipv6 route 2001:2::/64 2001:20::2 
```


4. **Test:**

**R1:**
```
R1(config)#do ping 2001:2::1
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 2001:2::1, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/1/2 ms


R1(config)#do ping 2001:3::1
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 2001:3::1, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/1/1 ms
```

**R2:**
```
R2(config)#do ping 2001:1::1
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 2001:1::1, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/1/2 ms


R2(config)#do ping 2001:3::1
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 2001:3::1, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms
```

**R3:**
```
R3(config)#do ping 2001:1::1
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 2001:1::1, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/1/2 ms


R3(config)#do ping 2001:2::1
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 2001:2::1, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/1/2 ms
```


Son olarak ping attıktan sonra Wireshark çıktısına bakalım.

R1'den R3'e giderken;

![ipv6](/images/Ipv4Ipv6Tunelleme/2.png)

Request:

![ipv6](/images/Ipv4Ipv6Tunelleme/3.png)

Reply:

![ipv6](/images/Ipv4Ipv6Tunelleme/4.png)


Teşekkürler,

İyi Çalışmalar.