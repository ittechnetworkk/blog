+++
date = '2024-07-15T22:57:40+01:00'
title = 'Raspberry Pi Syslog Server'
tags = ["syslog", "Raspberry Pi", "logging", "cisco"]
categories = ["Network", "IoT", "Linux", "Raspberry Pi"]
author = "Soner Sahin"
+++
Merhaba, bu yazımda bi Raspberry Pi Zero'ya Syslog server rolü verip, bir Cisco Switch'e bu Syslog server konfigürasyonunu yapacağım.

Bu Lab için kullanacağım donanım ve yazılımlar:
- Raspberry Pi Zero 2W,
- Cisco 2960 Switch,
- SD Cart,
- Kart Reader,
- Ethernet Kablosu,
- MicroUSB Power Cable,
- Switch Power Cable,
- ImagerPi.

İlk olarak ImagerPi kullanarak SD Kart'a Ubuntu işletim sistemini kuruyorum.

![syslog](/images/RaspberryPiSyslogServer/1.png)

![syslog](/images/RaspberryPiSyslogServer/2.png)

SD Kart'ı Raspberry Pi'a takıp, modemin yakınında güç kablosunu takıp cihazı açıyorum.

Raspberry Pi'nin hangi IP adresini aldığını öğrenmek için:
```
nmap -sn 192.168.1.1/24
```

Benim cihazım 192.168.1.122 IP'sine sahip.

Bu IP adresine SSH ile bağlanıyorum.
```
ssh pi@192.168.1.122
```

Cihaza ilk olarak güncellemelerini yapıyorum. Cihazın modemin yakınında olması avantaj sağlayacaktır.
```
sudo apt update -y && sudo apt upgrade -y
```

Syslog kurulumu:
```
sudo apt install rsyslog -y
```

Syslog Konfigürasyonu:
```
sudo nano /etc/rsyslog.conf
```

Aşağıdaki "module ve input" ile başlayan kısımların başındaki "#" işaretini aşağıda olduğu gibi kadırıyorum ve kaydediyorum.

```
# provides UDP syslog reception
module(load="imudp")
input(type="imudp" port="514")

# provides TCP syslog reception
module(load="imtcp")
input(type="imtcp" port="514")
```

Servisi restart ediyorum.
```
sudo systemctl restart rsyslog
```

Server kısmı bitti. 

Şimdi de Cisco Switch'de Syslog konfigürasyonu yapalım.

Switch'de ethernet kablosunu ve güç kablosunu takıp açıyorum.

Console Kablosu ile cihaza bağlanıyorum.

Switch'in Management IP adresi de 192.168.1.226'dır.

Syslog konfigürasyonu:
```
SW1>enable
SW1#configure terminal
SW1(config)#logging on                   #logging enable etme
SW1(config)#logging host 192.168.1.122   #syslog server IP
SW1(config)#logging trap 7               #debugging ve altındaki tüm loglar
SW1(config)#end
SW1#sh logging                           #kontrol
```

- emergencies = 0
- alerts = 1
- critical = 2
- errors = 3
- warnings = 4
- notifications = 5
- informational **(default level)** = 6
- debugging = 7

Şimdi Switch üzerinde log üretecek birkaç değişiklik yapıyorum.

Syslog Server'dan logların düştüğünü kontrol ediyorum.

```
pi@pi:~$ cat /var/log/syslog | grep 192.168.1.226
2024-09-15T20:01:22.134205+02:00 192.168.1.226 16: *Mar  1 00:21:27.273: %LINEPROTO-5-UPDOWN: Line protocol on Interface Vlan1, changed state to up
2024-09-15T20:01:46.624393+02:00 192.168.1.226 17: *Mar  1 00:21:52.288: %SYS-5-CONFIG_I: Configured from console by console
2024-09-15T20:06:38.458775+02:00 192.168.1.226 18: *Mar  1 00:26:44.572: %LINEPROTO-5-UPDOWN: Line protocol on Interface Vlan13, changed state to down
2024-09-15T20:06:54.744851+02:00 192.168.1.226 19: *Mar  1 00:27:00.788: %LINEPROTO-5-UPDOWN: Line protocol on Interface Vlan12, changed state to down
2024-09-15T20:09:31.819562+02:00 192.168.1.226 20: *Mar  1 00:29:37.722: %SYS-5-CONFIG_I: Configured from console by console
```

Loglar da sağlıklı çalışıyor.

Teşekkürler,

İyi Çalışmalar.
