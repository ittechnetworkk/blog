+++
date = '2024-03-31T22:57:40+01:00'
title = 'OSPF Authentication'
tags = ["ospf", "authentication"]
author = "Soner Sahin"
+++

OSPF Authentication, OSPF network trafiğinin güvenliğini artırmak amacıyla kullanılır. 
3 Çeşit doğrulama yöntemi vardır;

**1- Plain Text Authentication,**
**2- MD5 Authentication,**
**3- SHA-HMAC Authentication (IOS 15.4 ve sonrası versiyonlar için)**

Aşağıdaki topolojiyi uygulayacağız.

![ospf](/images/ospf-authentication/1.png)

Bu topolojide 3 Authentication metodunu da uygulayacağız.

R1 ve R3 arasında Plain Text Authentication (Area 1),

R1 ve R2 arasında MD5 Authentication (Area 0),

R2 ve R4 arasında SHA-HMAC Authentication yapacağız. (Area 2)

**1- Interfacelere IP vererek başlayalım:**

**R1:**
```
R1#configure terminal 
R1(config)#interface e0/0
R1(config-if)#ip addr 10.0.0.1 255.255.255.0
R1(config-if)#no sh
R1(config-if)#interface e0/1
R1(config-if)#ip addr 10.0.1.1 255.255.255.0
R1(config-if)#no sh
R1(config-if)#exit
```

**R2:**
```
R2#configure terminal 
R2(config)#interface e0/0
R2(config-if)#ip addr 10.0.0.2 255.255.255.0
R2(config-if)#no sh
R2(config-if)#interface e0/1
R2(config-if)#ip addr 10.0.2.1 255.255.255.0
R2(config-if)#no sh
R2(config-if)#exit
```

**R3:**
```
R3#configure terminal 
R3(config)#interface e0/0
R3(config-if)#ip addr 10.0.1.2 255.255.255.0
R3(config-if)#no sh
R3(config-if)#exit
```

**R4:**
```
R4#configure terminal 
R4(config)#interface e0/0
R4(config-if)#ip addr 10.0.2.2 255.255.255.0
R4(config-if)#no sh
R4(config-if)#exit
```


**2- OSPF Yapılandırması Yapalım:**

**R1:**
```
R1(config)#router ospf 1
R1(config-router)#network 10.0.0.0 0.0.0.255 area 0
R1(config-router)#network 10.0.1.0 0.0.0.255 area 1
R1(config-router)#exit
```

**R2:**
```
R2(config)#router ospf 1
R2(config-router)#network 10.0.0.0 0.0.0.255 area 0
R2(config-router)#network 10.0.2.0 0.0.0.255 area 2
R2(config-router)#exit
```

**R3:**
```
R3(config)#router ospf 1
R3(config-router)#network 10.0.1.0 0.0.0.255 area 1
R3(config-router)#exit
```

**R4:**
```
R4(config)#router ospf 1
R4(config-router)#network 10.0.2.0 0.0.0.255 area 2
R4(config-router)#exit
```


**3-  Authentication Yapılandırması Yapalım:**

**R1 ve R3 arasında yani Area 1'de Plain Text Authentication yapalım;**

**R1:**
```
R1(config)#interface e0/1
R1(config-if)#ip ospf authentication
R1(config-if)#ip ospf authentication-key BESIKTAS
R1(config-if)#exit
```

**R3:**
```
R3(config)#interface e0/0
R3(config-if)#ip ospf authenticatiion
R3(config-if)#ip ospf authentication-key BESIKTAS
R3(config-if)#exit
```


------------------------------------------------------------------------

**R1 ve R2 arasında yani Area 0'ı MD5 Authentication yapalım;**

**R1:**
```
R1(config)#interface e0/0
R1(config-if)#ip ospf message-digest-key 1 md5 feyyaz
R1(config-if)#ip ospf authentication message-digest
```

**R2:**
```
R2(config)#interface e0/0
R2(config-if)#ip ospf message-digest-key 1 md5 feyyaz
R2(config-if)#ip ospf authentication message-digest
R2(config-if)#exit
```

------------------------------------------------------------------------

**R2 ve R4 arasında yani Area 2 SHA-HMAC Authentication yapalım;**

**R2:**
```
R2(config)#key chain R2
R2(config-keychain)#key 1
R2(config-keychain-key)#cryptographic-algorithm hmac-sha-512 
R2(config-keychain-key)#key-string METIN
R2(config-keychain-key)#exit
R2(config-keychain)#exit
R2(config)#interface e0/1
R2(config-if)#ip ospf authentication key-chain R2
```

**R4:**
```
R4(config)#key chain R4
R4(config-keychain)#key 1
R4(config-keychain-key)#cryptographic-algorithm hmac-sha-512
R4(config-keychain-key)#key-string METIN
R4(config-keychain-key)#exit
R4(config-keychain)#exit
R4(config)#interface e0/0
R4(config-if)#ip ospf authentication key-chain R4

```


Teşekkürler,

İyi Çalışmalar.