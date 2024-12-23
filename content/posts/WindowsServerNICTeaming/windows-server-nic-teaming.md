+++
date = '2024-10-10T22:57:40+01:00'
title = 'Windows Server NIC Teaming'
tags = ["server", "windows"]
author = "Soner Sahin"
+++

Windows Server'da NIC Teaming, birden fazla ethernet kartının tek bir kart gibi kullanılmasına denir. Örneğin 4 x 1Gb kartlarımız var, bunları NIC Teaming yaparsak 4Gb olarak çalışan bir kart haline gelecektir.

NIC Teaming'in bazı avantajları aşağıdaki gibidir.

- Bant Genişliği,
- Yedeklilik,
- Verimlilik.

NIC Teaming yaparken mutlaka karşılığının olması gerekir yoksa çalışmaz. Yani Windows Server'ın karşısındaki Switch'den de LACP yapılması gerekir.

NIC Teaming yapma adımları aşağıdaki gibidir.

Aşağıdaki görseldeki "NIC Teaming    Disabled" yazan seçeneğe geliyorum.

![Teaming](/images/WindowsNICTeaming/1.png)

Bu ekranda "TASKS" yazan kısımda "New Team" seçeneğiyle yeni bir Team oluşturuyorum.

![Teaming](/images/WindowsNICTeaming/2.png)

Yeni Team'a "TEAMİNG" ismini veriyorum.

Tüm 4 NIC kartını da seçerek "Additional properties" kısmını genişletiyorum. 

Burada "Teaming mode" kısmını LACP yapıyorum.

![Teaming](/images/WindowsNICTeaming/3.png)

Kısa bir süre sonra Kartların "Active" yazısını görüyoruz.

![Teaming](/images/WindowsNICTeaming/5.png)

"Team Interfaces" kısmında da oluşturduğumuz "TEAMING" adlı kartı görebiliriz.

![Teaming](/images/WindowsNICTeaming/6.png)

Ethernet kartlarına bakacak olursak;

Oluşturduğumuz "TEAMING" adlı kartı görebiliriz. Artık tek bir kart olarak bu kartı kullanabiliriz.

Sonraki işlemlerimizde artık bu kartı kullanmamız gerekir. IP, Subnet, Def. Gateway vererek devam edebiliriz.

![Teaming](/images/WindowsNICTeaming/7.png)

Teşekkürler,

İyi Çalışmalar.







