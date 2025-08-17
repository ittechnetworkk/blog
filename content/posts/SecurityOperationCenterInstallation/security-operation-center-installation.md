+++
title = "[EN] Security Operation Center"
date = "2025-08-17T15:38:38+02:00"
tags = ["soc", "security operation center", "proxmox", "wazuh", "firewall", "pfsense", "volacilaptor", "thehive", "cortex", "network", "windows", "linux", "honeypot"]
categories = ["SOC", "Virtualization", "Windows", "Linux", "Firewall"]
author = "Soner Sahin"
image = "/images/SecurityOperationCenter/cover.png"
+++ 

Hi everyone! In this article, I will take you through my Security Operation Center environment on Hetzner, which is a German company that provides web hosting services and data centers.

I want to start by sharing my excitement with you.

I have been interested in IT for some time and have built several lab environments, ranging from small to large. After gaining experience, I wanted to build my own SOC environment to gain more real-life experience. 

I have learned many things that have sharpened my knowledge significantly. I will maintain this project as long as possible and share my experiences with you by writing new articles about it. My aim here is to defend, gain experience, and learn new things as much as possible. 

I'm writing this article as a guide for those who want to build their own lab environment and gain real-life experience.

I have been planning this project for some time, and after extensive research, I created a proper lab topology as you can see below.


## **Topology**


![SOC](/images/SecurityOperationCenter/topology.png)


## **Hetzner Dedicated Server**

I will be using Hetzner as my cloud provider, which is among the best and has a solid, secure infrastructure with affordable costs.

I purchased the "**EX44**" model dedicated server, which is sufficient to build your own SOC if you don't need a large one. In my case, it is more than adequate.

Here are the server model and its features.

![SOC](/images/SecurityOperationCenter/HerznerDedicatedServerPriceCustom1.png)

![SOC](/images/SecurityOperationCenter/HerznerDedicatedServerPriceCustom2.png)

![SOC](/images/SecurityOperationCenter/HerznerDedicatedServerPriceCustom3.png)



## **Additional IP**

I will install virtualization software on this dedicated server and then install a firewall solution on it. Therefore, I need 2 public IP addresses. I already have one that is included in the dedicated server price, but I need a second one for the firewall's WAN side.

Here's how to purchase an additional public IP address.

![SOC](/images/SecurityOperationCenter/additional-IP.png)

![SOC](/images/SecurityOperationCenter/additional-IP-2.png)

After purchasing the additional IP address, we need to separate their MAC addresses.

As you can see in the image below, there is a PC icon next to the additional IP address. Click that icon to separate the MAC addresses.

![SOC](/images/SecurityOperationCenter/request-seperate-mac.png)


## **Proxmox Installation**

Now, it's time to install Proxmox on our server. 

I'm including some articles below that will help you if you get stuck.

https://community.hetzner.com/tutorials/install-and-configure-proxmox_ve

https://medium.com/@artem_lajko/setup-ve-with-proxmox-on-hetzner-single-mode-6b76061efcdb

Here is how I did it.

Once the ordering process is complete, you will be sent the server information that will allow you to SSH. Keep the credentials safe.

## **SSH Connection**

Connect to the server via SSH to install Proxmox.

![SOC](/images/SecurityOperationCenter/ssh-first-login-2.png)


```bash
installimage
```

![SOC](/images/SecurityOperationCenter/proxmox-install-2.png)



![SOC](/images/SecurityOperationCenter/proxmox-install-3.png)


```bash
SWRAIDLEVEL 0
```

*Note: SWRAIDLEVEL 0 creates a striped RAID configuration without redundancy. This provides maximum performance but no fault tolerance. For production environments, consider using RAID 1 or RAID 5 for better data protection.*


![SOC](/images/SecurityOperationCenter/proxmox-install-5.png)


```bash
HOSTNAME proxmox-soc.local
```

![SOC](/images/SecurityOperationCenter/proxmox-install-6.png)


