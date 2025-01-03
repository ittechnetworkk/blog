+++
title = "EIGRP Authentication"
date = "2024-02-07T23:44:36+01:00"
tags = ["Cisco", "EIGRP"]
categories = ["Network"]
author = "Soner Sahin"
+++

EIGRP Cisco tarafından geliştirilen, daha sonra kaynak kodları açılan bir dinamik yönlendirme protokolüdür. Kimlik doğrulama yapılmasının amacı networkte bir şekilde bulunan yetkisiz routerların, yetkili olan routerların routing tablosunu bozmasını engellemektir. Trafiği şifrelemez. Sadece kimlik doğrulama yapar. Authentication 2 aşamada yapılır.

Aşağıdaki topolojiyi uygulayacağız.

![eigrp](/images/EIGRPAuthentication/2.png)

Burada 3 Router'ımız var, hali hazırda EIGRP konfigürasyonu yapılmış, networkler birbirlerini tanıyorlar. Bu topolojide, kötü niyetli biri routerlardan birine bir kablo takarsa rahatlıkla network duyuruları yapabilir, routing tablolarını şişirebilir, networkü kullanılmaz hale getirebilir. Kimlik doğrulamayı etkinleştirdiğimizde ise, kötü niyetli kişi artık bunları yapamaz. 


**R1:**
```
R1#configure terminal
R1(config)#key chain ALIMETINFEYYAZ
R1(config-keychain)#key 1
R1(config-keychain-key)#key-string ssnrshnn
R1(config-keychain-key)#exit
R1(config-keychain)#exit

R1(config)#interface gi0/2
R1(config-if)#ip authentication mode eigrp 100 md5
R1(config-if)#ip authentication key-chain eigrp 100 ALIMETINFEYYAZ

R1(config)#int gi0/1
R1(config-if)#ip authentication mode eigrp 100 md5
R1(config-if)#ip authentication key-chain eigrp 100 ALIMETINFEYYAZ
```

**R2:**
```
R2#conf terminal
R2(config)#key chain ALIMETINFEYYAZ
R2(config-keychain)#key 1
R2(config-keychain-key)#key-string ssnrshnn
R2(config-keychain-key)#exit
R2(config-keychain)#exit

R2(config)#int gi0/0
R2(config-if)#ip authentication mode eigrp 100 md5
R2(config-if)#ip authentication key-chain eigrp 100 ALIMETINFEYYAZ
R2(config-if)#exit

R2(config)#int gi0/1
R2(config-if)#ip authentication mode eigrp 100 md5
R2(config-if)#ip authentication key-chain eigrp 100 ALIMETINFEYYAZ
```

**R3:**
```
R3#conf t
R3(config)#key chain ALIMETINFEYYAZ
R3(config-keychain)#key 1
R3(config-keychain-key)#key-string ssnrshnn
R3(config-keychain-key)#exit
R3(config-keychain)#exit

R3(config)#int gi0/0
R3(config-if)#ip authentication mode eigrp 100 md5
R3(config-if)#ip authentication key-chain eigrp 100 ALIMETINFEYYAZ
R3(config-if)#exit

R3(config)#int gi0/1
R3(config-if)#ip authentication mode eigrp 100 md5
R3(config-if)#ip authentication key-chain eigrp 100 ALIMETINFEYYAZ
```


Oluşturduğumuz keyleri görmek için:

```
R1#show key chain
```

Konfigürasyonun doğru olduğunu görmek için;

```
R1#debug eigrp packets
```

Debug'ı durdurmak için;

```
R1#no debug eigrp packets
```

Teşekkürler,

İyi Çalışmalar.