+++
date = '2024-05-12T22:57:40+01:00'
title = 'Adguard Kurulumu (NanoPi R2S)'
tags = ["dietpi", "nanopi"]
author = "Soner Sahin"
+++

Merhaba, bu yazımda önceden aldığım fakat değerlendiremediğim NanoPi R2S cihazına Adguard Home kurmayı anlatacağım.

Bazı özellikleri şöyledir:
- Rockchip RK3328,
- 1GB DDR4 RAM,
- MicroSD x1 for external storage up to 128GB,
-  2x Gigabit Ethernet,
- USB 2.0 Host x1: USB Type A,
- USB-C x1:
- SYS LED(Red) x1,  WAN LED(Green) x1,  LAN LED(Green) x1,
- Reset buton

Metal kasa içerisine konmuş küçük ama merak uyandırıcı bir cihaz.

Peki Adguard Home nedir?
[Adguard Home](https://adguard.com/tr/adguard-home/overview.html) bilenler için Pi-Hole benzeri fakat daha gelişmiş özellikleri olan bir yazılımdır. 
Bazı özellikleri aşağıdaki gibidir:

| Feature                                                                 | AdGuard Home | Pi-Hole                                                 |
| ----------------------------------------------------------------------- | ------------ | ------------------------------------------------------- |
| Blocking ads and trackers                                               | ✅            | ✅                                                       |
| Customizing blocklists                                                  | ✅            | ✅                                                       |
| Built-in DHCP server                                                    | ✅            | ✅                                                       |
| HTTPS for the Admin interface                                           | ✅            | Kind of, but you'll need to manually configure lighttpd |
| Encrypted DNS upstream servers (DNS-over-HTTPS, DNS-over-TLS, DNSCrypt) | ✅            | ❌ (requires additional software)                        |
| Cross-platform                                                          | ✅            | ❌ (not natively, only via Docker)                       |
| Running as a DNS-over-HTTPS or DNS-over-TLS server                      | ✅            | ❌ (requires additional software)                        |
| Blocking phishing and malware domains                                   | ✅            | ❌ (requires non-default blocklists)                     |
| Parental control (blocking adult domains)                               | ✅            | ❌ (requires non-default blocklists)                     |
| Force Safe search on search engines                                     | ✅            | ❌                                                       |
| Per-client (device) configuration                                       | ✅            | ✅                                                       |
| Access settings (choose who can use AGH DNS)                            | ✅            | ❌                                                       |
| Running without root privileges                                         | ✅            | ❌                                                       |
| ----------------------------------------------------------------------- | ------------ | ------------------------------------------------------- |


Adguard Home'u herhangi bir işletim sisteminden de ayağa kaldırabilir veya aynı zamanda [Docker container](https://hub.docker.com/r/adguard/adguardhome) olarak da kurup kullanabilirsiniz. 

Öncelikle cihaza bir işletim sistemi kurmamız gerekiyor. NanoPi R2S için isterseniz FrindlyWRT veya DietPi işletim sistemlerinden birini kurabilirsiniz.

Ben DietPi işletim sistemi üzerine kuracağım. DietPi birçok teknolojiyi destekleyen hafif bir Linux dağıtımıdır.

İhtiyacımız olan donanım ve yazılımlar:
- NanoPi R2S,
- Kart Okuyucu,
- SD Kart,
- USB to Type C Güç Kablosu,
- Ethernet Kablosu,
- [DietPi Kurulum Dosyası](https://dietpi.com/downloads/images/DietPi_NanoPiR2S-ARMv8-Bookworm.img.xz),
- Balena Etcher,
- Putty.

![adguard](/images/AdguardKurulumu/donanımlar.jpg)



Öncelikle DietPi kurulum dosyasını [Web Sitesi](https://dietpi.com/)'nden indiriyoruz. 

İndirilen kurulum dosyası .xz uzantılı gelecektir. Bu dosyayı ilk olarak açmamız gerekecektir. Bunun için Linux'da xz aracını Windows'da ise 7zip aracını kullanabilirsiniz.
Ben Ubuntu kullanıyorum bu yüzden xz aracı ile indirilen dosyayı aşağıdaki komutla çıkarıyorum.

![adguard](/images/AdguardKurulumu/4.png)


Artık .img uzantılı bir imaj dosyamız oldu. 

![adguard](/images/AdguardKurulumu/5.png)



Sırada bunu SD Kart'a yazdırmamız gerekiyor.

İmajı SD Kart'a Balena Etcher yazılımını kullanarak yazdırıyorum.

![adguard](/images/AdguardKurulumu/2.png)

![adguard](/images/AdguardKurulumu/3.png)


Kurulum bittikten sonra cihazın IP almasını sağlamak için boot etmeden önce birinci yol olarak wifi bilgilerimizi ilgili dosyada belirtmemiz gerekecek.

İlk olarak;
/boot/dietpi.txt
dosyasında,
`AUTO_SETUP_NET_WIFI_ENABLED=0` değerini 1 olarak değiştiriyoruz.

![adguard](/images/AdguardKurulumu/6.png)

ikinci olarak;
/boot/dietpi-wifi.txt 
dosyasında,
```aWIFI_SSID[0]``` kısmına Wifi adınızı,
```aWIFI_KEY[0]``` kısmına Wifi parolanızı giriniz.

![adguard](/images/AdguardKurulumu/7.png)


Daha sonra kaydedip SD Kart'ı cihaza takıp boot edebilirsiniz. Daha fazla teknik bilgi için kendi [dökümanına](https://dietpi.com/docs/install/) göz atabilirsiniz.

Ben daha kolay olan ikinci yolu kullanacağım.
Wifi ayarlarıyla oynamadan direk modemden bir ethernet kablosu çekip cihazın LAN portuna takıyorum ve cihaza güç veriyorum.

![adguard](/images/AdguardKurulumu/8.jpg)


DietPi'a default olarak [Dropbear SSH](https://dietpi.com/docs/software/ssh/#dropbear) sunucusu kurulu gelir ve bu sayede cihaza erişilebilir.

Cihaza bağlanmak için [Putty](https://www.putty.org/) aracını kullanacağım. Ama daha öncesinde cihazın hangi IP adresini aldığını öğrenmeliyim. bunun için modemin arayüzüne erişip hangi IP'yi aldığına bakabilirsiniz. Bunun yanında Linux kullananlar için "nmap" veya "netdiscover" araçlarını kullanarak da bulabilirsiniz.

nmap:
```
nmap -sn 192.168.0.0/24   (Kendi network adres aralığınıza göre)
```

netdiscover:
```
netdiscover -r 192.168.0.0/24
```


Benim cihazım  192.168.0.119 IP adresine sahip. 

![adguard](/images/AdguardKurulumu/9.png)


Şimdi Putty aracı ile bağlanıyorum.

![adguard](/images/AdguardKurulumu/10.png)


Gelen ekranda default username (root) ve password'ü(dietpi) giriyorum. Yazdığımız password ekranda görünmeyecektir, doğru yazdığımızdan emin olup giriş yapabiliriz. 

![adguard](/images/AdguardKurulumu/11.png)

Ve cihaz açılmış oldu.

![adguard](/images/AdguardKurulumu/12.png)


Cihaz açıldığında default parolasını değiştirmenizi vs isteyecektir. Bu adımlar kolay olduğu için geçeceğim. Cihaza bir statik IP verip, Adguard kurulumuna geçeceğim.

DietPi-Config » Network Options: Adapters » Ethernet

Kısmından kendime uygun bir statik IP adresi tanımlayıp Apply diyerek konfigürasyonu uyguluyorum.

Daha sonra Adguard Home paketini kurmak için,

Search Software:

![adguard](/images/AdguardKurulumu/13.png)

![adguard](/images/AdguardKurulumu/14.png)

![adguard](/images/AdguardKurulumu/15.png)

paketini seçip, anasayfada bulunan install sekmesine tıklıyoruz.

![adguard](/images/AdguardKurulumu/16.png)

Sonrasında gelen seçeneği de OK diyerek geçiyorum.

![adguard](/images/AdguardKurulumu/17.png)

Ve kurulum başlıyor. Kurulum bittikten sonra bir anket ekranı geliyor. Cancel diyerek kapatabiliriz.

![adguard](/images/AdguardKurulumu/18.png)

Ve artık Adguard Home kurulmuş oldu. 
Ek olarak aynı zamanda desteklenen diğer paketleri de [Web Sitesi](https://dietpi.com/docs/software/)'nden veya "Browse Software" kısmından görebilirsiniz.

Geri dönelim.
Tarayıcımızdan, 
NanoPi IP adresinin 8083 portuna gidersek Adguard arayüzüne erişebiliriz.
Benim için;
```
192.168.0.105:8083
```

![adguard](/images/AdguardKurulumu/19.png)

Username: admin
Password: "NanoPi için belirlediğimiz password"

![adguard](/images/AdguardKurulumu/20.png)

Veee Adguard Home arayüzü de karşımızda:

![adguard](/images/AdguardKurulumu/21.png)

Artık istediğiniz gibi özelleştirebilirsiniz.

Teşekkürler,

İyi Çalışmalar.


