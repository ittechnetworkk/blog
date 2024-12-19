+++
date = '2024-04-07T22:57:40+01:00'
title = 'OSPF LAB'
tags = ["IPv4", "routing", "ospf"]
author = "Soner Sahin"
+++
Bu Lab’daki amacım OSPF’in genel bir tekrarını yapmak olacak. Komutları uzun uzun yazıyor olacağım.

Aşağıdaki topolojiyi uygulayacağım.

![ospf](/images/OSPFLAB/1.png)


 Bu Lab'da istenilenler topolojinin sol üst köşesinde yazıyor. 
 
Buna göre;

**1- İlk olarak router interfacelerine ve VPC'lere sırasıyla IP'lerini vererek başlıyorum.**
 
**R1:**
```
R1#configure terminal 
R1(config)#int e0/0
R1(config-if)#ip addr 10.0.1.1 255.255.255.0
R1(config-if)#no sh
R1(config-if)#int e0/1
R1(config-if)#ip address 10.0.3.1 255.255.255.0
R1(config-if)#no sh
R1(config-if)#int e0/2
R1(config-if)#ip addr 10.0.4.1 255.255.255.0
R1(config-if)#no sh
R1(config-if)#int e0/3
R1(config-if)#ip addr 10.0.2.1 255.255.255.0
R1(config-if)#no sh
R1(config-if)#int e1/0
R1(config-if)#ip addr 10.0.0.1 255.255.255.0
R1(config-if)#no sh
R1(config-if)#exit
```

**R2:**
```
R2#configure terminal 
R2(config)#int e0/0
R2(config-if)#ip addr 10.0.2.2 255.255.255.0
R2(config-if)#no sh
R2(config-if)#int e0/1
R2(config-if)#ip addr 10.0.20.1 255.255.255.0
R2(config-if)#no sh
R2(config-if)#int e0/2
R2(config-if)#ip addr 10.0.60.1 255.255.255.0
R2(config-if)#no sh
R2(config-if)#exit 
```

**R3:**
```
R3#configure terminal 
R3(config)#int e0/1
R3(config-if)#ip addr 10.0.1.2 255.255.255.0
R3(config-if)#no sh
R3(config-if)#int e0/0
R3(config-if)#ip addr 10.0.10.1 255.255.255.0
R3(config-if)#no sh
R3(config-if)#int e0/2
R3(config-if)#ip addr 10.0.50.1 255.255.255.0
R3(config-if)#no sh
R3(config-if)#exit
```

**R4:**
```
R4#configure terminal 
R4(config)#int e0/0
R4(config-if)#ip addr 10.0.4.2 255.255.255.0
R4(config-if)#no sh
R4(config-if)#int e0/1
R4(config-if)#ip addr 10.0.40.1 255.255.255.0
R4(config-if)#no sh
R4(config-if)#int e0/2
R4(config-if)#ip addr 10.0.61.1 255.255.255.0
R4(config-if)#no sh
R4(config-if)#exit
```

**R5:**
```
R5#configure terminal 
R5(config)#int e0/0
R5(config-if)#ip addr 10.0.3.2 255.255.255.0
R5(config-if)#no sh
R5(config-if)#int e0/1
R5(config-if)#ip addr 10.0.30.1 255.255.255.0
R5(config-if)#no sh
R5(config-if)#int e0/2
R5(config-if)#ip addr 10.0.51.1 255.255.255.0
R5(config-if)#no sh
R5(config-if)#exit
```

**R6:**
```
R6#configure terminal 
R6(config)#int e0/0
R6(config-if)#ip addr 10.0.0.2 255.255.255.0
R6(config-if)#no sh
R6(config-if)#int e0/1
R6(config-if)#ip addr 172.16.1.1 255.255.255.0
R6(config-if)#no sh
R6(config-if)#exit
```

**R7:**
```
R7#configure terminal 
R7(config)#int e0/0
R7(config-if)#ip addr 172.16.1.2 255.255.255.0
R7(config-if)#no sh
R7(config-if)#int loopback 0
R7(config-if)#ip address 192.168.1.1 255.255.255.0
R7(config-if)#no sh
R7(config-if)#exit
```

