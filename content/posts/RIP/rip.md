+++
title = "RIP Protokolü"
date = "2023-12-17T23:45:55+01:00"
tags = ["routing", "Rip"]
categories = ["Network"]
author = "Soner Sahin"
+++

- RIP(Router Information Protokol), bir dinamik yönlendirme protokolüdür. 
- Basit ve kolay öğrenilebilen bir protokoldür. 
- RIPv1 ve RIPv2 versiyonları vardır. RFC1058'de tanımlanmıştır. 
- RIP Protokolü, yönlendirme tablosunu 30 saniyede bir günceller daha sonra üzerindeki aktif arayüzlere iletir. 
- Administrative Distance değeri 120'dir. 
- RIP protokolü en fazla 15 Hop Count'a  izin verir. 
- En iyi rotanın bulunmasında hop sayısına bakılarak paket iletilir.  
- RIPv1 broadcast yayın yapar, subnet bilgisini routing tablosunu güncellediğinde göndermez, kimlik doğrulama yapmaz.  
- RIPv2 Multicast(224.0.0.9) yayın yapar, subnet bilgisini gönderir, kimlik doğrulama desteği vardır.

**RIPv2 Konfigürasyonu:**
Aşağıdaki örnek topolojiyi uygulayalım.

![rip](/images/RIP/1.png)

**1-Öncelikle PC IP'lerini verelim,**
Packet Tracer üzerinde PC'lere IP adresi vermek için PC'nin üzerine tıklayıp Desktop sekmesine geliyoruz ilk sırada yer alan IP Configuration kısmından ilgili IP adreslerini veriyoruz.

**PC1 = 10.0.0.5**

![rip](/images/RIP/2.png)



**PC2 = 192.168.1.5**

![rip](/images/RIP/3.png)


**PC3 = 172.16.0.5**

![rip](/images/RIP/4.png)


**2-Router Interfacelerine IP'lerini verelim,
R1:**
```
Router>enable
Router#configure  terminal
Router(config)#interface serial 0/1/0
Router(config-if)#ip address 1.1.1.1 255.255.255.0
Router(config-if)#no shutdown
Router(config-if)#exit

Router(config)#int ser 0/1/1
Router(config-if)#ip address 3.3.3.1 255.255.255.0
Router(config-if)#no sh
Router(config-if)#exit

Router(config)#int gi 0/0
Router(config-if)#
Router(config-if)#ip address 10.0.0.1 255.255.255.0
Router(config-if)#no sh
Router(config-if)#end
```


**R2:**
```
Router>enable
Router#configure  terminal
Router(config)#interface serial 0/1/0
Router(config-if)#ip address 1.1.1.2 255.255.255.0
Router(config-if)#no shutdown
Router(config-if)#exit

Router(config)#int ser 0/1/1
Router(config-if)#ip address 2.2.2.1 255.255.255.0
Router(config-if)#no sh
Router(config-if)#exit

Router(config)#int gi 0/0
Router(config-if)#
Router(config-if)#ip address 192.168.1.1 255.255.255.0
Router(config-if)#no sh
Router(config-if)#end
```

**R3:**
```
Router>enable
Router#configure  terminal
Router(config)#interface serial 0/1/0
Router(config-if)#ip address 2.2.2.2 255.255.255.0
Router(config-if)#no shutdown
Router(config-if)#exit

Router(config)#int ser 0/1/1
Router(config-if)#ip address 3.3.3.2 255.255.255.0
Router(config-if)#no sh
Router(config-if)#exit

Router(config)#int gi 0/0
Router(config-if)#
Router(config-if)#ip address 172.16.0.1 255.255.255.0
Router(config-if)#no sh
Router(config-if)#end
```


**3-RIP Konfigürasyonunu Gerçekleştirelim,

**R1:**
```
Router>enable
Router#configure terminal
Router(config)#router rip
Router(config-router)#version 2
Router(config-router)#network 10.0.0.0
Router(config-router)#network 1.1.1.0
Router(config-router)#network 3.3.3.0
Router(config-router)#no auto-summary
Router(config-router)#end
Router#write memory
```

**R2:**
```
Router>enable
Router#configure terminal
Router(config)#router rip
Router(config-router)#version 2
Router(config-router)#network 10.0.0.0
Router(config-router)#network 1.1.1.0
Router(config-router)#network 3.3.3.0
Router(config-router)#no auto-summary
Router(config-router)#end
Router#write memory
```

**R3:**
```
Router>enable
Router#configure terminal
Router(config)#router rip
Router(config-router)#version 2
Router(config-router)#network 172.16.0.0
Router(config-router)#network 2.2.2.0
Router(config-router)#network 3.3.3.0
Router(config-router)#no auto-summary
Router(config-router)#end
Router#write memory
```


**4-Test edelim,**
Ping testi yapmak için PC'lerden herhangi birinin üzerine tıklayıp Desktop sekmesinden Command Prompt kısmına geliyoruz ve aşağıdaki komutla test ediyoruz.

**PC1:**
```
ping 192.168.1.5
ping 172.16.0.5
```
![rip](/images/RIP/5.png)

**PC2:**
```
ping 10.0.0.5
ping 172.16.0.5
```
![rip](/images/RIP/6.png)

**PC3:**
```
ping 10.0.0.5
ping 192.168.0.5
```
![rip](/images/RIP/7.png)

**5-Route Tablosu**
Aşağıdaki komutlar sayesinde yaptığımız rip konfigürasyonlarının detayları inlecenebilir. 


**R1:**
```
Router#sh ip route
```
![rip](/images/RIP/8.png)

**R2:**
```
Router#sh ip route
```
![rip](/images/RIP/9.png)

**R3:**
```
Router#sh ip route
```
![rip](/images/RIP/10.png)

Bu komutun haricinde,

```
Router#sh ip rip database
Router#sh ip protocols
```


Komutlarıyla da detaylı olarak incelenebilir.

Teşekkürler,

İyi Çalışmalar.