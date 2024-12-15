+++
date = '2024-05-31T22:57:40+01:00'
title = 'DHCPv6'
tags = ["DHCP", "ipv6"]
author = "Soner Sahin"
+++

DHCP(Dynamic Host Configuration Protocol), bir networkteki bir cihaza IP, DNS, Default Gateway parametrelerini dağıtan servistir. Yani networkteki bir cihazın başka bir cihaz ile konuşmasını sağlayacak parametlereleri dağıtan servistir.
DHCPv6, DHCPv4'den bazı özellikleriyle ayrılıyor. DHCPv6 2 şekilde yapılandırılabilir.
- Stateful(Durumlu) DHCPv6,
- Stateless SLAAC (Durumsuz) DHCPv6

Stateful DHCPv6 tıpkı DHCPv4 gibi, bir DHCP server üzerinden parametreleri dağıtmaktır.

Stateless SLAAC DHCPv6 da ise herhangi bir DHCP server olmaksızın cihazların Router üzerinden IPv6 parametrelerini alıp otomatik olarak kendini yapılandırmasıdır.

Yani ortamda bir DHCP server olmasa bile bir PC'nin network ayarlarını "auto" şeklinde bırakırsak, PC, Router üzerinden otomatik olarak IP parametrelerini alıp iletişim kurabilecektir.

Fakat SLAAC yönteminde PC, IPv6 parametrelerini alacaktır fakat DNS parametresini alamayacaktır.

Bunun için DHCP Server'dan O Flag'ini 1 yaparsak cihaz artık DNS parametresini DHCP Server'dan alacaktır.

Topoloji üzerinde daha net anlaşılacaktır.

DHCPv6 için aşağıdaki topolojiyi uygulayacağım.

![dhcpv6](/images/dhcpv6/1.png)

Yapılacaklar:
1. Router'ın Interfacelerine ilgili IPv6 adreslerini ver,
2. Network A için Stateless (SLAAC) konfigürasyonu yap,
3. Network B için Stateful DHCPv6 konfigürasyonu yap,
4. Network C için SLAAC + DHCPv6 konfigürasyonu yap,
5. Kontrol et.


1. Router'ın Interfacelerine ilgili IPv6 adreslerini ver:

**R1:**
```
R1#configure terminal
R1(config)#ipv6 unicast-routing 
R1(config)#int e0/0
R1(config-if)#ipv6 addr 2001:10::1/64
R1(config-if)#no  sh
R1(config-if)#int e0/1
R1(config-if)#ipv6 addr 2001:20::1/64
R1(config-if)#no sh
R1(config-if)#int e0/2
R1(config-if)#ipv6 addr 2001:30::1/64
R1(config-if)#no sh
R1(config-if)#exit
```


2. Network A için Stateless (SLAAC) konfigürasyonu yap,

Bunun için VPC1 cihazının IP ayarlarını "auto" ya çektiğim zaman R1'den ilgili parametreleri otomatik alacaktır.

**VPC1:**

```
VPCS> ip auto
GLOBAL SCOPE      : 2001:10::2050:79ff:fe66:6804/64
ROUTER LINK-LAYER : aa:bb:cc:00:10:00


VPCS> show ipv6 
NAME              : VPCS[1]
LINK-LOCAL SCOPE  : fe80::250:79ff:fe66:6804/64
GLOBAL SCOPE      : 2001:10::2050:79ff:fe66:6804/64
DNS               : 
ROUTER LINK-LAYER : aa:bb:cc:00:10:00
MAC               : 00:50:79:66:68:04
LPORT             : 20000
RHOST:PORT        : 127.0.0.1:30000
MTU:              : 1500


VPCS> ping 2001:10::1
2001:10::1 icmp6_seq=1 ttl=64 time=0.483 ms
2001:10::1 icmp6_seq=2 ttl=64 time=2.252 ms

VPCS> ping 2001:20::1
2001:20::1 icmp6_seq=1 ttl=64 time=2.016 ms
2001:20::1 icmp6_seq=2 ttl=64 time=13.343 ms

VPCS> ping 2001:30::1
2001:30::1 icmp6_seq=1 ttl=64 time=2.311 ms
2001:30::1 icmp6_seq=2 ttl=64 time=2.663 ms
```

Görüldüğü gibi IPv6 adresini R1 üzerinden almış oldu. ve diğer networklere ping atabiliyor.
IPv6 adresi alma süreci de aşağıdaki gibidir.

![dhcpv6](/images/dhcpv6/2.png)

3. Network B için Stateful DHCPv6 konfigürasyonu yap.

Şimdi ise normal bir şekilde DHCPv6 Server konfigürasyonu yapıp IP, DNS parametrelerini dağıtacağız.

**R1:**

```
R1#configure terminal  
R1(config)#ipv6 dhcp pool test2
R1(config-dhcpv6)#address prefix 2001:20::/64
R1(config-dhcpv6)#dns-server 2001:5555::5555   
R1(config-dhcpv6)#domain-name aaa.local
R1(config-dhcpv6)#exit
R1(config)#interface e0/1
R1(config-if)#ipv6 dhcp server test2
R1(config-if)#ipv6 nd managed-config-flag 
R1(config-if)#exit
```

Şimdi cihazın IP alıp almadığına bakalım.

![dhcpv6](/images/dhcpv6/3.png)

Görüldüğü gibi hem IP hem DNS parametrelerini almış.
Şimdi DNS parametresini almadığı duruma bakalım.

4. Network C için SLAAC + DHCPv6 konfigürasyonu yap.

Şimdi ise SLAAC yönteminde alamadığımız DNS bilgilerini DHCPv6 server üzerinden alacağız.
Bunun için ise, 0 Flag'ini 1 olarak ayarlayacağız.
Öncelikle Network C'de bulunan cihazının IPv6 ayarını "auto" yapalım ve DNS bilgisi alıp almadığına bakalım.

**Win:**
![dhcpv6](/images/dhcpv6/4.png)

Evet var ama benim istediğim DNS değil bu. Bu yüzden sadece DNS parametresini DHCP Server'dan almasını sağlayacağız.

**R1:**
```
R1#configure terminal 
R1(config)#ipv6 dhcp pool test3
R1(config-dhcpv6)#dns-server 2001:5555::5555
R1(config-dhcpv6)#exit
R1(config)#int e0/2
R1(config-if)#ipv6 dhcp server test3
R1(config-if)#ipv6 nd other-config-flag 
R1(config-if)#exit
```

Şimdi cihazın DNS bilgisini alıp almadığına tekrar bakalım:

![dhcpv6](/images/dhcpv6/5.png)

Artık istediğim DNS'i de almış oldu.

Aynı zamanda R1'in e0/0 ve e0/1 interfacelerine de sorunsuz bir şekilde ulaşabiliyoruz.

![dhcpv6](/images/dhcpv6/6.png)

![dhcpv6](/images/dhcpv6/7.png)


Teşekkürler,

İyi Çalışmalar.



