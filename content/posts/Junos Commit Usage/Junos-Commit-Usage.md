+++
date = '2024-11-22T17:53:48+01:00'
title = 'Juniper Commit Usage'
tags = ["junos", "juniper"]
author = "Soner Sahin"
+++
JunOS sistemlerde bir diğer önemli konu ise Commit kullanımıdır.

JunOS'da commit işlemi, yapılan konfigürasyonu etkinleştirmek için kullanılır. Yani yapılan konfigürasyonu commit etmezsek yaptığımız konfigürasyon geçerli olmaz.

Bundan dolayı mutlaka konfigürasyon sonrası commit etmemiz gerekiyor.

Commit işlemi yaparken bazı parametreler var ki işleri kolaylaştırır. 

**Commit tipleri:**

**"commit"** : Bu komut, direkt olarak yapılan konfigürasyonu etkileştirir.

**"commit check"** : Bu komut, yapılan konfigürasyondan emin olmadığımız durumlarda, yapılan konfigürasyonun doğruluğunu kontrol eder. Eğer bir konfigürasyon hatası varsa bize ilgili kısmın hatasını gösterir.

Örneğin:
```
root@vqfx-re# commit check 
[edit interfaces xe-0/0/2 unit 0 family inet]
  'dhcp'
    Incompatible with interface assigned with address
error: configuration check-out failed: (statements constraint check failed)
```

**"commit confirmed"** : Bu komut, yapılan konfigürasyonun belirli bir süre aktif olmasını sağlar. Yani örneğin yapılan konfigürasyonun neler doğuracağını kestiremedik ama konfigürasyonu da değiştirmek istemiyoruz. O zaman bu komutu kullanıp, yapılan konfigürasyonu belirli bir süreliğine aktif edebiliriz. Eğer belirlediğimiz süre içerisinde commit edersek konfigürasyon tamamen geçerli olur, eğer hiçbir işlem yapmazsak belirlediğimiz süre sonunda konfigürasyonu geri alır

Örneğin yapılan konfigürasyonu 2 dk geçerli yapalım ve 2 dk sonunda konfigürasyon geri alınsın.
```
{master:0}[edit]
root@vqfx-re# commit confirmed 2  
configuration check succeeds
commit confirmed will be automatically rolled back in 2 minutes unless confirmed
commit complete

# commit confirmed will be rolled back in 2 minutes
```

Bu işlem yapılırken yukarıda görüldüğü gibi aynı zamanda "commit check"  de yapılır.

Konfigürasyonda bir sorun görünmüyorsa ilgili süre içerisinde commit yaparak konfigürasyonu kalıcı olarak kaydedebiliriz.

**"commit comment"** : Bu komut ise yapılan konfigürasyona bir yorum eklemeyi sağlar. Örneğin cihaza birçok kişi erişiyor ve konfigürasyonlar yapıyor. Kimin hangi konfigürasyonu yaptığını bu komutla belirtilmesini sağlayabilriz.

```
{master:0}[edit]
root@vqfx-re# commit comment "interfacelere IP tanimlandi"
configuration check succeeds
commit complete
```

**"commit at"** : Bu komut, konfigürasyonun belirtilen bir zamanda etkinleştirmesini sağlayabiliyoruz.

Örneğin konfigürasyon 19:00'da kaydedilsin:
```
root@vqfx-re# commit at 19:00 
configuration check succeeds
commit at will be executed at 2024-10-07 19:00:00 UTC
Exiting configuration mode
```

**"commit synchronize"** : Bu komut, birden fazla JunOS cihazı bir şasi de birleştirerek kullanıyorsak bu komutla konfigürasyonu bütün cihazlarda kaydedebiliriz.

Eğer cihazın bunu otomatik olarak yapmasını istersek:
```
{master:0}[edit]
root@vqfx-re# set system commit synchronize 
```

**"commit and-quit"** : Bu komut, konfigürasyonu kaydeder ve bizi bir alt moda yani  operational moda atar.

```
{master:0}[edit]
root@vqfx-re# commit and-quit 
Exiting configuration mode

{master:0}
root@vqfx-re> 
```


Teşekkürler,

İyi Çalışmalar.