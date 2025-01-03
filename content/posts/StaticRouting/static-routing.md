+++
date = '2024-03-18T22:57:40+01:00'
title = 'Static Routing'
tags = ["IPv4", "routing"]
categories = ["Network"]
author = "Soner Sahin"
+++
Static Routing, yönlendirme tablosuna manuel olarak route eklenmesidir.
Topoloji değişikliklerinde networklerin de yine güncellenmesi manuel olarak yapılmalıdır.
Administrative Distance değeri 1'dir

Aşağıdaki topolojiyi uygulayacağız.

![UTP](/images/StaticRouting/2.png)

Bu topolojide tüm cihazların birbirleriyle iletişim kurmasını istiyoruz. Başlayalım

**1-** Router interfacelerine ve VPC'lere IP'lerini verelim.

**R1:**
```
R1#enable 
R1#conf t     
R1(config)#int e0/0
R1(config-if)#ip add 192.168.1.1 255.255.255.0
R1(config-if)#no sh
R1(config-if)#int s1/0
R1(config-if)#ip address 2.2.2.2 255.255.255.0
R1(config-if)#no sh
R1(config-if)#int s1/1
R1(config-if)#ip addr 3.3.3.2 255.255.255.0
R1(config-if)#no sh
```

**R2:**
```
R2#enable
R2#conf t
R2(config)#int e0/0
R2(config-if)#ip add 192.168.2.1 255.255.255.0
R2(config-if)#no sh
R2(config-if)#int s1/0
R2(config-if)#ip add 2.2.2.1 255.255.255.0
R2(config-if)#no sh
R2(config-if)#int s1/1
R2(config-if)#ip add 1.1.1.1 255.255.255.0
R2(config-if)#no sh
```


**R3:**
```
R3#enable
R3#conf t
R3(config)#int e0/0
R3(config-if)#ip add 192.168.3.1 255.255.255.0
R3(config-if)#no sh
R3(config-if)#int s1/0
R3(config-if)#ip add 3.3.3.1 255.255.255.0
R3(config-if)#no sh
R3(config-if)#int s1/1
R3(config-if)#ip add 1.1.1.2 255.255.255.0
R3(config-if)#no sh
```

**VPC1:**
```
VPCS> ip 192.168.1.10 255.255.255.0 gateway 192.168.1.1
```

**VPC2:**
```
VPCS> ip 192.168.2.10 255.255.255.0 gateway 192.168.2.1
```

**VPC3:**
```
VPCS> ip 192.168.3.10 255.255.255.0 gateway 192.168.3.1
```

**2-** Rotaları yazalım.
Öncelikle herhangi bir Router'ın routing tablosuna bakalım ve hangi networklere gidebileceğine bakalım.
Örneğin R3:
```
R3#show ip route 
Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area 
       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
       E1 - OSPF external type 1, E2 - OSPF external type 2
       i - IS-IS, su - IS-IS summary, L1 - IS-IS level-1, L2 - IS-IS level-2
       ia - IS-IS inter area, * - candidate default, U - per-user static route
       o - ODR, P - periodic downloaded static route, H - NHRP, l - LISP
       a - application route
       + - replicated route, % - next hop override

Gateway of last resort is not set

      1.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
C        1.1.1.0/24 is directly connected, Serial1/1
L        1.1.1.2/32 is directly connected, Serial1/1
      3.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
C        3.3.3.0/24 is directly connected, Serial1/0
L        3.3.3.1/32 is directly connected, Serial1/0
      192.168.3.0/24 is variably subnetted, 2 subnets, 2 masks
C        192.168.3.0/24 is directly connected, Ethernet0/0
L        192.168.3.1/32 is directly connected, Ethernet0/0

```

Burada 3'er tane C ve L harfleri var. L yukarıda yazıldığı gibi cihazın üzerindeki interfaceleri gösterir. C ise direkt bağlı networkleri gösterir. Direct Connectly networklerin AD değeri 0'dır.
Router'lar yönlendirme tablolarına göre paketi iletirler. Tabloda yer almayan paketleri drop ederler.

Bir test yapalım.
R3'den 1.1.1.1/24 interfacesine gidelim.
```
R3#ping 1.1.1.1
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 1.1.1.1, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 8/8/9 ms

```
Başarılı, çünkü yönlendirme tablosunda bu network directly connect olarak görünüyordu.

Şimdi bir de 2.2.2.1/24 interfacesine gitmeyi deneyelim.
```
R3#ping 2.2.2.1
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 2.2.2.1, timeout is 2 seconds:
.....
Success rate is 0 percent (0/5)

```
Gidemedi çünkü bu networkü tanımıyor. Aynı şekilde routing tablosunda bulunmayan diğer networkler için de aynı çıktı olacaktır.

Şimdi Router'lara ilgili statik yönlendirmelerini girelim ve hayat normale dönsün.

**R1:**
```
R1#conf t
R1(config)#ip route 1.1.1.0 255.255.255.0 2.2.2.1     #Birinci yol
R1(config)#ip route 1.1.1.0 255.255.255.0 3.3.3.1     #İkinci yol 
R1(config)#ip route 192.168.2.0 255.255.255.0 2.2.2.1
R1(config)#ip route 192.168.3.0 255.255.255.0 3.3.3.1

```

R1 routerından 1.1.1.0 networküne 2 rota bulunuyor bundan dolayı ikisini de yazarak routerın load balance yapmasını sağlayabiliriz. Yani paketlerin bazılarını 2.2.2.1'den bazılarını 3.3.3.1'den gönderecektir bu sayede yük dağılımı yapacaktır. Route tablosunda da iki rota görünecektir.

