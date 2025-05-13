+++
title = "CDP LLDP Protokolleri"
date = "2024-02-08T23:39:19+01:00"
tags = ["Cisco", "CDP", "LLDP"]
categories = ["Network"]
author = "Soner Sahin"
image = "/images/cdp-lldp/cover.jpg"
+++

**A-CDP Protokolü:**
- CDP (Cisco Discovery Protocol), Cisco cihazlara özel cihaz keşif protokolüdür.
- Layer 2 seviyesinde çalışır.
- Cihaz türü, IP adresi, yazılım sürümü, işletim sistemi gibi bilgileri elde etmemizi sağlar.
- Varsayılan olarak açık gelir. İstenirse port bazında açabilir veya kapatabiliriz.
- Networkü tanımak için kullanılır fakat her zaman için iyi olmayabilir. 
- 60 saniyede bir CDP mesajı yollanır, 180 saniye tabloda tutulur.
- Multicast yayın yapar.

CDP Cihaz keşfi komutları:
```
R1#show cdp neighbors 
R1#show cdp neighbors detail
```

CDP Kapatmak için:
```
R1#configure terminal
R1(config)#no cdp run 
```

CDP Interface bazında kapatmak için:
```
R1(config)#interface range gigabitEthernet 0/0-2
R1(config-if-range)#no cdp run 
```



**B-LLDP Protokolü:**
- Marka bağımsız çalışan protokoldür.
- Layer 2 seviyesinde çalışır.
- Benzer şekilde cihaz adı, türü, IP adresi, işletim sistemi, sürüm bilgisi verir.
- Varsayılan olarak kapalı gelir. Tamamen veya port bazında açılıp kapatılabilir.
- 30 saniyede bir LLDP mesajı gönderilir, 120 saniye tabloda tutar.

LLDP açmak için:
```
R1#configure terminal 
R1(config)#lldp run 
```

LLDP cihaz keşfi için:
```
R1#sh lldp neighbors 
R1#sh lldp neighbors detail 
```

LLDP port bazında kapatmak için:
```
R1(config)#interface range gigabitEthernet 0/0-3
R1(config-if-range)#no lldp receive                      # Almayı kapatmak
R1(config-if-range)#no lldp transmit                     # Göndermeyi kapatmak
```

Teşekküler,

İyi Çalışmalar.