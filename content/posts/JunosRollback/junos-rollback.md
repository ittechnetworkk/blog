+++
date = '2024-11-22T22:57:40+01:00'
title = 'Juniper Rollback'
tags = ["junos", "juniper"]
author = "Soner Sahin"
+++
Rollback, cihazda yapılan önceki konfigürasyonlara dönebilmeyi sağlayan komuttur. Örneğin cihazda bir konfigürasyon yaptık ve commit ettik. Fakat yapılan konfigürasyon hatalıydı veya başka bir sebepten dolayı eski konfigürasyonu bir şekilde geri almamız gerekiyor. Bu durumda Rollback kullanılır.

Rollback dosyalar 50 adettir, 0'dan başlar ve sıfırıncı dosya cihazda hali hazırda çalışan konfigürasyon dosyasıdır. 

Cihaz'da 49 Rollback dosyası olması halinde her commit işleminde 49. Rollback dosyasını uçurur.

Rollback dosyalarını görmek için;
```
{master:0}[edit]
root@vqfx-re# rollback ?             
Possible completions:
  <[Enter]>            Execute this command
  0                    2024-10-07 02:20:28 UTC by root via cli 
  1                    2024-10-07 02:20:20 UTC by root via cli 
  2                    2024-10-07 02:20:19 UTC by root via cli 
  3                    2024-10-07 02:20:18 UTC by root via cli 
  4                    2024-10-07 02:20:17 UTC by root via cli 
  5                    2024-10-07 02:19:57 UTC by root via cli 
  6                    2024-10-07 02:19:37 UTC by root via cli 
  7                    2024-10-07 02:19:34 UTC by root via cli 
  8                    2024-10-07 02:12:37 UTC by root via cli 
  9                    2020-08-19 17:30:33 UTC by root via cli 
  10                   2020-08-19 17:22:59 UTC by root via other 
  |                    Pipe through a command
```

Yukarıda görüldüğü gibi, Rollback dosyalarının tarih, saat, kim tarafından, vs. bilgilerini görebiliyoruz. Sıfırıncı dosya çalışan konfigürasyon dosyasıdır.

Rollback dosyasından geri dönmek istiyoruz fakat hangi Rollback dosyası işimize yarayandı unuttuk ve bu Rollback dosyalarındaki konfigürasyonları geri almadan önce kontrol etmemiz gerekiyor. 

Bunun için;

```
{master:0}[edit]
root@vqfx-re# show |compare rollback 10    
[edit system]
+  host-name vqfx-re;
+  root-authentication {
+      encrypted-password "$6$W0N6t7fV$.B4uhCIFzP4JhPyohFJVR6Ntbsvpj3BL.glw81gwGqKcT2GsUli1AD1D1oWa6hn0sSWZpi/Y1E9GAU9f3kCqV/"; ## SECRET-DATA
+      ssh-rsa "ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEA6NF8iallvQVp22WDkTkyrtvp9eWW6A8YVr+kz4TjGYe7gHzIw+niNltGEFHzD8+v1I2YJ6oXevct1YeS0o9HZyN1Q9qgCgzUFtdOKLv6IedplqoPkcmF0aYet2PkEDo3MlTBckFXPITAMzF8dJSIFo9D8HfdOV0IAdx4O7PtixWKn5y2hMNG0zQPyUecp4pzC6kivAIhyfHilFR61RGL+GPXQ2MWZWFYbAGjyiYJnAmCP3NOTd0jMZEnDkbUvxhMmBYSdETk1rRgm+R4LOzFUGaHqHDLKLX+FIPKcF96hrucXzcWyLbIbEgE98OHlnVYCzRdK8jlqm8tehUc9c9WhQ== vagrant insecure public key"; ## SECRET-DATA
+  }
-  commit {
-      factory-settings {
-          reset-virtual-chassis-configuration;
-          reset-chassis-lcd-menu;
-      }
-  }
+  login {
+      user vagrant {
+          uid 2000;
+          class super-user;
+          authentication {
---(more)---
```

"-" ve "+" ile gösterilen satırlar şuan ki konfigürasyon ve Rollback 10 dosyasının karşılaştırmasıdır.

Belirli bir Rollback dosyasına dönmek için;

```
{master:0}[edit]
root@vqfx-re# rollback 10 
load complete

{master:0}[edit]
root@vqfx-re# commit 
configuration check succeeds
commit complete
```

Öncelikle ilgili Rollback dosyasını geri yüklüyoruz, daha sonra commit yaparak konfigürasyonu etkinleştiriyoruz.

Teşekkürler,

İyi Çalışmalar.