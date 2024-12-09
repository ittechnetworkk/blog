+++
date = '2024-06-07T17:53:48+01:00'
title = 'GRE Tunnel'
tags = ["gre", "cisco"]
author = "Soner Sahin"
+++

GRE(Generic Routing Encapsulation) Protokolü, paketin kaynaktan hedefe, oluşturulan tünel sayesinde iletilmesini sağlayan protokoldür. 
GRE, Cisco tarafından geliştirilmiştir. 
GRE kullanarak birden fazla şubesi olan networkler birleştirilebilir. 
Fakat oluşturulan tünelden iletilen paketler okunabilir şekilde iletilir. Yani araya girip trafik dinlenirse, paketler okunabilir. Bu tünel daha sonra güvenli hale de getirilebilir. 
GRE, IP paketini kapsüle ederek yönlendirme yapar. 
Enkapsülasyon yapılırken IP başlığına(20), 4 Byte GRE başlık bilgisi eklenir.

Aşağıdaki GRE Lab Topolojisini uygulayacağım. 

![gre](/images/gretunnel/1.png)

**Yapılacaklar:**
1. Router ve PC'lere IP adreslerini ver,
2. OSPF kullarak cihazları haberleştir,
3. GRE tünellerini oluştur,
4. Statik rota yazarak cihazları tünel üzerinden birbirleriyle haberleştir,
5. Test et.


6. **Router ve PC'lere IP adreslerini ver:**

**R1:**
```
R1#configure terminal 
R1(config)#int e0/1
R1(config-if)#ip addr 192.168.1.1 255.255.255.0
R1(config-if)#no sh
R1(config-if)#int e0/0
R1(config-if)#ip addr 172.16.1.2 255.255.255.252
R1(config-if)#no sh
R1(config-if)#exit
```

**R2:**
```
R2#configure terminal 
R2(config)#int e0/1
R2(config-if)#ip addr 192.168.2.1 255.255.255.0
R2(config-if)#no sh
R2(config-if)#int e0/0
R2(config-if)#ip addr 172.16.1.6 255.255.255.252
R2(config-if)#no sh
R2(config-if)#exit
```

**R3:**
```
R3#configure terminal 
R3(config)#int e0/1
R3(config-if)#ip addr 192.168.3.1 255.255.255.0
R3(config-if)#no sh
R3(config-if)#int e0/0
R3(config-if)#ip addr 172.16.1.10 255.255.255.252
R3(config-if)#no sh
R3(config-if)#exit
```

**ISP:**
```
ISP#configure terminal 
ISP(config)#int e0/0
ISP(config-if)#ip addr 172.16.1.1 255.255.255.252
ISP(config-if)#no sh
ISP(config-if)#int e0/1
ISP(config-if)#ip addr 172.16.1.5 255.255.255.252
ISP(config-if)#no sh
ISP(config-if)#int e0/2
ISP(config-if)#ip addr 172.16.1.9 255.255.255.252
ISP(config-if)#no sh
ISP(config-if)#exit
```

**VPC1:**
```
VPCS> ip 192.168.1.10 255.255.255.0 gateway 192.168.1.1
Checking for duplicate address...
VPCS : 192.168.1.10 255.255.255.0 gateway 192.168.1.1
```

**VPC2:**
```
VPCS> ip 192.168.2.10 255.255.255.0 gateway 192.168.2.1
Checking for duplicate address...
VPCS : 192.168.2.10 255.255.255.0 gateway 192.168.2.1
```

**VPC3:**
```
VPCS> ip 192.168.3.10 255.255.255.0 gateway 192.168.3.1 
Checking for duplicate address...
VPCS : 192.168.3.10 255.255.255.0 gateway 192.168.3.1
```

2. **OSPF kullarak cihazları haberleştir:**

**R1:**
```
R1(config)#router ospf 1
R1(config-router)#router-id 1.1.1.1
R1(config-router)#network 192.168.1.0 0.0.0.255 area 0
R1(config-router)#network 172.16.1.0 0.0.0.3 area 0
R1(config-router)#exit
```

**R2:**
```
R2(config)#router ospf 1
R2(config-router)#router-id 2.2.2.2
R2(config-router)#network 192.168.2.0 0.0.0.255 area 0
R2(config-router)#network 172.16.1.4 0.0.0.3 area 0
R2(config-router)#exit
```

**R3:**
```
R3(config)#router ospf 1
R3(config-router)#router-id 3.3.3.3
R3(config-router)#network 192.168.3.0 0.0.0.255 area 0
R3(config-router)#network 172.16.1.8 0.0.0.3 area 0
R3(config-router)#exit
```

