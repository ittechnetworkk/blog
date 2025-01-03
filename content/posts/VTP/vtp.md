+++
title = "VTP Protokolü"
date = "2023-12-24T23:46:15+01:00"
tags = ["Network", "VTP"]
categories = ["Network"]
author = "Soner Sahin"
+++

VTP (Vlan Trunking Protokol), çok sayıda switch bulunan networklerde yönetimi kolaylaştırmak için kullanılan bir protokoldür. Server-Client mantığıyla çalışır ve Cisco tarafından geliştirilmiştir. Bu protokolün amacı çok fazla switch bulunan networklerde tek tek vlanları ilgili switchlere tanımlamaktansa merkezi bir yerden vlanları dağıtmayı sağlar. Bu vlanlar trunk portlar üzerinden dağıtılır. Senkron çalışır yani merkezde bir vlan oluşturulduğunda veya silindiğinde bu değişiklik ilgili switchlere de dağıtılır. Vlanları dağıtılması işlemi için cihazların VTP etki alanında olması gerekir. Bunun için bir Domain ve Password'e ihtiyaç duyulur.

VTP Protokolünün 3 farklı modu vardır:
- **Server (Sunucu) Mode:** Vlanları oluşturma, silme ve dağıtma yetkisi olan mode. Her Cisco switch defaultta server modda gelir.
- **Client (İstemci) Mode:** Server modda bulunan switch'den vlan bilgisi alan moddur. Vlan ekleme veya silme yetkisi yoktur.
- **Transparent (Şeffaf) Mode:** Bağımsızdır yani server moddan vlan bilgilerini alır iletir ama saklamaz. Fakat kendi başına vlan oluşturabilir veya silebilir. Bu modda yapılan işlemler VTP etki alanını etkilemez.

***Uyarı:***

Eğer server olarak kullanılacak switch'in trunk portuna bir başka switch takılırsa ve bu takılan switch'in Revision numarası server modda olanınkinden büyükse, bu durumda sonradan takılan switch'in vlan bilgileri geçerli olacaktır. Yani server olarak kullanılan switch'in vlan tablosu nanay olacaktır.


**VTP Konfigürasyonu:**
Aşağıdaki örnek topolojiyi uygulayacağız.

![vtp](/images/VTP/1.png)

**1 - Öncelikle cihazları teker teker VTP etki alanına alalım ve karşılıklı portları trunk yapalım,**

**SW1-SERVER:**
```
SW1>enable
SW1#configure terminal
SW1(config)#vtp mode server                   #VTP modunu değiştiriyoruz.
SW1(config)#vtp domain cisco.com              #VTP domain adını giriyoruz.
SW1(config)#vtp password 123qqq!              #VTP password veriyoruz.
SW1(config)#vtp version 2                     #VTP versiyonu belirtiyoruz.
SW1(config)#interface range fa0/1-3           #Portların interfaceleri seçilir.
SW1(config-if-range)#switchport mode trunk    #İlgili interfaceler trunk yapılır.
SW1(config-if-range)#end
```

