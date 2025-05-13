+++
title = "HSRP Protokolü"
date = "2024-01-07T23:45:22+01:00"
tags = ["Cisco", "HSRP"]
categories = ["Network"]
author = "Soner Sahin"
image = "/images/HSRP/cover.jpg"
+++

  
HSRP (Hot Standby Router Protocol), router yedekliliğini sağlamak amacıyla Cisco tarafından geliştirilmiş bir protokoldür. Birden fazla Router bulunan networklerde aktif olarak belirtilen Router'ın çalışmaması durumunda yedek olarak bekleyen Router'ın devreye girmesi prensibiyle çalışır. Bunun için sanal bir ortak IP adresi oluşturulur ve PC'lere Gateway olarak bu IP adresi verilir. Bu IP adresine giden paketler de aktif olan Router'a yönlendirilir. Bu sayede iletişim sağlanır.

Router'lar birbirlerine 3 saniyede bir aktif olup olmadıklarını öğrendikleri Hello paketi yollarlar. Eğer aktif Router'dan 10 saniye cevap gelmezse yedek Router devreye girer, paketler o Router üzerinden iletilir. Bu değerler isteğe bağlı değiştirilebilir.

HSRP multicast olarak 224.0.0.2 adresinden yayın yapar. Bu da Network'deki diğer Router'larla iletişimi sağlar.

**HSRP Konfigürasyonu:**

Aşağıdaki örnek topolojiyi uygulayacağız.

![hsrp](/images/HSRP/1.png)


**1-Öncelikle Cihazları açalım ve IP'lerini verelim:**

**R1**
```
R1>enable
R1#configure terminal
R1(config)#interface e0/1
R1(config-if)#ip address 192.168.1.1 255.255.255.0
R1(config-if)#no sh
R1(config-if)#exit
R1(config)#interface e0/0
R1(config-if)#ip address 172.16.1.1 255.255.255.0
R1(config-if)#no sh
R1(config-if)#exit
```

**R2**
```
R2>enable
R2#configure terminal
R2(config)#interface e0/1
R2(config-if)#ip address 192.168.1.2 255.255.255.0
R2(config-if)#no sh
R2(config-if)#exit
R2(config)#interface e0/0
R2(config-if)#ip address 172.16.1.2 255.255.255.0
R2(config-if)#no sh
R2(config-if)#exit
```

**VPC5**
```
VPCS> ip 172.16.1.10 255.255.255.0 gateway 172.16.1.254     #Gateway sanal IP
```

**VPC6**
```
VPCS> ip 192.168.1.10 255.255.255.0 gateway 192.168.1.254   #Gateway sanal IP
```


**2-HSRP Konfigürasyonunu yapalım.**

A Network'ünden B Network'üne giderken R1'in aktif olarak kullanılmasını istiyorum. R2'de yedek olarak bekleyecek. Buna göre konfigürasyonu yapacağım.

**R1:**
```
R1(config)#interface e0/0
R1(config-if)#standby 10 ip 172.16.1.254     #Sanal IP
R1(config-if)#standby 10 priority 250        #Öncelik değeri
R1(config-if)#standby 10 preempt             #Arıza giderildikten sonra bunu tekrar aktif yap.
R1(config-if)#standby 10 timers 2 6          #2sn hello paketi, 6sn hold time
R1(config-if)#exit
```

**priority:** En yüksek priority değerine sahip cihaz aktif olarak seçilir. Bu değer max 255 olabilir.
**preempt:** Aktif router arızalanır ve yedek devreye girdikten sonra eğer arıza giderilirse tekrar bu router aktif olarak kullanılır.
**timers:** Bu değerin anlamı, 2 saniyede bir Hello paketi gönder, 6 saniye gelmezse yedek router devreye girer.
**NOT:** "10" değeri ilgili grubu temsil eder.

**R2:**
```
R2(config)#interface e0/0
R2(config-if)#standby 10 ip 172.16.1.254
R2(config-if)#standby 10 priority 200
R2(config-if)#standby 10 preempt 
R2(config-if)#standby 10 timers 2 6 
R2(config-if)#exit
```


B Networkü'nden A Network'üne giderken R2'nin aktif olarak kullanılmasını istiyorum. Şimdi de R1 yedek olacak.

**R1:**
```
R1(config)#interface e0/1
R1(config-if)#standby 20 ip 192.168.1.254
R1(config-if)#standby 20 priority 200
R1(config-if)#standby 20 preempt
R1(config-if)#standby 20 timers 2 6
```

**R2:**
```
R2(config)#interface e0/1
R2(config-if)#standby 20 ip 192.168.1.254
R2(config-if)#standby 20 priority 250
R2(config-if)#standby 20 preempt 
R2(config-if)#standby 20 timers 2 6
```

**Kontrol:**

VPC5'den VPC6'ya bir tracert atalım ve hangi Router üzerinden gittiğini görelim.
Yapmak istediğimiz R1'di.

**VPC5:**

![hsrp](/images/HSRP/2.png)

Tam isteğimiz gibi R1'den gidiyor. 

Şimdi bir de B Network'ünden A Network'üne gitmeye çalışalım. Burada da isteğimiz R2'den gitmesiydi.

![hsrp](/images/HSRP/3.png)


Yine istediğimiz gibi paket her seferinde R2 üzerinden gitti.

Şimdi bir de yine B Network'ünden A Network'üne gidelim, fakat bu sefer aktif olan R2'yi kapatalım ne olacak bakalım.

**VPC6:**
![hsrp](/images/HSRP/4.png)


Artık R1 aktif olarak ayarlandı ve paket R1'den gidiyor.

Tekrar açalım;
![hsrp](/images/HSRP/5.png)

Ve tekrardan R2 aktif olarak ayarlandı.

Şimdi son olarak standby tablolarımıza bakalım,

**R1:**
```
R1#sh standby
```

![hsrp](/images/HSRP/6.png)

```
R1#sh standby brief 
```

![hsrp](/images/HSRP/7.png)

```
R1#sh standby neighbors 
```

![hsrp](/images/HSRP/8.png)


**R2:**
```
R2#sh standby
```

![hsrp](/images/HSRP/9.png)


```
R2#sh standby brief 
```

![hsrp](/images/HSRP/11.png)


```
R1#sh standby neighbors 
```

![hsrp](/images/HSRP/10.png)



Teşekkürler,


İyi Çalışmalar.