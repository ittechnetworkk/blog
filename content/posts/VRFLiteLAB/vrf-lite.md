+++
title = "VRF-Lite Configuration"
date = "2025-02-21T02:36:28+01:00"
tags = ["VRF-Lite", "Cisco", "IOS"]
categories = ["Network"]
author = "Soner Sahin"
+++

Hello everyone, in this LAB I will configure GRE Tunnels with following topology.

![vrf-lite](/images/VRFLiteLAB/1.png)


**R1:**
```
#INTERFACE CONFIGURATION
R1>en
R1#conf t
R1(config)#int e0/0
R1(config-if)#ip addr 10.0.1.1 255.255.255.0
R1(config-if)#no sh
R1(config-if)#int e0/1
R1(config-if)#ip addr 1.1.1.2 255.255.255.252
R1(config-if)#no sh
R1(config-if)#exit

#OSPF
R1(config)#router ospf 1
R1(config-router)#network 1.1.1.0 0.0.0.3 area 0
R1(config-router)#network 10.0.1.0 0.0.0.255 area 0
R1(config-router)#exit
```


**R2:**
```
#INTERFACE CONFIGURATION
R2>en
R2#conf t
R2(config)#int e0/0
R2(config-if)#ip addr 10.0.2.1 255.255.255.0
R2(config-if)#no sh
R2(config-if)#int e0/2
R2(config-if)#ip addr 1.1.2.2 255.255.255.252
R2(config-if)#no sh
R2(config-if)#exit

#OSPF
R2(config)#router ospf 1
R2(config-router)#network 10.0.2.0 0.0.0.255 area 0
R2(config-router)#network 1.1.2.0 0.0.0.3 area 0
R2(config-router)#exit
```


**R3:**
```
#VRF DEFINITION
R3>en
R3#conf t
R3(config)#ip vrf Customer-A
R3(config-vrf)#exit
R3(config)#ip vrf Customer-B
R3(config-vrf)#exit

#IMPLEMENT VRF UNDER INTERFACES
R3(config)#int e0/1
R3(config-if)#ip vrf forwarding Customer-A
R3(config-if)#ip addr 1.1.1.1 255.255.255.252
R3(config-if)#no sh
R3(config-if)#int e0/0
R3(config-if)#ip vrf forwarding Customer-A
R3(config-if)#ip addr 1.1.5.1 255.255.255.252
R3(config-if)#no sh
R3(config-if)#exit
R3(config)#int e0/2
R3(config-if)#ip vrf forwarding Customer-B
R3(config-if)#ip addr 1.1.2.1 255.255.255.252
R3(config-if)#no sh
R3(config-if)#int e0/3
R3(config-if)#ip vrf forwarding Customer-B
R3(config-if)#ip addr 1.1.6.1 255.255.255.252
R3(config-if)#no sh
R3(config-if)#exit

#OSPF
R3(config)#router ospf 1 vrf Customer-A
R3(config-router)#network 1.1.1.0 0.0.0.3 area 0
R3(config-router)#network 1.1.5.0 0.0.0.3 area 0
R3(config-router)#capability vrf-lite 
R3(config-router)#exit
R3(config)#router ospf 2 vrf Customer-B
R3(config-router)#network 1.1.2.0 0.0.0.3 area 0
R3(config-router)#network 1.1.6.0 0.0.0.3 area 0
R3(config-router)#capability vrf-lite 
R3(config-router)#exit
```


**R4:**
```
#VRF DEFINITION
R4>en
R4#conf t
R4(config)#ip vrf Customer-A
R4(config-vrf)#exit

#IMPLEMENT VRF UNDER INTERFACES
R4(config-if)#int e0/0
R4(config-if)#ip vrf forwarding Customer-A
R4(config-if)#ip addr 1.1.5.2 255.255.255.252
R4(config-if)#no sh
R4(config-if)#int e0/1
R4(config-if)#ip vrf forwarding Customer-A
R4(config-if)#ip addr 1.1.7.1 255.255.255.252
R4(config-if)#no sh
R4(config-if)#exit

#OSPF
R4(config)#router ospf 1 vrf Customer-A
R4(config-router)#network 1.1.5.0 0.0.0.3 area 0
R4(config-router)#network 1.1.7.0 0.0.0.3 area 0
R4(config-router)#capability vrf-lite 
R4(config-router)#exit
```


