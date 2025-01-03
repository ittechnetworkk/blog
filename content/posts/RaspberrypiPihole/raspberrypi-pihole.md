+++
title = "RaspberryPi Zero'ya Pihole Kurulumu"
date = "2025-05-13T12:22:24+01:00"
tags = ["pihole", "raspberrypi", "iot"]
categories = ["IoT"]
author = "Soner Sahin"
+++

Selamlar, bu yazımda Raspberry Pi Zero 2W cihazına [Pi-Hole](https://pi-hole.net/) kurulumunu anlatmaya çalışacağım.
Pi-hole, dns server, reklam engelleyici, dhcp server olarak çalışabilen [açık kaynak kodlu](https://github.com/pi-hole/pi-hole) bir yazılımdır. Bu yazılımı networkümüzde bir dhcp sunucu, reklam engelleyici olarak kullanabiliriz.
Pi-hole birçok işletim sistemini destekler, aynı zamanda [Docker container](https://hub.docker.com/r/pihole/pihole) olarak da kurup kullanabilirsiniz.

Peki nedir bu Raspberry Pi Zero 2W?
Raspberry Pi Zero 2W, temel olarak küçük bir bilgisayardır. Bu bilgisayar ile birçok [proje](https://hackaday.io/projects?tag=raspberry%20pi%20zero) yapabilirsiniz.
Raspberry Pi Zero 2W'nun bazı özellikleri şöyledir:
- 1Ghz, Single-core İşlemci
- 512MB RAM LPDDR2
- Mini HDMI
- USB On-The-Go Giriş
- Micro USB Güç Girişi
- HAT-uyumlu 40-pin header
- Composite video ve reset headerler
- CSI Kamera Konektörü
- 11b/g/n Wireless LAN
- Bluetooth 4.1
- Bluetooth Low Energy (BLE)

Raspberry Pi Zero W görüntü itibariyle şöyledir:

![pihole](/images/RaspberryPiPihole/1.jpg)

Kullanacağım donanım ve yazılımlar şöyledir:
- Raspberry Pi Zero 2W
- Güç Kablosu,
- SD Kart,
- Kart Okuyucu,
- Raspberry Pi Imager,
- Putty.

İlk olarak cihaza bir işletim sistemi kuracağız. Bu cihaz birçok işletim sistemini destekler fakat ben kendi işletim sistemi olan Rasbian'ı kuracağım.
SD Kart'ı bilgisayarıma taktıktan sonra Raspberry Pi Imager uygulamasını açıyorum. 

Raspberry Pi Device,
Operating System,
Storage 

Seçeneklerini resimdeki gibi seçip ilerliyorum.

![pihole](/images/RaspberryPiPihole/10.png)

Karşımıza gelen ekrandan "EDIT SETTINGS" seçeneğiyle devam ediyorum.

General sekmesinde;
Hostname,
Username,
Password,
Wlan SSID and Password,
Time Zone ve Keyboard Layout.

Seçeneklerini kendime göre dolduruyorum.

![pihole](/images/RaspberryPiPihole/15.png)

Daha sonra "SERVICES" sekmesine gelip SSH'ı Enable ediyorum.

![pihole](/images/RaspberryPiPihole/5.png)

Daha sonra "SAVE" diyerek bu kısmı bitirip gelen seçeneğe de YES diyerek devam ediyorum.

![pihole](/images/RaspberryPiPihole/6.png)

Bir sonraki ekranda SD Karttaki bilgilerin silineceğine dair bir uyarı bildirimi geliyor. Emin olduktan sonra YES diyerek kurulumu başlatıyorum.

![pihole](/images/RaspberryPiPihole/7.png)

Kurulum bittikten sonra gelen bildirimi kapatıp SD Kart'ı Raspberry Pi'a takıyorum.

![pihole](/images/RaspberryPiPihole/8.png)

Güç kablosunu da cihazın ilgili portuna takıp cihazın boot edilmesini sağlıyorum.

![pihole](/images/RaspberryPiPihole/9.jpg)

Cihazın hangi IP'yi aldığını öğrenmek için modemin arayüzünden veya Linux kullanıcıları için "nmap" veya "netdiscover" araçları kullanılabilir.

nmap:
```
nmap -sn 192.168.0.0/24      (Kendi IP Bloğunuza Göre)
```

netdiscover:
```
netdiscover -r 192.168.0.0/24
```

Benim için Raspberry Pi'ın IP adresi: 192.168.0.98

Cihaza bağlanmak için Putty yazılımını kullanıyorum.

![pihole](/images/RaspberryPiPihole/11.png)

Kullanıcı adı ve parolayı girerek erişim sağlıyorum.

![pihole](/images/RaspberryPiPihole/12.png)

Şimdi Pi-hole kurulumu için aşağıdaki Script'i terminale yazınca otomatik olarak yükleme başlamış olacaktır.

```
curl -sSL https://install.pi-hole.net | bash
```

![pihole](/images/RaspberryPiPihole/13.png)

Bir süre paketleri kuracaktır. Daha sonra sırasıyla aşağıdaki adımları izliyorum.

![pihole](/images/RaspberryPiPihole/16.png)

![pihole](/images/RaspberryPiPihole/17.png)

![pihole](/images/RaspberryPiPihole/18.png)

![pihole](/images/RaspberryPiPihole/19.png)

![pihole](/images/RaspberryPiPihole/20.png)

![pihole](/images/RaspberryPiPihole/21.png)

![pihole](/images/RaspberryPiPihole/22.png)

![pihole](/images/RaspberryPiPihole/23.png)

![pihole](/images/RaspberryPiPihole/24.png)

![pihole](/images/RaspberryPiPihole/25.png)

![pihole](/images/RaspberryPiPihole/26.png)

Kurulum bir süre daha devam edecektir ve daha sonra web arayüzüne erişebileceğimiz IP ve Password bilgilerini bize verecektir.

![pihole](/images/RaspberryPiPihole/27.png)

Bize ilgili IP ve Password'ü verdi. 

Eğer parolayı değiştirmek istersek, terminalden:

```
sudo pihole -a -p
```

komutunu girip yeni şifremizi verebiliriz.

Daha sonra da tarayıcıdan ilgili IP adresine gidiyorum.

![pihole](/images/RaspberryPiPihole/28.png)

Parolamızı girerek arayüze erişebiliriz artık.

![pihole](/images/RaspberryPiPihole/29.png)


Artık istediğiniz gibi konfigüre edip kullanabilirsiniz.

Networkünüzde bulunan cihaz veya cihazların DNS adresini Raspberry Pi'ni IP'si yaparsanız reklamlara takılmadan internette gezinti yapabilirsiniz artık.

Teşekkürler,

İyi Çalışmalar.