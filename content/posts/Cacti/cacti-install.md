+++
title = "Cacti Installation"
date = "2025-07-19T14:37:10+02:00"
tags = ["monitoring", "cacti", "linux"]
categories = ["Monitoring"]
author = "Soner Sahin"
image = "/images/Cacti/cover.png"
draft = false
+++ 

Merhabalar, bu yazımda Cacti Monitoring yazılımını Rasperry pi Zero'ya kurulumunu göstereceğim.

[Cacti](https://github.com/Cacti/cacti), açık kaynak kodlu bir network monitoring yazılımıdır. 

Ben Raspberry Pi Zero'ya kuracağım,

Başlayalım.

Kullandığım donanım ve yazılımlar:

- Raspberry Pi Zero 2W,
- SD Kart,
- Kart Okuyucu,
- Raspberry Pi Güç Kablosu,
- ImagerPi

İlk olarak ImagerPi kullanarak SD Kart'a Raspbian işletim sistemini kuruyorum.

![cacti](/images/Cacti/1.png)

Yazdırma işlemi bittikten sonra, SD Kart'ı cihaza takıp güç kablosunu modemin usb portuna bağlıyorum (güncellemeleri ve kurulumları daha hızlı yapabilmek için).

Cihazın IP adresini öğrenmek için modemin arayüzünden veya Linux kullanıyorsanız aşağıdaki komutla bulabilirsiniz.

```
nmap -sn 192.168.1.0/24
```

Benim networkümde cihaz "192.168.1.199" IP adresine sahip.

SSH ile cihaza bağlanıyorum.

```
ssh pi@192.168.1.199
```

İlk olarak güncelleme yapıyorum.

```
sudo apt update -y && sudo apt upgrade -y
```

Güncellemeler tamamlandıktan sonra bir reboot.

```
reboot
```

Şimdi cihaza yeniden bağlanıp Cacti kurulumunu yapalım.

```
sudo apt install cacti -y
```

Bu komut Cacti için gerekli olan tüm paketleri indiriyor olacak. Bu biraz zaman alacaktır.

Kurulum sırasında konfigürasyon için birkaç soru gelecektir aşağıdaki gibi.

![cacti](/images/Cacti/2.png)

Aşağıdaki seçeneğe "Yes" diyerek devam ediyorum.

![cacti](/images/Cacti/3.png)

MySQL için bir parola veriyorum.

![cacti](/images/Cacti/4.png)

![cacti](/images/Cacti/5.png)

Kurulum sırasında cihaz donarsa, uzun süre tepki vermezse bende olduğu gibi, cihazın güç kablosunu çekip bir süre bekleyip geri takın ve tekrar ssh ile bağlanıp aşağıdaki komutu yazarak sorunu çözebilirsiniz.

```
sudo dpkg --configure -a
```

Bu adımdan sonra tarayıcıdan "your-server-ip/cacti" adresine giderek web arayüzüne erişebilirsiniz.

![cacti](/images/Cacti/6.png)

Giriş yapmak için;

- Username: admin
- Password: kurulum sırasında verilen parola

![cacti](/images/Cacti/7.png)


Umarım faydalı olmuştur.

İyi Çalışmalar.















