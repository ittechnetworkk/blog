+++
date = '2024-11-16T22:57:40+01:00'
title = 'Juniper Filtering Output'
tags = ["junos", "juniper"]
categories = ["Network"]
author = "Soner Sahin"
image = "/images/Juniper/cover.jpg"
+++

JunOS işletim sisteminde çıktıları filtrelemek çoğu zaman hayat kurtarır. JunOS'da bazı çıktılar çok uzun olabiliyor, bu çıktıları filtrelemek amacımıza ulaşmak için zamandan tasarruf sağlıyor.

JunOS FreeBSD tabanlı olduğu için Linux işletim sistemi bilenler için komutlara aşağı yukarı aşinalık gösterir.

Linux bilen JunOS'da ve benzeri sistemlerde bir şekilde yolunu bulur.

Çıktıları filtrelemek JunOS'da oldukça kolaydır. Aşağıdaki filtreleme komutlarını ve açıklamalarını görebilirsiniz.

Çıktıları filtrelemek için temel olarak pipe "|" komutu ve devamında amaca uygun komutu kullanmak işi çözecektir.

Genel olarak neleri kullanabildiğimizi görmek için:
İlk olarak filtreleme yapmak istediğimiz komut

```
root# show | ?
Possible completions:
  compare              Compare configuration changes with prior version
  count                Count occurrences
  display              Show additional kinds of information
  except               Show only text that does not match a pattern
  find                 Search for first occurrence of pattern
  hold                 Hold text without exiting the --More-- prompt
  last                 Display end of output only
  match                Show only text that matches a pattern
  no-more              Don't paginate output
  request              Make system-level requests
  resolve              Resolve IP addresses
  save                 Save output text to file
  trim                 Trim specified number of columns from start of line
[edit]
```

Show komutunun olduğu gibi kullanıldığı durumdaki çıktısına bakalım ilk önce:
```
root# show    
## Last changed: 2024-10-03 20:35:44 UTC
version 12.1X47-D20.7;
system {
    services {
        ssh;
        web-management {
            http {
                interface ge-0/0/0.0;
            }
        }
    }
    syslog {
        user * {
            any emergency;
        }
        file messages {
            any any;
            authorization info;
        }
        file interactive-commands {
            interactive-commands any;
        }
    }
    license {                           
        autoupdate {
            url https://ae1.juniper.net/junos/key_retrieval;
        }
    }
    ## Warning: missing mandatory statement(s): 'root-authentication'
}
interfaces {
    ge-0/0/0 {
        unit 0 {
            family inet {
                address 192.168.1.1/24;
                ##
                ## Warning: Incompatible with interface assigned with address
                ##
                dhcp-client;
            }
        }
    }
}
security {
    screen {
        ids-option untrust-screen {
            icmp {                      
                ping-death;
            }
            ip {
                source-route-option;
                tear-drop;
            }
            tcp {
                syn-flood {
                    alarm-threshold 1024;
                    attack-threshold 200;
                    source-threshold 1024;
                    destination-threshold 2048;
                    queue-size 2000; ## Warning: 'queue-size' is deprecated
                    timeout 20;
                }
                land;
            }
        }
    }
    policies {
        from-zone trust to-zone trust {
            policy default-permit {
---(more 54%)---

```

Ve daha da uzuyor.


- **| display set:**

Bu komut ile configürasyonları satır satır gösterir. 

Örneğin:
```
root# show | display set 
set version 12.1X47-D20.7
set system services ssh
set system services web-management http interface ge-0/0/0.0
set system syslog user * any emergency
set system syslog file messages any any
set system syslog file messages authorization info
set system syslog file interactive-commands interactive-commands any
set system license autoupdate url https://ae1.juniper.net/junos/key_retrieval
set interfaces ge-0/0/0 unit 0 family inet address 192.168.1.1/24
set interfaces ge-0/0/0 unit 0 family inet dhcp-client
set security screen ids-option untrust-screen icmp ping-death
set security screen ids-option untrust-screen ip source-route-option
set security screen ids-option untrust-screen ip tear-drop
set security screen ids-option untrust-screen tcp syn-flood alarm-threshold 1024
set security screen ids-option untrust-screen tcp syn-flood attack-threshold 200
set security screen ids-option untrust-screen tcp syn-flood source-threshold 1024
set security screen ids-option untrust-screen tcp syn-flood destination-threshold 2048
set security screen ids-option untrust-screen tcp syn-flood queue-size 2000
set security screen ids-option untrust-screen tcp syn-flood timeout 20
set security screen ids-option untrust-screen tcp land
---(more)---
```

