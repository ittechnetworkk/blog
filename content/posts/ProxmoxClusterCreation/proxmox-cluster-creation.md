+++
title = "[EN] Proxmox Cluster Creation"
date = "2025-04-19T22:59:48+02:00"
tags = ["Proxmox", "Virtualization"]
categories = ["Virtualization"]
author = "Soner Sahin"
image = "/images/ProxmoxClusterCreation/cover.jpg"
+++

Hi everyone, in this article I will show you how to create Proxmox Cluster and how a node joins to the cluster.

Creating Cluster on Proxmox is not that hard or complex thing. 

I have 2 single Proxmox nodes, node-1 and node-2. I will create cluster on node-1 and will add node-2 to the cluster. 

Steps are as follows.

![ProxmoxClusterCreation](/images/ProxmoxClusterCreation/1.jpg)

![ProxmoxClusterCreation](/images/ProxmoxClusterCreation/2.jpg)

![ProxmoxClusterCreation](/images/ProxmoxClusterCreation/3.png)

The cluster has been successfully installed. It is time to join. 

First we need to have "join information" token.

![ProxmoxClusterCreation](/images/ProxmoxClusterCreation/4.jpg)

![ProxmoxClusterCreation](/images/ProxmoxClusterCreation/5.png)

node-2

![ProxmoxClusterCreation](/images/ProxmoxClusterCreation/6.jpg)

I am giving join credentials here.

![ProxmoxClusterCreation](/images/ProxmoxClusterCreation/7.png)

![ProxmoxClusterCreation](/images/ProxmoxClusterCreation/8.png)

If you have virtual machines on this node, you cannot join the cluster directly. Usually the cluster is created before all then VM's are installed. Otherwise, you should move your VM config files to another directory (for ex. /root directory), then join the cluster, after joining you can move VM config files back to the relevant directory as follows.

```
Node-2

root@node-2:~# mv /etc/pve/nodes/node-2/qemu-server/101.conf /root/

After joining

root@node-2:~# mv /root/101.conf /etc/pve/nodes/node-2/qemu-server/
```

Last view:

![ProxmoxClusterCreation](/images/ProxmoxClusterCreation/9.png)

Thank you for taking the time to read this article. I hope you found it useful.

Keep up the great work!

