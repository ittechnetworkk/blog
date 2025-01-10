+++
title = "Vlan Routing L3 Switch (SVI)"
date = "2025-01-10T11:43:33+01:00"
tags = ["Network", "vlan", "routing"]
categories = ["Network"]
author = "Soner Sahin"
+++

Selamlar, bu yazımda VLAN Routing'in L3 bir Switch ile nasıl yapılacağını bir LAB senaryosu üzerinde yapacağım..

LAB'ı aşağıdaki topoloji üzerinde uygulayacağım.

![vlan](/images/VLANRoutingSVI/1.png)

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


**Vlanları L3 Switch'de de oluşturup bu Vlan'lar için SVI oluşturacağız ve Routing'i açacağız.**

**L3_Switch:**
```
L3_Switch>en
L3_Switch#conf t
L3_Switch(config)#vlan 10
L3_Switch(config-vlan)#vlan 20
L3_Switch(config-vlan)#exit

#SVI oluşturma
L3_Switch(config)#int vlan 10
L3_Switch(config-if)#ip addr 10.10.10.1 255.255.255.0
L3_Switch(config-if)#description Vlan10
L3_Switch(config-if)#exit

L3_Switch(config)#int vlan 20
L3_Switch(config-if)#ip addr 10.10.20.1 255.255.255.0
L3_Switch(config-if)#description Vlan20
L3_Switch(config-if)#exit

#Routing enable etme
L3_Switch(config)#ip routing 
```


**Test:**

**VLAN10:**
**VPC4 > VPC6:**
```
VPCS> ping 10.10.10.11                               

84 bytes from 10.10.10.11 icmp_seq=1 ttl=64 time=2.685 ms
84 bytes from 10.10.10.11 icmp_seq=2 ttl=64 time=2.833 ms
84 bytes from 10.10.10.11 icmp_seq=3 ttl=64 time=2.341 ms
84 bytes from 10.10.10.11 icmp_seq=4 ttl=64 time=2.329 ms
84 bytes from 10.10.10.11 icmp_seq=5 ttl=64 time=2.443 ms
```

**VLAN20:**
**VPC7 > VPC5:**
```
VPCS> ping 10.10.20.10

84 bytes from 10.10.20.10 icmp_seq=1 ttl=64 time=3.135 ms
84 bytes from 10.10.20.10 icmp_seq=2 ttl=64 time=2.930 ms
84 bytes from 10.10.20.10 icmp_seq=3 ttl=64 time=2.866 ms
84 bytes from 10.10.20.10 icmp_seq=4 ttl=64 time=2.878 ms
84 bytes from 10.10.20.10 icmp_seq=5 ttl=64 time=2.571 ms
```


Teşekkürler,

İyi Çalışmalar.


