+++
title = "Docker Notlarım"
date = "2025-02-08T21:46:11+01:00"
tags = ["Docker", "Linux"]
categories = ["Linux"]
author = "Soner Sahin"
+++

Docker'a giriş notlarım. Bu notlar Özgür Öztürk'ün Docker Eğitiminden aldığım notlarımdır.


```
#Container oluşturulduktan sonra date uygulaması çalıştırılacak. Container başka bir uygulama ile başlatılacak.
docker container run --name deneme httpd date

#Container'i arka planda çalıştırmak için
docker container run -d deneme2

#Container içerisinde komut çalıştırmak için "exec"
docker container exec 94ef4e4f89 ls

#Çalışan container'a nasıl bağlanılır
docker container exec -it deneme1 sh

#Bir sanal makine ile Container'in farkı; Container'de kernel yoktur, üzerinde çalıştığı hostun kernel'ini kullanır.

#Container ile ilgili daha fazla bilgi edinmek için
docker container inspect deneme1
docker network inspect bridge
docker image inspect fedora

#Container'a bağlanıp değişiklik yapılması pek önerilmez. Bazılarına bağlanılmaz bile.

#Container loglarına bakmak için
docker container logs deneme1

#Container loglarını zaman damgalarıyla göstermek için
docker container logs -t deneme1

#Container loglarındaki son birkaç satırı görmek için
docker container logs --tail 5 deneme1

#Container loglarını canlı görmek için 
docker container logs -f deneme1

#Container'ın kaynaklarına bakmak için
docker container top webserver
docker container stats webserver
docker stats 

#Container'ları sınırlamadığımız sürece host makinedeki kaynakları sınırsız kullanabilir.
Bu container'ların kaynaklarını kısıtlayabiliriz.
#Container'ın memory kısıtlaması için
docker container run -d --name deneme3 --memory=1G httpd
docker container run -d --name deneme3 --memory=500K httpd

#CPU kısıtlaması için iki yol vardır
#Container sadece 1 core kullanabilecek random olarak
docker run -d --name cpukisit --cpus="1" httpd

#Container 2 ve 8 nolu core'ları kullanabilecek
docker container run -d --name cpukisit2 --cpuset-cpus="2,8" httpd

#Container'de swap belirlemek için
docker run -d --name swap --memory-swap=1G httpd
```

![docker](/images/Docker/1.png)

Docker Volume:

```
#Volume'lar hos makinede bir klasör olarak durur. Container' bağlanan bir volume'da bir değişiklik yapılırsa host makinedeki o volume klasöründe de etkili olacaktır.

#Volume oluşturma
docker volume create deneme                                                    

#Volume'ları listeleme
docker volume ls

#Volume'ları detaylı inceleme
docker volume inspect deneme

#Volume'ı container'a bağlama
docker run -it --name denemevolume -v deneme:/osman httpd sh

#Bir volume'u birçok container'a bağlayabiliriz

#Volume'ü read only bağlamak için
docker run -it --name con5 -v deneme:/test1:ro alpine sh

#Host makinedeki herhangi bir klasörü de container'a volume gibi bağlayabiliriz. Buna da bind mount denir.
docker run -it --name deneme -p 83:80 -v /home/ssnrshnn/deneme:/usr/local/apache2/htdocs httpd

#Container'de volume'nin bağlanacağı yer yok ise kendisi yaratır.
#Bir volume'u birçok container'a bağlayabiliriz
#Production'da Volume'ler ortak bir storage cihazda oluşturulur.
```

![docker](/images/Docker/2.png)

**Environment Variables:**

```
#Environment variable girmek için; bu env'leri container içinden kontrol de edebiliriz.
docker run -it -e mysqlserver="server.ssnrshnn.com:3306" -e mysqladmin="admin" -e mysqlpassword="passwd123@" ubuntu bash

root@5173946588a5:/# printenv

#Toplu olarak environment variable tanımlamak için bir env list oluşturur onu da aşağıdaki komutla topluca container'a tanımlayabiliriz.
docker container run -it --env-file ./env.list ubuntu bash
```

**Drivers:**