**ISP:**
```
ISP(config)#router ospf 1
ISP(config-router)#router-id 4.4.4.4
ISP(config-router)#network 172.16.1.0 0.0.0.3 area 0
ISP(config-router)#network 172.16.1.4 0.0.0.3 area 0
ISP(config-router)#network 172.16.1.8 0.0.0.3 area 0
ISP(config-router)#exit
```

3. **GRE tünellerini oluştur:**

**R1:**
```
R1(config)#int tunnel 1                          #R1-R3
R1(config-if)#ip addr 10.1.1.1 255.255.255.252
R1(config-if)#tunnel source e0/0                 #çıkış interface
R1(config-if)#tunnel destination 172.16.1.10     #tunelin kurulacağı router IP'si
R1(config-if)#tunnel mode gre ip
R1(config-if)#exit
 
R1(config)#int tunnel 2                          #R1-R2
R1(config-if)#ip addr 10.1.1.5 255.255.255.252
R1(config-if)#tunnel source e0/0
R1(config-if)#tunnel destination 172.16.1.6
R1(config-if)#tunnel mode gre ip
R1(config-if)#exit
```

**R2:**
```
R2(config)#int tunnel 2                          #R2-R1
R2(config-if)#ip addr 10.1.1.6 255.255.255.252
R2(config-if)#tunnel source e0/0
R2(config-if)#tunnel mode gre ip
R2(config-if)#exit

R2(config)#int tunnel 3                          #R2-R3
R2(config-if)#ip addr 10.1.1.9 255.255.255.252
R2(config-if)#tunnel source e0/0
R2(config-if)#tunnel destination 172.16.1.10
R2(config-if)#tunnel mode gre ip
R2(config-if)#exit
```

**R3:**
```
R3(config)#int tunnel 1                          #R3-R1
R3(config-if)#ip addr 10.1.1.2 255.255.255.252
R3(config-if)#tunnel source e0/0
R3(config-if)#tunnel destination 172.16.1.2
R3(config-if)#tunnel mode gre ip
R3(config-if)#exit

R3(config)#int tunnel 3                          #R3-R2
R3(config-if)#ip addr 10.1.1.10 255.255.255.252
R3(config-if)#tunnel source e0/0
R3(config-if)#tunnel destination 172.16.1.6 
R3(config-if)#tunnel mode gre ip
R3(config-if)#exit
```

4. **Statik rota yazarak cihazları tünel üzerinden birbirleriyle haberleştir:**

**R1:**
```
R1(config)#ip route 192.168.2.0 255.255.255.0 10.1.1.6  #R2'nin tunnel IP'si
R1(config)#ip route 192.168.3.0 255.255.255.0 10.1.1.2  #R3'ün tunnel IP'si
```

**R2:**
```
R2(config)#ip route 192.168.1.0 255.255.255.0 10.1.1.5
R2(config)#ip route 192.168.3.0 255.255.255.0 10.1.1.10
```

**R3:**
```
R3(config)#ip route 192.168.1.0 255.255.255.0 10.1.1.1
R3(config)#ip route 192.168.2.0 255.255.255.0 10.1.1.9
```

5. **Test et:**

**VPC1:**
```
VPCS> ping 192.168.2.10
84 bytes from 192.168.2.10 icmp_seq=1 ttl=62 time=8.079 ms
84 bytes from 192.168.2.10 icmp_seq=2 ttl=62 time=5.720 ms
84 bytes from 192.168.2.10 icmp_seq=3 ttl=62 time=6.206 ms

VPCS> ping 192.168.3.10
84 bytes from 192.168.3.10 icmp_seq=1 ttl=62 time=8.159 ms
84 bytes from 192.168.3.10 icmp_seq=2 ttl=62 time=5.705 ms
84 bytes from 192.168.3.10 icmp_seq=3 ttl=62 time=6.253 ms


VPCS> trace 192.168.2.10
trace to 192.168.2.10, 8 hops max, press Ctrl+C to stop
 1   192.168.1.1   2.140 ms  2.279 ms  2.250 ms
 2   10.1.1.6   4.305 ms  3.929 ms  3.930 ms
 3   *192.168.2.10   5.270 ms (ICMP type:3, code:3, Destination port unreachable)

VPCS> trace 192.168.3.10
trace to 192.168.3.10, 8 hops max, press Ctrl+C to stop
 1   192.168.1.1   1.864 ms  1.819 ms  1.981 ms
 2   10.1.1.2   3.729 ms  4.180 ms  3.668 ms
 3   *192.168.3.10   4.981 ms (ICMP type:3, code:3, Destination port unreachable)
```