**R16:**
```
R16#configure terminal 
R16(config)#int e0/0
R16(config-if)#ip addr 10.0.51.2 255.255.255.0
R16(config-if)#no sh
R16(config-if)#int e0/1
R16(config-if)#ip addr 10.0.71.1 255.255.255.0
R16(config-if)#no sh
R16(config-if)#exit
```


**R17:**
```
R17#configure terminal 
R17(config)#int e0/1
R17(config-if)#ip addr 10.0.50.2 255.255.255.0
R17(config-if)#no sh
R17(config-if)#int e0/0
R17(config-if)#ip addr 10.0.70.1 255.255.255.0
R17(config-if)#no sh
R17(config-if)#exit
```


**R18:**
```
R18#configure terminal 
R18(config)#int e0/0
R18(config-if)#ip addr 10.0.71.2 255.255.255.0
R18(config-if)#no sh
R18(config-if)#int e0/1
R18(config-if)#ip addr 10.0.70.2 255.255.255.0
R18(config-if)#no sh
R18(config-if)#int loopback 0                      
R18(config-if)#ip address 10.0.100.1 255.255.255.0    
R18(config-if)#no sh
R18(config-if)#exit
```


**R19:**
```
R19#configure terminal 
R19(config)#int e0/0
R19(config-if)#ip addr 10.0.60.2 255.255.255.0
R19(config-if)#no sh
R19(config-if)#int e0/1
R19(config-if)#ip addr 10.0.80.1 255.255.255.0
R19(config-if)#no sh
R19(config-if)#exit
```

**R20:**
```
R20#configure terminal 
R20(config)#int e0/0
R20(config-if)#ip addr 10.0.61.2 255.255.255.0
R20(config-if)#no sh
R20(config-if)#int e0/1
R20(config-if)#ip addr 10.0.81.1 255.255.255.0
R20(config-if)#no sh
R20(config-if)#exit
```

**R21:**
```
R21#configure terminal 
R21(config)#int e0/0
R21(config-if)#ip addr 10.0.80.2 255.255.255.0
R21(config-if)#no sh
R21(config-if)#int e0/1
R21(config-if)#ip addr 10.0.81.2 255.255.255.0
R21(config-if)#no sh
R21(config-if)#int loopback 0
R21(config-if)#ip addr
R21(config-if)#ip addr 10.0.110.1 255.255.255.0
R21(config-if)#no sh
R21(config-if)#exit
```

**VPC1:**
```
VPCS> ip 10.0.10.10 255.255.255.0 gateway 10.0.10.1 
Checking for duplicate address...
VPCS : 10.0.10.10 255.255.255.0 gateway 10.0.10.1
```

**VPC2:**
```
VPCS> ip 10.0.20.10 255.255.255.0 gateway 10.0.20.1
Checking for duplicate address...
VPCS : 10.0.20.10 255.255.255.0 gateway 10.0.20.1
```

**VPC3:**
```
VPCS> ip 10.0.30.10 255.255.255.0 gateway 10.0.30.1
Checking for duplicate address...
VPCS : 10.0.30.10 255.255.255.0 gateway 10.0.30.1
```

**VPC4:**
```
VPCS> ip 10.0.40.10 255.255.255.0 gateway 10.0.40.1
Checking for duplicate address...
VPCS : 10.0.40.10 255.255.255.0 gateway 10.0.40.1
```

**2- OSPF çalıştır ve networkleri duyur.**

**R1:**
```
R1(config)#router ospf 1
R1(config-router)#router-id 1.1.1.1
R1(config-router)#network 10.0.0.1 0.0.0.0 area 0
R1(config-router)#network 10.0.1.1 0.0.0.0 area 0
R1(config-router)#network 10.0.2.1 0.0.0.0 area 0
R1(config-router)#network 10.0.3.1 0.0.0.0 area 0
R1(config-router)#network 10.0.4.1 0.0.0.0 area 0
R1(config-router)#exit
```

**R2:**
```
R2(config)#router ospf 1
R2(config-router)#router-id 2.2.2.2
R2(config-router)#network 10.0.2.2 0.0.0.0 area 0
R2(config-router)#network 10.0.20.1 0.0.0.0 area 2
R2(config-router)#network 10.0.60.1 0.0.0.0 area 6
R2(config-router)#exit
```

