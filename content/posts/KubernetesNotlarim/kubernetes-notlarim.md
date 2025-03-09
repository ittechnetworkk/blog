+++
title = "Kubernetes Notlarım"
date = "2025-02-16T14:48:43+01:00"
tags = ["Kubernetes"]
categories = ["Kubernetes"]
author = "Soner Sahin"
image = "/images/KubernetesNotlarim/cover.jpg"
+++

Kubernetes'a giriş notlarım. Bu notlar Özgür Öztürk'ün Kubernetes Eğitiminden aldığım notlarımdır.

Kubernetes, container'ları kurup yönetme işlerini üstlenen sektör standardı bir araçtır. Container'ları, volume'ları, networkleri vs. yönetmeyi kolaylaştırır, işleri tek elden yapmayı sağlar.

Docker Swarm da aynı amaca hizmet eder fakat Kubernetes kadar popüler değildir.

Kubernetes hem beyan temelli yapılandırmayı hem de otomasyonu kolaylaştıran, container iş yüklerini ve hizmetlerini yönetmek için oluşturulmuş, taşınabilir ve genişletilebilir açık kaynaklı bir platformdur.

![kubernetes](/images/KubernetesNotlarim/1.png)

![kubernetes](/images/KubernetesNotlarim/2.png)

![kubernetes](/images/KubernetesNotlarim/3.png)

![kubernetes](/images/KubernetesNotlarim/4.png)

![kubernetes](/images/KubernetesNotlarim/5.png)

**Monolithic - Microservice:**

![kubernetes](/images/KubernetesNotlarim/6.png)

**Kubernetes Komponentleri - 1**

![kubernetes](/images/KubernetesNotlarim/7.png)

![kubernetes](/images/KubernetesNotlarim/8.png)

**kube-apiserver:**

kube-apiserver, Kubernetes API'nı ortaya çıkaran Kubernetes control plane'in en önemli bileşeni ve giriş noktasıdır. Tüm diğer komponent ve node bileşenlerinin direkt iletişim kurabildiği tek komponenttir.

![kubernetes](/images/KubernetesNotlarim/9.png)

**etcd:**

Etcd tüm cluster verisi, metadata bilgileri ve Kubernetes'de oluşturulan tüm objelerin bilgilerinin tutulduğu anahtar-değer "key-value" veri deposudur.

![kubernetes](/images/KubernetesNotlarim/10.png)

**kube-schduler:**

kube-schduler yeni oluşturulan ya da bir node ataması yapılmamış Pod'ları izler ve üzerinde çalışacakları bir node seçer.

![kubernetes](/images/KubernetesNotlarim/11.png)

**kube-controller-manager:**

Mantıksal olarak, hem controller ayrı bir süreçtir, ancak karmaşıklığı azaltmak için hepsi tek bir binary olarak derlenmiştir ve tek bir proces olarak çalışır. Bu controllerların bazıları şunlardır:

- Node controller,
- Job controller,
- Service Account & Token controller,
- Endpoints controller.

![kubernetes](/images/KubernetesNotlarim/12.png)

![kubernetes](/images/KubernetesNotlarim/13.png)

**Container runtime:**

Container runtime, containerları çalıştırmaktan sorumlu olan yazılımdır. Kubernetes birkaç container runtime destekler: Docker, containerd, CRI-O.

![kubernetes](/images/KubernetesNotlarim/14.png)

**kubelet:**

Cluster'daki her node çalışan bir agent'tır. od içerisinde tanımlanan containerların çalıştırılmasını sağlar.

Kubelet, çeşikli mekanizmalar aracılığıyla sağlanan bir dizi Pod tanımı alır ve bu Pod tanımında belirtilen containerların çalışır durumda ve sağlıklı olmasını sağlar.


![kubernetes](/images/KubernetesNotlarim/15.png)

**kube-proxy:**

kube-proxy, nodelar üstünde ağ kurallarını yönetir. Bu ağ kuralları, cluster'ın içindeki veya dışındaki ağ oturumlarından Pod'larınızla ağ iletişimine izin verir.

![kubernetes](/images/KubernetesNotlarim/16.png)

**Basit bir kubernetes cluster çalışma mantığı:**

![kubernetes](/images/KubernetesNotlarim/17.png)

**Kubernetes Yayın Döngüsü:**

![kubernetes](/images/KubernetesNotlarim/18.png)

![kubernetes](/images/KubernetesNotlarim/19.png)


**Minikube Kurulumu:**

```shell
curl -LO https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64
```


**Kubectl config:**

![kubernetes](/images/KubernetesNotlarim/20.png)


