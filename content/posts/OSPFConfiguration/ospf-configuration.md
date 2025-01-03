+++
date = '2024-03-31T22:57:40+01:00'
title = 'OSPF Konfigürasyonu'
tags = ["IPv4", "routing", "ospf"]
categories = ["Network"]
author = "Soner Sahin"
+++

OSPF (Open Short Path First), dinamik bir yönlendirme protokolüdür. OSPF bir Link State Routing protokolüdür. Bundan dolayı network haritasının tamamına hakimdir Bazı özellikleri şöyledir:
- Açık kaynaklıdır,
- SPF(Shortest Path First) algoritmasını kullanır,
- Classless (Sınıfsız) bir protokoldür,
- CIDR (Classless Inter-Domain Routing), VLSM(Veriable Length Subnet Masking) destekler,
- Load balancing destekler,
- Güncelleme süresi hızlıdır,
- Administrative Distance değeri 110'dur,
- Area yapısı ile ölçeklenebilir,
- Kimlik doğrulamayı destekler (MD5)
- Metrik değeri olarak Cost kullanır.
- Multicast 224.0.0.5 ve 224.0.0.6 adreslerinden yayın yapar.
- 89 portunu kullanır.

**OSPF Paket Tipleri:**
- **Hello:** Komşuluk kurmak ve devam ettirmek için kullanılan pakettir. Defaultta 10 saniyede bir header ile gönderilir. 
- **Database Description (DBD):** İki router arasındaki LSDB'nin aynı olup olmasığını kontrol etmek için gönderilir.
- **Link-State Request (LSR):** Komşu bir routerdan belirli bir Link-State kaydını istemek için kullanılır.
- **Link State Update (LSU):** Kendisinden istenen Link-State kayıtlarını göndermek için kullanılır. Request ile istenir Update ile gönderilir.
- **Link-State Acknowledgement (LSAck):** Kabul edilmiş olan Link-State Advertisement headerlarının bir listesini içeriyor kabul ettikten sonra. Yani bir paketi aldığını onaylamak için kullanılır.

OSPF 224.0.0.5 multicast adresinden Hello paketiyle komşuluk kurar.
Bir OSPF Hello paketi aşağıdakileri içerir;
-  **Router ID:** 
	- IP formatında olmalıdır (fakat IP adresi ile karıştırıllmamalıdır) ve diğer komşu routerlarınkinden farklı olmalıdır. Router ID aynı zamanda DR ve BDR seçimi için de kullanılan bir değerdir. 
	- Manuel olarak yapılandırıılır:
		- ```"router-id 2.2.2.2"```
	- Manuel olarak yapılandırılmazsa en büyük loopback IP adresi olur. Eğer loopback IP adresi de yok ise en büyük fiziksel interface IP adresi olur.
- **Hello/Dead Interval:**
	- Defaultta 10 saniyede bir Hello paketi, 40 saniyede ise Dead Interval paketi gönderilir. Dead Interval süresi defaultta Hello paketinin 4 katıdır. Yani Hello paketini 20 saniyeye çıkarırsak Dead Interval paketi 80 saniye olacaktır. Bu değerler değiştirilebilir. Fakat komşuluk kurulabilmesi için tüm routerlada aynı olmak zorundadır. 
	- Değiştimek için:
		- `"ip ospf hello-interval 1-65535"`
		- `"ip ospf dead-interval 1-65535"`
- **Neighbors:**  
	- Komşuluklar listelenir.
- **Area ID:**
	- Yönetimi basitleştirmek, trafik ve kaynak kullanımını optimize etmek için kullanılır.
	- Routerların komşılık kurabiilmesi için aynı area içinde olamaları gerekir.
	- Area'lar IP formatında veya decimal formatta yazılabilir.
	- Örn:
		- `"network 0.0.0.0 255.255.255.255 area 5.5.5.5"`
		- `"network 0.0.0.0 255.255.255.255 area 5"`