**R3:**
```
R3(config)#router ospf 1
R3(config-router)#router-id 3.3.3.3
R3(config-router)#network 10.0.1.2 0.0.0.0 area 0
R3(config-router)#network 10.0.10.1 0.0.0.0 area 1
R3(config-router)#network 10.0.50.1 0.0.0.0 area 5
R3(config-router)#exit
```

**R4:**
```
R4(config)#router ospf 1
R4(config-router)#router-id 4.4.4.4
R4(config-router)#network 10.0.4.2 0.0.0.0 area 0
R4(config-router)#network 10.0.40.1 0.0.0.0 area 4
R4(config-router)#network 10.0.61.1 0.0.0.0 area 6
R4(config-router)#exit
```

**R5:**
```
R5(config)#router ospf 1
R5(config-router)#router-id 5.5.5.5
R5(config-router)#network 10.0.3.2 0.0.0.0 area 0
R5(config-router)#network 10.0.30.1 0.0.0.0 area 3
R5(config-router)#network 10.0.51.1 0.0.0.0 area 5
R5(config-router)#exit
```

**R6:**
```
R6(config)#router ospf 1
R6(config-router)#router-id 6.6.6.6
R6(config-router)#network 10.0.0.2 0.0.0.0 area 0
R6(config-router)#exit
```

**R16:**
```
R16(config)#router ospf 1
R16(config-router)#router-id 16.16.16.16
R16(config-router)#network 10.0.51.2 0.0.0.0 area 5
R16(config-router)#network 10.0.71.1 0.0.0.0 area 7
R16(config-router)#exit
```

**R17:**
```
R17(config)#router ospf 1
R17(config-router)#router-id 17.17.17.17
R17(config-router)#network 10.0.50.2 0.0.0.0 area 5
R17(config-router)#network 10.0.70.1 0.0.0.0 area 7
R17(config-router)#exit
```

**R18:**
```
R18(config)#router ospf 1
R18(config-router)#router-id 18.18.18.18
R18(config-router)#network 10.0.70.2 0.0.0.0 area 7
R18(config-router)#network 10.0.71.2 0.0.0.0 area 7
R18(config-router)#network 10.0.100.1 0.0.0.0 area 7
R18(config-router)#exit
```

**R19:**
```
R19(config)#router ospf 1
R19(config-router)#router-id 19.19.19.19
R19(config-router)#network 10.0.60.2 0.0.0.0 area 6
R19(config-router)#network 10.0.80.1 0.0.0.0 area 8
R19(config-router)#exit
```

**R20:**
```
R20(config)#router ospf 1
R20(config-router)#router-id 20.20.20.20
R20(config-router)#network 10.0.61.2 0.0.0.0 area 6
R20(config-router)#network 10.0.81.1 0.0.0.0 area 8
R20(config-router)#exit
```

**R21:**
```
R21(config)#router ospf 1
R21(config-router)#router-id 21.21.21.21
R21(config-router)#network 10.0.80.2 0.0.0.0 area 8
R21(config-router)#network 10.0.81.2 0.0.0.0 area 8
R21(config-router)#network 10.0.110.1 0.0.0.0 area 8
R21(config-router)#exit
```


**3- Default değeri 100 Mbps olan bant genişliğini 1 Gbps olarak ayarla.**

**R1:**
```
R1(config)#router ospf 1
R1(config-router)#auto-cost reference-bandwidth 1000
R1(config-router)#exit
```

**R2:**
```
R2(config)#router ospf 1
R2(config-router)#auto-cost reference-bandwidth 1000
R2(config-router)#exit
```

**R3:**
```
R3(config)#router ospf 1
R3(config-router)#auto-cost reference-bandwidth 1000
R3(config-router)#exit
```

**R4:**
```
R4(config)#router ospf 1
R4(config-router)#auto-cost reference-bandwidth 1000
R4(config-router)#exit
```

**R5:**
```
R5(config)#router ospf 1
R5(config-router)#auto-cost reference-bandwidth 1000
R5(config-router)#exit
```

**R6:**
```
R6(config)#router ospf 1
R6(config-router)#auto-cost reference-bandwidth 1000
R6(config-router)#exit
```

**R16:**
```
R16(config)#router ospf 1
R16(config-router)#auto-cost reference-bandwidth 1000
R16(config-router)#exit
```

