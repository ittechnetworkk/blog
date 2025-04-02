+++
title = "Fedora Server IP Konfigürasyonu"
date = "2025-01-19T22:51:26+01:00"
tags = ["Linux", "IP", "Fedora"]
categories = ["Linux"]
author = "Soner Sahin"
image = "/images/FedoraIP/cover.jpg"
+++

Selamlar, bu yazımda Fedora Server'a nasıl statik veya dinamik IP tanımlanacağını göstereceğim.

Her Linux dağıtımında statik IP'ler aynı şekilde tanımlanmayabilir. Fakat mantığını bilmek bir adım önde başlamak demektir.

Linux sistemlerde her şey bir dosyadan okunduğu için bunun için de bir ilgili bir dosya vardır. 

Fedora'da bu dosya şuradadır: 

NetworkManager kullanılmadığında;

- /etc/sysconfig/network-scripts/ifcfg-ens33

NetworkManager kullanıldığında;

- /etc/NetworkManager/system-connections/ens33.nmconnection

Şimdi bu dosyayı editleyelim.

Dosyanın ilk hali şu şekildedir:

```
[connection]
id=ens160
uuid=36903561-eb7f-38c2-986b-b098913248de
type=ethernet
autoconnect-priority=-999
interface-name=ens160
timestamp=1737213877

[ethernet]

[ipv4]


[ipv6]
addr-gen-mode=eui64
method=auto

[proxy]
```

Bazı parametreler sisteminize bağlı olarak değişiklik gösterebilir, fakat bizim ilgilendiğimiz kısım şimdilik `[ipv4]` kısmı.

İlk olarak DHCP'den IP almasını sağlayalım.

Bunun için aşağıdaki tek satırı ekliyoruz:

```
[ipv4]
method=auto
```

Dosyayı kaydedip servisi restart edelim;

```
systemctl restart NetworkManager
```

Şimdi IP adresine bakacak olursak DHCP'den bir IP aldığını görebiliriz. Benim Lab ortamımda `172.16.238.132` IP'sini aldı.

```
fedora@fedora:~$ ifconfig 
ens160: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.16.238.132  netmask 255.255.255.0  broadcast 172.16.238.255
        inet6 fe80::20c:29ff:fe02:93cf  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:02:93:cf  txqueuelen 1000  (Ethernet)
        RX packets 349  bytes 38259 (37.3 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 358  bytes 38867 (37.9 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

Şimdi IP adresini olması gerektiği gibi statik olarak verelim. 

Aynı dosyayı aşağıdaki şekilde yeniden düzenliyorum. IP adresi `172.16.238.50` olacak.

```
[ipv4]
method=manual
address1=172.16.238.50/24,172.16.238.2
dns=8.8.8.8;1.1.1.1;
```

Mantığı şöyledir ki; `address1` den sonra istediğimiz IP adresini veriyoruz, sonra `subnet mask` değerini de arkasından ekliyoruz. Daha sonra bir virgülle boşluksuz bir şekilde `default gateway`  veriyoruz. 

Hemen alt satırda ise DNS bilgilerini noktalı virgülle (;) art arda verebiliyoruz. Satır sonunda ise yine noktalı virgülle (;) bitiriyoruz.

Dosyayı kaydedip servisi restart ediyorum.

```
systemctl restart NetworkManager
```

Servisi restart ettikten sonra `ifconfig`  komutu ile IP adresini kontrol ettiğimizde hala eski IP olarak görünüyor olabilir. 

`ip a` veya `nmcli` komutlarıyla baktımızda ise eski IP'yi de yeni verdiğimiz IP'yi de göreceğiz. 

```
fedora@fedora:~$ ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host noprefixroute 
       valid_lft forever preferred_lft forever
2: ens160: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
    link/ether 00:0c:29:02:93:cf brd ff:ff:ff:ff:ff:ff
    altname enp3s0
    inet 172.16.238.132/24 brd 172.16.238.255 scope global dynamic noprefixroute ens160
       valid_lft 813sec preferred_lft 813sec
    inet 172.16.238.50/24 brd 172.16.238.255 scope global secondary noprefixroute ens160
       valid_lft forever preferred_lft forever
    inet6 fe80::20c:29ff:fe02:93cf/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever

```

Fakat IP değişmiş olacaktır. 

Bunu verdiğimiz IP'yi ping'leyerek teyit edebilirsiniz.

Makineyi reboot ettikten sonra bu da düzelecektir.

```
fedora@fedora:~$ ifconfig 
ens160: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.16.238.50  netmask 255.255.255.0  broadcast 172.16.238.255
        inet6 fe80::20c:29ff:fe02:93cf  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:02:93:cf  txqueuelen 1000  (Ethernet)
        RX packets 205  bytes 22978 (22.4 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 218  bytes 24572 (23.9 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

```

Teşekkürler,

İyi Çalışmalar.