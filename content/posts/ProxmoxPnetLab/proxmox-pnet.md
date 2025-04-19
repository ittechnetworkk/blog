+++
date = '2024-08-29T22:57:40+01:00'
title = "Proxmox'a PNET Lab Kurulumu"
tags = ["pnetlab", "proxmox"]
categories = ["Virtualization"]
author = "Soner Sahin"
image = "/images/ProxmoxVmwareMigration/cover.jpg"
+++
Proxmox'a normal bir ISO dosyası yükleyerek sanal makine oluşturulabilir. Fakat .ova uzantılı bir dosya için farklı bir yöntemle yüklemek gerek. 

Başlayalım.

Öncelikle PNET Lab ova dosyasını [web sitesinden](https://pnetlab.com/pages/download) indiriyorum. 

Bu .ova uzantılı dosyayı Proxmox Server'ımıza atmamız gerekiyor. Bunun için FileZilla veya benzeri FTP uygulamalarıyla atabilirsiniz. 

Daha pratik bir yöntem ise scp aracıyla atmak olacak.

Aşağıdaki komutla kendi bilgisayarımdan Proxmox Server'a dosyayı şutluyorum. 

```
scp PNET_4.2.10.ova root@192.168.0.170:/root
```

Dosya Server'a başarıyla geldi.

```
root@sonersahin:~# ls
PNET_4.2.10.ova
```

Daha sonra dosyayı atomlarına ayırıyorum.

```
root@sonersahin:~# tar -xvf PNET_4.2.10.ova
PNET_4.2.10.ovf
PNET_4.2.10.mf
PNET_4.2.10-disk1.vmdk
```

Artık .ova uzantılı dosya haricinde .vmdk .mf .ovf uzantılı dosyalarımız da oldu.

Şimdi ise son olarak .ovf uzantılı dosyayı Proxmox'ta bir sanal sunucu haline getiriyorum.

```
root@sonersahin:~# qm importovf 1051 PNET_4.2.10.ovf local-lvm
  Logical volume "vm-1051-disk-0" created.
transferred 0.0 B of 100.0 GiB (0.00%)
transferred 1.0 GiB of 100.0 GiB (1.00%)
transferred 11.0 GiB of 100.0 GiB (11.01%)
transferred 38.0 GiB of 100.0 GiB (38.03%)
transferred 43.0 GiB of 100.0 GiB (43.03%)
transferred 50.0 GiB of 100.0 GiB (50.04%)
transferred 58.0 GiB of 100.0 GiB (58.04%)
transferred 68.0 GiB of 100.0 GiB (68.05%)
transferred 75.1 GiB of 100.0 GiB (75.06%)
transferred 78.1 GiB of 100.0 GiB (78.06%)
transferred 84.1 GiB of 100.0 GiB (84.06%)
transferred 89.1 GiB of 100.0 GiB (89.07%)
transferred 94.1 GiB of 100.0 GiB (94.07%)
transferred 100.0 GiB of 100.0 GiB (100.00%)
```

Görüldüğü gibi sanal makine olarak geldi.

![pnet](/images/ProxmoxPnetLab/1.png)

Makineyi açmadan önce "Hardware > Processors" kısmından makinenin Processor tipini "host" olarak değiştiriyorum. Ve kaynaklarım doğrultusunda Socket Core ve RAM atamalarını yapıyorum.

![pnet](/images/ProxmoxPnetLab/2.png)

Makine'de ayrıca herhangi bir network kartı da takılı görünmüyor. Bir network kartı da makineye tanıtmamız gerek.

Aşağıdaki adımlarla network kartı da ekliyorum.

![pnet](/images/ProxmoxPnetLab/4.png)

![pnet](/images/ProxmoxPnetLab/3.png)

Artık makineyi kullanabilrsiniz.

Teşekkürler,

İyi Çalışmalar.