Bu komut süslü parantezleri, tabları vs. kaldırır ve komutları olduğu gibi gösterir.

- **| count:**

Bu komut çıktının kaç satır olduğunu gösterir.

Örneğin:

```
root# show |count         
Count: 126 lines

[edit]
```

Fakat bu komut çıktıları satır satır saydığı için dosyadaki süslü parantezleri de saydığı için satır sayısını yüksek gösterdi.

Biz bu komutu "show | display set | count" şeklinde kullanırsak daha doğru bir sonuç alacağız.

Örneğin:
```
root# show |display set | count
Count: 39 lines

[edit]
```


- **| compare:**

Bu komut yapılan değişiklikleri bize gösterir. Bu komu bizim hali hazırda kullandığımız konfigürasyon dosyası ile o anda yapılan konfigürasyonu karşılaştırır.  Fakat commit işlemi yaptıktan sonra bu komutu çalıştırırsak birşey görünmeyecektir. Çünkü gösterilecek herhangi bir değişiklik kalmayacaktır. Yapılan değişiklik ana konfigürasyon dosyasına kayıt edilecektir.

Örneğin:
```
root# show | compare 
[edit system]
-   autoinstallation {
-       delete-upon-commit;
-       traceoptions {
-           level verbose;
-           flag {
-               all;
-           }
-       }
-   }
[edit interfaces ge-0/0/0 unit 0]
+     family inet {
+         address 192.168.1.1/24;
+     }

[edit]
```

Burada "-" ile gösterilenler silinen konfigürasyonlar, "+" ile gösterilenler eklenen konfigürasyonlardır.

- **| except:**

Bu komuttan sonra vereceğimiz kelimeyi ve o kelimenin kapsadığı çıktıları çıkarır.

Örneğin:
```
root# show | display set 
set version 12.1X47-D20.7
set system services ssh
set system services web-management http interface ge-0/0/0.0
set system syslog user * any emergency
set system syslog file messages any any
set system syslog file messages authorization info
set system syslog file interactive-commands interactive-commands any
set system license autoupdate url https://ae1.juniper.net/junos/key_retrieval
set interfaces ge-0/0/0 unit 0 family inet address 192.168.1.1/24
set security screen ids-option untrust-screen icmp ping-death
set security screen ids-option untrust-screen ip source-route-option
set security screen ids-option untrust-screen ip tear-drop
set security screen ids-option untrust-screen tcp syn-flood alarm-threshold 1024
set security screen ids-option untrust-screen tcp syn-flood attack-threshold 200
set security screen ids-option untrust-screen tcp syn-flood source-threshold 1024
set security screen ids-option untrust-screen tcp syn-flood destination-threshold 2048
set security screen ids-option untrust-screen tcp syn-flood queue-size 2000
set security screen ids-option untrust-screen tcp syn-flood timeout 20
set security screen ids-option untrust-screen tcp land
set security policies from-zone trust to-zone trust policy default-permit match source-address any
set security policies from-zone trust to-zone trust policy default-permit match destination-address any
set security policies from-zone trust to-zone trust policy default-permit match application any
set security policies from-zone trust to-zone trust policy default-permit then permit
set security policies from-zone trust to-zone untrust policy default-permit match source-address any
set security policies from-zone trust to-zone untrust policy default-permit match destination-address any
set security policies from-zone trust to-zone untrust policy default-permit match application any
set security policies from-zone trust to-zone untrust policy default-permit then permit
set security policies from-zone untrust to-zone trust policy default-deny match source-address any
set security policies from-zone untrust to-zone trust policy default-deny match destination-address any
set security policies from-zone untrust to-zone trust policy default-deny match application any
set security policies from-zone untrust to-zone trust policy default-deny then deny
set security zones security-zone trust tcp-rst
set security zones security-zone untrust screen untrust-screen
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services http
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services https
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services ssh
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services telnet
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services dhcp

[edit]
```

