+++
title = "GRE Over IPSEC LAB"
date = "2025-02-21T22:19:46+01:00"
tags = ["gre", "ipsec", "cisco", "ios"]
categories = ["Network"]
author = "Soner Sahin"
+++

Hello everyone, in this LAB I will configure GRE over IPSec Tunnels. 

I will implement the following topology. In this topology some configurations have been done. So networks can already reach with each other. I will just focus on GRE over IPSec Tunnels between the networks of Customer-A and Customer-B.

GRE Subnet for Customer-A: 192.168.1.0/24

GRE Subnet for Customer-B: 192.168.2.0/24

![gre-over-ipsec-lab](/images/GREoverIPSEC-LAB/1.png)

**R1:**

```
#GRE CONFIGURATION
R1(config)#int tunnel 1
R1(config-if)#ip addr 192.168.1.10 255.255.255.0
R1(config-if)#tunnel source e0/1
R1(config-if)#tunnel destination 1.1.4.2 
R1(config-if)#exit


#IPSEC CONFIGURATION
R1(config)#crypto isakmp policy 100
R1(config-isakmp)#authentication pre-share 
R1(config-isakmp)#encryption aes 
R1(config-isakmp)#group 14
R1(config-isakmp)#hash sha
R1(config-isakmp)#exit

R1(config)#crypto isakmp key ittechnetworkk address 1.1.4.2

R1(config)#crypto ipsec transform-set XYZ esp-aes esp-sha-hmac 
R1(cfg-crypto-trans)#mode transport 
R1(cfg-crypto-trans)#exit

R1(config)#ip access-list extended GRE-IPSEC
R1(config-ext-nacl)#permit gre host 1.1.1.2 host 1.1.4.2
R1(config-ext-nacl)#exit

R1(config)#crypto map IPSEC 10 ipsec-isakmp 
R1(config-crypto-map)#match address GRE-IPSEC
R1(config-crypto-map)#set peer 1.1.4.2
R1(config-crypto-map)#set transform-set XYZ
R1(config-crypto-map)#exit

R1(config)#int e0/1
R1(config-if)#crypto map IPSEC
R1(config-if)#exit


#ROUTING
R1(config)#ip route 10.0.4.0 255.255.255.0 tunnel 1
```

**R10:**

```
#GRE CONFIGURATION
R10>en
R10#conf t
R10(config)#int tunnel 1
R10(config-if)#ip addr 192.168.1.11 255.255.255.0
R10(config-if)#tunnel source e0/2
R10(config-if)#tunnel destination 1.1.1.2
R10(config-if)#exit


#IPSEC CONFIGURATION
R10(config)#crypto isakmp policy 100
R10(config-isakmp)#authentication pre-share 
R10(config-isakmp)#encryption aes 
R10(config-isakmp)#group 14
R10(config-isakmp)#hash sha
R10(config-isakmp)#exit

R10(config)#crypto isakmp key ittechnetworkk address 1.1.1.2

R10(config)#crypto ipsec transform-set XYZ esp-aes esp-sha-hmac 
R10(cfg-crypto-trans)#mode transport 
R10(cfg-crypto-trans)#exit

R10(config)#ip access-list extended GRE-IPSEC   
R10(config-ext-nacl)#permit gre host 1.1.4.2 host 1.1.1.2
R10(config-ext-nacl)#exit

R10(config)#crypto map IPSEC 10 ipsec-isakmp 
R10(config-crypto-map)#match address GRE-IPSEC
R10(config-crypto-map)#set peer 1.1.1.2
R10(config-crypto-map)#set transform-set XYZ
R10(config-crypto-map)#exit

R10(config)#int e0/2
R10(config-if)#crypto map IPSEC
R10(config-if)#exit


#ROUTING
R10(config)#ip route 10.0.1.0 255.255.255.0 tunnel 1
```

**R2:**

```
#GRE CONFIGURATION
R2>en
R2#conf t
R2(config)#int tunnel 1
R2(config-if)#ip addr 192.168.2.10 255.255.255.0
R2(config-if)#tunnel source e0/2
R2(config-if)#tunnel destination 1.1.3.2
R2(config-if)#exit


#IPSEC CONFIGURATION
R2(config)#crypto isakmp policy 100
R2(config-isakmp)#authentication pre-share 
R2(config-isakmp)#encryption aes 
R2(config-isakmp)#group 14
R2(config-isakmp)#hash sha
R2(config-isakmp)#exit

R2(config)#crypto isakmp key ittechnetworkk1 address 1.1.3.2

R2(config)#crypto ipsec transform-set ABC esp-aes esp-sha-hmac 
R2(cfg-crypto-trans)#mode transport 
R2(cfg-crypto-trans)#exit

R2(config)#ip access-list extended GRE-IPSEC   
R2(config-ext-nacl)#permit gre host 1.1.2.2 host 1.1.3.2
R2(config-ext-nacl)#exit

R2(config)#crypto map IPSEC 10 ipsec-isakmp 
R2(config-crypto-map)#match address GRE-IPSEC
R2(config-crypto-map)#set peer 1.1.3.2
R2(config-crypto-map)#set transform-set XYZ
R2(config-crypto-map)#exit

R2(config)#int e0/2
R2(config-if)#crypto map IPSEC
R2(config-if)#exit


#ROUTING
R2(config)#ip route 10.0.3.0 255.255.255.0 tunnel 1
```

**R9:**

```
#GRE CONFIGURATION
R9>en
R9#conf t
R9(config)#int tunnel 1
R9(config-if)#ip addr 192.168.2.11 255.255.255.0
R9(config-if)#tunnel source e0/1
R9(config-if)#tunnel destination 1.1.2.2 
R9(config-if)#exit


#IPSEC CONFIGURATION
R2(config)#crypto isakmp policy 100
R2(config-isakmp)#authentication pre-share 
R2(config-isakmp)#encryption aes 
R2(config-isakmp)#group 14
R2(config-isakmp)#hash sha
R2(config-isakmp)#exit

R2(config)#crypto isakmp key ittechnetworkk1 address 1.1.2.2

R2(config)#crypto ipsec transform-set ABC esp-aes esp-sha-hmac 
R2(cfg-crypto-trans)#mode transport 
R2(cfg-crypto-trans)#exit

R2(config)#ip access-list extended GRE-IPSEC   
R2(config-ext-nacl)#permit gre host 1.1.3.2 host 1.1.2.2
R2(config-ext-nacl)#exit

R2(config)#crypto map IPSEC 10 ipsec-isakmp 
R2(config-crypto-map)#match address GRE-IPSEC
R2(config-crypto-map)#set peer 1.1.2.2
R2(config-crypto-map)#set transform-set XYZ
R2(config-crypto-map)#exit

R2(config)#int e0/1
R2(config-if)#crypto map IPSEC
R2(config-if)#exit


#ROUTING
R2(config)#ip route 10.0.2.0 255.255.255.0 tunnel 1
```


**TEST:**

VPC15 > VPC21:

```
VPCS> trace 10.0.4.10
trace to 10.0.4.10, 8 hops max, press Ctrl+C to stop
 1   10.0.1.1   0.397 ms  0.413 ms  0.441 ms
 2   192.168.1.11   1.954 ms  1.508 ms  1.360 ms
```

VPC18 > VPC19:

```
VPCS> trace 10.0.3.10
trace to 10.0.3.10, 8 hops max, press Ctrl+C to stop
 1   10.0.2.1   0.639 ms  0.410 ms  0.403 ms
 2   192.168.2.11   1.657 ms  1.293 ms  1.129 ms
```


Thank you for taking the time to read this article.

Keep up the good work!