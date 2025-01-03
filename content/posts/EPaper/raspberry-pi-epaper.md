+++
date = '2024-06-25T22:57:40+01:00'
title = 'Raspberry Pi e-Paper Projesi'
tags = ["raspberrypi"]
categories = ["Linux", "Automation"]
author = "Soner Sahin"
+++

Merhabalar, bu yazıda Raspbery Pi Zero kullanarak anlık olarak Saati, Tarihi, IP bilgisini, Hostname'i ve Download/Upload değerlerini gösteren bir proje yapacağım.

Bu proje için Raspberry Pi Zero'ya uygun 2.13Inch bir e-Paper Display kullanacağım. 

Kullanacağım donanım ve yazılımlar aşağıdaki gibidir.
- Raspberry Pi Zero,
- [2.13 Inch E-Paper Display](https://de.aliexpress.com/item/33005909532.html?spm=a2g0o.order_list.order_list_main.148.42cd5c5fmmGynP&gatewayAdapt=glo2deu),
- [3.7V 1000mah UPS](https://www.amazon.com/-/de/dp/B09JZH16WH/ref=sr_1_3?__mk_de_DE=%C3%85M%C3%85%C5%BD%C3%95%C3%91&sr=8-3),
- SD Card,
- Card Reader,
- [Raspberry Pi Imager](https://www.raspberrypi.com/software/),
- [Ve birkaç vida](https://de.aliexpress.com/item/1005005924842887.html?spm=a2g0o.order_list.order_list_main.183.42cd5c5fmmGynP&gatewayAdapt=glo2deu).

Donanımlar görüntü itibariyle aşağıdaki gibidir:
![raspberrypi](/images/EPaper/hardware.jpg)

İlk olarak Raspberry Pi Imager kullanarak işletim sistemini SD Kart'a yazdıracağım

Kurulum adımları aşağıdaki gibidir.

"Raspberrt Pi Device" kısmında "Raspberry Pi Zero" yu,
"Operating System" kısmında "Raspberry Pi OS (32-bit)" olan seçeneği,
"Storage" kısmında ise SD Kartımı seçerek "NEXT" diyorum.

![raspberrypi](/images/EPaper/1.png)

Bu kısmında "EDIT SETTINGS" diyerek WiFi ayarlarını ve SSH ayarlarını yapmak için devam ediyorum.

![raspberrypi](/images/EPaper/2.png)

"GENERAL" kısmında;
hostname,
username,
password,
WLAN SSID,
WLAN Password,
Wireless LAN country,
Time zone,
Keyboard layout.

Seçeneklerini aşağıdaki gibi kendime göre dolduruyorum.

![raspberrypi](/images/EPaper/3.png)

"SERVICES" kısmında;
"Use password authentication" seçeneğini seçerek "SAVE" ile kaydediyorum.

![raspberrypi](/images/EPaper/4.png)

Daha sonra "YES" diyerek devam ediyorum.

![raspberrypi](/images/EPaper/5.png)

Son olarak doğru SD kartı seçtiğimden emin olduktan sonra "YES" ile kurulumu başlatıyorum.

![raspberrypi](/images/EPaper/6.png)

Ve kurulum işlemi başlıyor.

![raspberrypi](/images/EPaper/7.png)

"CONTINIUE" ile bitiriyorum.

![raspberrypi](/images/EPaper/8.png)

Şimdi Raspberry Pi'a E-Paper ekranı ve UPS'i takalım.

E-Paper gayet basit bir şekilde Raspberry Pi pinlerine oturtulabiliyor.

![raspberrypi](/images/EPaper/9.jpg)

![raspberrypi](/images/EPaper/10.jpg)

UPS için ise küçük vidalardan kullanacağım. UPS de Raspberry Pi'nin alt kısmına konumlanacak.

Bağlantı aşağıdaki gibi olacaktır:

![raspberrypi](/images/EPaper/11.jpg)

![raspberrypi](/images/EPaper/12.jpg)

![raspberrypi](/images/EPaper/13.jpg)


Şimdi sırada cihaza güç vermekte.

UPS'i "ON" konumuna getiriyorum ve Raspberry Pi'ı başlatıyorum.

Raspberry Pi Modemden IP alacağı için ilk olarak hangi IP adresini aldığını bulmamız gerek.
IP adresini öğrenmenin birkaç yolu var:
- Modem arayüzünden,
- Terminalden.

Ben Linux kullanıyorum ve bana daha kolay geldiği için terminalden yapacağım.

Aşağıdaki 2 yöntemle terminalden hangi IP adresini aldığını bulabiliriz.

```
sudo nmap -sn 192.168.0.0/24
```

```
sudo netdiscover -r 192.168.0.0/24
```

Benim networkümde Raspberry Pi "192.168.0.98" IP adresini aldı.

Şimdi terminalden bir SSH bağlantısı yapıyorum. Windows için Putty veya benzeri terminal programları kullanabilirsiniz.

![raspberrypi](/images/EPaper/14.png)

SSH ile cihaza erişim sağladık.

İlk olarak sistemi bir güncelleyelim. Bu işlem biraz zaman alacaktır. Cihazın Modem'e yakın olması süreci hızlandıracaktır.

```
sudo apt update -y && sudo apt upgrade -y
```

Gerekli kütüphane ve bağımlılıkları yüklüyorum.

```
sudo apt-get install python3-pip python3-pil python3-numpy python3-psutil
```

Şimdi e-Paper Display için gerekli olan kütüphaneyi Github'dan klonluyorum. Ve yüklüyorum.

```
git clone https://github.com/waveshare/e-Paper.git 
cd e-Paper/RaspberryPi_JetsonNano/python 
sudo python3 setup.py install
cd ~
```

Daha sonra Raspberry Pi'nin SPI Interface'sini "Enable" ediyorum.

```
sudo raspi-config
```


![raspberrypi](/images/EPaper/15.png)

![raspberrypi](/images/EPaper/16.png)

![raspberrypi](/images/EPaper/17.png)

![raspberrypi](/images/EPaper/18.png)

Şimdi cihazı bir kere Reboot edeceğim.
```
sudo reboot
```

Bu işlemler de bittikten sonra artık kodumuzu çalıştırabiliriz.

Kod aşağıdaki gibidir. Kodu ChatCPT'ye yazdırdım kopyalayıp aynı şekilde kullanabilirsiniz.

Öncelikle bir Python dosyası oluşturuyorum.

```
cd ~
sudo nano project.py
```

```py
import sys
import os
import time
import datetime
import socket
import psutil  # psutil kütüphanesi kullanarak sistem bilgilerini alacağız
from PIL import Image, ImageDraw, ImageFont
from waveshare_epd import epd2in13_V4

def get_ip_address():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip_address = s.getsockname()[0]
        s.close()
        return ip_address
    except OSError:
        return "N/A"

def get_hostname():
    try:
        hostname = socket.gethostname()
        return hostname
    except OSError:
        return "N/A"

def format_bytes(bytes):
    # Byte cinsinden veriyi okunabilir bir formata dönüştüren fonksiyon
    if bytes < 1024:
        return f"{bytes} B"
    elif bytes < 1048576:
        return f"{bytes / 1024:.2f} KB"
    else:
        return f"{bytes / 1048576:.2f} MB"

def draw_centered_text(draw, text, font, y_position, width):
    text_width, text_height = draw.textsize(text, font=font)
    x_position = (width - text_width) // 2
    draw.text((x_position, y_position), text, font=font, fill=0)

def draw_clock(draw, width, height, previous_upload, previous_download):
    now = datetime.datetime.now()
    current_time = now.strftime("%H:%M:%S")
    current_date = now.strftime("%d.%m.%Y")  # Gün.Ay.Yıl formatı (nokta ile ayrılmış)
    hostname = get_hostname()
    ip_address = get_ip_address()
    
    net_io = psutil.net_io_counters()
    upload = net_io.bytes_sent
    download = net_io.bytes_recv
    
    upload_speed = upload - previous_upload
    download_speed = download - previous_download
    
    upload_speed_formatted = format_bytes(upload_speed) + "/s"
    download_speed_formatted = format_bytes(download_speed) + "/s"

    font_time = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 28)
    font_date = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
    font_info = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 13)

    draw.rectangle((0, 0, width, height), fill=255)  # Ekranı temizle

    draw_centered_text(draw, current_time, font_time, 2, width)
    draw_centered_text(draw, current_date, font_date, 30, width)
    draw_centered_text(draw, f"IP: {ip_address}", font_info, 59, width)
    draw_centered_text(draw, f"Hostname: {hostname}", font_info, 73, width)
    draw_centered_text(draw, f"Download: {download_speed_formatted}", font_info, 87, width)
    draw_centered_text(draw, f"Upload: {upload_speed_formatted}", font_info, 101, width)
    
    return upload, download

try:
    epd = epd2in13_V4.EPD()
    epd.init()
    epd.Clear()

    width, height = epd.height, epd.width
    image = Image.new('1', (width, height), 255)  # 255: Beyaz arka plan

    previous_upload = 0
    previous_download = 0

    while True:
        draw = ImageDraw.Draw(image)
        previous_upload, previous_download = draw_clock(draw, width, height, previous_upload, previous_download)
        epd.display(epd.getbuffer(image))
        time.sleep(1)

except IOError as e:
    print(e)

except KeyboardInterrupt:
    print("Ctrl+C")
    epd2in13_V4.epdconfig.module_exit()
    exit()
except Exception as e:
    print(f"Hata: {e}")
    epd2in13_V4.epdconfig.module_exit()
    exit()

```

Kodu kaydetmek için "CTRL + O" tuşlarına bastıktan sonra "Enter"a basarak kaydediyorum.

Çıkmak için "CTRL + X" tuşlarına basıyorum.

Son olarak kodu çalıştırıyorum.

```
python3 project.py
```

Görüntü aşağıdaki gibi olacaktır:

![raspberrypi](/images/EPaper/finish.jpg)

Buraya kadar her şey güzeldi. 

Şimdi de bu kodu bir servis haline getirelim. Yani cihaz her kapanıp açıldığında bu kod çalışsın.

Bunun için bu kodu bir Linux servisi haline getireceğim.

Aşamalar şu şekildedir:

"project.service" adında bir servis dosyası oluşturuyorum.
```
sudo nano /etc/systemd/system/project.service
```

Dosyayı aşağıdaki gibi düzenliyorum.
```
[Unit]
Description=Display System Info on e-Paper
After=multi-user.target

[Service]
ExecStart=/usr/bin/python3 /home/pi/project.py
WorkingDirectory=/home/pi
StandardOutput=inherit
StandardError=inherit
Restart=always
User=pi

[Install]
WantedBy=multi-user.target

```

Son olarak servisi yükleme ve etkinleştirme işlemlerini yapıyorum.

```
sudo systemctl daemon-reload
sudo systemctl enable project.service
sudo systemctl start project.service
```

Artık cihaz kapanıp açılsa bile bu servis otomatik olarak çalışacaktır.

Umarım faydalı bir içerik olmuştur. 

Teşekkürler,

İyi Çalışmalar.