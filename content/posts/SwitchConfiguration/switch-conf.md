+++
date = '2024-06-26T17:53:48+01:00'
title = 'Temel Switch Konfigürasyonu'
tags = ["Cisco", "Switch"]
categories = ["Network"]
author = "Soner Sahin"
image = "/images/temel-switch/cover.jpg"
+++

Merhaba, bu yazıda Cisco bir Switch'in temel bir konfigürasyonunu göstereceğim. 

Tabi bu konfigürasyonları temel düzelde uygulayacağım, daha kapsamlı konfigürasyon network yapılarına göre, kullanılan teknolojilere göre değişiklik gösterecektir.

Uygulayacağım konfigürasyonları sırasıyla aşağıdaki gibi olacaktır:

1. Hostname,
2. Zaman Konfigürasyonu,
3. Yanlış Girilen Parola Politikası,
4. Enable Password,
5. Banner motd,
6. Kullanıcı Oluşturma,
7. Console Erişimi,
8. SSH Konfigürasyonu,
9. Default Gateway, 
10. Disable Ports,
11. Konfigürasyonları Kaydetme,
12. Kontrol.

Başlayalım.

Ben konfigürasyonları, Cisco Catalyst 2960 Serisi bir Switch üzerinde uygulayacağım.

Console Kablosu  ve Switch görüntü itibariyle aşağıdaki gibidir. 

![switch](/images/switch-configuration/1.jpg)

![cable](/images/switch-configuration/2.jpg)

Console kabloları birden fazla çeşittir. 
Örneğin; 
RS232 Serial to RJ45,  
USB to RJ45,
USB Mini-B to USB (Yeni cihazlar için)

Bendeki modeli USB to RJ45 olan modelidir. 

RS232 Serial to RJ45 Console Kablosu için aşağıdaki gibi bir dönüştürücüye ihtiyaç olacaktır.

![converter](/images/switch-configuration/3.jpg)


İlk olarak Console Kablosunu bir ucunu Switch'in Console portuna, diğer ucunu da bilgisayarıma takıyorum. 

Console bağlantısını da yaptıktan sonra cihaza güç veriyorum.

Cihaz açıldığında ilk olarak hangi port ismiyle geldiğini öğrenmemiz gerekiyor.

**Windows için;**
Device Manager'i açıp, Ports kısmından hangi COM portunda olduğunu görebilirsiniz. Aşağıdaki örnekte COM4 olduğunu görebiliriz.

![COM](/images/switch-configuration/5.png)

Linux için;

![linux](/images/switch-configuration/4.png)

 ```
 sudo dmesg | grep ttyUSB
 sudo dmesg | grep ttyS
```
 
Komutuyla bulabiliriz.
 
Ben Linux kullanıyorum, bu sebeple benim için yukarıdaki görselde görüldüğü gibi ilgili port ttyUSB0 portudur.