```
Network Drivers:

- Bridge (Default) (172.17.0.0/16)
- Host
- Macvlan
- None
- Overlay

Networkleri listeleme
docker network ls

Bir network driver'ının detaylarına bakmak için
docker network inspect bridge

Bridge Network Driver:

Bir network oluşturma
docker network create --driver bridge denemenet

Network'ün detaylarına bakma
docker network inspect denemenet

Oluşturulan network'ü container'a bağlama
docker run -it --network=denemenet busybox sh
ip a

Subnet belirleyerek bir network driver oluşturma
docker network create --driver bridge --subnet=192.168.10.0/24 --gateway=192.168.10.1 denemenet2

Default bridge network driver'ında DNS çözümlemesi kapalıdır. Container'lar birbirlerine hostname ile ulaşamazlar.
Fakat daha sonradan oluşturduğumuz bridge network driverlarında ulaşabilirler



Host Network Driver:

Hostun network driver'ını kullanır. Host'ta çalışan bir process gibi çalışır. Htop ile bakarsak ilgili process'i görürüz.

Host network driver'ının detaylarına bakmak için
docker network inspect host

Host network'ü container'a bağlama
docker run -it --network=host busybox sh
ip a



MacVlan Network Driver:

Vlan yapabilme özelliği olan network driver'ıdır.



None Network Driver:

Container hiçbir şekilde networke bağlanmasın driver'ı olmasın istenirse kullanılır.

None network'ü container'a bağlama
docker container run -it --name den2 --network=none busybox sh
ip a
```

Docker Hub:

```
Hali hazırda olan bir imajı kendimiz de tag'leyebiliriz.
docker image tag httpd:latest soner4444/deneme:latest

Image'ı Docker Hub'a göndermek istersek
docker image push soner4444/deneme:latest

Docker Hub'a CLI'den login olmak için
docker login -u soner4444
```

Docker Image Oluşturma:

Dockerfile - 1:

Docker'a özgü bir dil formatı ile conterner'a ne olacağını söylediğimiz dosyadır.
Dockerfile'ı iyi dizayn etmemiz gerekiyor bekleme sürelerini minimalize etmek için. Değişiklik olan kısımları dosyanın altına doğru yazmamız gerekir ki Cache mekanizmasını daha efektif kullanılabilsin.

