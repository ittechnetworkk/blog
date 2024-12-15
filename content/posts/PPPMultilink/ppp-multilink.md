+++
date = '2024-04-14T22:57:40+01:00'
title = 'PPP Multilink Konfigürasyonu'
tags = ["ppp", "multilink"]
author = "Soner Sahin"
+++

PPP Multilink, routerlar arasındaki birden fazla fiziksel bağlantıyı tek bir mantıksal bağlantı yapmak amacıyla kullanılır. 
Bazı özellikleri:
- Yük Dengeleme,
- Bant Genişliğinin Artırılması,
- Verimlilik,
- Yedeklilik.

**Multilink PPP LAB:**
Aşağıdaki basit yapıyı konfigüre edeceğim.


![ppp](/images/ppp-multilink/1.png)



Bu yapıda serial 4 kablo ile bağlanmış iki router var. R1 ile başlayalım.

**R1:**
```
R1#conf t
R1(config)#interface multilink 1
R1(config-if)#ip addr 10.0.0.1 255.255.255.0
R1(config-if)#no sh
R1(config-if)#ppp multilink
R1(config-if)#ppp multilink group 1
R1(config-if)#exit

R1(config)#int ser0/0
R1(config-if)#encapsulation ppp
R1(config-if)#ppp multilink 
R1(config-if)#ppp multilink group 1  
R1(config-if)#no sh

R1(config-if)#int ser0/1
R1(config-if)#encapsulation ppp
R1(config-if)#ppp multilink
R1(config-if)#ppp multilink group 1
R1(config-if)#no sh

R1(config-if)#int ser0/2
R1(config-if)#encapsulation ppp
R1(config-if)#ppp multilink
R1(config-if)#ppp multilink group 1
R1(config-if)#no sh

R1(config-if)#int ser0/3
R1(config-if)#encapsulation ppp
R1(config-if)#ppp multilink
R1(config-if)#ppp multilink group 1
R1(config-if)#no sh
R1(config-if)#exit
```


**R2:**
```
R2(config)#interface multilink 1
R2(config-if)#ip addr 10.0.0.2 255.255.255.0
R2(config-if)#no sh
R2(config-if)#ppp multilink
R2(config-if)#ppp multilink group 1
R2(config-if)#exit

R2(config)#int ser0/0
R2(config-if)#encapsulation ppp
R2(config-if)#ppp multilink
R2(config-if)#ppp multilink group 1
R2(config-if)#no sh

R2(config-if)#int ser0/1
R2(config-if)#encapsulation ppp    
R2(config-if)#ppp multilink        
R2(config-if)#ppp multilink group 1
R2(config-if)#no sh

R2(config-if)#int ser0/2
R2(config-if)#encapsulation ppp    
R2(config-if)#ppp multilink        
R2(config-if)#ppp multilink group 1
R2(config-if)#no sh

R2(config-if)#int ser0/3
R2(config-if)#encapsulation ppp    
R2(config-if)#ppp multilink        
R2(config-if)#ppp multilink group 1
R2(config-if)#no sh
R2(config-if)#exit
```


Ping testi:

**R1 » R2:**
```
R1#ping 10.0.0.2
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.0.0.2, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 9/9/9 ms
```

**R2 » R1:**
```
R2#ping 10.0.0.1
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.0.0.1, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 10/10/11 ms
```

Teşekkürler,

İyi Çalışmalar.