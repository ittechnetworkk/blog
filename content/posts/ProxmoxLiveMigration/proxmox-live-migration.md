+++
title = "[EN] Proxmox Live Migration"
date = "2025-04-19T23:08:02+02:00"
tags = ["Proxmox", "Virtualization "]
categories = ["Virtualization"]
author = "Soner Sahin"
image = "/images/ProxmoxLiveMigration/cover.jpg"
+++

Hi everyone, in this article I will show you how to migrate virtual machines between nodes where in the cluster.

I have 2 virtual machines running, one of them is Centos-7 on node-1 and the other one is WIN-SERVER-2022 on node-2.

I will migrate them vice versa at the same time and will start a ping in case to be able to see any outage.

Steps will be as follows.

The IP address of Centos-7 is 192.168.1.214/24
The IP address of WIN-SERVER-2022 is 192.168.1.215/24

Each of them is running right now and I'm going to start pings from outsource to be able to see any packet loss.

![ProxmoxLiveMigration](/images/ProxmoxLiveMigration/6.png)

node-1 to node-2

![ProxmoxLiveMigration](/images/ProxmoxLiveMigration/1.jpg)

![ProxmoxLiveMigration](/images/ProxmoxLiveMigration/2.png)

![ProxmoxLiveMigration](/images/ProxmoxLiveMigration/3.png)

node-2 to node-1

![ProxmoxLiveMigration](/images/ProxmoxLiveMigration/4.png)

![ProxmoxLiveMigration](/images/ProxmoxLiveMigration/5.png)

![ProxmoxLiveMigration](/images/ProxmoxLiveMigration/7.png)

![ProxmoxLiveMigration](/images/ProxmoxLiveMigration/8.png)

![ProxmoxLiveMigration](/images/ProxmoxLiveMigration/9.png)

These ping results are not exhaustive, but I noticed that there was not even a single lost ping.  
Meanwhile, you can continue using your virtual machines without any interruption.

In this case, the migration of the CentOS 7 VM took approximately 2 minutes, while the other one took around 4–5 minutes, depending on their individual conditions.

Thank you for taking the time to read this article. I hope you found it helpful.

Keep up the great work!