**R17:**
```
R17(config)#router ospf 1
R17(config-router)#auto-cost reference-bandwidth 1000
R17(config-router)#exit
```

**R18:**
```
R18(config)#router ospf 1
R18(config-router)#auto-cost reference-bandwidth 1000
R18(config-router)#exit
```

**R19:**
```
R19(config)#router ospf 1
R19(config-router)#auto-cost reference-bandwidth 1000
R19(config-router)#exit
```

**R20:**
```
R20(config)#router ospf 1
R20(config-router)#auto-cost reference-bandwidth 1000
R20(config-router)#exit
```

**R21:**
```
R21(config)#router ospf 1
R21(config-router)#auto-cost reference-bandwidth 1000
R21(config-router)#exit
```


**4- Passive Interfaceleri ayarla.**
Routerlarda çok fazla interface var, bundan dolayı sadece birer tane olacak şekilde kısa kısa göstereceğim. Burada "Hello" paketlerinin gitmesini istemediğimiz interfaceleri pasif konuma getiriyoruz.

**R1:**
```
R1(config)#router ospf 1
R1(config-router)#passive-interface e1/1  
R1(config-router)#exit
```

**R2:**
```
R2(config)#router ospf 1
R2(config-router)#passive-interface e1/1
```

**R3:**
```
R3(config)#router ospf 1
R3(config-router)#passive-interface e1/1
R3(config-router)#exit
```

**R4:**
```
R4(config)#router ospf 1
R4(config-router)#passive-interface e1/1
R4(config-router)#exit
```

**R5:**
```
R5(config)#router ospf 1
R5(config-router)#passive-interface e1/1
R5(config-router)#exit
```

**R6:**
```
R6(config)#router ospf 1
R6(config-router)#passive-interface e1/1
R6(config-router)#exit
```

**R16:**
```
R16(config)#router ospf 1
R16(config-router)#passive-interface e1/1
R16(config-router)#exit
```

**R17:**
```
R17(config)#router ospf 1
R17(config-router)#passive-interface e1/1
R17(config-router)#exit
```

**R18:**
```
R18(config)#router ospf 1
R18(config-router)#passive-interface e1/1
R18(config-router)#exit
```

**R19:**
```
R19(config)#router ospf 1
R19(config-router)#passive-interface e1/1
R19(config-router)#exit
```

**R20:**
```
R20(config)#router ospf 1
R20(config-router)#passive-interface e1/1
R20(config-router)#exit
```

**R21:**
```
R21(config)#router ospf 1
R21(config-router)#passive-interface e1/1
R21(config-router)#exit
```


**5- R6 Router'ı üzerinde Default Route yaz.**
Bunun anlamı; bilmediğin her rotayı ona sor. Yani Default Gateway'e sor. Ben burada örnek olması için farklı Autonomous System olan R7'nin Interfacesini yazacağım

**R6:**
```
R6(config)#ip route 0.0.0.0 0.0.0.0 172.16.1.2
```

**6- Default Route'u yayınla.**

**R6:**
```
R6(config)#router ospf 1
R6(config-router)#default-information originate 
R6(config-router)#exit
```


**7- SHA512 Authentication yapılandır.**

**R1:**
```
R1(config)#key chain R1
R1(config-keychain)#key 1
R1(config-keychain-key)#cryptographic-algorithm hmac-sha-512 
R1(config-keychain-key)#key-string besiktas
R1(config-keychain-key)#exit
R1(config-keychain)#exit
---------------------------------------------------------------------------
#Buraya Kadar Anahtar Oluşturduk, Şimdi de Interface Altında Uygulayacağız.
---------------------------------------------------------------------------
R1(config)#interface e0/0
R1(config-if)#ip ospf authentication key-chain R1
R1(config-if)#int e0/1
R1(config-if)#ip ospf authentication key-chain R1
R1(config-if)#int e0/2
R1(config-if)#ip ospf authentication key-chain R1
R1(config-if)#int e0/3
R1(config-if)#ip ospf authentication key-chain R1
R1(config-if)#int e1/0
R1(config-if)#ip ospf authentication key-chain R1
R1(config-if)#exit
```

