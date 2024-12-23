+++
date = '2024-11-07T22:57:40+01:00'
title = 'Ubuntu 22.04 DHCP Server Konfigürasyonu'
tags = ["linux" "ubuntu", "dhcp"]
author = "Soner Sahin"
+++

Merhabalar bu yazımda, Ubuntu-22.04 Server'a DHCP rolü kurup konfigürasyonunu yapacağım.

Ubuntu'ya DHCP rolü vermeden önce, Server'ın IP adresini statik olarak ayarlıyorum.

Statik IP adresi tanımlamak için "/etc/netplan/00-installer-config.yaml" dosyasını düzenliyorum.

```
network:
  version: 2
  renderer: networkd
  ethernets:
    ens33:
      addresses:
        - 192.168.1.50/24
      nameservers:
        addresses: [1.1.1.1, 8.8.8.8]
      routes:
        - to: default
          via: 192.168.1.1
```

Değişiklikleri geçerli kılmak için:
```
sudo netplan apply
```

Grafik arayüzü ile yapılandırmak için "nmtui" aracını kullanabilirsiniz.

DHCP Server Rolü Kurulumu:

```
sudo apt install isc-dhcp-server
```

DHCP rolü yüklendikten sonra, konfigürasyon dosyası "/etc/dhcp/dhcpd.conf"dur.

Şimdi bunu kendi ağımıza göre konfigüre edelim.

```
sudo nano /etc/dhcp/dhcpd.conf
```

Bu dosya yorum satırlarıyla birlikte biraz uzun olabilir, fakat neyin nasıl yapılandırılması gerektiğini güzelce açıklar.

Ben dosyanın içindekileri tamamen silip tekrardan sade bir şekilde yazacağım.

```
authoritative;                                          #Yetkili dhcp olduğunu bildirir.

default-lease-time 600;                                 #10 dk
max-lease-time 7200;                                    #120 df

subnet 192.168.1.0 netmask 255.255.255.0 {              #subnetimiz
 range 192.168.1.150 192.168.1.200;                     #dağıtılacak IP aralığı
 option routers 192.168.1.1;                            #default router
 option domain-name-servers 192.168.1.1, 1.1.1.1;       #DNS
}
```

DHCP Server'ın hizmet vereceği interfaceyi belirtme:
```
sudo nano /etc/default/isc-dhcp-server

INTERFACESv4="ens33"
INTERFACESv6=""
```

Servisi başlatma ve enable etme:
```
sudo systemctl start isc-dhcp-server
sudo systemctl enable isc-dhcp-server
```

Kontrol:
```
sudo systemctl status isc-dhcp-server
```

Firewall varsa ilgili portlara izin verilir:
```
sudo ufw allow 67/udp 
sudo ufw allow 68/udp
```

Logları görmek için:
```
journalctl -u isc-dhcp-server
```


