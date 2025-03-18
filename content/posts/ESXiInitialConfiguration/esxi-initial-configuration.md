+++
title = "[EN] ESXi Initial Configuration"
date = "2025-03-18T11:05:52+01:00"
tags = ["esxi", "configuration", "initial"]
categories = ["Virtualization"]
author = "Soner Sahin"
image = "/images/ESXiInitialConfiguration/cover.jpg"
+++

Hi everyone, in this article I will show you ESXi initial configuration and demonstrate how to install Windows Server 2022 as a virtual machine.

After installing ESXi, we need to configure some essential things such as NTP, Licence, Users, Roles etc. 

Additionally, I will show you how to upload an ISO image and how to install a virtual machine.

**License:**

First, I will show you how to assign a license to an ESXi node. To obtain a license, you can visit the [Broadcom Website](https://support.broadcom.com/group/ecx/my-dashboard). I will use a license that you will find with quick searching. But never use this license in the bussiness. I'm just labbing therefore I'm using this license. The steps are as follows:

![esxi](/images/ESXiInitialConfiguration/1.png)

![esxi](/images/ESXiInitialConfiguration/2.png)

![esxi](/images/ESXiInitialConfiguration/3.png)

![esxi](/images/ESXiInitialConfiguration/4.png)

**NTP:**

NTP is one of the most important services, as it ensures accurate time synchronization. It must always be configured correctly.

If you have a local NTP server, you can set it up accordingly. However, if you don't, you can check out this [website](https://www.ntppool.org) for public NTP servers.

![esxi](/images/ESXiInitialConfiguration/5.png)

![esxi](/images/ESXiInitialConfiguration/6.png)

After setting up the NTP servers, we need to start the `ntpd` service, as it is stopped by default.

![esxi](/images/ESXiInitialConfiguration/7.png)

**Users:**

One of the important tasks is adding users. By default, we use the **root** account, which has full privileges. However, using the root account can be risky, especially for new users.

For this reason, we need to create a new user and assign roles as needed. As an example, I will create a new user and grant some random privileges, but you should carefully assign permissions based on your requirements.

Before adding a user, let's create a role first.

![esxi](/images/ESXiInitialConfiguration/8.png)

I will assign some additional privileges, but be careful not to grant any unnecessary permissions.

**Privileges:**

![esxi](/images/ESXiInitialConfiguration/9.png)

![esxi](/images/ESXiInitialConfiguration/10.png)

**Adding user:**

![esxi](/images/ESXiInitialConfiguration/11.png)

![esxi](/images/ESXiInitialConfiguration/12.png)

![esxi](/images/ESXiInitialConfiguration/13.png)

![esxi](/images/ESXiInitialConfiguration/14.png)

![esxi](/images/ESXiInitialConfiguration/15.png)

![esxi](/images/ESXiInitialConfiguration/16.png)

![esxi](/images/ESXiInitialConfiguration/17.png)

![esxi](/images/ESXiInitialConfiguration/18.png)

Let's log out and log back in as the **ssnrshnn** user.

![esxi](/images/ESXiInitialConfiguration/19.png)

![esxi](/images/ESXiInitialConfiguration/20.png)

![esxi](/images/ESXiInitialConfiguration/21.png)

Great! Now, let's take a quick look at the sections.

**System:**

**Advanced Settings:**

![esxi](/images/ESXiInitialConfiguration/22.png)

**Autostart:**

In this section, you can edit **Autostart**, which allows you to schedule the automatic startup of a virtual machine.

![esxi](/images/ESXiInitialConfiguration/23.png)

![esxi](/images/ESXiInitialConfiguration/24.png)

**Swap:**

In this section, you can edit **Swap**, which enables the swapping of virtual machine RAM pages to the hard drive.

![esxi](/images/ESXiInitialConfiguration/25.png)

![esxi](/images/ESXiInitialConfiguration/26.png)

**Time & Date:**

In this section, we can configure both **NTP** and **PTP** services.

![esxi](/images/ESXiInitialConfiguration/27.png)

![esxi](/images/ESXiInitialConfiguration/28.png)

**Hardware:**

**PCI Devices:**

In this section, you can view the **PCI devices** attached to your server.

![esxi](/images/ESXiInitialConfiguration/29.png)

**Power Management:**

In this section, we configure the **Power Policy** of our node.

![esxi](/images/ESXiInitialConfiguration/30.png)

You can select one of them according to your needs. Keep in mind that this is a corporate server.

![esxi](/images/ESXiInitialConfiguration/31.png)

**Licensing:**

In this section, we can assign or remove licenses. You will also be able to see the license key, key expiration date, and the features that come with your license.

![esxi](/images/ESXiInitialConfiguration/32.png)

**Packages:**

In this section, we can view update packages and install updates.

![esxi](/images/ESXiInitialConfiguration/33.png)

![esxi](/images/ESXiInitialConfiguration/34.png)

![esxi](/images/ESXiInitialConfiguration/35.png)

**Services:**

In this section, we can view, start, stop, and restart ESXi services.

![esxi](/images/ESXiInitialConfiguration/36.png)

**Security & Users:**

**Acceptance Level:**

In this section, we can edit the **Acceptance Level**, which determines which VIBs can be installed on a host.

![esxi](/images/ESXiInitialConfiguration/37.png)

![esxi](/images/ESXiInitialConfiguration/38.png)

**Authentication:**

In this section, we can join a domain.

![esxi](/images/ESXiInitialConfiguration/39.png)

![esxi](/images/ESXiInitialConfiguration/40.png)

**Certificates:**

In this section, we can import a certificate for SSL.

![esxi](/images/ESXiInitialConfiguration/41.png)

![esxi](/images/ESXiInitialConfiguration/42.png)

**Users:**

In this section, we can add, edit, and remove users.

![esxi](/images/ESXiInitialConfiguration/43.png)

![esxi](/images/ESXiInitialConfiguration/44.png)

**Roles:**

In this section, we can view, add, edit, and remove roles.

![esxi](/images/ESXiInitialConfiguration/45.png)

![esxi](/images/ESXiInitialConfiguration/46.png)

**Lockdown Mode:**

In this section, we configure **Lockdown Mode**, which prevents access to the ESXi host's web management console for security purposes, provided you have a vCenter. You can also configure the **user exception** feature, which allows only specified exception users to access the host.

![esxi](/images/ESXiInitialConfiguration/47.png)

![esxi](/images/ESXiInitialConfiguration/48.png)

![esxi](/images/ESXiInitialConfiguration/49.png)

**Monitor:**

In this section, we can monitor our ESXi host's resources, including **Performance**, **Hardware**, **Storage**, **Events**, **Tasks**, **Logs**, and **Notifications**.

![esxi](/images/ESXiInitialConfiguration/50.png)

**Virtual Machines:**

In this section, we can create and manage virtual machines.

![esxi](/images/ESXiInitialConfiguration/51.png)

**Storage:**

In this section, we can view and manage our storage.

![esxi](/images/ESXiInitialConfiguration/52.png)

**Networking:**

In this section, we configure all our networking settings.

![esxi](/images/ESXiInitialConfiguration/53.png)

In this section, we can log out, change the password, and manage other settings.

![esxi](/images/ESXiInitialConfiguration/54.png)

You can configure it according to your infrastructure.

Thank you for taking the time to read this article. I hope you found it useful.

Keep up the great work!
