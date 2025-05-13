+++
date = '2024-09-11T22:57:40+01:00'
title = 'DMVPN Phase 2 OSPF'
tags = ["DMVPN", "cisco", "vpn", "ospf"]
categories = ["Network"]
author = "Soner Sahin"
image = "/images/DMVPNPhase3OSPF/cover.jpg"
+++

Merhaba bu yazıda DMVPN Phase 1 ve RIP protokolü ile Hub ve Spoke'ların dinamik bir şekilde haberleşmesinden bahsedeceğim.

Aşağıda oluşturduğum topoloji ile devam edeceğim.

![DMVPN](/images/DMVPNPhase2OSPF/1.png)


Başlayalım.

**HUB:**
```
HUB#conf t 
HUB(config)#int tun0 
HUB(config-if)#no sh
HUB(config-if)#ip addr 10.0.0.1 255.255.255.0 
HUB(config-if)#tunnel source f0/0
HUB(config-if)#tunnel mode gre multipoint
HUB(config-if)#ip mtu 1400
HUB(config-if)#ip tcp adjust-mss 1360 
HUB(config-if)#ip nhrp network-id 1  
HUB(config-if)#ip nhrp authentication Marvel1   
HUB(config-if)#ip nhrp map multicast dynamic  
HUB(config-if)#end
HUB#wr
```

**SPOKE-1:***
```
SPOKE-1#conf t
SPOKE-1(config)#int tun0
SPOKE-1(config-if)#no sh
SPOKE-1(config-if)#ip addr 10.0.0.2 255.255.255.0
SPOKE-1(config-if)#ip mtu 1400
SPOKE-1(config-if)#ip tcp adjust-mss 1360
SPOKE-1(config-if)#tunnel source f0/0
SPOKE-1(config-if)#tunnel destination 1.1.1.1
SPOKE-1(config-if)#ip nhrp network-id 1
SPOKE-1(config-if)#ip nhrp authentication Marvel1
SPOKE-1(config-if)#ip nhrp nhs 10.0.0.1
SPOKE-1(config-if)#ip nhrp map 10.0.0.1 1.1.1.1
SPOKE-1(config-if)#ip nhrp map multicast 1.1.1.1
SPOKE-1(config-if)#end
SPOKE-1#wr
```

**SPOKE-2:***
```
SPOKE-2#conf t
SPOKE-2(config)#int tun0
SPOKE-2(config-if)#no sh
SPOKE-2(config-if)#ip addr 10.0.0.3 255.255.255.0
SPOKE-2(config-if)#ip mtu 1400
SPOKE-2(config-if)#ip tcp adjust-mss 1360
SPOKE-2(config-if)#tunnel source f0/0
SPOKE-2(config-if)#tunnel destination 1.1.1.1
SPOKE-2(config-if)#ip nhrp network-id 1
SPOKE-2(config-if)#ip nhrp authentication Marvel1
SPOKE-2(config-if)#ip nhrp nhs 10.0.0.1
SPOKE-2(config-if)#ip nhrp map 10.0.0.1 1.1.1.1
SPOKE-2(config-if)#ip nhrp map multicast 1.1.1.1
SPOKE-2(config-if)#end
SPOKE-2#wr
```


**RIP:**

**HUB:**
```
HUB#conf t
HUB(config)#router rip 
HUB(config-router)#version 2
HUB(config-router)#no auto-summary 
HUB(config-router)#network 172.16.1.0
HUB(config-router)#network 10.0.0.0
HUB(config-router)#exit
HUB(config)#int tun0
HUB(config-if)#no ip split-horizon 
```

**SPOKE-1:**
```
SPOKE-1#conf t
SPOKE-1(config)#router rip
SPOKE-1(config-router)#version 2
SPOKE-1(config-router)#no auto-summary 
SPOKE-1(config-router)#network 10.0.0.0
SPOKE-1(config-router)#network 172.16.2.0
SPOKE-1(config-router)#end
SPOKE-1#wr
```

**SPOKE-2:**
```
SPOKE-2#conf t
SPOKE-2(config)#router rip
SPOKE-2(config-router)#version 2
SPOKE-2(config-router)#no auto-summary 
SPOKE-2(config-router)#network 172.16.3.0
SPOKE-2(config-router)#network 10.0.0.0
SPOKE-2(config-router)#end
SPOKE-2#wr
```


Trafiğin Hub üzerinden aktığını kontrol edelim.

**SPOKE-1 to SPOKE-2:**
```
SPOKE-1#traceroute 172.16.3.1
Type escape sequence to abort.
Tracing the route to 172.16.3.1
VRF info: (vrf in name/id, vrf out name/id)
  1 10.0.0.1 8 msec 15 msec 8 msec
  2 10.0.0.3 24 msec 15 msec * 
```

**SPOKE-2 to SPOKE-1:**
```
SPOKE-2#traceroute 172.16.2.1
Type escape sequence to abort.
Tracing the route to 172.16.2.1
VRF info: (vrf in name/id, vrf out name/id)
  1 10.0.0.1 9 msec 4 msec 4 msec
  2 10.0.0.2 11 msec 28 msec * 
```


Gayet güzel çalışıyor. Aşağıdaki bazı show komutlarıyla detaylı olarak inceleyebilirsiniz.


Show komutları:
```
show ip route rip
show run interface tun0
show ip nhrp
show ip nhrp nhs
show ip nhrp multicast
show dmvpn
show adjacency <IP> detail
show ip protocols
show run
```




Teşekkürler,

İyi Çalışmalar.






