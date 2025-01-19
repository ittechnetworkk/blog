+++
title = "Debian Server IP Konfigürasyonu"
date = "2025-01-19T23:56:33+01:00"
tags = ["Linux", "IP", "Debian"]
categories = ["Linux"]
author = "Soner Sahin"
+++

Selamlar, bu yazımda Debian Server'a nasıl statik veya dinamik IP tanımlanacağını göstereceğim.

Her Linux dağıtımında statik IP'ler aynı şekilde tanımlanmayabilir. 

Linux sistemlerde her şey bir dosyadan okunduğu için bunun için de bir ilgili bir dosya vardır. 

Debian'da bu dosya şuradadır: 

- /etc/network/interfaces

Şimdi bu dosyayı editleyelim.

Dosyanın ilk hali şu şekildedir:

```
# This file describes the network interfaces available on your system
# and how to activate them. For more information, see interfaces(5).

source /etc/network/interfaces.d/*

# The loopback network interface
auto lo
iface lo inet loopback
```

Bazı parametreler sisteminize bağlı olarak değişiklik gösterebilir.

İlk olarak DHCP'den IP almasını sağlayalım.

Bunun için aşağıdaki satırı ekliyorum:

Benim kullandığım interface adı `ens33`. Bir yorum bırakarak aşağıdaki gibi tanımı giriyorum.

```
#ens33
iface ens33 inet dhcp
```

Dosyayı kaydedip servisi restart edelim;

```
systemctl restart NetworkManager
systemctl restart networking.service
```

Şimdi IP adresine bakacak olursak DHCP'den bir IP aldığını görebiliriz.

Benim Lab ortamımda `172.16.238.133` IP'sini aldı.

```
debian@debian:~$ sudo ifconfig
ens33: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.16.238.133  netmask 255.255.255.0  broadcast 172.16.238.255
        inet6 fe80::20c:29ff:fe1a:dbdf  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:1a:db:df  txqueuelen 1000  (Ethernet)
        RX packets 2301  bytes 878954 (858.3 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1734  bytes 201907 (197.1 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 23  bytes 2467 (2.4 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 23  bytes 2467 (2.4 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

Şimdi IP adresini olması gerektiği gibi statik olarak verelim. 

Aynı dosyayı aşağıdaki şekilde yeniden düzenliyorum. IP adresi `172.16.238.110` olacak.

```
#ens33
auto ens33
iface ens33 inet static
        address 172.16.238.110
        netmask 255.255.255.0
        gateway 172.16.238.2
        dns-nameservers 8.8.8.8
        dns-nameservers 1.1.1.1
```

Dosyayı kaydedip servisi restart ediyorum.

```
systemctl restart NetworkManager
systemctl restart networking.service
```

Servisi restart ettikten sonra `ifconfig`  komutu ile IP adresini kontrol ettiğimizde hala eski IP olarak görünüyor olabilir. Makine restart edildikten sonra değişecektir.

```
debian@debian:~$ sudo ifconfig
ens33: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.16.238.110  netmask 255.255.255.0  broadcast 172.16.238.255
        inet6 fe80::20c:29ff:fe1a:dbdf  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:1a:db:df  txqueuelen 1000  (Ethernet)
        RX packets 153  bytes 14054 (13.7 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 159  bytes 22224 (21.7 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 14  bytes 1862 (1.8 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 14  bytes 1862 (1.8 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

```


Teşekkürler,

İyi Çalışmalar.