```bash
IPV4_ONLY yes
```

![SOC](/images/SecurityOperationCenter/proxmox-install-7.png)


## **Partitioning**


![SOC](/images/SecurityOperationCenter/proxmox-install-8.png)

Save and quit. 

If everything is correct, you will be taken to a screen like the following.

![SOC](/images/SecurityOperationCenter/proxmox-install-9.png)


![SOC](/images/SecurityOperationCenter/proxmox-install-10.png)

Once the installation is complete, reboot the server and wait a couple of minutes.

Then navigate to your IP address and the relevant port for Proxmox, which is **8006** by default.

![SOC](/images/SecurityOperationCenter/proxmox-install-3.png)

Here is Proxmox successfully installed.

Here you can upload the ISO images you plan to use.

![SOC](/images/SecurityOperationCenter/iso-upload-1.png)




## **Network Configuration**

Here is the network configuration of my Proxmox server. I've created multiple network bridges to segment different network zones:

- **vmbr0**: WAN interface (connected to the internet)
- **vmbr1**: Management network (for Proxmox administration)
- **vmbr2**: LAN-1 for servers
- **vmbr3**: LAN-2 for client machines
- **vmbr4**: SOC network (Security Operations Center)
- **vmbr5**: DMZ network (Demilitarized Zone)
- **vmbr6**: Monitoring network

![SOC](/images/SecurityOperationCenter/network-conf-1.png)


```bash
root@proxmox-soc ~ # cat /etc/network/interfaces
# network interface settings; autogenerated
# Please do NOT modify this file directly, unless you know what
# you're doing.
#
# If you want to manage parts of the network configuration manually,
# please utilize the 'source' or 'source-directory' directives to do
# so.
# PVE will preserve these directives, but will NOT read its network
# configuration from sourced files, so do not attempt to move any of
# the PVE managed interfaces into external files!

source /etc/network/interfaces.d/*

auto lo
iface lo inet loopback

iface lo inet6 loopback

auto enp5s0
iface enp5s0 inet manual

auto vmbr0
iface vmbr0 inet static
        address 88.99.31.180/26
        gateway 88.99.31.129
        bridge-ports enp5s0
        bridge-stp off
        bridge-fd 0

auto vmbr1
iface vmbr1 inet manual
        bridge-ports none
        bridge-stp off
        bridge-fd 0
#Management

auto vmbr2
iface vmbr2 inet manual
        bridge-ports none
        bridge-stp off
        bridge-fd 0
#LAN-1_Servers

auto vmbr3
iface vmbr3 inet manual
        bridge-ports none
        bridge-stp off
        bridge-fd 0
#LAN-2_Clients

auto vmbr4
iface vmbr4 inet manual
        bridge-ports none
        bridge-stp off
        bridge-fd 0
#SOC

auto vmbr5
iface vmbr5 inet manual
        bridge-ports none
        bridge-stp off
        bridge-fd 0
#DMZ

auto vmbr6
iface vmbr6 inet manual
        bridge-ports none
        bridge-stp off
        bridge-fd 0
#Monitoring
```

## **Pfsense Network Configuration:**

The pfSense firewall acts as the gateway between your internal networks and the internet. It's crucial to properly configure the network interfaces to ensure traffic flows correctly between your different network segments.

![SOC](/images/SecurityOperationCenter/network-conf-2.png)

![SOC](/images/SecurityOperationCenter/network-conf-3.png)

Pay close attention when arranging interfaces to ensure you configure everything else properly. 


## **Installations**

I don't want to make this document too cluttered, so I'll guide you through the installation process via links that I used when I encountered issues.


## **Active Directory Domain Controller Installation:**

https://ittechnetworkk.github.io/posts/addcinstallation/ad-dc-installation/

https://www.manageengine.com/products/active-directory-audit/kb/how-to/how-to-setup-a-domain-controller.html

