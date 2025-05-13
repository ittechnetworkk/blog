+++
title = "DHCP Relay Agent"
date = "2024-01-14T23:43:35+01:00"
tags = ["Cisco", "DHCP", "Relay"]
categories = ["Network"]
author = "Soner Sahin"
image = "/images/DHCPRelayAgent/cover.jpg"
+++

DHCP, cihazlara IP, DNS, Default Gateway dağıtan protokoldür. Bu protokol client-server mantığıyla çalışır. İstemci talep eder ve server hizmet verir. UDP çalışır ve 4 aşamada işlem tamamlanır.

![dhcp](/images/DHCPRelayAgent/8.png)

- Client, DHCP Discover paketini networke gönderir. Bunun anlamı "Bana IP verecek bir DHCP Server var mı?".

- Server, DHCP Offer paketiyle karşılık verir ve der ki "Evet ben verebilirim".

- Client, DHCP Request paketiyle IP adresi talep eder.

- Server, DHCP Ack paketiyle ile cihaza IP adresi ataması yapar.

Paketlere kısaltması olan DORA'da denilir. 

Bu paketler Broadcast gider. Bu yüzden sadece network içinde kalır, başka bir networke gidemez. Peki bizim DHCP Server'ımız network dışında ise ne olur. Bunu da DHCP Relay Agent ile çözüyoruz.
DHCP Relay Agent, IP almak isteyen farklı networkteki cihazların IP almalarını sağlayan uygulamadır. 
Router üzerinde "ip helper address (DHCP SERVER IP)" komutu girilerek oluşturulur. Bu komut sayesinde Client cihaz DHCP Discover paketi yayınladığında bu paket Router'ın LAN interfacesine kadar gidecek ve Router bu paketi başka networkte bulunan DHCP Server'a iletecek. Bu sayede iletişim gerçekleşecektir.

**UYGULAMA:**
Aşağıdaki Topolojiyi uygulayacağız.

![dhcp](/images/DHCPRelayAgent/1.png)


Bu topolojide DHCP Server'da A ve B Networkleri için IP havuzu oluşturuldu ve IP almak isteyen cihazları avını bekleyen sırtlan gibi bekliyor.

Öncelikle cihazların IP almadıklarından emin olalım. A ve B Networklerinden birer cihaza bakalım.

**VPC1:**
![dhcp](/images/DHCPRelayAgent/2.png)


**VPC3:**
![dhcp](/images/DHCPRelayAgent/3.png)

IP'yi statik vermediğimiz için ve DHCP Server'a ulaşamadıkları için henüz alamadılar.

Routerlar'ın konfigürasyonlarıyla başlayalım.

**R5:**
```
R5>en
R5#conf t
R5(config)#int e0/2
R5(config-if)#ip addr 10.10.10.1 255.255.255.0
R5(config-if)#no sh
R5(config-if)#exit

R5(config)#int e0/0
R5(config-if)#ip addr 1.1.1.1 255.255.255.0
R5(config-if)#no sh

R5(config)#int e0/1
R5(config-if)#ip addr 2.2.2.1 255.255.255.0
R5(config-if)#no sh
R5(config-if)#exit

R5(config)#ip route 192.168.1.0 255.255.255.0 1.1.1.2     #A Networkü için route
R5(config)#ip route 172.16.1.0 255.255.255.0 2.2.2.2      #B Networkü için route

```

**R9:**
```
R9>en
R9#conf t
R9(config)#int e0/2
R9(config-if)#ip addr 1.1.1.2 255.255.255.0
R9(config-if)#no sh
R9(config-if)#exit

R9(config)#int e0/1
R9(config-if)#ip addr 192.168.1.1 255.255.255.0
R9(config-if)#no sh
R9(config-if)#exit

R9(config)#ip route 10.10.10.0 255.255.255.0 1.1.1.1  #Server'ın bulunduğu networke gidilen route

R9(config)#int e0/1
R9(config-if)#ip help
R9(config-if)#ip helper-address 10.10.10.10     #DHCP Server IP
```

Burada "ip helper-address (DHCP Server IP)" parametresini Router'ın LAN interfacesine yazıyoruz. Örneğin A Network'ünün IP almasını istiyorsak R9'un e0/1 interfacesine yazıyoruz.  B Network'ü için R10'un e0/1 interfacesine.

**R10:**
```
R10(config)#int e0/2
R10(config-if)#ip addr 2.2.2.2 255.255.255.0
R10(config-if)#no sh 
R10(config-if)#exit

R10(config)#int e0/1
R10(config-if)#ip addr 172.16.1.1 255.255.255.0
R10(config-if)#no sh
R10(config-if)#exit

R10(config)#ip route 10.10.10.0 255.255.255.0 2.2.2.1  Server'ın bulunduğu networke gidilen route

R10(config)#int e0/1
R10(config-if)#ip helper-address 10.10.10.10    #DHCP Server IP
```

Konfigürasyonlar yapıldı. Şimdi cihazları DHCP'den IP alacak şekilde ayarlayalım.

**VPC1:**
![dhcp](/images/DHCPRelayAgent/4.png)


Görüldüğü gibi DHCP paketleri gidip geldi "DDORA" ve sonunda IP, DNS ve Default Gateway almayı başardı. 

**VPC2:**
![dhcp](/images/DHCPRelayAgent/5.png)



B Networkü için de bakalım.

**VPC3:**
![dhcp](/images/DHCPRelayAgent/6.png)


**VPC4:**
![dhcp](/images/DHCPRelayAgent/7.png)


Bu sayede farklı bir networkte bulunan DHCP Server'dan IP almayı başardık.

Teşekkürler,

İyi Çalışmalar.