NOT: Eğer istersek AD değerleriyle oynayarak aynı networke giden iki yoldan birini önceliklendirebiliriz.

Örneğin R1'den 1.1.1.0/24 networküne giden 2 yoldan birini seçerek AD değeriyle oynayacağım ve tek yoldan gitmesini sağlayacağım. R1'in 1.1.1.0/24 networküne 3.3.3.1'den gitmesini istiyorum ve bu rotaya birşey olursa 2.2.2.1'den gitmeye devam etsin.

**R1:**
```
R1(config)#ip route 1.1.1.0 255.255.255.0 3.3.3.1 1   #Öncelikli rota
R1(config)#ip route 1.1.1.0 255.255.255.0 2.2.2.1 2 

```

Yaptığım tek şey aynı komutun sonuna öncelik değerini girmek. En düşük olan önceliklidir. Route tablosunda sadece en düşük olan görünecektir. Eğer bu rotaya birşey olursa diğerinden paketler gitmeye devam edecektir.

R2'den devam edelim.

**R2:**
```
R1#conf t
R2(config)#ip route 3.3.3.0 255.255.255.0 2.2.2.2    
R2(config)#ip route 3.3.3.0 255.255.255.0 1.1.1.2
R2(config)#ip route 192.168.1.0 255.255.255.0 2.2.2.2
R2(config)#ip route 192.168.3.0 255.255.255.0 1.1.1.2
```

**R3:**
```
R3(config)#ip route 2.2.2.0 255.255.255.0 1.1.1.1     
R3(config)#ip route 2.2.2.0 255.255.255.0 3.3.3.2 
R3(config)#ip route 192.168.1.0 255.255.255.0 3.3.3.2
R3(config)#ip route 192.168.2.0 255.255.255.0 1.1.1.1
```

**NOT:**  Default route denen bir rota da vardır ki bunun anlamı şudur, bilmediğin her networkü ona sor demektir.

Bu da şöyle yazılır:
```
ip route 0.0.0.0 0.0.0.0 192.168.1.1     #Bilmediğin her şeyi 192.168.1.1'e sor
```

Şimdi birkaç test yapalım.

VPC1'den VPC3'e:
```
VPCS> ping 192.168.3.10

84 bytes from 192.168.3.10 icmp_seq=1 ttl=62 time=15.916 ms
84 bytes from 192.168.3.10 icmp_seq=2 ttl=62 time=9.811 ms
84 bytes from 192.168.3.10 icmp_seq=3 ttl=62 time=14.032 ms
84 bytes from 192.168.3.10 icmp_seq=4 ttl=62 time=13.569 ms
84 bytes from 192.168.3.10 icmp_seq=5 ttl=62 time=13.107 ms

```

VPC2'den VPC1'e:
```
VPCS> ping 192.168.1.10

84 bytes from 192.168.1.10 icmp_seq=1 ttl=62 time=9.456 ms
84 bytes from 192.168.1.10 icmp_seq=2 ttl=62 time=13.573 ms
84 bytes from 192.168.1.10 icmp_seq=3 ttl=62 time=13.713 ms
84 bytes from 192.168.1.10 icmp_seq=4 ttl=62 time=11.117 ms
84 bytes from 192.168.1.10 icmp_seq=5 ttl=62 time=13.260 ms

```

Şimdi de route tablolarına bakalım:

**R1:**
```
R1#sh ip route static 
Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area 
       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
       E1 - OSPF external type 1, E2 - OSPF external type 2
       i - IS-IS, su - IS-IS summary, L1 - IS-IS level-1, L2 - IS-IS level-2
       ia - IS-IS inter area, * - candidate default, U - per-user static route
       o - ODR, P - periodic downloaded static route, H - NHRP, l - LISP
       a - application route
       + - replicated route, % - next hop override

Gateway of last resort is not set

      1.0.0.0/24 is subnetted, 1 subnets
S        1.1.1.0 [1/0] via 3.3.3.1
S     192.168.2.0/24 [1/0] via 2.2.2.1
S     192.168.3.0/24 [1/0] via 3.3.3.1

```

**R2:**
```
R2#sh ip route static 
Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area 
       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
       E1 - OSPF external type 1, E2 - OSPF external type 2
       i - IS-IS, su - IS-IS summary, L1 - IS-IS level-1, L2 - IS-IS level-2
       ia - IS-IS inter area, * - candidate default, U - per-user static route
       o - ODR, P - periodic downloaded static route, H - NHRP, l - LISP
       a - application route
       + - replicated route, % - next hop override

Gateway of last resort is not set

      3.0.0.0/24 is subnetted, 1 subnets
S        3.3.3.0 [1/0] via 2.2.2.2
                 [1/0] via 1.1.1.2
S     192.168.1.0/24 [1/0] via 2.2.2.2
S     192.168.3.0/24 [1/0] via 1.1.1.2

```

**R3:**
```
R3#sh ip route static 
Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area 
       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
       E1 - OSPF external type 1, E2 - OSPF external type 2
       i - IS-IS, su - IS-IS summary, L1 - IS-IS level-1, L2 - IS-IS level-2
       ia - IS-IS inter area, * - candidate default, U - per-user static route
       o - ODR, P - periodic downloaded static route, H - NHRP, l - LISP
       a - application route
       + - replicated route, % - next hop override

Gateway of last resort is not set

      2.0.0.0/24 is subnetted, 1 subnets
S        2.2.2.0 [1/0] via 3.3.3.2
                 [1/0] via 1.1.1.1
S     192.168.1.0/24 [1/0] via 3.3.3.2
S     192.168.2.0/24 [1/0] via 1.1.1.1
```


Teşekkürler,

İyi Çalışmalar.