https://www.ibm.com/docs/en/storage-scale-bda?topic=support-install-configure-active-directory

You may also consider using Samba DC, which is a great alternative :)



## **Windows Client Domain Join:**

https://woshub.com/add-computer-to-active-directory-domain/

https://www.tenforums.com/tutorials/90045-join-windows-10-pc-domain.html



## **Linux Domain Join**

https://www.redhat.com/en/blog/linux-active-directory

https://www.linkedin.com/pulse/how-join-linux-machine-active-directory-ad-domain-mohsen-rizkallah-36pkf/

https://medium.com/@daryl-goh/how-to-join-a-linux-ubuntu-machine-to-windows-active-directory-domain-a5563ccc4844



## **Wazuh Installation**

https://documentation.wazuh.com/current/quickstart.html



## **Wazuh Agent Installation**

**Pfsense**

Here you can find both Wazuh Agent installation and how to send logs (including Suricata logs) to the Wazuh server.

https://benheater.com/integrating-pfsense-with-wazuh/

https://kifarunix.com/install-wazuh-agent-on-pfsense/

Alternatively, you can send pfSense logs via Syslog by following these guides:

https://devopstales.github.io/linux/wazuh-pfsense-syslog/

https://app.letsdefend.io/training/lesson_detail/collecting-logs-with-syslog


**Windows**

https://documentation.wazuh.com/current/installation-guide/wazuh-agent/index.html

If you want to integrate Sysmon, follow these guides:

https://app.letsdefend.io/training/lesson_detail/introduction-and-set-up-of-sysmon

https://app.letsdefend.io/training/lesson_detail/windows-wazuh-agent-installation-and-log-collectio


**Linux**

https://documentation.wazuh.com/current/installation-guide/wazuh-agent/index.html


## **TheHive + Cortex Installation**

You can find many TheHive+Cortex installation guides, Docker Compose files, and similar resources, but here is my repository that I created to deploy TheHive and Cortex. There you can also find instructions on how to install and configure Cortex Analyzers and Responders.

https://github.com/ssnrshnn/TheHive-Cortex



## **Velociraptor Installation and Agent Deployment**

https://docs.velociraptor.app/docs/deployment/quickstart/



## **Checkmk Installation**

https://docs.checkmk.com/latest/en/intro_setup.html



## **T-Pot Honeypot Installation**

https://github.com/telekom-security/tpotce



## **Pfsense Suricata Configuration**

https://tech.lobobrothers.com/en/configuring-suricata-in-pfsense/

https://hackzone.in/blog/how-to-install-suricata-on-pfsense-a-step-by-step-guide/


## **Pfsense OpenVPN Installation**

https://www.heimnetz.de/anleitungen/firewall/pfsense/pfsense-openvpn-server-einrichten/

https://www.comparitech.com/blog/vpn-privacy/openvpn-server-pfsense/

https://www.zenarmor.com/docs/de/netzwerksicherheitstutorials/wie-installiert-man-openvpn-auf-der-pfsense-software


## **Pfsense Dashboard**

![SOC](/images/SecurityOperationCenter/network-conf-4.png)



Here are some images of my Security Operation Center.

## **Attack Map**

![SOC](/images/SecurityOperationCenter/AttackerMap.png)



## **Kibana**

![SOC](/images/SecurityOperationCenter/Elastic.png)



## **Wazuh**

![SOC](/images/SecurityOperationCenter/Wazuh.png)



## **TheHive+Cortex**

![SOC](/images/SecurityOperationCenter/TheHive.png)



## **Volacilaptor**

![SOC](/images/SecurityOperationCenter/Volacilaptor.png)


## **Pfsense Firewall**

![SOC](/images/SecurityOperationCenter/Pfsense.png)



## **Proxmox**

![SOC](/images/SecurityOperationCenter/Proxmox.png)



Pretty cool, isn't it?


## **Resources**




Thank you for taking the time to read this article. I hope you find it helpful.

Keep up the great work!

