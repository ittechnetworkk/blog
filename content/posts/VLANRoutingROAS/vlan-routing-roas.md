+++
title = "Vlan Routing (Router on a Stick)"
date = "2025-01-10T11:43:17+01:00"
tags = ["Network", "vlan", "routing"]
categories = ["Network"]
author = "Soner Sahin"
+++

Selamlar, bu yazımda VLAN Routing'in bir Router ile nasıl yapılacağını bir LAB senaryosu üzerinde yapacağım..

LAB'ı aşağıdaki topoloji üzerinde uygulayacağım.

![vlan](/images/VLANRoutingROAS/1.png)

**Başlayalım.**

**İlk olarak cihazlara IP verelim.**

**VPC4:**
```
VPCS> ip 10.10.10.10 255.255.255.0 gateway 10.10.10.1
```

**VPC5:**
```
VPCS> ip 10.10.20.10 255.255.255.0 gateway 10.10.20.1
```

**VPC6:**
```
VPCS> ip 10.10.10.11 255.255.255.0 gateway 10.10.10.1
```

**VPC7:**
```
VPCS> ip 10.10.20.11 255.255.255.0 gateway 10.10.20.1
```


**Şimdi Switch'lerde VLAN'ları oluşturalım ve portlara atayalım.**

**SW2:**
```
Switch>en
Switch#conf t
Switch(config)#vlan 10
Switch(config-vlan)#vlan 20
Switch(config-vlan)#exit

Switch(config)#int e0/1
Switch(config-if)#switchport mode access 
Switch(config-if)#switchport access vlan 10
Switch(config-if)#exit

Switch(config)#int e0/2
Switch(config-if)#switchport mode access 
Switch(config-if)#switchport access vlan 20
Switch(config-if)#exit

#Vlan'ların geçeceği port trunk olmalı
Switch(config)#int e0/0
Switch(config-if)#switchport trunk encapsulation dot1q
Switch(config-if)#switchport mode trunk 
```

**SW3:**
```
Switch>en
Switch#conf t
Switch(config)#vlan 10
Switch(config-vlan)#vlan 20
Switch(config-vlan)#exit

Switch(config)#int e0/1
Switch(config-if)#switchport mode access 
Switch(config-if)#switchport access vlan 10 
Switch(config-if)#exit

Switch(config)#int e0/2
Switch(config-if)#switchport mode access 
Switch(config-if)#switchport access vlan 20
Switch(config-if)#exit

#Vlan'ların geçeceği port trunk olmalı
Switch(config)#int e0/0
Switch(config-if)#switchport trunk encapsulation dot1q 
Switch(config-if)#switchport mode trunk 
```

**SW4:**
```
Switch>en
Switch#conf t
Switch(config)#vlan 10
Switch(config-vlan)#vlan 20
Switch(config-vlan)#exit

Switch(config)#int e0/0
Switch(config-if)#switchport trunk encapsulation dot1q
Switch(config-if)#switchport mode trunk 
Switch(config-if)#exit

Switch(config)#int e0/1      
Switch(config-if)#switchport trunk encapsulation dot1q 
Switch(config-if)#switchport mode trunk 
Switch(config-if)#exit

Switch(config)#int e0/2
Switch(config-if)#switchport trunk encapsulation dot1q 
Switch(config-if)#switchport mode trunk 
Switch(config-if)#exit
```


**Router konfigürasyonunu yapalım:**

**R1:**
```
R1>en
R1#conf t
R1(config)#int g0/0.10                                      #sub interface
R1(config-subif)#encapsulation dot1Q 10
R1(config-subif)#ip addr 10.10.10.1 255.255.255.0
R1(config-subif)#exit

R1(config)#int g0/0.20
R1(config-subif)#encapsulation dot1Q 20
R1(config-subif)#ip addr 10.10.20.1 255.255.255.0
R1(config-subif)#exit

R1(config)#int g0/0                                         #enable interface
R1(config-if)#no sh
R1(config-if)#exit
```


**Kontrol:**

**R1:**
```
R1(config)#do sh ip route 
Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area 
       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
       E1 - OSPF external type 1, E2 - OSPF external type 2
       i - IS-IS, su - IS-IS summary, L1 - IS-IS level-1, L2 - IS-IS level-2
       ia - IS-IS inter area, * - candidate default, U - per-user static route
       o - ODR, P - periodic downloaded static route, H - NHRP, l - LISP
       a - application route
       + - replicated route, % - next hop override
       + 
Gateway of last resort is not set

      10.0.0.0/8 is variably subnetted, 4 subnets, 2 masks
C        10.10.10.0/24 is directly connected, GigabitEthernet0/0.10
L        10.10.10.1/32 is directly connected, GigabitEthernet0/0.10
C        10.10.20.0/24 is directly connected, GigabitEthernet0/0.20
L        10.10.20.1/32 is directly connected, GigabitEthernet0/0.20


-----------------------------------------------------------------------------


R1(config)#do sh ip int brief 
Interface                  IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0         unassigned      YES unset  up                    up   
GigabitEthernet0/0.10      10.10.10.1      YES manual up                    up   
GigabitEthernet0/0.20      10.10.20.1      YES manual up                    up   
GigabitEthernet0/1         unassigned      YES NVRAM  up                    up   
GigabitEthernet0/2         unassigned      YES NVRAM  administratively down down 
GigabitEthernet0/3         unassigned      YES NVRAM  administratively down down
```


**Test:**

**R1:**
```
R1#ping 10.10.10.11
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.10.10.11, timeout is 2 seconds:
.!!!!
Success rate is 80 percent (4/5), round-trip min/avg/max = 1/2/5 ms


R1#ping 10.10.20.10
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.10.20.10, timeout is 2 seconds:
.!!!!
Success rate is 80 percent (4/5), round-trip min/avg/max = 1/1/2 ms
```


**VPC4 > VPC6:**
```
VPCS> ping 10.10.10.11

84 bytes from 10.10.10.11 icmp_seq=1 ttl=64 time=0.651 ms
84 bytes from 10.10.10.11 icmp_seq=2 ttl=64 time=0.881 ms
84 bytes from 10.10.10.11 icmp_seq=3 ttl=64 time=0.887 ms
84 bytes from 10.10.10.11 icmp_seq=4 ttl=64 time=1.058 ms
84 bytes from 10.10.10.11 icmp_seq=5 ttl=64 time=1.020 ms
```

**VPC4 > VPC7:**
```
VPCS> ping 10.10.20.11

84 bytes from 10.10.20.11 icmp_seq=1 ttl=63 time=2.752 ms
84 bytes from 10.10.20.11 icmp_seq=2 ttl=63 time=1.877 ms
84 bytes from 10.10.20.11 icmp_seq=3 ttl=63 time=2.063 ms
84 bytes from 10.10.20.11 icmp_seq=4 ttl=63 time=1.673 ms
84 bytes from 10.10.20.11 icmp_seq=5 ttl=63 time=1.508 ms
```

Teşekkürler,

İyi Çalışmalar.