| Instruction                                                                         | Description                                                 |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| [`ADD`](https://docs.docker.com/reference/dockerfile/#add)                          | Add local or remote files and directories.                  |
| [`ARG`](https://docs.docker.com/reference/dockerfile/#arg)                          | Use build-time variables.                                   |
| [`CMD`](https://docs.docker.com/reference/dockerfile/#cmd)                          | Specify default commands.                                   |
| [`COPY`](https://docs.docker.com/reference/dockerfile/#copy)                        | Copy files and directories.                                 |
| [`ENTRYPOINT`](https://docs.docker.com/reference/dockerfile/#entrypoint)            | Specify default executable.                                 |
| [`ENV`](https://docs.docker.com/reference/dockerfile/#env)                          | Set environment variables.                                  |
| [`EXPOSE`](https://docs.docker.com/reference/dockerfile/#expose)                    | Describe which ports your application is listening on.      |
| [`FROM`](https://docs.docker.com/reference/dockerfile/#from)                        | Create a new build stage from a base image.                 |
| [`HEALTHCHECK`](https://docs.docker.com/reference/dockerfile/#healthcheck)          | Check a container's health on startup.                      |
| [`LABEL`](https://docs.docker.com/reference/dockerfile/#label)                      | Add metadata to an image.                                   |
| [`MAINTAINER`](https://docs.docker.com/reference/dockerfile/#maintainer-deprecated) | Specify the author of an image.                             |
| [`ONBUILD`](https://docs.docker.com/reference/dockerfile/#onbuild)                  | Specify instructions for when the image is used in a build. |
| [`RUN`](https://docs.docker.com/reference/dockerfile/#run)                          | Execute build commands.                                     |
| [`SHELL`](https://docs.docker.com/reference/dockerfile/#shell)                      | Set the default shell of an image.                          |
| [`STOPSIGNAL`](https://docs.docker.com/reference/dockerfile/#stopsignal)            | Specify the system call signal for exiting a container.     |
| [`USER`](https://docs.docker.com/reference/dockerfile/#user)                        | Set user and group ID.                                      |
| [`VOLUME`](https://docs.docker.com/reference/dockerfile/#volume)                    | Create volume mounts.                                       |
| [`WORKDIR`](https://docs.docker.com/reference/dockerfile/#workdir)                  | Change working directory.                                   |
|                                                                                     |                                                             |

```
#Oluşturulacak imajın hangi imajdan oluşturulacağını belirten talimat. 
#Dockerfile içerisinde geçmesi mecburi tek talimat budur. Mutlaka olmalıdır.
FROM imaj:tag
FROM ubuntu:20.04

#İmaj oluşturulurken shell'de bir komut çalıştırmak istersek bu talimat kullanılır.
RUN apt-get update
RUN apt-get install isc-dhcp-server

#Klasör değiştirmek istersek bu talimat kullanılır. cd ile aynı mantıktadır. Bunu yapmak için RUN'da kullanılır fakt kullanılmamalıdır çünkü eğer klasör yoksa RUN ile yaptığımızda klasör yaratmaz hata alırız. Fakat WORKDIR ile yaparsak, klasör olmasa bile yaratılır.
WORKDIR /usr/src/app

#İmaj içine dosya veya klasör kopyalamak için kullanılır.
COPY /source /user/src/app

#Bu imajdan oluşturulacak containerların hangi portlar üstünden erişilebileceğini yani hangi portların yayınlanacağını bu talimatlarla belirtebilirsiniz.
EXPOSE 80/tcp

#Bu imajdan container yaratıldığı zaman varsayılan olarak çalıştırmasını istediğiniz komutu bu talimat ile belirleyebilirsiniz. Bu da mutlaka olması gerekir.
CMD java merhaba

#Bu talimat ile Docker'a bir container'ın hala çalışıp çalışmadığını kontrol etmesini söyleyebiliriz. Docker varsayılan olarak container içerisinde çalışan ilk process'i izler ve o çalıştığı sürece container çalışmaya devam eder. Fakat process bile onun düzgün işlem yapıp yapmadığına bakmaz. HEALTHCHECK ile buna bakabilme imkanına kavuşuruz.
HEALTHCHECK --interval=5m --timeout=3s CMD curl -f http://localhost/ || exit 1

#Gireceğimiz komutları hangi kullanıcı ile çalıştırmasını istiyorsak bu talimat ile onu seçebiliriz. 
USER poweruser

# İmaj metadata’sına key=value şeklinde değer çiftleri eklemek için kullanılır. Örneğin team=development şeklinde bir etiket eklenerek bu imajın development ekibinin kullanması için yaratıldığı belirtilebilir.
LABEL version:1.0.8

#COPY Aynı işi yapar yani dosya ya da klasör kopyalarsınız. Fakat ADD bunun yanında dosya kaynağının bir url olmasına da izin verir. Ayrıca ADD ile kaynak olarak bir .tar dosyası belirtilirse bu dosya imaja .tar olarak sıkıştırılmış haliyle değil de açılarak kopyalanır. 
ADD https://wordpress.org/latest.tar.gz /temp

#Imaj içinde environment variable tanımlamak için kullanılır
ENV TEMP_FOLDER="/temp"

#ARG ile de variable tanımlarsınız. Fakat bu variable sadece imaj oluşturulurken yani build aşamasında kullanılır. Imajın oluşturulmuş halinde bu variable bulunmaz. ENV ile imaj oluşturulduktan sonra da imaj içinde olmasını istediğiniz variable tanımlarsınız, ARG ile sadece oluştururken kullanmanız gereken variable tanımlarsınız.
ARG VERSION:1.0

#Imaj içerisinde volume tanımlanamızı sağlayan talimat. Eğer bu volume host sistemde varsa container bunu kullanır. Yoksa yeni volume oluşturur. 
VOLUME /myvol

#Bu talimat ile bir containerın çalıştırılabilir bir uygulama gibi ayarlanabilmesini sağlarsınız.
ENTRYPOINT ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]

#Imaj içerisinde volume tanımlanamızı sağlayan talimat. Eğer bu volume host sistemde varsa container bunu kullanır. Yoksa yeni volume oluşturur. 
VOLUME /myvol

#Dockerfile'ın komutları işleyeceği shell'in hangisi olduğunu belirtiriz. Linux için varsayılan shell ["/bin/sh", "-c"],Windows için ["cmd", "/S", "/C"]. Bunları SHELL talimatı ile değiştirebiliriz. 
SHELL ["powershell", "-command"]
```

Dockerfile Örnekleri:

```
FROM ubuntu:18.04
RUN apt-get update -y
RUN apt-get install default-jre -y
WORKDIR /merhaba
COPY /myapp .
CMD ["java", "merhaba"]
```

```
FROM ubuntu:18.04
COPY . /app
RUN make /app
CMD python /app/app.py
```

```
FROM python:2.7-alpine
WORKDIR /app
ADD requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt
ADD . /app
EXPOSE 80
CMD ["gunicorn","app:app","-b","0.0.0.0:80","--log-file","--access-logfile","-","--workers","4","--keep-alive","o"]
```

Dockerfile çalıştırma:

```
docker image build -t besiktas .
docker image ls

#Oluşturulan image'dan container yaratma
docker container run --name alimetinfeyyaz besiktas

#Farklı bir Dockerfile çalıştırma:
docker image build -t besiktas1 -f Dockerfile.test
```

Oluşturduğumuz imajdan bir container yaratma:

```
docker run -d -p 8080:8080 --name deneme1 besiktas1
```

Container'i Hub'a gönderme:

```
#İlk olarak imajı repo ismiyle tag'lıyoruz.
docker image tag besiktas soner4444/besiktas

#Sonra push edilir.
docker push soner4444/besiktas:latest 

#Container'ı inceleme
docker inspect 
```



**Kaynaklar:**

https://www.udemy.com/course/adan-zye-docker

https://www.youtube.com/@aytitech























