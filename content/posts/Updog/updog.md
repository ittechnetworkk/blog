+++
date = '2024-10-11T22:57:40+01:00'
title = 'Updog'
tags = ["updog", "http"]
categories = ["Linux"]
author = "Soner Sahin"
image = "/images/Updog/cover.jpg"
+++

Updog, SimpleHTTPServer alternatifi bir araçtır. Çok hızlı ve kolay bir şekilde localinizde bir HTTP Server ayağa kaldırmanızı sağlayan Python ile yazılmış [açık kaynak kodlu](https://github.com/sc0tfree/updog) bir araçtır.

Encryption ve Authentication destekler. Kendinden imzalı bir SSL sertifikası ve parola ile de bir Authentication sağlar.

Updog Yükleme:
```
pip3 install updog
```

Updog kullanımı oldukça kolaydır aşağıda updog ile kullanılan tüm parametrelerini görebilirsiniz.

-d                                              
-p 
--password          
--ssl                                            
--version                                       
-h

Bir örnek:

```
┌─[ssnrshnn@MARVEL]─[~/test]
└──╼ $ls
test1.txt


┌─[ssnrshnn@MARVEL]─[~/test]
└──╼ $updog -d /home/ssnrshnn/test/ -p 6654 --password Pass123! --ssl
[+] Serving /home/ssnrshnn/test...
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on all addresses (0.0.0.0)
 * Running on https://127.0.0.1:6654
 * Running on https://192.168.1.121:6654
Press CTRL+C to quit
```

İlgili IP adresine gidecek olursak aşağıdaki gibi bir ekran karşılayacak bizi. Burada Username kısmı boş, Password kısmına ise belirlediğimiz parolayı yazıyoruz.

![UPDOG](/images/Updog/1.png)

Ve dizin karşımıza geliyor. Buradan artık dosya indirebilir veya yükleyebiliriz.

![UPDOG](/images/Updog/2.png)

Logları da yine terminalden görebiliriz.

![UPDOG](/images/Updog/3.png)

Durdurmak için ise yukarıda görüldüğü gibi "CTRL+C" kombinasyonu yeterli olacaktır.

Teşekkürler,

İyi Çalışmalar.