- **Authentication Data:**
	- Eğer Authentication varsa bununla ilgili bilgiler yer alır.
- **Router Priority:**
	- Router öncelik değeridir. Default değeri 1'dir
- **DR ve BDR IP Adresleri:**
	- DR ve BDR Routerlar'ın IP bilgileri yer alır.

**Komşuluk İlişkisi Kurmak İçin Ne Gerekir?**
- Subnet,
- Area ID,
- Hello/Dead Interval değerleri,
- Authentication,
- Area Stub Flag,
- MTU

**OSPF Neighbor States (Komşuluk Durumları):**
- **Down State:** Henüz Hello paketleri alınmamış olan durumdur. Her OSPF çalıştıran router burdan başlar.
- **Init State:** Bir router diğer OSPF routerından Hello paketi aldığı durumdur, fakat henüz iki taraflı görüşme yok.
- **2-Way State:** BKomşu router Hello mesajını alıyor ve kendisi de bir Hello mesajıyla yanıt veriyor. İki yönlü iletişim burada başlıyor.
- **ExStart State:** Her iki router arasında LSDB değişimi başlıyor. Master ve Slave seçimleri de burada yapılıyor.
- **Exchange State:** DBD Paketleri değiş tokuş edilir.
- **Loading State:** Bir routerın bilmediği her network için LSR (Link-State Request) bağlantı durumu istekleri gönderdiği durumdur.
- **Full State:** Her iki routerda da LSDB'ler eşitlenmiş olur. Bu aşamadan sonra artık OSPF yönlendirmesi başlıyor.

Komşuluk kurulduktan sonra komşu routerlar arasında LSA; Link State Advertisement yani Bağlantı Durumu İlanı paketleri gider gelir. Her Router bir LSA Database'i tutar, buna da LSDB; Bağlantı Durumu Veritabanı denir. Routerlar arasında gidip gelen LSA paketleri LSDB'ye yazılır. Daha sonra bu LSDB'ler de routerlala paylaşılır. Bu sayede aynı area içerisinde her routerda aynı LSDB'ler oluşturulmuş oluyor.

![ospf](/images/OSPFConfiguration/1.png)

Bu LSDB'ler sayesinde rotalar oluşturuluyor ve SPF Algoritması aracılığıyla network topolojisi çıkarılıyor. En iyi yol da Routing Tablosu'na yazılıyor.
Bu durum her 30 dk'da bir yapılır. Eğer topolojide bir değişiklik olursa. LSA paketleriyle LSDB'ler güncellenir, paylaşılır ve SPF Algoritması tekrardan çalışır.
Bu gerçekleştikten sonra 30 dk boyunca LSA paketleri network trafiği oluşturmaz. Sadece Hello paketleri gidip gelir.
Bu durum her area için aynıdır. Aynı area içerisindeki routerların LSDB'leri aynıdır.

**OSPF Tabloları:**
3 çeşit tablo bulunur;
- Neighbor Table (Komşuluk Tablosu),
- Topology Table (Topoloji Tablosu),
- Routing Table (Yönlendirme Tablosu).

**OSPF Cost (Maliyet) Hesaplaması:**
OSPF en düşük maliyetli yolu hesaplar ve Routing Tablosu'na yazar. Peki nasıl hesaplanır?
Referans bant genişliğinin interface bant genişliğine bölümüyle hesaplanır.
Referans Bant Genişliği defaultta 100 Mbps yani 100.000.000 bps'dir.

![ospf](/images/OSPFConfiguration/2.png)