**R5:**
```
#VRF DEFINITION
R5>en
R5#conf t
R5(config)#ip vrf Customer-B
R5(config-vrf)#exit

#IMPLEMENT VRF UNDER INTERFACES
R5(config)#int e0/3
R5(config-if)#ip vrf forwarding Customer-B 
R5(config-if)#ip addr 1.1.6.2 255.255.255.252
R5(config-if)#no sh
R5(config-if)#int e0/1
R5(config-if)#ip vrf forwarding Customer-B 
R5(config-if)#ip addr 1.1.8.1 255.255.255.252
R5(config-if)#no sh
R5(config-if)#exit

#OSPF
R5(config)#router ospf 1 vrf Customer-B
R5(config-router)#network 1.1.6.0 0.0.0.3 area 0
R5(config-router)#network 1.1.8.0 0.0.0.3 area 0
R5(config-router)#capability vrf-lite 
R5(config-router)#exit
```


**R6:**
```
#VRF DEFINITION
R6>en
R6#conf t
R6(config)#ip vrf Customer-A
R6(config-vrf)#exit

#IMPLEMENT VRF UNDER INTERFACES
R6(config)#int e0/1
R6(config-if)#ip vrf forwarding Customer-A 
R6(config-if)#ip addr 1.1.7.2 255.255.255.252
R6(config-if)#no sh
R6(config-if)#int e0/0
R6(config-if)#ip vrf forwarding Customer-A 
R6(config-if)#ip addr 1.1.9.1 255.255.255.252
R6(config-if)#no sh
R6(config-if)#exit

#OSPF
R6(config)#router ospf 1 vrf Customer-A
R6(config-router)#network 1.1.7.0 0.0.0.3 area 0
R6(config-router)#network 1.1.9.0 0.0.0.3 area 0
R6(config-router)#capability vrf-lite 
R6(config-router)#exit
```


**R7:**
```
#VRF DEFINITION
R7>en
R7#conf t
R7(config)#ip vrf Customer-B
R7(config-vrf)#exit

#IMPLEMENT VRF UNDER INTERFACES
R7(config)#int e0/1
R7(config-if)#ip vrf forwarding Customer-B 
R7(config-if)#ip addr 1.1.8.2 255.255.255.252
R7(config-if)#no sh
R7(config-if)#int e0/3
R7(config-if)#ip vrf forwarding Customer-B 
R7(config-if)#ip addr 1.1.10.1 255.255.255.252
R7(config-if)#no sh
R7(config-if)#exit

#OSPF
R7(config)#router ospf 1 vrf Customer-B
R7(config-router)#network 1.1.8.0 0.0.0.3 area 0
R7(config-router)#network 1.1.10.0 0.0.0.3 area 0
R7(config-router)#capability vrf-lite 
R7(config-router)#exit
```


**R8:**
```
#VRF DEFINITION
R8>en
R8#conf t
R8(config)#ip vrf Customer-A
R8(config-vrf)#exit
R8(config)#ip vrf Customer-B
R8(config-vrf)#exit

R8(config)#int e0/0
R8(config-if)#ip vrf forwarding Customer-A
R8(config-if)#ip addr 1.1.9.2 255.255.255.252
R8(config-if)#no sh
R8(config-if)#int e0/2
R8(config-if)#ip vrf forwarding Customer-A
R8(config-if)#ip addr 1.1.4.1 255.255.255.252
R8(config-if)#int e0/3
R8(config-if)#ip vrf forwarding Customer-B
R8(config-if)#ip addr 1.1.10.2 255.255.255.252
R8(config-if)#no sh
R8(config-if)#int e0/1
R8(config-if)#ip vrf forwarding Customer-B
R8(config-if)#ip addr 1.1.3.1 255.255.255.252
R8(config-if)#no sh
R8(config-if)#exit

#OSPF
R8(config)#router ospf 1 vrf Customer-A
R8(config-router)#network 1.1.9.0 0.0.0.3 area 0
R8(config-router)#network 1.1.4.0 0.0.0.3 area 0
R8(config-router)#capability vrf-lite 
R8(config-router)#exit
R8(config)#router ospf 2 vrf Customer-B
R8(config-router)#network 1.1.10.0 0.0.0.3 area 0
R8(config-router)#network 1.1.3.0 0.0.0.3 area 0
R8(config-router)#capability vrf-lite 
R8(config-router)#exit
```


