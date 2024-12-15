+++
date = '2024-07-28T22:57:40+01:00'
title = 'Network Troubleshooting'
tags = ["troubleshooting"]
author = "Soner Sahin"
+++

İlk olarak eğer hatanın nereden kaynaklandığını az çok tahmin edebiliyorsak ilk o noktaya yoğunlaşmakta fayda olacağını düşünüyorum diyerek başlamak istiyorum.

Network'te bir sorunu çözerken yaklaşımımızın adım adım olacak şekilde ilk olarak en yakınımızdaki cihaz veya uygulama veya katman olmalıdır.

Peki ne demek istiyorum?

Aşağıda örnek bir senaryom var. Bu senaryoda PC1 İnternete erişemediğini varsayalım.

![troubleshooting](/images/network-troubleshooting/1.png)

Buradaki senaryomda, PC'nin bütün ayarlarını gözden geçirdikten sonra yani PC'nin Ethernet kablosu, IP Adres, Default Gateway, DNS gibi. 

Ethernet bağlantısında sıkıntı olmadığını anladıktan sonra PC'nin diğer bilgilerinin doğruluğunu teyit etmek için aşağıdaki komutları kullanabiliriz.

Linux:
```
ifconfig
```

```
┌─[ssnrshnn@monster]─[~]
└──╼ $ifconfig 
docker0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        inet 172.17.0.1  netmask 255.255.0.0  broadcast 172.17.255.255
        ether xx.xx.xx.xx  txqueuelen 0  (Ethernet)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

enp4s0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet x.x.x.x  netmask 255.255.255.0  broadcast 192.168.0.255
        ether xx.xx.xx.xx  txqueuelen 1000  (Ethernet)
        RX packets 1708125  bytes 2179572414 (2.1 GB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 820899  bytes 120349323 (120.3 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 59715  bytes 9639629 (9.6 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 59715  bytes 9639629 (9.6 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

Windows:
```
ipconfig
ipconfig /all
```

Router'ın sol bacağına ulaşılıp ulaşılamadığı kontrol edilir.

Eğer sorunsuz bir şekilde ping'e eğer karşılık yok ise, sorunun kapsamını ve kafamızda bazı olabilecek olası sorunlar canlanabilir.

Örneğin, PC ve Router arasındaki kablolamada bir sorun olabilir(bakır kablolarda manyetik alandan geçiyorsa sorun olabilir veya yanlış çakılmış olabilir vs.), Router Interface'sinde sorun olabilir(IP adresi, subnet hataları vb.) gibi gibi sorunlar. 

Bu kısma yoğunlaşıp hatayı düzeltip devam edebiliriz.

Bir sonraki adım, Router'ın sağ bacağına gitmek olacak. Buraya da sorunsuz ulaşabiliyorsak, diyebiliz ki Network Layer'da sorun yok.

Eğer sorun varsa yine aynı şekilde birkaç senaryo canlanabilir:

Örneğin; Routing'lerde bir sorun olabilir veya yanlış yazılmış olabilir, yine aynı şekilde Interface'de bir yanlışlık yapılmış olabilir, ACL'lerde bir sıralama hatası veya yanlış yazım hatası olabilir gibi gibi.

Bu noktaya yoğunlaşıp hatayı düzeltip devam edebiliriz.

Peki sorun networkümüzde değil de nerede? Bir sonraki adımda kime gideceğiz?

Bu noktada ve aslında birçok noktada yorumlayabileceğimiz ve kullanabileceğimiz bir takım araçlar var.

Yorum kısmında yapılacak şey ping mesajlarına dönen cevap.

Ping'e dönen yanıtlar bize bazı bilgiler verebilir. 

Örneğin:

1. **Unknown host**: Bu yanıt, girdiğiniz ana bilgisayar adının veya IP adresinin tanınmadığını veya bir IP adresine çözümlenemediğini gösterir.
2. **Destination host unreachable**:  Hedefe Erişilemedi
3. **General failure error**: Bu yanıt genellikle ping işlemi sırasında meydana gelen daha genel bir hatayı gösterir. 
4. **Request timed out**: Genellikle hedef ana bilgisayarın veya ağın ping isteğine yanıt vermediğini gösterir.
5. **Time to Live Exceeded:** Zaman aşımı

Bir diğer araç olan "tracert" da networkte sorun çözerken işimize yarayacaktır.

tracert aracı ile birlikte gideceğimiz hedefi belirtirsek, hedefe giderken geçilen routerları önümüze çıkaracaktır.

tracert aracının Linux'taki karşılığı "traceroute"dir.

Örnek bir tracert çıktısı:
```
┌─[ssnrshnn@monster]─[~]
└──╼ $traceroute 8.8.8.8
traceroute to 8.8.8.8 (8.8.8.8), 30 hops max, 60 byte packets
 1  _gateway (X.X.X.X)  65.569 ms  65.541 ms  65.756 ms
 2  x.x.x.x (x.x.x.x)  65.794 ms  66.009 ms  66.041 ms
 3  irb-472.agg1v.sof1.bg.m247.ro (x.x.x.x)  70.382 ms  70.376 ms  70.368 ms
 4  ae102-3102.bb1n.sof1.bg.m247.ro (x.x.x.x)  70.258 ms  70.190 ms  74.961 ms
 5  185.148.161.17 (185.148.161.17)  90.743 ms  70.140 ms  65.796 ms
 6  178.132.85.120 (178.132.85.120)  108.410 ms 173.194.121.208 (173.194.121.208)  145.002 ms 178.132.85.120 (178.132.85.120)  144.919 ms
 7  * * *
 8  dns.google (8.8.8.8)  115.157 ms  115.041 ms  115.032 ms

