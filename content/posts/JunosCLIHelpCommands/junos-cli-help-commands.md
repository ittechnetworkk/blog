+++
date = '2024-11-16T22:57:40+01:00'
title = 'Juniper CLI Help Komutları'
tags = ["junos", "juniper"]
author = "Soner Sahin"
+++
JunOS'da Cli yardım alma komutları oldukça detaylı ve kullanışlıdır. Junos sadece bir işletim sistemi değil aynı zamanda içinde bir kütüphanedir. 

JunOS'da birden fazla yardım alma komutu vardır ve her biri birbirinden kulanıcı dostudur.

Cli Help Komutları:
```
root> help ?   
Possible completions:
  <[Enter]>            Execute this command
  apropos              Find help information about a topic
  reference            Reference material
  syslog               System log error messages
  tip                  Tip for the day
  topic                Help for high level topics
  |                    Pipe through a command
```

Help komutlarıyla birlikte ne kullanılacağını "help ?" komutuyla görebiliriz.

- **help apropos:**
Komut hakkında yardım alma komutlarını açıklamalarıyla getirir.

Örneğin ospf komutuyla ilgili yarım komutlarını gösterelim.

```
root> help apropos ospf 
monitor security flow filter protocol ospf 
    Open Shortest Path First
clear ospf 
    Clear Open Shortest Path First information
clear ospf neighbor 
    Clear OSPF neighbors
clear ospf neighbor area <area> 
    OSPF area ID
clear ospf neighbor instance <instance> 
    Name of OSPF instance
clear ospf database 
    Clear OSPF database entries
clear ospf database area <area> 
    OSPF area ID
clear ospf database instance <instance> 
    Name of OSPF instance
clear ospf database-protection 
    Clear OSPF database protection related state
clear ospf database-protection instance <instance> 
    Name of OSPF instance
clear ospf statistics 
    Clear OSPF statistics
clear ospf statistics instance <instance> 
---(more 6%)---
```

"Space" ile sayfa sayfa, "Enter" ile satır satır ilerleyebilirsiniz.


- **help reference:**
Bu komut bize verdiğimiz bir komutun yapılandırma bilgilerinin verir. Vereceğimiz komutun detaylarına da inmemiz gerekir. 

Örneğin, ospf de area yapılandırmasıyla ilgili  komut setlerini görmek istiyorsanız:
```
root> help reference ospf area    
area

  Syntax

     area area-id;

  Hierarchy Level

     [edit logical-systems logical-system-name protocols (ospf | ospf3)],
     [edit logical-systems logical-system-name protocols ospf3 realm
     (ipv4-unicast | ipv4-multicast | ipv6-multicast)],
     [edit logical-systems logical-system-name routing-instances
     routing-instance-name protocols (ospf | ospf3)],
     [edit logical-systems logical-system-name routing-instances
     routing-instance-name protocols ospf3 realm (ipv4-unicast |
     ipv4-multicast | ipv6-multicast)],
     [edit protocols (ospf | ospf3)],
     [edit protocols ospf3 realm (ipv4-unicast | ipv4-multicast |
     ipv6-multicast)],
     [edit routing-instances routing-instance-name protocols (ospf | ospf3)],
     [edit routing-instances routing-instance-name protocols ospf3 realm
     (ipv4-unicast | ipv4-multicast | ipv6-multicast)]

---(more)---
```

Bunu daha spesifik hale getirmek için;

```
root> help reference ospf area | grep ipv6     
     (ipv4-unicast | ipv4-multicast | ipv6-multicast)],
     ipv4-multicast | ipv6-multicast)],
     ipv6-multicast)],
     (ipv4-unicast | ipv4-multicast | ipv6-multicast)]



VEYA



root> help reference ospf area | match ipv6   
     (ipv4-unicast | ipv4-multicast | ipv6-multicast)],
     ipv4-multicast | ipv6-multicast)],
     ipv6-multicast)],
     (ipv4-unicast | ipv4-multicast | ipv6-multicast)]

root> 
```


- **help topic:**

Bu komut bize bilgi almak istediğimiz komutun açıklamasını yapar.

Örneğin:
```
root> help topic rip timers    
                             Configuring RIP Timers

   You can configure various timers for RIP.

   RIP routes expire when either a route timeout limit is met or a route
   metric reaches infinity, and the route is no longer valid. However, the
   expired route is retained in the routing table for a time period so that
   neighbors can be notified that the route has been dropped. This time
   period is set by configuring the hold-down timer. Upon expiration of the
   hold-down timer, the route is removed from the routing table.

   To configure the hold-down timer for RIP, include the holddown statement:

   holddown seconds;

   seconds can be a value from 10 through 180. The default value is 120
   seconds.

   For a list of hierarchy levels at which you can configure this statement,
   see the statement summary section for this statement.

   You can set a route timeout interval. If a route is not refreshed after
   being installed into the routing table by the specified time interval, the
---(more)---
```

Bir başka komut açıklaması:
```
root> help topic ospf area-backbone     
                       Configuring the OSPF Backbone Area

   You must create a backbone area if your network consists of multiple
   areas. An ABR must have at least one interface in the backbone area, or it
   must have a virtual link to a routing device in the backbone area. The
   backbone comprises all ABRs and all routing devices that are not included
   in any other area. You configure all these routing devices by including
   the area 0.0.0.0 statement:
     area 0.0.0.0;
   For a list of hierarchy levels at which you can include this statement,
   see the statement summary section for the statement.
```


Teşekkürler,

İyi Çalışmalar