**R9:**
```
#INTERFACE CONFIGURATION
R9>en
R9#conf t
R9(config)#int e0/0
R9(config-if)#ip addr 10.0.3.1 255.255.255.0  
R9(config-if)#no sh
R9(config-if)#int e0/1
R9(config-if)#ip addr 1.1.3.2 255.255.255.252
R9(config-if)#no sh
R9(config-if)#exit

#OSPF
R9(config)#router ospf 1 
R9(config-router)#network 10.0.3.0 0.0.0.255 area 0
R9(config-router)#network 1.1.3.0 0.0.0.3 area 0
R9(config-router)#exit
```


**R10:**
```
#INTERFACE CONFIGURATION
R10>en
R10#conf t
R10(config)#int e0/0
R10(config-if)#ip addr 10.0.4.1 255.255.255.0
R10(config-if)#no sh
R10(config-if)#int e0/2
R10(config-if)#ip addr 1.1.4.2 255.255.255.252
R10(config-if)#no sh
R10(config-if)#exit

#OSPF
R10(config)#router ospf 1 
R10(config-router)#network 10.0.4.0 0.0.0.255 area 0
R10(config-router)#network 1.1.4.0 0.0.0.3 area 0
R10(config-router)#exit
```


**VPC15:**
```
VPCS> ip 10.0.1.10 255.255.255.0 gateway 10.0.1.1
Checking for duplicate address...
VPCS : 10.0.1.10 255.255.255.0 gateway 10.0.1.
```

**VPC18:**
```
VPCS> ip 10.0.2.10 255.255.255.0 gateway 10.0.2.1
Checking for duplicate address...
VPCS : 10.0.2.10 255.255.255.0 gateway 10.0.2.1
```

**VPC19:**
```
VPCS> ip 10.0.3.10 255.255.255.0 gateway 10.0.3.1
Checking for duplicate address...
VPCS : 10.0.3.10 255.255.255.0 gateway 10.0.3.1
```

**VPC21:**
```
VPCS> ip 10.0.4.10 255.255.255.0 gateway 10.0.4.1
Checking for duplicate address...
VPCS : 10.0.4.10 255.255.255.0 gateway 10.0.4.1
```


**TEST:**

VPC21 to VPC15

```
VPCS> ping 10.0.1.10

84 bytes from 10.0.1.10 icmp_seq=1 ttl=58 time=2.750 ms
84 bytes from 10.0.1.10 icmp_seq=2 ttl=58 time=1.582 ms
84 bytes from 10.0.1.10 icmp_seq=3 ttl=58 time=2.427 ms
84 bytes from 10.0.1.10 icmp_seq=4 ttl=58 time=2.167 ms
84 bytes from 10.0.1.10 icmp_seq=5 ttl=58 time=1.760 ms
```

VPC18 to VPC19

```
VPCS> ping 10.0.3.10

84 bytes from 10.0.3.10 icmp_seq=1 ttl=58 time=2.183 ms
84 bytes from 10.0.3.10 icmp_seq=2 ttl=58 time=2.037 ms
84 bytes from 10.0.3.10 icmp_seq=3 ttl=58 time=2.224 ms
84 bytes from 10.0.3.10 icmp_seq=4 ttl=58 time=1.949 ms
84 bytes from 10.0.3.10 icmp_seq=5 ttl=58 time=2.328 ms
```


Thank you for taking the time to read this article.

Keep up the good work!