**VPC2:**
```
VPCS> ping 192.168.1.10
84 bytes from 192.168.1.10 icmp_seq=1 ttl=62 time=6.205 ms
84 bytes from 192.168.1.10 icmp_seq=2 ttl=62 time=5.548 ms
84 bytes from 192.168.1.10 icmp_seq=3 ttl=62 time=6.536 ms

VPCS> ping 192.168.3.10
84 bytes from 192.168.3.10 icmp_seq=1 ttl=62 time=6.331 ms
84 bytes from 192.168.3.10 icmp_seq=2 ttl=62 time=5.673 ms
84 bytes from 192.168.3.10 icmp_seq=3 ttl=62 time=6.559 ms

VPCS> trace 192.168.1.10
trace to 192.168.1.10, 8 hops max, press Ctrl+C to stop
 1   192.168.2.1   2.358 ms  1.916 ms  1.872 ms
 2   10.1.1.5   4.070 ms  4.256 ms  4.368 ms
 3   *192.168.1.10   5.377 ms (ICMP type:3, code:3, Destination port unreachable)

VPCS> trace 192.168.3.10  
trace to 192.168.3.10, 8 hops max, press Ctrl+C to stop  
1 192.168.2.1 1.877 ms 1.814 ms 2.114 ms  
2 10.1.1.10 3.753 ms 5.774 ms 3.091 ms  
3 *192.168.3.10 5.080 ms (ICMP type:3, code:3, Destination port unreachable)

VPCS> ping 192.168.1.10
84 bytes from 192.168.1.10 icmp_seq=1 ttl=62 time=8.082 ms
84 bytes from 192.168.1.10 icmp_seq=2 ttl=62 time=2.208 ms
84 bytes from 192.168.1.10 icmp_seq=3 ttl=62 time=6.092 ms

VPCS> ping 192.168.2.10
84 bytes from 192.168.2.10 icmp_seq=1 ttl=61 time=8.555 ms
84 bytes from 192.168.2.10 icmp_seq=2 ttl=61 time=5.865 ms
84 bytes from 192.168.2.10 icmp_seq=3 ttl=61 time=5.172 ms


VPCS> trace 192.168.1.10
trace to 192.168.1.10, 8 hops max, press Ctrl+C to stop
 1   192.168.3.1   1.979 ms  1.847 ms  1.618 ms
 2   10.1.1.1   3.607 ms  7.971 ms  3.582 ms
 3   *192.168.1.10   5.941 ms (ICMP type:3, code:3, Destination port unreachable)

VPCS> trace 192.168.2.10
trace to 192.168.2.10, 8 hops max, press Ctrl+C to stop
 1   192.168.3.1   1.954 ms  1.745 ms  1.772 ms
 2   10.1.1.9   2.975 ms  3.291 ms  3.701 ms
 3   *192.168.2.10   4.770 ms (ICMP type:3, code:3, Destination port unreachable)
```


**Test2:**
R2'de debug modu açıp VPC1'den ping attığımdaki çıktı.

**R2:**
```
R2#debug tunnel
Tunnel Interface debugging is on

*Jun  7 21:20:55.815: ipv4 decap oce used, oce_rc=0x0 tunnel Tunnel2
*Jun  7 21:20:55.819: Tunnel2: adjacency fixup, 172.16.1.6->172.16.1.2(tableid 0), tos is 0x0
*Jun  7 21:20:56.824: ipv4 decap oce used, oce_rc=0x0 tunnel Tunnel2
*Jun  7 21:20:56.825: Tunnel2: adjacency fixup, 172.16.1.6->172.16.1.2(tableid 0), tos is 0x0
*Jun  7 21:20:57.831: ipv4 decap oce used, oce_rc=0x0 tunnel Tunnel2
*Jun  7 21:20:57.832: Tunnel2: adjacency fixup, 172.16.1.6->172.16.1.2(tableid 0), tos is 0x0
*Jun  7 21:20:58.837: ipv4 decap oce used, oce_rc=0x0 tunnel Tunnel2
*Jun  7 21:20:58.839: Tunnel2: adjacency fixup, 172.16.1.6->172.16.1.2(tableid 0), tos is 0x0
*Jun  7 21:20:59.844: ipv4 decap oce used, oce_rc=0x0 tunnel Tunnel2
*Jun  7 21:20:59.846: Tunnel2: adjacency fixup, 172.16.1.6->172.16.1.2(tableid 0), tos is 0x0

```


**Wireshark Çıktısı:**

![gre](/images/gretunnel/2.png)

![gre](/images/gretunnel/3.png)


Teşekkürler,

İyi Çalışmalar.