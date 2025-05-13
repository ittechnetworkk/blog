+++
date = '2024-07-23T22:57:40+01:00'
title = "GPG Nedir?"
tags = ["gpg", "linux"]
categories = ["Linux"]
author = "Soner Sahin"
image = "/images/GPGNedir/cover.jpg"
+++
GPG (GNU Privacy Guard )[RFC4880](https://datatracker.ietf.org/doc/html/rfc4880) , GPL Lisanslı bir şifreleme ve imzalama aracıdır. Linux'da defaultta gelir, Windows için [Web Sitesi](https://www.gnupg.org/download/)'nden indirilebilir. 

GPG asimetrik şifreleme algoritması kullanır. Yani Public ve Prive anahtarlar vasıtasıyla dataları şifreler veya çözer.

Nedir bu Public ve Prive anahtarlar?

2 kişi düşünelim birbirleriyle haberleşmek istesin. Her kişinin 2 anahtarı olur. Biri "Public Key" yani paylaşılan anahtar. Diğeri ise "Private key" yani gizli kalması gereken anahtar.

X kişisi Y kişisine gizli bir mesaj göndermek isterse bu mesajı Y kişisinin "Public Key"i ile şifrelemesi gerekir. 

Bunu açmak için ise Y kişisi private anahtarını kullanır. Bu sayede mesaj içeriğine kimse erişemez.

Şekilde görüldüğü gibi "Ali Haydar" adlı kişi "Elida Deniz" adlı arkadaşa gizli bir bir mesaj gönderiyor.

![gpg](/images/GPGNedir/1.png)

Bunu yapmak için Ali Haydar mesajı Elida Deniz'in Public Key'i ile şifreliyor ve gönderiyor.

Elida Deniz ise mesajı açmak için Private Key'ini kullanarak açabiliyor.

Elida Deniz de bir mesaj göndermek isterse bu sefer Ali Haydar'ın Public Key'i ile şifreleyecek ve gönderecektir.

Şimdi gelelim işin nasıl yapıldığına;

Linux sistemlerde defaultta gelir, eğer yüklü değilse aşağıdaki komutla yükleyebilirsiniz.

```
sudo apt install gpg
```

Artık kullanmaya başlayabiliriz.

İlk olarak bir anahtar çifti oluşturma:
```
gpg --gen-key
```

Anahtar çifti oluştururken adınızı, mail adresinizi ve güçlü bir şifre girmenizi isteyecektir. Bu şifreyi unutmamanız gerekir.

Anahtarları listeleme:
```
gpg --list-keys
gpg --list-secret-keys
```

Anahtar silme:
``` 
gpg --delete-keys ID                     ID'si belirtilen public anahtarı siler.
gpg --delete-secret-keys ID              ID'si belirtilen private anahtarı siler.
gpg --delete-secret-and-public-keys ID   ID'si belirtilen secret ve private anahtarı siler.
```

Parmak izlerini görmek için:
```
gpg --fingerprint
```

Anahtarı düzenlemek için:
```
gpg --edit-key ID
passwd        #parolayı değiştirir
save          #değişiklikleri kaydeder
enable        #enable eder
disable       #disable eder
addphoto      #bir fotograf ekler
quit          #edit modundan çıkmayı sağlar
```

Private Key'i dışarıya aktarma:
```
gpg -ao private.txt --export-secret-keys ID    #ID'si belirtilen Private Key'yi dışarı aktarır.
```

Private anahtarı dışarı aktarmak, farklı cihazlarda gpg kullanmanızı sağlar.

Private Key'i import etme:
```
gpg --allow-secret-key-import --import private.txt
```

Public Key oluşturma:
```  
gpg -ao public.txt --export ID            #Key'i public.txt dosyasına kaydeder.
```

Public Key import etme:
```
gpg --import public.txt
```

Başkasına ait Public Key'i anahtarlığa ekler.

Bu komut size aşağıdaki gibi bir Key üretecektir.
```
-----BEGIN PGP PUBLIC KEY BLOCK-----

mQGNBGadVywBDACu6iDTxhNeQMwEz//fbGO6kVrXu15KggDLahYl65W/6ha0gvnR
gdOFE+ae5kWzAt8DnrbZWAqLJCvu5SS59RQXo03PhLDOg+/eunqq6WaqV1Rb67sj
3eT8lbd+LF2V42dPq/v2evpBnC2EDxDyppD76OCJ4X/5MZNlhXUnC+dZ3qw4I5SI
mbRm6rsRy+98OuTxL2F8fWfpUqp5vGwh/6sLhtJl9dshcCD4YcHyDaUt+gAuaMlN
ghC+E5MK7qDwlj2wa3U9No50ahfTj1f6E9tdVzATnbl3DvzBLv+faAhz/6LQpoYL
fe0Y8kTfgb+hP1hhX/U2W5PsTI1ZjkTcrfH5byT2LEi5wOBl1ikrRwlYG01ZWbMq
gdOFE+ae5kWzAt8DnrbZWAqLJCvu5SS59RQXo03PhLDOg+/eunqq6WaqV1Rb67sj
3eT8lbd+LF2V42dPq/v2evpBnC2EDxDyppD76OCJ4X/5MZNlhXUnC+dZ3qw4I5SI
mbRm6rsRy+98OuTxL2F8fWfpUqp5vGwh/6sLhtJl9dshcCD4YcHyDaUt+gAuaMlN
ghC+E5MK7qDwlj2wa3U9No50ahfTj1f6E9tdVzATnbl3DvzBLv+faAhz/6LQpoYL
fe0Y8kTfgb+hP1hhX/U2W5PsTI1ZjkTcrfH5byT2LEi5wOBl1ikrRwlYG01ZWbMq
WAEZjXCFJ+/gA63qdq6b3NNonVt+iiwUDkf1c92jnqM3OMJ1HuRT4eufRe8PKnWd
zy+nJMf+VivABw6qK0VNGWIywLliiK6onUjWEx/TijWu2Pd9pc/67OsIzVnU2Vpo
mQGNBGadVywBDACu6iDTxhNeQMwEz//fbGO6kVrXu15KggDLahYl65W/6ha0gvnR
gdOFE+ae5kWzAt8DnrbZWAqLJCvu5SS59RQXo03PhLDOg+/eunqq6WaqV1Rb67sj
3eT8lbd+LF2V42dPq/v2evpBnC2EDxDyppD76OCJ4X/5MZNlhXUnC+dZ3qw4I5SI
mbRm6rsRy+98OuTxL2F8fWfpUqp5vGwh/6sLhtJl9dshcCD4YcHyDaUt+gAuaMlN
ghC+E5MK7qDwlj2wa3U9No50ahfTj1f6E9tdVzATnbl3DvzBLv+faAhz/6LQpoYL
fe0Y8kTfgb+hP1hhX/U2W5PsTI1ZjkTcrfH5byT2LEi5wOBl1ikrRwlYG01ZWbMq
WAEZjXCFJ+/gA63qdq6b3NNonVt+iiwUDkf1c92jnqM3OMJ1HuRT4eufRe8PKnWd
zy+nJMf+VivABw6qK0VNGWIywLliiK6onUjWEx/TijWu2Pd9pc/67OsIzVnU2Vpo
9mffy8VesxgkvBMAEQEAAbQgc29uZXJzYWhpbiA8c29uZXJhMTcxQGdtYWlsLmNv
bT6JAdQEEwEKAD4WIQShE5AUmCeOS+K8HdjOstk45/606QUCZp1XLAIbAwUJA8Jn
AAULCQgHAgYVCgkICwIEFgIDAQIeAQIXgAAKCRDOstk45/606a/ODACfyLQJvMRN
rzU1ioLdoH3i92eHOTo54HVUoD7yoyUZmt5WQh0h7/tUfsZRwa/lBV3TE6sTQtUd
Rk4PrHZdq00bz6mKjY7UTGi6AIEJXSjWCL1k56YB44NrJFtRTDez3QYuapa3E7vn
nBRVQwARAQABiQG8BBgBCgAmFiEEoROQFJgnjkvivB3YzrLZOOf+tOkFAmadVywC

-----END PGP PUBLIC KEY BLOCK-----
```

Bu Public Key'dir. Bunu artık Key Server'lara koyarak başkalarının size mesaj gönderirken kullanmasını sağlayabilirsiniz. Veya bir txt dosyasına kaydedip güvenli iletişim kurmak istediğiniz kişilere gönderebilirsiniz.

Public Key'i anahtar sunuculara gönderme:
```
gpg --keyserver «SunucuURL» --sends-keys ID
```

Örnek Key Serverlar: 
https://keyserver.ubuntu.com/
https://keys.openpgp.org/

Aynı zamanda ilgili Key Server'dan anahtar da çekebiliriz:
```
gpg --keyserver «SunucuURL» --recv-keys ID
```

Key Server'da arama yapma:
```
gpg --keyserver «SunucuURL» --search-keys «KullanıcıAdı»
```

Şimdi dosya şifreleme komutlarına bakalım.

Elimde bir adet Akın'a ait Public Key var. Bu Public Key ile elimdeki "abc.txt" dosyasını şifreleyeceğim. 

```
gpg -r Akın -e abc.txt
gpg -r ID -e abc.txt                    #ID olarak da verebiliriz.
```

Bu komuttan sonra "Akın" için oluşturulmuş bir abc.txt.gpg dosyası oluşacaktır.

Bizim için şifrelenmiş bir dosyayı açmak için:
```
gpg -d abc.txt.gpg                       #çıktıyı terminalde gösterir
gpg -d abc.txt.gpg -o sonuc.txt          #çıktıyı sonuc.txt dosyasına yazar
```


Komutlar ilk başta zor geliyorsa GUI'si olan programlarla da aynı işlemler yapılabilir.

Umarım faydalı olmuştur.

Teşekkürler,

İyi Çalışmalar.