**R2:**
```
R2(config)#key chain R2
R2(config-keychain)#key 1
R2(config-keychain-key)#cryptographic-algorithm hmac-sha-512 
R2(config-keychain-key)#key-string besiktas
R2(config-keychain-key)#exit
R2(config-keychain)#exit
R2(config)#interface e0/0
R2(config-if)#ip ospf authentication key-chain R2
R2(config-if)#int e0/2
R2(config-if)#ip ospf authentication key-chain R2
R2(config-if)#exit
```

**R3:**
```
R3(config)#key chain R3
R3(config-keychain)#key 1
R3(config-keychain-key)#cryptographic-algorithm hmac-sha-512
R3(config-keychain-key)#key-string besiktas
R3(config-keychain-key)#exit
R3(config-keychain)#exit 
R3(config)#interface e0/1
R3(config-if)#ip ospf authentication key-chain R3
R3(config-if)#int e0/2
R3(config-if)#ip ospf authentication key-chain R3
R3(config-if)#exit
```

**R4:**
```
R4(config)#key chain R4
R4(config-keychain)#key 1
R4(config-keychain-key)#cryptographic-algorithm hmac-sha-512 
R4(config-keychain-key)#key-string besiktas
R4(config-keychain-key)#exit
R4(config-keychain)#exit
R4(config)#interface e0/0
R4(config-if)#ip ospf authentication key-chain R4
R4(config-if)#int e0/2
R4(config-if)#ip ospf authentication key-chain R4
R4(config-if)#exit
```

**R5:**
```
R5(config)#key chain R5
R5(config-keychain)#key 1
R5(config-keychain-key)#cryptographic-algorithm hmac-sha-512 
R5(config-keychain-key)#key-string besiktas
R5(config-keychain-key)#exit
R5(config-keychain)#exit
R5(config)#interface e0/0
R5(config-if)#ip ospf authentication key-chain R5
R5(config-if)#int e0/2
R5(config-if)#ip ospf authentication key-chain R5
R5(config-if)#exit
```

**R6:**
```
R6(config)#key chain R6
R6(config-keychain)#key 1
R6(config-keychain-key)#cryptographic-algorithm hmac-sha-512 
R6(config-keychain-key)#key-string besiktas
R6(config-keychain-key)#exit
R6(config-keychain)#exit
R6(config)#interface e0/0
R6(config-if)#ip ospf authentication key-chain R6
R6(config-if)#exit
```

**R16:**
```
R16(config)#key chain R16
R16(config-keychain)#key 1
R16(config-keychain-key)#cryptographic-algorithm hmac-sha-512 
R16(config-keychain-key)#key-string besiktas
R16(config-keychain-key)#exit
R16(config-keychain)#exit
R16(config)#int e0/0
R16(config-if)#ip ospf authentication key-chain R16
R16(config-if)#int e0/1
R16(config-if)#ip ospf authentication key-chain R16
R16(config-if)#exit
```

**R17:**
```
R17(config)#key chain R17
R17(config-keychain)#key 1
R17(config-keychain-key)#cryptographic-algorithm hmac-sha-512 
R17(config-keychain-key)#key-string besiktas
R17(config-keychain-key)#exit
R17(config-keychain)#exit
R17(config)#int e0/1
R17(config-if)#ip ospf authentication key-chain R17
R17(config-if)#int e0/0
R17(config-if)#ip ospf authentication key-chain R17
R17(config-if)#exit
```

**R18:**
```
R18(config)#key chain R18
R18(config-keychain)#key 1 
R18(config-keychain-key)#cryptographic-algorithm hmac-sha-512 
R18(config-keychain-key)#key-string besiktas
R18(config-keychain-key)#exit
R18(config-keychain)#exit
R18(config)#int e0/0
R18(config-if)#ip ospf authentication key-chain R18
R18(config-if)#int e0/1
R18(config-if)#ip ospf authentication key-chain R18
R18(config-if)#exit
```

**R19:**
```
R19(config)#key chain R19
R19(config-keychain)#key 1
R19(config-keychain-key)#cryptographic-algorithm hmac-sha-512 
R19(config-keychain-key)#key-string besiktas
R19(config-keychain-key)#exit
R19(config-keychain)#exit
R19(config)#int e0/0 
R19(config-if)#ip ospf authentication key-chain R19
R19(config-if)#int e0/1
R19(config-if)#ip ospf authentication key-chain R19
R19(config-if)#exit
```

