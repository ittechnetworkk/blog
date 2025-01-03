+++
date = '2024-07-07T22:57:40+01:00'
title = 'UTP Kablo Yapımı'
tags = ["cable"]
categories = ["Network"]
author = "Soner Sahin"
+++

UTP Kablo yani ağ kabloları, internet iletişiminde cihazların birbirleriyle iletişim kurması için kullanılan kablolardır.

Birden fazla çeşidi vardır ve iletim hızlarına göre kategorilere ayrılmışlardır.

UTP kablolar 100 metreye kadar sinyal iletebilirler. Aşılması durumunda sinyal kayıpları, performans sorunları ile karşılaşılır.

UTP Kablolarının her iki ucu da RJ45 ile çakılır.

Kablolar koruyucu malzeme ile kablı olması veya olmaması gibi özelliklere göre 2'ye ayrılır.

- Sheilded Twisted Pair (STP) kablonun içinde bir kuruyucu vardır,
- Unshielded Twisted Pair (UTP) koruyucu yoktur.

Buradaki koruyucu metal malzemenin görevi ise kablonun elektromanyetik alandan etkilenmemesini sağlamaktır.

Ağ kabloları, iletim hızlarına göre kategorilere ayrılmıştır. UTP kablolarda da artık günümüzde yüksek hızlara ulaşmak mümkündür. 

Aşağıda kategorilerine göre ağ kabloları ve iletim hızları gösterilmiştir. Cat 5'e kadar artık görmek pek de mümkün değildir. Çok eski oldukları için.

![UTP](/images/UTPKabloYapimi/14.png)

UTP kablo yaparken 2 farklı renk dizilim standardı karşımıza çıkar.

1. T568A (YB-Y    TB-M    MB-T    KB-K),
2. T568B (TB-T    YB-M    MB-Y    KB-K).

![UTP](/images/UTPKabloYapimi/15.png)

Bu dizilimler başta çok karmaşık gelebilir, fakat daha biraz vakit harcayınca çok rahat akılda kalıyor. Artık bir yerlere bakmadan yapabiliyorsunuz.

UTP kablo yaparken 2 standart karşımıza çıkar.

1. Düz (Straight) Kablo:

- Kablonun her iki ucu aynı renk dizilimine göre yapılır. Yani her iki ucu ya T568A ya da T568B olacak.
- Farklı kategori cihazları bağlamak için kullanılır. Örneğin aşağıdaki gibi Switch-Router, Switch-PC, Switch-Server gibi.

![UTP](/images/UTPKabloYapimi/16.png)

2. Çapraz (Crossover) Kablo:

- Crossover'da ise kablonun her iki ucu farklı renk dizilimine göre yapılır. Yani bir ucu T568A diğer ucu T568B olarak dizilecek.
- Aynı kategori cihazları bağlamak için kullanılır. Örneğin aşağıdaki gibi Switch-Switch, Router-Router, PC-PC gibi.

![UTP](/images/UTPKabloYapimi/17.png)

Güzel haber şu ki artık kabloları çapraz mı düz mü bağlamam gerekiyor? gibi bir zorluk kalmamıştır. 

Çünkü NIC (Network Interface Card) kartları bu ayrımı yapabiliyorlar. 

Yani her iki ucu da T568B olarak bağlamak gayet yeterli olacaktır.

Şimdi UTP Kablo yapımına geçelim.

Ben Cat 7 kablo yapmayı göstereceğim. Zira diğer kablo çeşitleride çok farklı olmayacaktır. 

Aşağıdaki kategorilerine göre internet kablosu yapım örneklerini inceleyebilirsiniz.

- [Cat 5,](https://www.youtube.com/watch?v=UFlqNQsjYCs)
- [Cat 6,](https://www.youtube.com/watch?v=y0V5XSn-H2g)
- [Cat 8,](https://www.youtube.com/watch?v=65kDSAsmLmQ)

İhtiyacımız olan malzemeler aşağıdaki gibidir:

![UTP](/images/UTPKabloYapimi/18.jpg)

İlk olarak turuncu koruyucu kabı kesilen yerden geçiriyorum.

Daha sonra sarı renkli küçük ama yetenekli alet ile kabloyu 2 cm kadar soyuyorum.

![UTP](/images/UTPKabloYapimi/1.jpg)

![UTP](/images/UTPKabloYapimi/2.jpg)

Daha sonra mor plastik kısmı çıkarıyorum. Koruyucu metal katman aşağıdaki gibi görünecektir.

![UTP](/images/UTPKabloYapimi/3.jpg)

4 çift olarak sarılmış ve en üstü tel parçaları ile çevrilmiş.

Bu metal kısmı ve tel parçalarını da çıkarıp atıyorum ve kabloları renklerine göre çift olarak ayırıyorum.

![UTP](/images/UTPKabloYapimi/4.jpg)

Bu kabloları da T568B standardına göre aşağıdaki gibi nizami bir şekilde diziyorum ve pensenin keskin kısmı ile kesiyorum.

![UTP](/images/UTPKabloYapimi/5.jpg)

![UTP](/images/UTPKabloYapimi/6.jpg)

Kestikten sonra aşağıdaki resimde görülen küçük düzenleyiciyi sırayı bozmadan takıyorum.

![UTP](/images/UTPKabloYapimi/7.jpg)

Bu şekilde konnektöre takıyorum.

![UTP](/images/UTPKabloYapimi/8.jpg)

![UTP](/images/UTPKabloYapimi/9.jpg)

Kabloların tam ve doğru sırada olduklarını tekrar kontrol ediyorum.

Daha sonra pense ile son sıkıştırma işlemini yapıyorum.

![UTP](/images/UTPKabloYapimi/10.jpg)

Konnektörün kenar telleriyle kabloyu iyice sıkıştırıyorum.

![UTP](/images/UTPKabloYapimi/11.jpg)

Son olarak koruyucu turuncu kabı yerine yerleştiriyorum.

![UTP](/images/UTPKabloYapimi/12.jpg)

Artık kontrol edebiliriz.

Kablonun her iki ucunu da aşağıdaki gibi kontrol cihazına takıp cihazı "ON" konumuna getiriyorum.

Cihazın tüm ışıkları sırasıyla karşılıklı olarak yanıyorsa sorun yok demektir. 

![UTP](/images/UTPKabloYapimi/13.jpg)

Artık kullanmaya başlayabilirsiniz.

Teşekkürler,

İyi Çalışmalar.



