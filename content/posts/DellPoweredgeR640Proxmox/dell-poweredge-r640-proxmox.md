+++
date = '2024-12-02T22:57:40+01:00'
title = 'Dell PowerEdge R640 Proxmox'
tags = ["proxmox", "virtualization", "server"]
categories = ["Virtualization"]
author = "Soner Sahin"
+++

Bu yazımda, Dell Poweredge R640 Server'a Proxmox kurulumunu anlatacağım.

Sahip olduğum donanım ve yazılımlar şu şekilde:
- Dell PowerEdge R640 2x Xeon Gold 6132 14C 2.6GHz 128GB DDR4 RAM 8SFF H730 RAID,
- 2 x 1TB SSD
- Monitor,
- Klavye,
- Mause,
- USB Bellek,
- Ethernet Kablosu,
- Balena Etcher.

![proxmox](/images/ProxmoxKurulumu/1.jpg)



Kablo bağlantılarının doğru yapıldığından emin olduktan sonra, ilk olarak [web sitesinden](https://www.proxmox.com/en/downloads/proxmox-virtual-environment/iso/proxmox-ve-8-2-iso-installer) Proxmox ISO'sunu indiriyorum.

Bu ISO dosyasını USB belleğe yazdırmak için [Balena Etcher](https://etcher.balena.io/)  yazılımını kullanıyorum. İsteğe bağlı başka yazılımlar da kullanılabilir.


ISO yazdırma işlemi bittikten sonra USB belleği sunucumun ön kısmında bulunan porta takıyorum ve cihaza güç veriyorum.

Cihazı USB bellekten boot etmek için açılırken F11 tuşuna basıyorum.

![proxmox](/images/ProxmoxKurulumu/3.jpg)

Gelen menüden "One-shot UEFI Boot Menu" seçeneğiyle devam ediyorum.

![proxmox](/images/ProxmoxKurulumu/4.jpg)

Bir sonraki menüden USB Bellekten boot etmesi gereken seçeneği seçerek ilerliyorum.

![proxmox](/images/ProxmoxKurulumu/5.jpg)

Proxmox kurulum ekranı gelmiş oldu. En üstteki seçeği seçiyorum.

![proxmox](/images/ProxmoxKurulumu/6.jpg)

Lisans Sözleşmesine "I agree" diyerek devam ediyorum.

![proxmox](/images/ProxmoxKurulumu/7.jpg)

"Proxmox Virtual Environment (PVE)" kısmında Proxmox'un kurulacağı diski seçmemi istiyor. Uygun olan diski seçip devam ediyorum.

![proxmox](/images/ProxmoxKurulumu/8.jpg)

"Location and Time Zone selection"  kısmında konum, zaman ve klavye seçeneklerini doldurduktan sonra devam ediyorum.

![proxmox](/images/ProxmoxKurulumu/9.jpg)

"Administration Password and Email Address" kısmında bir parola(Proxmox arayüzüne erişmek için kullanılacak) ve Email adresi belirledikten sonra devam ediyorum.

![proxmox](/images/ProxmoxKurulumu/10.jpg)

"Management Network Configuration" kısmında 
- Yönetim Arayüzü
- Hostname
- IP Adresi
- Gateway 
- DNS Sunucusu

Ayarlarını yaptıktan sonra devam ediyorum.

![proxmox](/images/ProxmoxKurulumu/11.jpg)

Son olarak "Summary" kısmında bir özet olarak konfigürasyonu kontrol ettikten sonra "Install" diyerek kurulumu başlatıyorum.

![proxmox](/images/ProxmoxKurulumu/12.jpg)

![proxmox](/images/ProxmoxKurulumu/13.jpg)

Kurulum işlemi bittikten sonra cihaz otomatik olarak yeniden başlatılacaktır. Reboot edilirken USB Belleği çıkarıyorum.

![proxmox](/images/ProxmoxKurulumu/14.jpg)

Ve artık Proxmox kurulmuş oldu.

![proxmox](/images/ProxmoxKurulumu/19.jpg)

Kendi bilgisayarımın tarayıcısından "192.168.0.17:8006" adresine gidiyorum.

"Advanced" diyerek devam ediyorum.

![proxmox](/images/ProxmoxKurulumu/20.png)

"Proceed to 192.168.0.170(unsafe)" yazan seçenekle devam ediyorum

![proxmox](/images/ProxmoxKurulumu/21.png)

Gelen giriş ekranından da 
- User name: root
- Password: *Belirlediğimiz password*
ile giriş yapıyorum.

![proxmox](/images/ProxmoxKurulumu/22.png)

Gelen uyarı ekranına da "OK" diyerek işlemi bitiriyorum. 

![proxmox](/images/ProxmoxKurulumu/23.png)

Proxmox kurulumu bu kadardı. 

Teşekkürler,

İyi Çalışmalar.