**R20:**
```
R20(config)#key chain R20
R20(config-keychain)#key 1
R20(config-keychain-key)#cryptographic-algorithm hmac-sha-512
R20(config-keychain-key)#key-string besiktas
R20(config-keychain-key)#exit
R20(config-keychain)#exit
R20(config)#int e0/0
R20(config-if)#ip ospf authentication key-chain R20
R20(config-if)#int e0/1
R20(config-if)#ip ospf authentication key-chain R20
R20(config-if)#exit
```

**R21:**
```
R21(config)#key chain R21
R21(config-keychain)#key 1
R21(config-keychain-key)#cryptographic-algorithm hmac-sha-512
R21(config-keychain-key)#key-string besiktas
R21(config-keychain-key)#exit
R21(config-keychain)#exit
R21(config)#int e0/0
R21(config-if)#ip ospf authentication key-chain R21
R21(config-if)#int e0/1
R21(config-if)#ip ospf authentication key-chain R21
R21(config-if)#exit
```


**8- Virtual Link Yapılandır (R16-R5) (R3-R17) (R2-R19) (R4-R20)**
Virtual link yapmamızın amacı Area 0'a doğrudan bağlantısı olmayan areaların sanal bir link ile bağlanmasını sağlamak. Peki Area 0'a doğrudan bağlı olmayan arealara ne olur? Örneğin Virtual Link olmadan R21 Router'ının routing tablosuna bakalım:

![ospf](/images/OSPFLAB/2.png)

Hiçbir şey yok. Yani bu router diğer networklere gidemez. Bir de yaptıktan sonra tekrar bakalım.

*Virtual Link 1*
**R16:**
```
R16(config)#router ospf 1
R16(config-router)#area 5 virtual-link 5.5.5.5
R16(config-router)#exit
```

**R5:**
```
R5(config)#router ospf 1
R5(config-router)#area 5 virtual-link 16.16.16.16
R5(config-router)#exit
```


*Virtual Link 2*
**R17:**
```
R17(config)#router ospf 1
R17(config-router)#area 5 virtual-link 3.3.3.3
R17(config-router)#exit
```

**R3:**
```
R3(config)#router ospf 1
R3(config-router)#area 5 virtual-link 17.17.17.17
R3(config-router)#exit
```


*Virtual Link 3*
**R2:**
```
R2(config)#router ospf 1
R2(config-router)#area 6 virtual-link 19.19.19.19
R2(config-router)#exit
```

**R19:**
```
R19(config)#router ospf 1
R19(config-router)#area 6 virtual-link 2.2.2.2
R19(config-router)#exit
```


*Virtual Link 4*
**R4:**
```
R4(config)#router ospf 1
R4(config-router)#area 6 virtual-link 20.20.20.20
R4(config-router)#exit
```

**R20:**
```
R20(config)#router ospf 1
R20(config-router)#area 6 virtual-link 4.4.4.4
R20(config-router)#exit
```

Şimdi de yine örnekten devam ederek R21 Router'ının routing tablosuna bakalım.

![ospf](/images/OSPFLAB/3.png)

Görüldüğü gibi artık bir hayli route birden eklenmiş oldu. Artık diğer networklere erişebilir hale geldi. 
Virtual-Link yapmanın amacı budur.

R21'de bazı networklere gitmek için 2 rota görünüyor bir tanesi 81.1'den diğeri ise 80.1'den. Bu durumda OSPF yük dengeleme yapacaktır. Eğer istersem bu rotalardan birini önceliklendirebilirim. Eğer ki illa R19'dan değil de R20'den gitsin istersem R21'in interfacesi altında cost değeriyle oynayarak bunu yapabilirim.
Örnek olarak yapalım. Yukarda görüldüğü üzre 10.0.0.0/24 networküne giden iki rotanın da Cost değeri 400. OSPF en düşük Cost değerindeki interfaceden paketi gönderir. Bundan dolayı e0/0 interfacesine Cost değeri olarak 2, e0/1 interfacesine de 1 Cost değeri verirsem olay tatlıya bağlanır. Unutulmamalıdır ki bu değişiklik, ilgili interfacelerden gidilen diğer rotaları da etkileyecektir.
Başlayalım,

