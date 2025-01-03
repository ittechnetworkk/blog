+++
title = "Nanopi R2S Ipfire Kurulumu"
date = "2025-01-03T23:00:44+01:00"
tags = ["ipfire", "firewall", "iot", "nanopi"]
categories = ["IoT", "Firewall"]
author = "Soner Sahin"
+++

Merhaba, bu yazıda, NanoPi R2S cihazıma IPFire kurulumunu anlatacağım.

Kullandığım ekipmanlar:

1. NanoPi R2S,
2. MicroSD Kart,
3. Kart Okuyucu,
4. Type C Güç Kablosu,
5. USB to Serial Kablo,
6. Ethernet Kablosu,
7. Terminal yazılımı (Putty or minicom),
8. Balena Etcher.

İlk olarak [IPFire imaj dosyasını](https://cdimage.debian.org/mirror/ipfire.org/releases/ipfire-2.x/2.27-core167/ipfire-2.27.2gb-ext4.aarch64-full-core167.img.xz) indiriyorum ve Balena Etcher aracıyla SD Kart'a yazdırıyorum.

![ipfire](/images/NanoPiR2SIPFireKurulumu/1.png)

Bu işlem bittikten sonra SD Kart'ı cihaza takıyorum.

Serial Kablo'yu da aşağıdaki şekilde cihaza bağlıyorum.
Siyah Kablo » G
Beyaz Kablo » TX
Turkuaz Kablo » RX

![ipfire](/images/NanoPiR2SIPFireKurulumu/100.jpg)

Terminal programı olarak ben minicom kullanacağım, aynı zamansa screen'de kullanabilirsiniz. 

Windows kullanıyorsanız Putty de işinizi görecektir. Daha fazla teknik bilgi için [Web Sitesi](https://www.ipfire.org/docs/installation/serial)'ni ziyaret edebilirsiniz.

Eğer IPFire'nin son versiyonu çalışmazsa bir önceki versiyonlarını da deneyebilirsiniz.


İlk olarak cihaz hangi port ismiyle geldiğine bakıyorum.

```
dmesg |grep ttyUSB
```

Bende "ttyUSB0" olarak geldi. Şimdi Minicom'u buna göre ayarlıyorum. 

```
sudo minicom -s
```

![ipfire](/images/NanoPiR2SIPFireKurulumu/101.png)

![ipfire](/images/NanoPiR2SIPFireKurulumu/102.png)

![ipfire](/images/NanoPiR2SIPFireKurulumu/103.png)

Bu işlemler tamamlandıktan sonra artık Minicom'u çalıştırıyorum.

```
sudo minicom
```

Cihaza güç kablosunu takıyorum. Ekran birkaç saniye geç gelebilir.

Kurulum adımları aşağıdaki gibi devam edecektir.

![ipfire](/images/NanoPiR2SIPFireKurulumu/10.png)

![ipfire](/images/NanoPiR2SIPFireKurulumu/11.png)

![ipfire](/images/NanoPiR2SIPFireKurulumu/12.png)

![ipfire](/images/NanoPiR2SIPFireKurulumu/13.png)

![ipfire](/images/NanoPiR2SIPFireKurulumu/14.png)

![ipfire](/images/NanoPiR2SIPFireKurulumu/15.png)

![ipfire](/images/NanoPiR2SIPFireKurulumu/16.png)

![ipfire](/images/NanoPiR2SIPFireKurulumu/17.png)

![ipfire](/images/NanoPiR2SIPFireKurulumu/18.png)

![ipfire](/images/NanoPiR2SIPFireKurulumu/19.png)

![ipfire](/images/NanoPiR2SIPFireKurulumu/20.png)

![ipfire](/images/NanoPiR2SIPFireKurulumu/21.png)

Aşağıdaki kısımda RED olan yani WAN bacağının IP adresini Statik olarak kendi yapınıza göre vermelisiniz.


![ipfire](/images/NanoPiR2SIPFireKurulumu/22.png)

![ipfire](/images/NanoPiR2SIPFireKurulumu/24.png)

![ipfire](/images/NanoPiR2SIPFireKurulumu/26.png)

![ipfire](/images/NanoPiR2SIPFireKurulumu/27.png)

![ipfire](/images/NanoPiR2SIPFireKurulumu/28.png)

![ipfire](/images/NanoPiR2SIPFireKurulumu/29.png)

![ipfire](/images/NanoPiR2SIPFireKurulumu/30.png)

![ipfire](/images/NanoPiR2SIPFireKurulumu/31.png)

IPFire sağlıklı bir şekilde kurulmuş oldu.

Web arayüzüne erişmek için, cihazın LAN portundan bir ethernet kablosu bilgisayarıma takıyorum ve aynı subnetten bir IP adresi veriyorum.

Artık cihazın LAN IP adresinin 444 portundan gidecek olursam web arayüzüne erişebilirim.

Yani "https://192.168.1.2:444" adresinde Web arayüzü gelecektir.

![ipfire](/images/NanoPiR2SIPFireKurulumu/32.png)

![ipfire](/images/NanoPiR2SIPFireKurulumu/33.png)

![ipfire](/images/NanoPiR2SIPFireKurulumu/34.png)

Artık istediğiniz gibi kullanabilirsiniz.

Teşekkürler,

İyi Çalışmalar.

























