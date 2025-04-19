+++
title = "[EN] Proxmox LACP"
date = "2025-04-19T23:05:27+02:00"
tags = ["Proxmox", "Virtualization"]
categories = ["Virtualization"]
author = "Soner Sahin"
image = "/images/ProxmoxLACP/cover.jpg"
+++

Hi everyone, in this article I will show you how to configure LACP between Proxmox and a L2 Cisco Switch.

LACP (Link Aggregation Control Protocol) is used to combine multiple physical interfaces into a single logical interface. This provides benefits such as load balancing, redundancy, and high availability.

When aiming for load balancing, redundancy, and high availability, LACP becomes an essential configuration.

Here's how to configure:

**L2 Cisco Switch:**

I will use Fa0/1, Fa0/2 interfaces for LACP.

```
SW-2>enable
SW-2#conf t
SW-2(config)#interface range FastEthernet 0/1-2
SW-2(config-if-range)#channel-group 1 mode active 
Creating a port-channel interface Port-channel 1

SW-2(config-if-range)#do show etherchannel summary
Flags:  D - down        P - bundled in port-channel
        I - stand-alone s - suspended
        H - Hot-standby (LACP only)
        R - Layer3      S - Layer2
        U - in use      f - failed to allocate aggregator

        M - not in use, minimum links not met
        u - unsuitable for bundling
        w - waiting to be aggregated
        d - default port


Number of channel-groups in use: 1
Number of aggregators:           1

Group  Port-channel  Protocol    Ports
------+-------------+-----------+-----------------------------------------------
1      Po1(SD)         LACP      Fa0/1(D)    Fa0/2(D)
```

**Proxmox:**

Create a "Linux Bond"

![ProxmoxLACP](/images/ProxmoxLACP/1.jpg)

Fill in only the "Mode" and "Hash Policy" sections as follows for now:

- Mode: `802.3ad (LACP)`
    
- Hash Policy: `layer3+4`
    

I am using the LACP (802.3ad) protocol in this setup. Depending on your network architecture, you may choose a different bonding mode if needed.

![ProxmoxLACP](/images/ProxmoxLACP/2.png)

Go back "vmbr0" interface.

![ProxmoxLACP](/images/ProxmoxLACP/3.jpg)

Change "Bridge ports" value into bond interface name that we've just created "bond0".

![ProxmoxLACP](/images/ProxmoxLACP/4.png)

Go back to the "bond0" interface.

![ProxmoxLACP](/images/ProxmoxLACP/5.jpg)

Now that I can add "eno1", "eno2" interfaces in "Slave" section

![ProxmoxLACP](/images/ProxmoxLACP/6.png)

Finally, apply configurations.

![ProxmoxLACP](/images/ProxmoxLACP/7.jpg)

![ProxmoxLACP](/images/ProxmoxLACP/8.png)

![ProxmoxLACP](/images/ProxmoxLACP/9.png)

Here's last view.

![ProxmoxLACP](/images/ProxmoxLACP/10.png)

Thank you for taking the time to read this article. I hope you found it helpful.

Keep up the great work!