```
#Context'leri listeleme
kubectl config get-contexts
CURRENT   NAME       CLUSTER    AUTHINFO   NAMESPACE
*         minikube   minikube   minikube   default

#Hangi Context'de olduğumuzu görmek için
kubectl config current-context                                                   
minikube

#Context değiştirmek için
kubectl config use-context "docker-desktop"

#Yardım almak için
kubectl get --help

#Belirli bir namespace'daki podları getirme
kubectl get pods -n kube-system

#Tüm namespace'lerdeki podları getirme
kubectl get pods -A

#Output formatlarını değiştirme

#Çıktıyı JSON olarak yazdırma
kubectl get pods -A -o json

#Çıktıyı YAML olarak yazdırma
kubectl get pods -A -o yaml

#Ekstra bilgi yazdırma
kubectl get pods -A -o wide

#Sadece isimleri almak için
kubectl get pods -A -o name
```


**Kubernetes Objeleri:**

![kubernetes](/images/KubernetesNotlarim/21.png)

**Pod:**

- Pod'lar, Kubernetes'te oluşturabileceğiniz ve yönetebileceğiniz en küçük birimlerdir.
- Pod'lar bir ya da daha fazla container barındırabilir. Ama çoğu durumda pod tek container barındırır.
- Her Pod'un eşsiz bir ID'si "uid" bulunur.
- Her pod eşsiz bir IP adresine sahiptir.
- Aynı pod içerisinde containerlar aynı node üstünde çalıştırılır ve bu containerlar birbirleriyle localhost üstünden haberleşebilirler.

![kubernetes](/images/KubernetesNotlarim/22.png)

**Pod oluşturma:**

```
#httpd imajından pod oluşturma
kubectl run "ilkpod" --image="httpd:latest" --restart=Never

#Oluşturduğumuz pod'a bakma
kubectl get pods

#Pod'un tek satırda daha fazla özelliğine bakma
kubectl get pods -o wide

#Pod'un detaylı bilgilerini getirme
kubectl describe pods ilkpod 

#Pod'un loglarına bakma
kubectl logs ilkpod

#Pod içerisinde birden fazla container varsa
kubectl logs ilkpod -c containeradi

#Pod'un loglarını anlık olarak görmek için
kubectl logs -f ilkpod

#Pod'un son loglarını görmek için
kubectl logs --tail 5 ilkpod

#Pod'un üzerinde komut çalıştırmak için
kubectl exec ilkpod -- date                                                     
Wed Feb 12 12:53:19 UTC 2025

#Pod'da birden fazla container varsa her zaman -c parametresiyle ilgili containerin adını vermeliyiz
kubectl exec ilkpod -c containeradi -- pwd

#Pod'a bağlanma
kubectl exec -it ilkpod -- sh

#Pod'u silme
kubectl delete pods ilkpod
```

**YAML ile çalışmak:**

Örnek bir YAML dosyası:

```
apiVersion: v1
kind: Pod
metadata:
    name: ilkpod
    labels:
	    app: osman
spec:
    containers:
    - name: ilkpod
	    image: httpd:latest
	    ports:
	    - containerPort: 80
```

```
#YAML dosyasını çalıştırma
kubectl apply -f ./osman.yaml

#Podları getirme
kubectl get pods -o w

#Podları detaylı inceleme
kubectl describe pods ilkpod
```


**Pod yaşam döngüsü:**

![kubernetes](/images/KubernetesNotlarim/23.png)

![kubernetes](/images/KubernetesNotlarim/24.png)

![kubernetes](/images/KubernetesNotlarim/25.png)

![kubernetes](/images/KubernetesNotlarim/26.png)

![kubernetes](/images/KubernetesNotlarim/27.png)

![kubernetes](/images/KubernetesNotlarim/28.png)


```
#Shell'de her 2 sn'de bir podların bilgilerini getirir.
watch kubectl get pods -o wide 
kubectl get pods -o wide -w
```


**Çoklu Container Pod:**

![kubernetes](/images/KubernetesNotlarim/29.png)

![kubernetes](/images/KubernetesNotlarim/30.png)

![kubernetes](/images/KubernetesNotlarim/31.png)

![kubernetes](/images/KubernetesNotlarim/32.png)

![kubernetes](/images/KubernetesNotlarim/33.png)

**Init Container:**

![kubernetes](/images/KubernetesNotlarim/34.png)


**Label and Selector:**

![kubernetes](/images/KubernetesNotlarim/35.png)

![kubernetes](/images/KubernetesNotlarim/36.png)

