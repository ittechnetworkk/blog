+++
date = '2024-03-22T22:57:40+01:00'
title = 'EtherChannel'
tags = ["Etherchannel", "LACP", "PaGP"]
author = "Soner Sahin"
+++

EtherChannel Protokolü switchlerin birden fazla fiziksel portunu tek bir mantıksal port yapan protokoldür. Yapılmasının amacı şudur örneğin iki switch arasına 4 kablo çekip bırakırsak Stp (Spanning Tree Protocol) devreye girecek ve bu portlardan bazılarını kapatacaktır loop'u engellemek için. Eğer EtherChannel yaparsak bu portlar tek bir mantıksal port gibi görünecektir ve STP'ye gerek kalmayacaktır. Konfigüre etmek için karşılıklı portların yapısı aynı olmalıdır. Örneğin bir taraf GigabitEthernet diğeri FastEthernet olamaz. 
3 EtherChannel Protokolü vardır:
- No Protocol = Herhangi bir protokol kullanılamadan yapılır.
- PAgP (Port Aggrastion Protocol) = Cisco'ya özeldir, başka cihazlarda çalışmaz.
- LACP (Link Aggregation Control Protocol) = Tüm cihazlarda kullanılan bir protokoldür, Cisco dahil.
Bazı özellikleri şöyledir:
- Bant Genişliği,
- Performans ve Güvenlik,
- Yük Dengeleme 
- Max 8 Port Birleştirilebilir,
- FastEthernet için max 800 Mbps,
- GigabitEthernet için max 8 Gbps,

Aşağıdaki örneği uygulayacağız.

![etherchannel](/etherchannel.png)




Başlayalım,
Öncelikle LACP Yapalım;

**SW1:**
```
SW1#conf t
SW1(config)#interface range e0/0-3
SW1(config-if-range)#switchport trunk encapsulation dot1q 
SW1(config-if-range)#channel-group 1 mode active 
Creating a port-channel interface Port-channel 1

SW1(config-if-range)#exit
SW1(config)#int port-channel 1
SW1(config-if)#switchport trunk encapsulation dot1q    
SW1(config-if)#switchport mode trunk             #vlan trafiğini geçirmesi için 
SW1(config-if)#end
```

**SW2:**
```
SW2#conf t
SW2(config)#interface range e0/0-3
SW2(config-if-range)#switchport trunk encapsulation dot1q 
SW2(config-if-range)#channel-group 1 mode active 
Creating a port-channel interface Port-channel 1

SW2(config-if-range)#exit
SW2(config)#int port-channel 1
SW2(config-if)#switchport trunk encapsulation dot1q    
SW2(config-if)#switchport mode trunk             #vlan trafiğini geçirmesi için 
SW1(config-if)#end
```

PAgP Yapalım:
Tek modu active değil Desirable yapıyoruz.

**SW1:**
```
SW1#conf t
SW1(config)#interface range e0/0-3
SW1(config-if-range)#switchport trunk encapsulation dot1q 
SW1(config-if-range)#channel-group 1 mode desirable 
Creating a port-channel interface Port-channel 1

SW1(config-if-range)#exit
SW1(config)#int port-channel 1
SW1(config-if)#switchport trunk encapsulation dot1q    
SW1(config-if)#switchport mode trunk             #vlan trafiğini geçirmesi için 
SW1(config-if)#end
```

**SW2:**
```
SW2#conf t
SW2(config)#interface range e0/0-3
SW2(config-if-range)#switchport trunk encapsulation dot1q 
SW2(config-if-range)#channel-group 1 mode desirable 
Creating a port-channel interface Port-channel 1

SW2(config-if-range)#exit
SW2(config)#int port-channel 1
SW2(config-if)#switchport trunk encapsulation dot1q    
SW2(config-if)#switchport mode trunk             #vlan trafiğini geçirmesi için 
SW1(config-if)#end
```

Kontrol:

**SW1:**
```
SW1#sh etherchannel summary 
Flags:  D - down        P - bundled in port-channel
        I - stand-alone s - suspended
        H - Hot-standby (LACP only)
        R - Layer3      S - Layer2
        U - in use      f - failed to allocate aggregator

        M - not in use, minimum links not met
        u - unsuitable for bundling
        w - waiting to be aggregated
        d - default port


Number of channel-groups in use: 1
Number of aggregators:           1

Group  Port-channel  Protocol    Ports
1      Po1(SU)         LACP      Et0/0(P)    Et0/1(P)    Et0/2(P)     Et0/3(P)

------------------------------------------------------------------------------

SW1#sh etherchannel protocol 
		Channel-group listing: 
		

Group: 1 

Protocol:  LACP

------+-------------+-----------+-----------------------------------------------
SW1#sh ip int br
Interface              IP-Address      OK? Method Status                Protocol
Ethernet0/0            unassigned      YES unset  up                    up      
Ethernet0/1            unassigned      YES unset  up                    up      
Ethernet0/2            unassigned      YES unset  up                    up      
Ethernet0/3            unassigned      YES unset  up                    up      
Port-channel1          unassigned      YES unset  up                    up     

------+-------------+-----------+-----------------------------------------------

SW1#sh etherchannel load-balance 
EtherChannel Load-Balancing Configuration:
        src-dst-ip

EtherChannel Load-Balancing Addresses Used Per-Protocol:
Non-IP: Source XOR Destination MAC address
  IPv4: Source XOR Destination IP address
  IPv6: Source XOR Destination IP address
  
SW2#
```


**SW2:**
```
SW2#sh etherchannel summary 
Flags:  D - down        P - bundled in port-channel
        I - stand-alone s - suspended
        H - Hot-standby (LACP only)
        R - Layer3      S - Layer2
        U - in use      f - failed to allocate aggregator

        M - not in use, minimum links not met
        u - unsuitable for bundling
        w - waiting to be aggregated
        d - default port


Number of channel-groups in use: 1
Number of aggregators:           1

Group  Port-channel  Protocol    Ports
------+-------------+-----------+-----------------------------------------------
1      Po1(SU)         LACP      Et0/0(P)    Et0/1(P)    Et0/2(P)   Et0/3(P)      

SW2#sh etherchannel protocol 
		Channel-group listing: 

Group: 1 

Protocol:  LACP
------+-------------+-----------+-----------------------------------------------
SW2#sh ip int br
Interface              IP-Address      OK? Method Status                Protocol
Ethernet0/0            unassigned      YES unset  up                    up      
Ethernet0/1            unassigned      YES unset  up                    up      
Ethernet0/2            unassigned      YES unset  up                    up      
Ethernet0/3            unassigned      YES unset  up                    up      
Port-channel1          unassigned      YES unset  up                    up      
------+-------------+-----------+-----------------------------------------------

SW2#sh etherchannel load-balance 
EtherChannel Load-Balancing Configuration:
        src-dst-ip

EtherChannel Load-Balancing Addresses Used Per-Protocol:
Non-IP: Source XOR Destination MAC address
  IPv4: Source XOR Destination IP address
  IPv6: Source XOR Destination IP address
  
SW2#
```

Teşekkürler,

İyi Çalışmalar.