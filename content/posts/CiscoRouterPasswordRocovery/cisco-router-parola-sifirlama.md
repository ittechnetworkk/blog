+++
date = '2024-06-09T22:57:40+01:00'
title = 'Cisco Router Parola Sifirlama'
tags = ["Cisco", "Router",]
author = "Soner Sahin"
+++

Cisco Router ve Switch'lerde unutulan parolayı cihazı fabrika ayarlarına döndürmeden nasıl sıfırlayabiliriz?
Cisco cihazlarda unutulan parolayı, konfigürasyonu bozmadan sıfırlamak mümkün. Bu işlem birkaç adımda yapılır.
Ben bu uygulamayı elimde bulunan Cisco 800 Serisi bir Router'da adım adım uygulayacağım.
Cihaz şekilde görüldüğü gibidir.

![router](/images/CiscoRouterPasswordRocovery/1.png)
CiscoRouterPasswordRocovery

İlk olarak Console Portundan cihaza bağlanıyorum. 

Cihaz'a güç verdikten hemen sonra, cihaz açılış aşamasındayken "`CTRL+BREAK`" tuşlarına basarak "`Rommon`" moduna geçiyorum.

Her terminal programında farklılık gösterebilir. Örneğin ben minicom kullanıyorum ve açılırken "`CTRL + A + F`" tuş kombinasyonlarını kullanarak "`BREAK`" sinyali gönderebiliyorum.

"`rommon mod`" aşağıdaki gibi görünecektir:

![router](/images/CiscoRouterPasswordRocovery/2.png)

Şimdi sırasıyla aşağıdaki komutları giriyorum.

```
rommon 1 > confreg 0x2142
rommon 2 > reset
```

Bu komulardan sonra cihaz yeniden başlayacaktır.  

Başladıktan sonra aşağıdaki komutu yazarak "`startup-config`" dosyasını RAM'de çalışan "`running-config`"e kopyalıyorum

```
Router>enable
Router# copy startup-config running-config
```

Daha sonra, cihaza yeniden bir şifre belirliyorum.

```
R1#configure terminal
R1(config)#enable secret cisco
R1(config)#username besiktas secret deneme
```

Parolalarımızı belirledikten sonra bu yapılandırmaların bu şekilde başlaması için aşağıdaki komutu yazıyoruz.

```
R1(config)#config-register 0x2102
R1(config)#end
```

Son olarak cihazı yeniden başlatıyorum.

```
R1#reload
```

Bu sayede cihazdaki konfigürasyonları silmeden artık belirlediğim parolayla cihaza erişebiliyorum.

```
R1>enable
Password: cisco
R1#
```

Teşekkürler,

İyi Çalışmalar.