Ben bu çıktıdaki "screen" geçen satırları görmek istemiyorum.

```
root# show | display set |except screen    
set version 12.1X47-D20.7
set system services ssh
set system services web-management http interface ge-0/0/0.0
set system syslog user * any emergency
set system syslog file messages any any
set system syslog file messages authorization info
set system syslog file interactive-commands interactive-commands any
set system license autoupdate url https://ae1.juniper.net/junos/key_retrieval
set interfaces ge-0/0/0 unit 0 family inet address 192.168.1.1/24
set security policies from-zone trust to-zone trust policy default-permit match source-address any
set security policies from-zone trust to-zone trust policy default-permit match destination-address any
set security policies from-zone trust to-zone trust policy default-permit match application any
set security policies from-zone trust to-zone trust policy default-permit then permit
set security policies from-zone trust to-zone untrust policy default-permit match source-address any
set security policies from-zone trust to-zone untrust policy default-permit match destination-address any
set security policies from-zone trust to-zone untrust policy default-permit match application any
set security policies from-zone trust to-zone untrust policy default-permit then permit
set security policies from-zone untrust to-zone trust policy default-deny match source-address any
set security policies from-zone untrust to-zone trust policy default-deny match destination-address any
set security policies from-zone untrust to-zone trust policy default-deny match application any
set security policies from-zone untrust to-zone trust policy default-deny then deny
set security zones security-zone trust tcp-rst
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services http
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services https
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services ssh
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services telnet
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services dhcp

[edit]
```

Görüldüğü gibi "screen" geçen hiçbir satır yok.


- **| find:**

Bu komut ise çıktıdaki vereceğimiz komutun alakalı olduğu satırları verecektir. Burada bir kalıp olarak arama yapar.

Örneğin:
```
root# show | display set | find interface 
set system services web-management http interface ge-0/0/0.0
set system syslog user * any emergency
set system syslog file messages any any
set system syslog file messages authorization info
set system syslog file interactive-commands interactive-commands any
set system license autoupdate url https://ae1.juniper.net/junos/key_retrieval
set interfaces ge-0/0/0 unit 0 family inet address 192.168.1.1/24
set security screen ids-option untrust-screen icmp ping-death
set security screen ids-option untrust-screen ip source-route-option
set security screen ids-option untrust-screen ip tear-drop
set security screen ids-option untrust-screen tcp syn-flood alarm-threshold 1024
set security screen ids-option untrust-screen tcp syn-flood attack-threshold 200
set security screen ids-option untrust-screen tcp syn-flood source-threshold 1024
set security screen ids-option untrust-screen tcp syn-flood destination-threshold 2048
set security screen ids-option untrust-screen tcp syn-flood queue-size 2000
set security screen ids-option untrust-screen tcp syn-flood timeout 20
set security screen ids-option untrust-screen tcp land
set security policies from-zone trust to-zone trust policy default-permit match source-address any
set security policies from-zone trust to-zone trust policy default-permit match destination-address any
set security policies from-zone trust to-zone trust policy default-permit match application any
set security policies from-zone trust to-zone trust policy default-permit then permit
set security policies from-zone trust to-zone untrust policy default-permit match source-address any
set security policies from-zone trust to-zone untrust policy default-permit match destination-address any
set security policies from-zone trust to-zone untrust policy default-permit match application any
set security policies from-zone trust to-zone untrust policy default-permit then permit
set security policies from-zone untrust to-zone trust policy default-deny match source-address any
set security policies from-zone untrust to-zone trust policy default-deny match destination-address any
set security policies from-zone untrust to-zone trust policy default-deny match application any
set security policies from-zone untrust to-zone trust policy default-deny then deny
set security zones security-zone trust tcp-rst
set security zones security-zone untrust screen untrust-screen
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services http
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services https
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services ssh
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services telnet
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services dhcp

[edit]
```



- **| match:**

Çıktıda belirli bir kelimenin geçtiği satırı getirir.

Örneğin:
```
root# show | display set | match interface 
set system services web-management http interface ge-0/0/0.0
set interfaces ge-0/0/0 unit 0 family inet address 192.168.1.1/24
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services http
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services https
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services ssh
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services telnet
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services dhcp

[edit]
```



