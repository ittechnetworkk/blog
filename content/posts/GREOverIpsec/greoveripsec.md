+++
date = '2024-11-22T22:57:40+01:00'
title = 'GRE Over Ipsec'
tags = ["ipsec", "gre"]
author = "Soner Sahin"
+++


Aşağıdaki topologiye göre ilerleyeceğim. Topolojideki cihazların interfacelerine IP adresleri verilmiştir.

![ipsec](/images/greoveripsec/1.png)


**GRE Config:**

**R1:**
```
R1#conf t
R1(config)#int tunnel 1
R1(config-if)#ip addr 192.168.1.1 255.255.255.0
R1(config-if)#tunnel source e0/0
R1(config-if)#tunnel destination 200.59.25.2
```

**R2:**
```
R1#conf t
R2(config)#int tunnel 1
R2(config-if)#ip addr 192.168.1.2 255.255.255.0
R2(config-if)#tunnel source e0/0
R2(config-if)#tunnel destination 197.53.15.2 
```

**IPsec:**

**R1:**
```
R1(config)#crypto isakmp policy 10
R1(config-isakmp)#authentication pre-share               (define it later on)
R1(config-isakmp)#encryption aes
R1(config-isakmp)#group 14                        (above from 14)
R1(config-isakmp)#hash sha
R1(config-isakmp)#exit

R1(config)#crypto isakmp key BENIMCICIPAROLAM address 200.59.25.2   (pre-share key and next point IP)

R1(config)#crypto ipsec transform-set AABBCC esp-aes esp-sha-hmac 
R1(cfg-crypto-trans)#mode transport 
R1(cfg-crypto-trans)#exit

R1(config)#ip access-list extended GRE-IPSEC
R1(config-ext-nacl)#permit gre host 197.53.15.2 host 200.59.25.2     (src > dst)
R1(config-ext-nacl)#exit

R1(config)#crypto map IPSEC-MAP 10 ipsec-isakmp 
R1(config-crypto-map)#match address GRE-IPSEC
R1(config-crypto-map)#set peer 200.59.25.2
R1(config-crypto-map)#set transform-set AABBCC
R1(config-crypto-map)#exit

R1(config)#int e0/0
R1(config-if)#crypto map IPSEC-MAP
R1(config-if)#end
R1#wr
```

**R2:**
```
R2#conf t
R2(config)#crypto isakmp policy 10
R2(config-isakmp)#authentication pre-share 
R2(config-isakmp)#encryption aes 
R2(config-isakmp)#group 14
R2(config-isakmp)#hash sha
R2(config-isakmp)#exit

R2(config)#crypto isakmp key BENIMCICIPAROLAM address 197.53.15.2

R2(config)#crypto ipsec transform-set AABBCC esp-aes esp-sha-hmac 
R2(cfg-crypto-trans)#mode transport 
R2(cfg-crypto-trans)#exit

R2(config)#ip access-list extended GRE-IPSEC
R2(config-ext-nacl)# permit gre host 200.59.25.2 host 197.53.15.2   
R2(config-ext-nacl)#exit

R2(config)#crypto map IPSEC-MAP 10 ipsec-isakmp 
R2(config-crypto-map)#match address GRE-IPSEC
R2(config-crypto-map)#set peer 197.53.15.2
R2(config-crypto-map)#set transform-set AABBCC
R2(config-crypto-map)#exit

R2(config)#int e0/0
R2(config-if)#crypto map IPSEC-MAP
R2(config-if)#end
R2#wr
```

**OSPF:**

**R1:**
```
R1#conf t
R1(config)#router ospf 1
R1(config-router)#network 10.10.10.0 0.0.0.255 area 0
R1(config-router)#network 192.168.1.1 0.0.0.0 area 0
R1(config-router)#end
R1#wr
```

**R2:**
```
R2#conf t
R2(config)#router ospf 1
R2(config-router)#network 10.10.20.0 0.0.0.255 area 0
R2(config-router)#network 192.168.1.2 0.0.0.0 area 0
R2(config-router)#end
R2#wr
```


**Test:**

**R1:**
```
R1#traceroute 10.10.20.10
Type escape sequence to abort.
Tracing the route to 10.10.20.10
VRF info: (vrf in name/id, vrf out name/id)
  1 192.168.1.2 5 msec 6 msec 5 msec
  2 10.10.20.10 7 msec 5 msec 5 msec
```

**R2:**
```
R2#traceroute 10.10.10.10
Type escape sequence to abort.
Tracing the route to 10.10.10.10
VRF info: (vrf in name/id, vrf out name/id)
  1 192.168.1.1 5 msec 5 msec 5 msec
  2 10.10.10.10 6 msec 5 msec 5 msec
```


```
sh run | sec isakmp
sh crypto sessions
sh ip route
sh ip route ospf
```