+++
title = "Cockpit Kurulumu"
date = "2025-01-24T22:16:16+01:00"
tags = ["Cockpit"]
categories = ["Linux"]
author = "Soner Sahin"
+++

Selamlar, bu yazımda Linux sunucularda Cockpit kurulumuna değineceğim.

[Cockpit](https://cockpit-project.org/), Linux sunucuları yönetebilmeyi sağlayan bir araçtır. 

Cockpit'i kurduktan sonra sunucuyu web tarayıcısı üzerinden yönetebilmeyi sağlar.

Alternatif olarak, Webmin, cPanel, Plesk, DirectAdmin gibi araçlar da bulunur.

Kurulumu oldukça kolaydır. Ben Fedora Server üzerine kurulumunu göstereceğim. 

Ayrıca [Web Sitesini'de ](https://cockpit-project.org/running.html)ziyaret edebilirsiniz.

```
fedora@fedora:~$ sudo dnf check-update
fedora@fedora:~$ sudo dnf install cockpit
```

Kurulum bittikten sonra servisi başlatıp daha sonra enable ediyorum. Cockpit servisinin adı `cockpit.socket` tir.

```
fedora@fedora:~$ systemctl start cockpit.socket
fedora@fedora:~$ systemctl enable --now cockpit.socket
fedora@fedora:~$ systemctl status cockpit.socket
● cockpit.socket - Cockpit Web Service Socket
     Loaded: loaded (/usr/lib/systemd/system/cockpit.socket; disabled; preset: disabled)
     Active: active (listening) since Mon 2025-01-20 16:42:14 CET; 2s ago
 Invocation: 5dac77b73372402bafe6d98b15bb39f8
   Triggers: ● cockpit.service
       Docs: man:cockpit-ws(8)
     Listen: [::]:9090 (Stream)
    Process: 1267 ExecStartPost=/usr/share/cockpit/issue/update-issue  localhost (code=exited, status=0/SUCCESS)
    Process: 1275 ExecStartPost=/bin/ln -snf active.issue /run/cockpit/issue (code=exited, status=0/SUCCESS)
      Tasks: 0 (limit: 2248)
     Memory: 660K (peak: 2.2M)
        CPU: 18ms
     CGroup: /system.slice/cockpit.socket

Jan 20 16:42:14 fedora systemd[1]: Starting cockpit.socket - Cockpit Web Service Socket...
Jan 20 16:42:14 fedora systemd[1]: Listening on cockpit.socket - Cockpit Web Service Socket.
```

Kurulum ve servisi hallettikten sonra Cockpit'in hangi portta çalıştığını bulmak için yukarıdaki `systemctl` çıktısına bakabilir veya ağ bağlantılarını kontrol edebilirsiniz.

```
fedora@fedora:~$ sudo netstat -tunlp |grep LISTEN
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1030/sshd: /usr/sbi 
tcp        0      0 127.0.0.54:53           0.0.0.0:*               LISTEN      901/systemd-resolve 
tcp        0      0 0.0.0.0:5355            0.0.0.0:*               LISTEN      901/systemd-resolve 
tcp        0      0 127.0.0.53:53           0.0.0.0:*               LISTEN      901/systemd-resolve 
tcp6       0      0 :::22                   :::*                    LISTEN      1030/sshd: /usr/sbi 
tcp6       0      0 :::5355                 :::*                    LISTEN      901/systemd-resolve 
tcp6       0      0 :::9090                 :::*                    LISTEN      1/systemd           
```

Çıktıda da görüldüğü üzere `9090` portunda hizmet veriyor. 

Bu port Cockpit'in default portudur.

Aynı zamanda defaultta `root` girişine kapalıdır. (/etc/cockpit/disallowed-users/)

Bu şekilde kendi tarayıcımdan gitmeye çalışırsam, web paneline erişemiyor olacağım. 

İlgili porta firewall'dan izin verilmelidir.

```
fedora@fedora:~$ sudo firewall-cmd --add-service=cockpit --permanent
success

fedora@fedora:~$ sudo firewall-cmd --reload
success
```

Firewall izinlerinden sonra web arayüzünden ilgili IP ve porta istek attığımızda Cockpit bizi karşılayacaktır.

![cockpit](/images/CockpitInstallation/1.png)

Kullanıcı ve parola girildikten sonra da;

![cockpit](/images/CockpitInstallation/2.png)

Admin haklarına erişmek için sağ üs kısımdaki "Limited access" veya ekranın üst kısmında görünen mavi butona tıklayıp, parolamızı girmemiz gerekiyor.

![cockpit](/images/CockpitInstallation/3.png)

![cockpit](/images/CockpitInstallation/4.png)

Artık web paneli üzerinden sunucuyu yönetebiliriz.

Teşekkürler,

İyi Çalışmalar.