Buradaki örnekte A makinesi B makinesine giderken kullanacağı 2 yol vardır. Eğer RIP gibi Next Hop Protokü olan bir dinamik yönlendirme protokolü olsaydı R1 ve R2 üzerinden hedefe giderdi. 
Fakat OSPF protokolünde Cost hesabı yapılır ve en yüksek hızda paketi iletmek için R1 - R2 ve R3 üzerinden paketi iletecektir.
Peki bu hesabı nasıl yaptı?
Öncelikle hız formatlarını bps olarak dönüştüreceğiz.
Referans Bant Genişliği = 100 Mbps = 100.000.000 bps
Interface Bant Genişliği = 100 Mbps = 100.000.000 bps
Daha sonra förmüle göre referans alınan bant genişliğini (100 Mbps )interface bant genişliğine böleceğiz( 100 Mbps).
Cost = 100.000.000 / 100.000.000 = 1

R1 ve R2 üzerinden hesabı da yapalım:
Cost = 100.000.000 / 10.000.000 = 10

Aşağıdaki tabloda bazı maliyet hesapları yer almaktadır:
- 128 Kbps = 128.000 bps        Cost=100.000.000/128.000=781
- 1544 Kbps = 1.544.000 bps       Cost=100.000.000/1.544.000=64
- 10 Mbps = 10.000.000 bps       Cost=100.000.000/10.000.000=10
- 100 Mbps = 100.000.000 bps       Cost=100.000.000/100.000.000=1
- 1 Gbps = 1.000.000.000 bps       Cost=100.000.000/1.000.000.000=0.1 ~ 1
- 10 Gbps = 10.000.000.000 bps       Cost=100.000.000/10.000.000.000=0.01 ~ 1

100 Mbps üzeri hızlar için cost değeri 1'dir. Bunun sebebi referans bant genişliğinin 100 Mbps alınmasıdır. Bu sorunu aşmak için referans bant genişliğini değiştirmemiz gerekiyor. Bunu da tüm routerlar için yapmamız gerekir. 
Bir diğer önemli nokta ise ne kadar yapmamız gerek? 
Bunu da networkteki en yüksek hız baz alınarak yapılması gerekir. Şu şekilde değiştirebiliriz;
`router ospf 1`
`auto-cost reference-bandwidth 10000 (10 Gbps)`

Manuel olarak Cost değerini ayarlamak için ise;
`interface g0/0`
`ip ospf cost XXX`

**OSPF Area Kavramı:**
Router sayısının az olduğu networklerde LSA paketleri networkü çok fazla yormaz, fazla yük oluşturmaz. Fakat networkteki cihaz sayısı arttıkça LSA paketleri artar ve LSDB'ler de aynı şekilde büyür. Bundan dolayı SPF Algoritması daha fazla kaynak tüketmeye başlayacaktır. 
Bu sebeple area kavramı geliştirilmiştir. Yani networkü belli parçalara bölerek fazladan trafiğin önüne geçilmiştir. Birden fazla area olan networklere Multiarea denir.
Avantajları:
- Trafik ve kaynak kullanımı optimize ediliyor,
- Yönetim basitleşiyor,
- Yönlendirme güncellemeleri azalıyor,
- Yönlendirme tabloları küçülüyor.
Birden fazla areanın oluşturduğu sisteme Autonomous System (AS) denir. Bir Autonomous System'de tüm arealar Backbone Area (Omurga Area) olan area 0'a bağlı olması gerekir. Yani ortamda bir tane area 0 olması gerekiyor. Bunun dışındakikilere standart area denir. 
Bu arealar arasındaki bağlantıyı da Area Border Router (ABR)'lar sağlıyor. Yani farklı areaları birbirine bağlayan routerlara ABR-Area Border Router denir. 
ABR'ler farklı areaları birbirlerine bağladıkları için birden fazla LSDB tutarlar.

**OSPF Router Çeşitleri:**
- **Internal Routers:** Aynı LSDB'lere sahip routerlara denir (R7-R8-R4-R5-R6).
- **Backbone Routers:** Area 0'a en az bir interfacesinden bağlı olan routerlara denir (R2-R3-R7-R8).
- **Area Border Routers:** Farklı areaları birbirine bağlayan routerlara denir (R2-R3).
- **Autonomous System Boundary Routers (ASBR):** En az bir interfacesi dış bir networke bağlı olan routerlara denir (R8). Bağlı olduğu router farklı bir yönlendirme protokolü çalıştırıyor olabilir (Örn: EIGRP).

