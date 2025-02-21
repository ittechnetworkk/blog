+++
title = "Cisco IOS SSH Konfigürasyonu"
date = "2024-02-07T23:41:02+01:00"
tags = ["Cisco", "SSH"]
categories = ["Network"]
author = "Soner Sahin"
+++

SSH uzak bir cihaza bağlanmak için kullanılan kriptolu ve güvenli bir protokoldür. Defaultta 22 TCP portunu kullanır. Şimdi bir Cisco Router'a nasıl SSH konfigürasyonu yapılır bakalım.
SSH konfigürasyonu birkaç adımdan oluşur.


**A-ROUTER:**

**1:** Hostname ver,
```
vIOS-01>enable
vIOS-01#configure terminal
vIOS-01(config)#hostname R1
```


**2:*** Bir domain-name tanımla,
```
R1(config)#ip domain-name ssnrshnn.local
```

**3:** Bir kullanıcı ve parola tanımla,
```
R1(config)#username suleyman privilege 15 secret seba
```

**4:** Bir key oluştur,
```
R1(config)#crypto key generate rsa general-keys modules 1024
```

**5:** vty moda geçiş yapıyoruz,
```
R1(config)#line vty 0 4
R1(config-line)#login local                       #lokal kullanıcı ile giriş
R1(config-line)#transport input ssh               #sadece ssh
R1(config-line)#exit
```

**6:** SSH Versiyonunu ayarla,
```
R1(config)#ip ssh version 2
```

**7:** Enable password tanımla,
```
R1(config)#enable secret kara
```

**8:** Management Interface'e IP ver,
```
R1(config)#int gi0/0
R1(config-if)#ip address 192.168.1.15 255.255.255.0
R1(config-if)#no sh
```


**B-SWITCH:**
Herşey aynı sayılır. Sadece Switch'de Management Vlan'a IP verilir.

**1:** Hostname ver,
```
vIOS-01>enable
vIOS-01#configure terminal
vIOS-01(config)#hostname SW1
```

**2:*** Bir domain-name tanımla,
```
SW1(config)#ip domain-name ssnrshnn.local
```

**3:** Bir kullanıcı ve parola tanımla,
```
SW1(config)#username suleyman privilege 15 secret seba
```

**4:** Bir key oluştur,
```
SW1(config)#crypto key generate rsa general-keys modules 1024
```

**5:** vty moda geçiş yapıyoruz,
```
SW1(config)#line vty 0 4
SW1(config-line)#login local                       #lokal kullanıcı ile giriş
SW1(config-line)#transport input ssh               #sadece ssh
SW1(config-line)#exit
```

**6:** SSH Versiyonunu ayarla,
```
SW1(config)#ip ssh version 2
```

**7:** Enable password tanımla,
```
SW1(config)#enable secret kartal
```

**8:** Management Vlan'a IP ver,
```
SW1(config)#int vlan 1
SW1(config-if)#ip address 192.168.1.20 255.255.255.0
SW1(config-if)#no sh
```
