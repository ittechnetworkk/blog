+++
title = "[EN] Active Directory Domain Controller Installation"
date = "2025-03-18T11:14:26+01:00"
tags = ["ad", "dc", "installation", "windows", "server"]
categories = ["Windows"]
author = "Soner Sahin"
image = "/images/ADDCInstallation/cover.jpg"
+++

Hi everyone,

In this article, I will show you how to install the **Active Directory Domain Controller** role on a Windows Server.

I will be using **Windows Server 2022**, which is already installed.

The installation process will be as follows:

Before starting the installation, we need to configure a few things.

First, we need to assign a static IP address to our server.

![esxi](/images/ADDCInstallation/1.png)

![esxi](/images/ADDCInstallation/2.png)

![esxi](/images/ADDCInstallation/3.png)

![esxi](/images/ADDCInstallation/4.png)

![esxi](/images/ADDCInstallation/5.png)

![esxi](/images/ADDCInstallation/6.png)

![esxi](/images/ADDCInstallation/7.png)

![esxi](/images/ADDCInstallation/8.png)

Next, we need to assign a hostname. Please note that this process will require a restart.

![esxi](/images/ADDCInstallation/9.png)

![esxi](/images/ADDCInstallation/11.png)

![esxi](/images/ADDCInstallation/12.png)

![esxi](/images/ADDCInstallation/13.png)

![esxi](/images/ADDCInstallation/14.png)

![esxi](/images/ADDCInstallation/15.png)

![esxi](/images/ADDCInstallation/16.png)

After rebooting, let's check for updates.

![esxi](/images/ADDCInstallation/17.png)

![esxi](/images/ADDCInstallation/18.png)

While updating, let's configure the time and date.

![esxi](/images/ADDCInstallation/19.png)

![esxi](/images/ADDCInstallation/20.png)

![esxi](/images/ADDCInstallation/21.png)

You can also configure the date, time, time zone, and regional formatting here.

![esxi](/images/ADDCInstallation/22.png)

![esxi](/images/ADDCInstallation/23.png)

In case you need to add a language or keyboard layout, you can do so here.

![esxi](/images/ADDCInstallation/24.png)

Configure the power and sleep settings.

![esxi](/images/ADDCInstallation/25.png)

![esxi](/images/ADDCInstallation/26.png)

![esxi](/images/ADDCInstallation/27.png)

It is good practice to reboot the system after making certain configuration changes.

By default, the firewall is turned on, which is good. However, since we are in a lab environment, I want to turn it off for specific reasons.

Now, let's proceed with installing the **AD-DC** role.

![esxi](/images/ADDCInstallation/28.png)

![esxi](/images/ADDCInstallation/29.png)

![esxi](/images/ADDCInstallation/30.png)

![esxi](/images/ADDCInstallation/31.png)

![esxi](/images/ADDCInstallation/32.png)

![esxi](/images/ADDCInstallation/33.png)

![esxi](/images/ADDCInstallation/34.png)

![esxi](/images/ADDCInstallation/35.png)

![esxi](/images/ADDCInstallation/36.png)

If you check the box starting with "Restart," the server will automatically restart if required after the installation is complete.

![esxi](/images/ADDCInstallation/37.png)

![esxi](/images/ADDCInstallation/38.png)

![esxi](/images/ADDCInstallation/39.png)

Here are the next steps:

![esxi](/images/ADDCInstallation/40.png)

![esxi](/images/ADDCInstallation/41.png)

![esxi](/images/ADDCInstallation/42.png)

![esxi](/images/ADDCInstallation/43.png)

![esxi](/images/ADDCInstallation/44.png)

![esxi](/images/ADDCInstallation/45.png)

![esxi](/images/ADDCInstallation/46.png)

![esxi](/images/ADDCInstallation/47.png)

![esxi](/images/ADDCInstallation/48.png)

![esxi](/images/ADDCInstallation/49.png)

![esxi](/images/ADDCInstallation/50.png)

![esxi](/images/ADDCInstallation/51.png)

The **Active Directory Domain Controller** role has been successfully installed.

Thank you for taking the time to read this article. I hope you found it useful.

Keep up the great work!

Thanks for taking the time to read this article. I hope you find this article useful.

Keep up the good work!