![ospf](/images/OSPFConfiguration/3.png)

**OSPF DR ve BDR Kavramı:**
Bir ethernet networkünde aynı segment içerisinde çok fazla komşuluk ilişkisi oluşabiliyor. :ok fazla komşuluk ilişkisi kurulması da aynı Link-State Update'lerinin tüm komşular arasında iletilmesine neden oluyor. Bu da aşırı bir trafiğe neden oluyor. Bunu önlemek için DR ve BDR seçimi yapılıyor.
DR = Designated Router
BDR = Backup Designated Router

DR ve BDR seçmek için 2 yol vardır:
- Priority: En büyük olan seçilir (defaultta 1 'dir. 1-255 arası seçilebilir).
- Router ID : En büyük olan BDR seçilir.

DR Down olduğunda BDR devreye girer. Fakat DR tekrar up olduğunda eskisi gibi DR rolünde olmaz. Yani giden gitmiştir gittiği gün bitmiştir.
DR ve BDR seçimi her bir areada değil, her bir Multi-Access Segmentte yapılır. Her ethernet segmenti için ayrı bir DR ve BDR seçimi yapılır.
Bir routerın DR mı BDR mı olduğu şu komutla öğrenilir:
`show ip ospf neighbor`

![ospf](/images/OSPFConfiguration/4.png)

R2 ve R5 arasında  henhangi bir DR ve BDR seçilmez. Çünkü DR ve BDR seçimi, ethernet gibi Broadcast Multi-Access linklerde seçilir, Point to Point linklerde seçilmiyor.
DR ve BDR'ı priority değerine göre manuel seçelim. R3'ü DR ve R1'i BDR yapalım.
**R3:**
`interface gi0/0`
`ip ospf priority 2`

**R1:**
`interface gi0/0`
`ip ospf priority 1`

**OSPF Passive Interface:**
Hello paketlerinin gitmesini istemediğimiz interfaceleri pasif duruma getirerek gereksiz trafik oluşmasını engelleyebiliriz.
Örneğin aşağıdaki topolojide R1, R2 ve R3 Router'larının gi0/0 interfacelerine Hello paketi gitmesine gerek yoktur çünkü komşuluk kuracak bir router yoktur. 

![ospf](/images/OSPFConfiguration/5.png)

Bundan dolayı şu komutla kapatıyoruz:
**R1:**
`router ospf 1`
`passive-interface gi0/0`

**R2:**
`router ospf 1`
`passive-interface gi0/0`

**R3:**
`router ospf 1`
`passive-interface gi0/0`

**OSPF Virtual-Link:**
Bir Autonomous System'de tüm arealar Backbone Area'ya bağl olması gerekir.  Bazı durumlarda arealar doğrudan Backbone Area'ya yani Area 0'a bağlı olmayabiliyor. Bu durumda Virtual Link devreye giriyor ve routerlar arasında sanal bir link oluşturarak bu sorunu çözüyoruz.
Örneğin aşağıdaki topolojide olduğu gibi Area 2 doğrudan Area 0'a bağlı değil. Bu sorunu çözmek için R2 ve R4 arasında bir Virtual Link oluşturuyoruz.

![ospf](/images/OSPFConfiguration/6.png)

**R2:**
`router ospf 1`
`area 1 virtual-link 4.4.4.4`

**R4:**
`router ospf 1`
`area 1 virtual-link 2.2.2.2`

**OSPF Default Route Yayınlama:**
OSPF Default Route'u kendi içinde dağıtmasını destekler. Default rotanın ve daha fazlasını anlattığım yazıma da [buradan](https://sonersahin.com/statik-yonlendirme/) ulaşabilirsiniz.
Default Route'u duyurmak için aşağıdaki komut kullanılır:
`default-information originate`

Teşekkürler,

İyi Çalışmalar.

















