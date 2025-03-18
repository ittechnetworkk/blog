+++
title = "[EN] ESXi Installation"
date = "2025-03-09T23:13:13+01:00"
tags = ["esxi", "virtualization", "vmware"]
categories = ["Virtualization"]
author = "Soner Sahin"
image = "/images/ESXiInstallation/cover.jpg"
+++

In this article I will show you how to install ESXi that a commonly used virtualization software in the industry providing lots of feature to solve issues that help IT guys quite a lot.

ESXi is one of the famous virtualization software used on servers. When it comes to talking about virtualization software, it is like a cornerstone because virtualization software helps us to virtualize our hardware, easy management, efficiency, cost benefits, isolation, fast deployment and more. 

Here is a brief information about the types of virtualization.

There are 2 types of virtualizations called "Type 1" and "Type 2". 

Type 2 is installed on Servers as seen in the image below. This type of virtualization softwares are used for Servers. Here is some common Type 1 virtualizations softwares: Proxmox, VMware, KVM, Xen, Citrix, RedHat, XCP-ng, HyperV.

![esxi](/images/ESXiInstallation/1.png)

Type 2 is installed on Operating System as seen in the image below. This type of virtualization softwares can be used for everyone. Here is some common Type 2 virtualization softwares: Vmware Workstation Pro (Free), Virtualbox, QEMU, Parallels.

![esxi](/images/ESXiInstallation/2.png)

After quick info, let's get installation.

I will install ESXi on my Proxmox Server :) as a virtual machine. Probably you will install it on a bare metal server then put the ISO file into USB and plug it into the server. Afterwards boot the server with USB. The remaining process will be the same.

First, we need to have an ESXi ISO image. Before got to the relevant download page, we need to ensure that what version of ESXi is best for our server. Because every server has its different features and every ESXi version is not compatible for every server. You will find useful information and instructions on your server manufacturer's website.

Pay carefully attention this part and please note that you can also take a look some social media communities to see any experiences. You can download the ISO image and get a licence in [Broadcom Website.](https://support.broadcom.com/group/ecx/my-dashboard)

I will use 8.0U3b version in my case. If you use Proxmox as virtualization software like me, you know we need to upload the ISO image to Proxmox first. You can see steps as follows.

![esxi](/images/ESXiInstallation/3.png)

![esxi](/images/ESXiInstallation/4.png)

![esxi](/images/ESXiInstallation/5.png)

![esxi](/images/ESXiInstallation/6.png)

![esxi](/images/ESXiInstallation/7.png)

![esxi](/images/ESXiInstallation/8.png)

![esxi](/images/ESXiInstallation/9.png)

![esxi](/images/ESXiInstallation/10.png)

![esxi](/images/ESXiInstallation/11.png)

![esxi](/images/ESXiInstallation/12.png)

![esxi](/images/ESXiInstallation/13.png)

**ESXi Installation:**

![esxi](/images/ESXiInstallation/14.png)

![esxi](/images/ESXiInstallation/15.png)

![esxi](/images/ESXiInstallation/16.png)

Select relevant disk 

![esxi](/images/ESXiInstallation/17.png)

Choose you keyboard layout. Please make sure that select proper one in your case because it might bother you in the password section.

![esxi](/images/ESXiInstallation/18.png)

![esxi](/images/ESXiInstallation/20.png)

![esxi](/images/ESXiInstallation/21.png)

![esxi](/images/ESXiInstallation/22.png)

![esxi](/images/ESXiInstallation/23.png)

The software has been successfully installed. Remove the USB before rebooting.

![esxi](/images/ESXiInstallation/24.png)

We will not work with this screen but before go to web management console, we need to set up some configurations. For this pres "F2" to go to configuration section.

![esxi](/images/ESXiInstallation/25.png)

Enter the username as root and Password that we have given in the installation.

![esxi](/images/ESXiInstallation/26.png)

You can set some configuration in this section. If there are no problem, you will not see this screen very often.

This node gets its IP from a DHCP server. This is an undesirable situation. Let's give it a static IP, DNS and hostname as follows.

![esxi](/images/ESXiInstallation/28.png)

![esxi](/images/ESXiInstallation/29.png)

![esxi](/images/ESXiInstallation/30.png)

![esxi](/images/ESXiInstallation/31.png)

![esxi](/images/ESXiInstallation/32.png)

After configuration, restart the management network.

![esxi](/images/ESXiInstallation/33.png)

![esxi](/images/ESXiInstallation/34.png)

![esxi](/images/ESXiInstallation/35.png)

Now as you can see in the picture below, Our ESXi node has been successfully configured for our case.

![esxi](/images/ESXiInstallation/36.png)

Let's go to the ESXi web management console. Enter the IP address of ESXi node in the browser URL bar as follows.

![esxi](/images/ESXiInstallation/38.png)

Enter the username and password.

![esxi](/images/ESXiInstallation/39.png)

![esxi](/images/ESXiInstallation/40.png)

![esxi](/images/ESXiInstallation/41.png)

We now have a successfully installed ESXi node. 

You can configure it according to your structure. But it is not usually used as a standalone in this way.

What about you have 5, 50 or more ESXi nodes?

I will cover on this topic in the vCenter article in the future.

Thanks for taking the time to read this article. I hope you find this article useful.

Keep up the good work!