**SW2-CLIENT:**
```
SW2>enable
SW2#configure terminal
SW2(config)#vtp mode client
SW2(config)#vtp domain cisco.com
SW2(config)#vtp password 123qqq!
SW2(config)#vtp version 2
SW2)config)#interface range fa0/1-2
SW2(config-if-range)#switchport mode trunk
Switch(config-if-range)#end```
```

**SW3-CLIENT:**
```
SW3>enable
SW3#configure terminal
SW3(config)#vtp mode client
SW3(config)#vtp domain cisco.com
SW3(config)#vtp password 123qqq!
SW3(config)#vtp version 2
SW3(config)#interface fa0/1
SW3(config-if)#switchport mode trunk
SW3(config-if)#end
```

**SW4-TRANSPARENT:**
```
SW4>enable
SW4#configure terminal
SW4(config)#vtp mode trasparent
SW4(config)#vtp version 2
SW4(config)#interface range fa0/1-2
SW4(config-if-range)#switchport mode trunk
SW4(config-if-range)#end
```

**SW5-CLIENT:**
```
SW5>enable
SW5#configure terminal
SW5(config)#vtp mode client
SW5(config)#vtp domain cisco.com
SW5(config)#vtp password 123qqq!
SW5(config)#vtp version 2
SW5(config)#interface fa0/1
SW5(config-if)#switchport mode trunk
SW5(config-if)#end
```

**SW6-SERVER:**
```
SW6>enable
SW6#configure terminal
SW6(config)#vtp mode server
SW6(config)#vtp domain cisco.com
SW6(config)#vtp password 123qqq!
SW6(config)#vtp version 2
SW6(config)#interface range fa0/1-2
SW6(config-if-range)#switchport mode trunk
SW6(config-if-range)#end
```

**SW7-CLIENT:**
```
SW7>enable
SW7#configure terminal
SW7(config)#vtp mode client
SW7(config)#vtp domain cisco.com
SW7(config)#vtp password 123qqq!
SW7(config)#vtp version 2
SW7(config)#interface fa0/1
SW7(config-if)#switchport mode trunk
SW7(config-if)#end
```

Buraya kadar herşey doğru yapılandırıldıysa etki alanı oluşturulmuş oldu. Artık server modda olan switch'den vlanlar oluşturulabilir.
Öncelikle server moddaki switch'in vlan tablosuna bakalım, boş olduğunu görelim. Daha sonra oluşturmaya başlayalım.

![vtp](/images/VTP/2.png)

**2 - Vlanları oluşturalım,**

**SW1-SERVER:**
```
SW1#en
SW1#conf t
SW1(config)#vlan 10
SW1(config-vlan)#name PAZARLAMA
SW1(config-vlan)#vlan 20
SW1(config-vlan)#name SATIS
SW1(config-vlan)#vlan 30
SW1(config-vlan)#name AR-GE
SW1config-vlan)#vlan 40
SW1(config-vlan)#name MISAFIR
SW1(config-vlan)#end
```

Tekrar vlan tablosuna bakalım;

**SW1-SERVER:**

![vtp](/images/VTP/3.png)

Vlanlar oluşturuldu, şimdi teker teker kontrol edelim;

**SW2-CLIENT:**
![vtp](/images/VTP/4.png)

**SW3-CLIENT:**
![vtp](/images/VTP/5.png)

**SW4-TRANSPARENT:**
![vtp](/images/VTP/6.png)

Transparent modda çalışan switch'in VTP etki alanındaki vlanları tutmadığını görüyoruz. Fakat SW5'e bakacak olursak vlanların olduğu görüyoruz. Bundan dolayı transparent modda çalışan bir switch'in vlan tutmadığını fakat vlanları ilettiğini söyleyebiliriz.


**SW5-CLIENT:**
![vtp](/images/VTP/7.png)

**SW6-SERVER:**
![vtp](/images/VTP/8.png)

**SW7-CLIENT:**
![vtp](/images/VTP/9.png)

***DENEME-1***
Bir örnek yapalım ve Client modda olan bir cihazda vlan oluşturmayı ve silmeyi deneyelim. Bunun için SW3 cihazını kullanacağım.

![vtp](/images/VTP/10.png)

Görüldüğü gibi cihaz Client modda olduğu için vlan oluşturma veya silme işlemi yapamıyoruz.

***DENEME-2***
Şimdi aynı uygulamayı Transparent modda çalışan SW4'de yapmaya çalışacağım.

![vtp](/images/VTP/11.png)

Transparent modda vlan oluşturabiliyoruz evet, fakat bu vlanlar diğer cihazları etkilemeyecektir. Bunu görmek için SW5'in vlan tablosuna bakalım.

![vtp](/images/VTP/12.png)

Transparent moddaki cihazdan oluşturulan vlanlar gelmedi.

***DENEME-3***
Şimdi bir de SW6 yine server modda çalışan cihazdan vlanlar oluşturmayı ve silmeyi deneyelim.

![vtp](/images/VTP/13.png)

Burada da yine vlanları oluşturabildiğimizi ve silebildiğimizi görüyoruz. Peki diğer cihazlara da bu değişiklik iletiliyor mu bunu öğrenmek için yine SW5'in vlan tablosuna bakalım.

![vtp](/images/VTP/14.png)

Evet değişiklikler diğer cihazlara da iletiliyor.

**Revizyon Numarası Nedir?**

Revizyon numarası Vlanlarda yapılan her bir değişikliği ifade eder. Örneğin bir vlan oluşturduğumuzda bu numara 1 artar, bu vlan'a bir isim verirsek 1 artar, silersek 1 artar gibi.
Revizyon numarasını görmek için aşağıdaki komut kullanılır:
```
show vtp status
```

Bizim topolojideki SW1'in revizyon numarası 19'dur.

![vtp](/images/VTP/15.png)

***DENEME-4***
Örnek olarak bir switch daha ekleyelim fakat networkle bağlantısı olmasın. Bu switch'de vlanlar oluşturalım ve revizyon numarasını yükseltelim. 

![vtp](/images/VTP/16.png)

Artık elimde Revizyon numarası networkümdeki VTP etki alanımda bulunan cihazımınkinden yüksek bir cihaz var. Peki bunu çaaat diye networke dahil edersek neler olur görelim.

![vtp](/images/VTP/17.png)

Görseldeki gibi networke dahil edilen switch yapılandırdığımız vlanları uçurdu ve yerine kendi vlan tablosu geldi. Bunu görmek için SW1 cihazının vlan tablosuna bakalım.

![vtp](/images/VTP/18.png)



VTP Etki alanının passwrod'ünü öğrenmek istersek;
```
SW1#sh vtp password
VTP Password: 123qqq!
```

VTP hakkında detaylı bilgi almak istersek;
```
SW1#show vtp status
```

Komutları kullanılır.


Teşekkürler,

İyi Çalışmalar.