- **| last 10:**

Bu komut çıktının son 10 satırını getirir. Tabi bu artırılıp azaltılabilir.

Örneğin:
```
root# show | display set | last 5    
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services ssh
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services telnet
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services dhcp
                                        
[edit]
```


 - **| no-more:**

Çıktı uzun oladuğu zaman ekranda çıktının tamamı gösterilmez, sayfa sayfa veya satır satır ilerleyebilirsiniz.

Bu komutla tüm çıktıyı direkt ekranda görebilirsiniz. 

Örneğin:
```
root# show | display set 
set version 12.1X47-D20.7
set system services ssh
set system services web-management http interface ge-0/0/0.0
set system syslog user * any emergency
set system syslog file messages any any
set system syslog file messages authorization info
set system syslog file interactive-commands interactive-commands any
set system license autoupdate url https://ae1.juniper.net/junos/key_retrieval
set interfaces ge-0/0/0 unit 0 family inet address 192.168.1.1/24
set security screen ids-option untrust-screen icmp ping-death
set security screen ids-option untrust-screen ip source-route-option
set security screen ids-option untrust-screen ip tear-drop
set security screen ids-option untrust-screen tcp syn-flood alarm-threshold 1024
set security screen ids-option untrust-screen tcp syn-flood attack-threshold 200
set security screen ids-option untrust-screen tcp syn-flood source-threshold 1024
set security screen ids-option untrust-screen tcp syn-flood destination-threshold 2048
set security screen ids-option untrust-screen tcp syn-flood queue-size 2000
set security screen ids-option untrust-screen tcp syn-flood timeout 20
set security screen ids-option untrust-screen tcp land
set security policies from-zone trust to-zone trust policy default-permit match source-address any
---(more)---
```

```
root# show | display set | no-more 
set version 12.1X47-D20.7
set system services ssh
set system services web-management http interface ge-0/0/0.0
set system syslog user * any emergency
set system syslog file messages any any
set system syslog file messages authorization info
set system syslog file interactive-commands interactive-commands any
set system license autoupdate url https://ae1.juniper.net/junos/key_retrieval
set interfaces ge-0/0/0 unit 0 family inet address 192.168.1.1/24
set security screen ids-option untrust-screen icmp ping-death
set security screen ids-option untrust-screen ip source-route-option
set security screen ids-option untrust-screen ip tear-drop
set security screen ids-option untrust-screen tcp syn-flood alarm-threshold 1024
set security screen ids-option untrust-screen tcp syn-flood attack-threshold 200
set security screen ids-option untrust-screen tcp syn-flood source-threshold 1024
set security screen ids-option untrust-screen tcp syn-flood destination-threshold 2048
set security screen ids-option untrust-screen tcp syn-flood queue-size 2000
set security screen ids-option untrust-screen tcp syn-flood timeout 20
set security screen ids-option untrust-screen tcp land
set security policies from-zone trust to-zone trust policy default-permit match source-address any
set security policies from-zone trust to-zone trust policy default-permit match destination-address any
set security policies from-zone trust to-zone trust policy default-permit match application any
set security policies from-zone trust to-zone trust policy default-permit then permit
set security policies from-zone trust to-zone untrust policy default-permit match source-address any
set security policies from-zone trust to-zone untrust policy default-permit match destination-address any
set security policies from-zone trust to-zone untrust policy default-permit match application any
set security policies from-zone trust to-zone untrust policy default-permit then permit
set security policies from-zone untrust to-zone trust policy default-deny match source-address any
set security policies from-zone untrust to-zone trust policy default-deny match destination-address any
set security policies from-zone untrust to-zone trust policy default-deny match application any
set security policies from-zone untrust to-zone trust policy default-deny then deny
set security zones security-zone trust tcp-rst
set security zones security-zone untrust screen untrust-screen
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services http
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services https
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services ssh
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services telnet
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services dhcp

[edit]
```


Bu komutları yukarıdaki örneklerde gördüğünüz gibi kombine edip de kullanabilirsiniz.

Teşekkürler,

İyi Çalışmalar.