```

Görüldüğü gibi 8.8.8.8 adresine giderken hangi routerlar üzerinden geçtiğimizi görebiliyoruz.

Peki biz internete çıkabiliyoruz ama sorun nerede?

Sorun belki de gitmek istediğimiz yerdedir?

Hedef portun açık olup olmadığını kontrol edebiliriz.

Bunun için "telnet" aracını kullanabiliriz. Veya "nmap".

Telnet sadece uzak bağlantılar için değil portun açık olup olmadığını anlamak için de kullanabiliriz.

Örneğin, hedef cihazın 80 portunun açık olup olmadığına bakalım:

```
telnet 10.10.50.55 80
```

Peki başka ne gibi sorunlar karşımıza çıkabilir?
- Routing (Statik, Dinamik), 
- Firewall Kuralları ile ilgili yanlış konfigürasyon,
- VPN sorunları,
- DNS Sorunları,
- DHCP Server yanlış konfigürasyonu veya Server'ın hizmet verememesi,
- Switch yanlış konfigürasyonu,
- IP-Subnet hatalı konfigürasyonu,
- ACL'lerin hatalı konfigürasyonu,
- ISP kaynaklı sorunlar,
- Loop sorunları.

Sorun zaten büyük ihtimalle en fazla 2 veya 3 gözden geçirmeden sorun bulunmuş ve çözülmüş olacaktır.

Burada örnek bir senaryoda anlatmak istediğim şey networkte sorun çözerken adım adım soruna nasıl yaklaşmamız gerektiğine değinmekti.

Bu ve bu tarz network sorunlarını da aynı yaklaşımla bulmak ve düzeltmek işimizi kolaylaştıractır.

Bunların dışında Network'te sorun çözerken kullanılan diğer araçlar:

1. **nslookup:** DNS kayıtlarıyla ilgili bilgiler verir. Örnek bir nslookup çıktısı:
```
┌─[ssnrshnn@monster]─[~]
└──╼ $nslookup -type=ns google.com
Server:		127.0.0.53
Address:	127.0.0.53#53

Non-authoritative answer:
google.com	nameserver = ns2.google.com.
google.com	nameserver = ns4.google.com.
google.com	nameserver = ns1.google.com.
google.com	nameserver = ns3.google.com.

