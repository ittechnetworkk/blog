+++
title = "Airpods in linux"
date = "2025-08-31T03:58:55+02:00"
tags = ["airpods", "linux"]
categories = ["Linux"]
author = "Soner Sahin"
image = "/images/airpodsinlinux/cover.png"
+++ 


Selamlar! Bu yazıda AirPods'u Linux'ta nasıl kullanabileceğimizden kısaca bahsedeceğim.

`/etc/bluetooth/main.conf` dosyasına aşağıdaki satırı eklemeniz veya varsa aşağıdaki şekilde düzeltmeniz işi çözecektir:

```bash
ControllerMode = bredr
```

Daha sonra Bluetooth ile tekrar bir tarama yaparsanız, Linux cihazınız AirPods'u görecektir.

**Not:** Değişikliklerin etkili olması için Bluetooth servisini yeniden başlatmanız gerekebilir:

```bash
sudo systemctl restart bluetooth
```

Teşekkürler,

İyi çalışmalar.