+++
title = "RaspberryPi Ipfire Kurulumu"
date = "2024-05-19T23:00:44+01:00"
tags = ["ipfire", "firewall", "IoT", "Raspberry Pi"]
categories = ["IoT", "Firewall", "Raspberry Pi"]
author = "Soner Sahin"
+++

Bu yazımda yeni aldığım Raspberry Pi 4 B modeline IPFire kurulumunu anlatacağım.
[IPFire](https://www.ipfire.org/), açık kaynak kodlu Linux tabanlı bir firewall yazılımıdır. IPFire'ı ISO olarak indirip bir sanal makine olarak da kurup inceleyebilirsiniz. Az kaynak tüketir ve işlevseldir. 

[IPFire'ın bazı özellikleri:](https://www.ipfire.org/about)
- Network Security,
- VLAN,
- DHCP,
- NTP,
- Captive Portal,
- Web Proxy,
- VPN,
- DNS,
- IPS,
- QoS,
Ve çok daha fazlası.

Kullandığım Donanım ve Yazılımlar:
1. Raspberry Pi 4 B,
2. Kart Okuyucu,
3. Harici Ethernet Kartı,
4. USB to TypeC Güç Kablosu,
5. Mouse,
6. SD Kart,
7. HDMI to Micro HDMI Dönüştürücü,
8. Klavye,
9. Monitor,
10. HDMI to HDMI,
11. 2 Ethernet kablosu,
12. BalenaEtcher.


![ipfire](/images/RaspberryPiIPFire/17.jpg)




Başlayalım.

Öncelikle IPFire Web Sitesi'nden Raspberry Pi 4 B modeli için olan [kurulum dosyasını](https://downloads.ipfire.org/releases/ipfire-2.x/2.29-core185/ipfire-2.29-core185-aarch64.img.xz) indiriyorum.

İndirdiğim dosyayı BalenaEtcher kullanarak SD Kart'a yazdırıyorum.

![ipfire](/images/RaspberryPiIPFire/15.png)


Bittikten sonra, SD Kart'ın içine girip, 
1. `"uEnv.txt"` dosyasında bulunan  `"SERIAL-CONSOLE=ON"` yazan satırı `"OFF "` olarak değiştiriyorum.
2. `"boot.cmd"` dosyasındaki 99.satırdaki;
`"booti ${kernel_addr_r} ${ramdisk_addr} ${fdt_addr_r};"` kodu,
`"booti ${kernel_addr_r} ${ramdisk_addr} ${fdt_addr};"` ile
ve 
102.satırdaki;  
`"booti ${kernel_addr_r} - ${fdt_addr_r};"` kodu
`"booti ${kernel_addr_r} - ${fdt_addr};"` ile değiştiriyorum.

3. Daha sonra aynı dizinde bir terminal açıp aşağıdaki kodu çalıştırıyorum.
`"mkimage -A arm -T script -O linux -d boot.cmd boot.scr"`

Daha sonra sorun yaşarsanız [teknik dökümanlarından](https://www.ipfire.org/docs/hardware/arm/rpi/four) da yardım alabilirsiniz.

SD Kart'ı Raspberry Pi'a takıyorum. 
Ve daha sonra,
Harici Ethernet Kablosunu,
Klavyeyi,
Maus'u
Monitorden gelen HDMI kablosunu dönüştürücüye, dönüştürücüyü de cihaza bağlıyorum,
Modemden gelen sarı ethernet kablosunu da cihazın WAN olacak portuna takıyorum, yani dahili olan ethernet girişine,
Mor ethernet kablosunun bir ucunu bir pc'ye diğer ucunu RPi'nin harici ethernet kartına takıyorum.
Kuruluma başlamadan önce Ethernet kartlarının MAC Adreslerini bilmekte fayda var. Kurulum sırasında ihtiyacımız olacak.

Son olarak güç kablosunu da takıp cihaza güç veriyorum.

Görüntü şöyle olacaktır:

![ipfire](/images/RaspberryPiIPFire/18.jpg)

![ipfire](/images/RaspberryPiIPFire/19.jpg)

Kurulum adımları sırasıyla aşağıdaki gibi olacaktır.

![ipfire](/images/RaspberryPiIPFire/21.jpg)

Klavye dilini seçiyoruz. Kendinize göre "tr" de yapabilirsiniz.

![ipfire](/images/RaspberryPiIPFire/22.jpg)  

Zaman dilimini kendime göre ayarlıyorum.

![ipfire](/images/RaspberryPiIPFire/23.jpg)

Makinenin Hostname'ini buradan veriyoruz.

![ipfire](/images/RaspberryPiIPFire/24.jpg)

Domainini giriyorum. 

![ipfire](/images/RaspberryPiIPFire/25.jpg)

İlk olarak "root" parolasını iki kere giriyorum. Parola girildiğinde ekranda herhangi birşey görünmeyecektir. Fakat doğru olduğundan emin olduktan sonra ilerleyebilirsiniz.

![ipfire](/images/RaspberryPiIPFire/26.jpg)

İkinci olarak "admin" parolasını da iki kez giriyorum. Admin parolasını daha sonra web arayüzüne erişmek için kullanacağız.

![ipfire](/images/RaspberryPiIPFire/27.jpg)

İlk seçenekle devam ediyorum. Kaç ethernet kartlı bir yapımız oladuğunu belirteceğiz. Default olarak 2 alanmız var fakat yine de göstereceğim.

![ipfire](/images/RaspberryPiIPFire/28.jpg)

Burada "GREEN" ve "RED" olan ilk seçenek bizim network yapımıza uygun olandır. Eğer Raspberry Pi cihazınıza daha fazla ethetnet kartı takarsanız ona göre ayarlama yapabilirsiniz. Bu alanlar "zone" olarak da ifade edilir.

![ipfire](/images/RaspberryPiIPFire/29.jpg)

İkinci seçenekte "GREEN" ve "RED" Zone'larına ilgili NIC kartlarını atayacağız.

![ipfire](/images/RaspberryPiIPFire/30.jpg)

"GREEN" ile devam ediyorum.

![ipfire](/images/RaspberryPiIPFire/31.jpg)

"GREEN" Zone'u için yani bizim LAN tarafımız için harici olan NIC kartını seçiyorum. Ben harici NIC kartımın MAC adresini bildiğim için onu rahatlıkla seçiyorum.

![ipfire](/images/RaspberryPiIPFire/32.jpg)

İkinci olarak "RED" ile devam ediyorum.

![ipfire](/images/RaspberryPiIPFire/33.jpg)

"RED" Zone'u için yani WAN tarafımız için de dahili olan NIC kartını seçiyorum.

![ipfire](/images/RaspberryPiIPFire/34.jpg)

İki Zone'u da ayarladıktan sonra "Done" ile bitiriyorum.

![ipfire](/images/RaspberryPiIPFire/35.jpg)

Son seçenek olarak bu NIC'lere IP adreslerini atamak için devam ediyorum.

![ipfire](/images/RaspberryPiIPFire/36.jpg)

İlk olarak LAN tarafı için "GREEN" ile ilerliyorum.

![ipfire](/images/RaspberryPiIPFire/37.jpg)

Bu uyarıya "OK" diyerek devam edebiliriz.

![ipfire](/images/RaspberryPiIPFire/38.jpg)

Kendi yapıma göre ilgili IP adresini veriyorum.

![ipfire](/images/RaspberryPiIPFire/39.jpg)

İkinci olarak WAN tarafı için "RED" ile devam ediyorum.

![ipfire](/images/RaspberryPiIPFire/40.jpg)

Burada seçeneklerimiz biraz daha zengin. İstersek Statik istersek DHCP veya PPP ile bağlantı sağlayabiliriz. Ben "Static" ile devam edip kendi network yapıma göre bir IP adresi Mask'ı ve Gateway'i verip ilerliyorum.

![ipfire](/images/RaspberryPiIPFire/41.jpg)

İkisini de tamamladıktan sonra "Done" ile bitiriyorum.

![ipfire](/images/RaspberryPiIPFire/42.jpg)

Bütün konfigürasyonları yaptıktan sonra "Done" ile bitiriyorum.

![ipfire](/images/RaspberryPiIPFire/43.jpg)

Bir sonraki seçenekte DHCP servisini kullanmak istediğimizi soruyor. "Enable" edip hangi network aralığında IP dağıtmasını istediğimi belirtip devam ediyorum.

![ipfire](/images/RaspberryPiIPFire/44.jpg)

Ve kurulum tamamlandı. "OK" diyip cihazı Reboot'a gönderiyorum.

![ipfire](/images/RaspberryPiIPFire/45.jpg)

Reboot'dan sonra "root" kullanıcı adını ve belirlediğim parolayla giriş yapıyorum.

![ipfire](/images/RaspberryPiIPFire/46.jpg)

İlk olarak "ifconfig" komutu ile network kartlarını kontrol ediyorum. Bir sıkıntı görünmüyor.

![ipfire](/images/RaspberryPiIPFire/47.jpg)

Bir de PC'nin network konfigürasyonunu kontrol ediyorum. Burada da bir sorun görünmüyor.

![ipfire](/images/RaspberryPiIPFire/53.jpg)

Daha sonra harici ethernet kartına bağladığım bir cihazın tarayıcısından LAN yani "GREEN" olan tarafın https://10.10.10.1:444 IP ve portuna gidiyorum. Defaultta 444 portundan arayüze erişebiliyoruz. 
Riski kabul ederek devam ediyorum.

![ipfire](/images/RaspberryPiIPFire/48.jpg)

İkinci kısımda da riski kabuk ederek devam ediyorum.

![ipfire](/images/RaspberryPiIPFire/49.jpg)

Daha sonra "admin" kullanıcı adı ve kurulumda belirlediğimiz parolayı giriyorum.

![ipfire](/images/RaspberryPiIPFire/50.jpg)

Kullanım sözleşmesini kabul edip "Yes" ile devam ediyorum.

![ipfire](/images/RaspberryPiIPFire/51.jpg)

Ve IPFire artık kurulmuş oldu. Artık konfigüre edip kullanabileceğimiz şahane bir Firewall'ımız var.

![ipfire](/images/RaspberryPiIPFire/52.jpg)

Teşekkürler,

İyi Çalışmalar.