Şimdi [Putty](https://www.putty.org/) terminal programıyla aşağıdaki şekilde cihaza bağlanıyorum. Dilediğiniz terminal aracını da kullanabilirsiniz.

![connect](/images/switch-configuration/6.png)

![connected](/images/switch-configuration/7.png)

Cihazın CLI'ını almış olduk. Şimdi sırasıyla konfigürasyonları yapmaya başlayalım.

1. **Hostname:**
Cihaza Hostname verme işlemidir.

```
Switch>enable
Switch#configure terminal
Switch(config)#hostname SW5_FLOOR5
SW5_FLOOR5(config)#exit
```

2. **Zaman Konfigürasyonu:**
Saat kısmını burada manuel olarak set edeceğim. Kendi yapınıza göre bir NTP Server'dan da aldırabilirsiniz. Time bilgisi kritik öneme sahiptir.

```
SW5_FLOOR5#clock set 22:00:00 22 Jun 2024    
SW5_FLOOR5#show clock
22:00:08.740 UTC Sat Jun 22 2024
```

3. **Yanlış Girilen Parola Politikası:**
Bu konfigürasyondaki amacım belirli bir süre içinde birçok yanlış parola girilmesi durumunda kullanıcıyı belirli bir süre bloklamak.

Aşağıdaki örnekte ise, 30 saniye içerisinde 2 kez parola yanlış girilmesi halinde, kullanıcıyı 120 saniye blokla.

```
SW5_FLOOR5#configure terminal
SW5_FLOOR5(config)#login block-for 120 attempts 2 within 30
```

4. **Enable Password:**
Cihazın Priviledge Modu'na geçebilmek için parola girilmesi gerektiğini belirler.

```
SW5_FLOOR5(config)#enable password Cisco123
SW5_FLOOR5(config)#enable secret netacad123!!!  #enable secret geçerli olacaktır.
SW5_FLOOR5(config)#service password-encryption
```

5. **Banner motd:**
Banner motd, kullanıcıların cihazla ilk bağlantı kurduklarında gördükleri mesajdır. 

```
SW5_FLOOR5(config)#banner motd # !!!!! SADECE YETKILI GIREBILIR !!!!! #
```

6. **Kullanıcı Oluşturma:**
Oluşturulan kullanıcı ile cihaza erişim sağlanacaktır. Buradaki besiktas kullanıcısının parolası "suleymanseba123!!!"dır ve en yüksek yetki seviyesine sahiptir(15).

```
SW5_FLOOR5(config)#username besiktas privilege 15 secret suleymanseba123!!!
```

7. **Console Erişimi:**
Konsol bağlantısını kontrol altına almak için yapılan konfigürasyondur. Konsol bağlantısı yapabilmek için cihazın Local Database'indeki kullanıcı kullanılacak(besiktas).

```
SW5_FLOOR5(config)#line console 0
SW5_FLOOR5(config-line)#login local              #kullanıcı local kimlik doğrulaması sağlar.
SW5_FLOOR5(config-line)#exec-timeout 10          #kullanıcı 10dk işlem yapmazsa oturumu düşür.
SW5_FLOOR5(config-line)#exit
```

8. **SSH Konfigürasyonu:**
Cihaza uzaktan bağlantı yapabilmek için kullanılan SSH Protokolü konfigürasyonudur.

```
SW5_FLOOR5(config)#ip domain-name karakartal.com
SW5_FLOOR5(config)#crypto key generate rsa general-keys modulus 1024
SW5_FLOOR5(config)#ip ssh version 2
SW5_FLOOR5(config)#line vty 0 4
SW5_FLOOR5(config-line)#transport input ssh
SW5_FLOOR5(config-line)#login local
SW5_FLOOR5(config-line)#exit
SW5_FLOOR5(config)#interface vlan 1
SW5_FLOOR5(config-if)#ip address 192.168.0.50 255.255.255.0
SW5_FLOOR5(config-if)#no sh
SW5_FLOOR5(config-if)#exit
```

9. **Default Gateway:**
Cihazın Default Gateway'ini göstermek için yapılan konfigürasyondur.

```
SW5_FLOOR5(config)#ip default-gateway 192.168.0.1
```

10. **Disable Ports:**
Kullanılmayan portların kapatılması için yapılan konfigürasyondur.

```
SW5_FLOOR5(config)#interface range FastEthernet 0/5-8
SW5_FLOOR5(config-if-range)#shutdown
SW5_FLOOR5(config-if-range)#end
```

11. **Konfigürasyonları Kaydetme:**
Konfigürasyonların kalıcı hafızaya alınmasını sağlamak için yapılan konfigürasyondur.

```
SW5_FLOOR5#copy running-config startup-config
```

12. **Kontrol:**
Yapılan konfigürasyonları kontrol etme.

```
SW5_FLOOR5#show running-config
```

Yapılan konfigürasyonlardan emin olduktan sonra bu konfigürasyon dosyasını bir USB Belleğe kopyalayıp başka Switchlere de uygulayabiliriz. 

Bunun için, USB Belleği öncelikle FAT dosya formatına dönüştürmeliyiz.

Daha sonra USB Belleği Switch'e takıp aşağıdaki komutla konfigürasyon dosyasının kopyasını alıyoruz.

```
SW5_FLOOR5#dir nvram:/                              #USB bellek kontrol
SW5_FLOOR5#copy startup-config usbflash0:config
```

Daha sonra USB belleği diğer Switch'e takıp konfigürasyon dosyasını aktarıyoruz.

```
Switch#copy usbflash0:/config running-config
Switch#show running-config
```

Teşekkürler,

İyi Çalışmalar.