Authoritative answers can be found from:
ns1.google.com	internet address = 216.239.32.10
ns2.google.com	internet address = 216.239.34.10
ns3.google.com	internet address = 216.239.36.10
ns4.google.com	internet address = 216.239.38.10
ns1.google.com	has AAAA address 2001:4860:4802:32::a
ns2.google.com	has AAAA address 2001:4860:4802:34::a
ns3.google.com	has AAAA address 2001:4860:4802:36::a
ns4.google.com	has AAAA address 2001:4860:4802:38::a
```

nslookup komutunu çeşitli parametrelerle özelleştirebilirsiniz.
- nslookup -type=mx google.com: Mail Exchanger sorgulaması yapar.
- nslookup -type=ns google.com: Name Server sorgulaması yapar.
- nslookup -type=ptr google.com: PTR sorgulaması yapar.
- nslookup -type=soa google.com: SOA kaydı sorgulaması yapar.
- nslookup -type=cname google.com: CNAME sorgulaması yapar.
- nslookup -type=txt google.com: DNS dışında bilgiler içeren sorgulama tipi

2. **netstat:** Network bağlantılarını, routing tablosu gibi bilgileri verir. Örnek bir nslookup çıktısı:
```
┌─[ssnrshnn@monster]─[~]
└──╼ $sudo netstat -tunlp
[sudo] password for ssnrshnn: 
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 127.0.0.53:53           0.0.0.0:*               LISTEN      770/systemd-resolve 
tcp        0      0 0.0.0.0:8080            0.0.0.0:*               LISTEN      2947/python3        
tcp        0      0 127.0.0.1:631           0.0.0.0:*               LISTEN      1131/cupsd          
tcp        0      0 192.168.122.1:53        0.0.0.0:*               LISTEN      1685/dnsmasq        
tcp        0      0 0.0.0.0:902             0.0.0.0:*               LISTEN      2707/vmware-authdla 
tcp        0      0 127.0.0.1:11434         0.0.0.0:*               LISTEN      2331/ollama         
tcp6       0      0 ::1:631                 :::*                    LISTEN      1131/cupsd          
tcp6       0      0 :::902                  :::*                    LISTEN      2707/vmware-authdla 
udp        0      0 0.0.0.0:5353            0.0.0.0:*                           867/avahi-daemon: r 
udp        0      0 192.168.122.1:53        0.0.0.0:*                           1685/dnsmasq        
udp        0      0 127.0.0.53:53           0.0.0.0:*                           770/systemd-resolve 
udp        0      0 0.0.0.0:67              0.0.0.0:*                           1685/dnsmasq        
udp        0      0 0.0.0.0:631             0.0.0.0:*                           2328/cups-browsed   
udp        0      0 0.0.0.0:42339           0.0.0.0:*                           867/avahi-daemon: r 
udp6       0      0 :::5353                 :::*                                867/avahi-daemon: r 
udp6       0      0 :::32785                :::*                                867/avahi-daemon: r 
udp6       0      0 fe80::ed44:1e28:966:546 :::*                                874/NetworkManager  
udp6       0      0 fe80::d56a:31dc:852:546 :::*                                874/NetworkManager
```

netstat da birçok şekilde özelleştirilebilir. Sık kullanılan netstat parametreleri:
- **netstat -a:** Tüm TCP ve UDP bağlantılarını getirir.
- **netstat -o:** PID numaraları ve uygulamaya göre gösterir.
- **netstat -r:** Routing tablosunu gösterir.
- **netstat -i:** Interfaceleri listeler.
- **netstat -s:** Network istatistiklerini gösterir.
- **netstat -p:** Bağlantıların PID/Program isimlerini gösterir.
- **netstat -l:** Dinlenen bağlantıları listeler.
- **netstat -a:** Tüm bağlantıları listeler.

Aynı zamanda parametreleri kombinasyon yaparak da kullanabiliriz. Örneğin:
- **netstat -ano**
- **netstat -tunlp**

3. **dig:** Alan adlarıyla ilgili detaylı sorgulamalar yapar. Örnek bir dig çıktısı:
```
┌─[✗]─[ssnrshnn@monster]─[~]
└──╼ $dig google.com

; <<>> DiG 9.18.28-0ubuntu0.22.04.1-Ubuntu <<>> google.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 26269
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 65494
;; QUESTION SECTION:
;google.com.			IN	A

;; ANSWER SECTION:
google.com.		148	IN	A	142.250.185.174

;; Query time: 24 msec
;; SERVER: 127.0.0.53#53(127.0.0.53) (UDP)
;; WHEN: Sat Jul 27 11:55:34 CEST 2024
;; MSG SIZE  rcvd: 55

```

dig aracı da birçok şekilde özelleştirilebilir. Örnek kullanım ve parametleri:
- **dig google.com MX:** MX kaygını sorgular.
- **dig google.com SOA:** SOA kaydı sorgular.
- **dig google.com TTL:** TTL değerlerini sorgular.
- **dig google.com CNAME:** CNAME kaydını sorgular.
- **dig google.com NS:** Name Server kaydını sorgular.
- **dig ns3.google.com. google.com:** Spesifik Name Server kaydını sorgular.

Çok daha fazlasını "dig -h" komutuyla bulabilirsiniz.

4. **mtr:** Hem ping hem de traceroute komutlarının özelleklerinin birleştirilmiş halidir. Aynı zamanda gecikmeleri de anlık olarak gösteren güzel bir araçtır. Örnek bir mtr sorgu çıktısı:

![troubleshooting](/images/network-troubleshooting/2.png)


Umarım faydalı olmuştur.

Teşekkürler,

İyi Çalışmalar.

