**R21:**
```
R21(config)#interface e0/1
R21(config-if)#ip ospf cost 1
R21(config-if)#int e0/0
R21(config-if)#ip ospf cost 2
R21(config-if)#exit
```

Şimdi route tablosuna tekrar bakalım.

![ospf](/images/OSPFLAB/4.png)




Dediğim gibi tabloda da bir hayli değişiklik olmuş oldu. 

Devam edelim.


**9- R6 ve R7 Router'ları üzerinde EIGRP yapılandır.**

Başka Dynamic Routing protokolü kullanan networklerle iletişim kurmak için Redistribution yapmamız gerek. Örnek olarak ben bu topolojide R7 adında bir Router oluşturdum ve burada da EIGRP koşturacağım. Daha sonra da OSPF-EIGRP Redistribution yapılandıracağım.
Bunun için R7'de basit bir şekilde EIGRP konfigürasyonu yapıyorum.

**R7:**
```
R7(config)#router eigrp 100
R7(config-router)#network 192.168.1.1 0.0.0.0
R7(config-router)#network 172.16.1.2 0.0.0.0
R7(config-router)#exit
```

Şimdi R6'da da yine aynı şekilde bir de EIGRP protokolü çalıştıracağım. Bu sayede Redistribution yapabiliyor olacağım. EIGRP çalıştırırken AS numarasının aynı olması gerekmektedir. Aksi halde komşuluk kurulmaz. R7'de 100 olarak yapılandırdım. Aynı şekilde R6'da da 100 olarak yapılandırıyorum.

**R6:**
```
R6(config)#router eigrp 100
R6(config-router)#net
R6(config-router)#network 172.16.1.1 0.0.0.0
R6(config-router)#exit
```


**10- Redistribution yap (EIGRP).**
Şimdi sıra tabloları aktarıp döndermekte.

**R6:**
```
R6(config)#router eigrp 100
R6(config-router)#redistribute ospf 1 metric 10000 1000 255 1 1500
R6(config-router)#exit
R6(config)#router ospf 1
R6(config-router)#redistribute eigrp 100 metric 66 metric-type 1 subnet tag 555
```


**11- Test et.**
Son olarak en uç cihazlardan birkaç ping testi yapalım.

VPC3'den R21 Loopback IP'sine (10.0.110.1)
**VPC3:**
```
VPCS> ping 10.0.110.1
84 bytes from 10.0.110.1 icmp_seq=1 ttl=251 time=5.771 ms
84 bytes from 10.0.110.1 icmp_seq=2 ttl=251 time=1.833 ms
84 bytes from 10.0.110.1 icmp_seq=3 ttl=251 time=1.449 ms
84 bytes from 10.0.110.1 icmp_seq=4 ttl=251 time=6.742 ms
84 bytes from 10.0.110.1 icmp_seq=5 ttl=251 time=1.507 ms

```

VPC1'den VPC4'e
**VPC1:**
```
VPCS> ping 10.0.40.10
84 bytes from 10.0.40.10 icmp_seq=1 ttl=61 time=8.473 ms
84 bytes from 10.0.40.10 icmp_seq=2 ttl=61 time=1.220 ms
84 bytes from 10.0.40.10 icmp_seq=3 ttl=61 time=1.260 ms
84 bytes from 10.0.40.10 icmp_seq=4 ttl=61 time=1.142 ms
84 bytes from 10.0.40.10 icmp_seq=5 ttl=61 time=1.180 ms
```

VPC2'den R7'nin Loopback IP'sine (192.168.1.1)
**VPC2:**
```
VPCS> ping 192.168.1.1
84 bytes from 192.168.1.1 icmp_seq=1 ttl=252 time=4.994 ms
84 bytes from 192.168.1.1 icmp_seq=2 ttl=252 time=4.879 ms
84 bytes from 192.168.1.1 icmp_seq=3 ttl=252 time=4.704 ms
84 bytes from 192.168.1.1 icmp_seq=4 ttl=252 time=1.288 ms
84 bytes from 192.168.1.1 icmp_seq=5 ttl=252 time=5.089 ms

```

Artık bütün networkler birbirlerine gidebildiğine göre Lab başarıyla tamamlanmıştır.

Teşekkürler,

İyi Çalışmalar.