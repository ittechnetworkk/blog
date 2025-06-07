+++
title = "[EN] Network Address Translation (NAT)"
date = "2025-05-13T21:08:38+02:00"
tags = ["NAT","Dynamic NAT", "Static NAT", "PAT"]
categories = ["Network"]
author = "Soner Sahin"
image = "/images/nat/cover.jpg"
+++

Hi everyone,

In this article, I will walk you through Network Address Translation (NAT)—what it is, how it works, why we use it, and how to configure it using a lab.

NAT (Network Address Translation) is a method used in routers and firewalls that allows private IP addresses within a local network to access the public internet using a single or a few public IP addresses.

Since private IP addresses (e.g., 192.168.x.x, 10.x.x.x, 172.16.x.x–172.31.x.x) are not routable on the internet, NAT translates these private IP addresses into a public IP before forwarding traffic. It also translates incoming public traffic back to the appropriate private IP inside the network.

The primary reason NAT exists is because of the limited number of IPv4 addresses available globally.

**There are 3 types of NAT:**

- **Static NAT:** A single private IP is always mapped to the same public IP.
- **Dynamic NAT:** Private IPs are mapped to a pool of public IPs, but not fixed; the router picks an available public IP dynamically.
- **PAT or NAT-Overload:** Many private IPs are mapped to a single public IP using different ports.

## **Static NAT Configuration:**

```
R1>enable
R1#configure terminal
R1(config)#int g0/0                                  
R1(config-if)#ip nat inside 
R1(config-if)#int g0/1
R1(config-if)#ip nat outside 
R1(config-if)#exit

R1(config)#ip nat inside source static 192.168.1.1 50.65.84.74
OR
R1(config)#ip nat inside source static 192.168.1.1 interface g0/1
```
## **Dynamic NAT Configuration:**

```
R1>enable
R1#configure terminal
R1(config)#int g0/0                                  
R1(config-if)#ip nat inside 
R1(config-if)#int g0/1
R1(config-if)#ip nat outside 
R1(config-if)#exit

R1(config)#ip nat pool NATPool 80.60.50.10 80.60.50.20 netmask 255.255.255.0
R1(config)#access-list 10 permit 192.168.1.0 0.0.0.255
R1(config)#ip nat inside source list 10 pool NATPool
```
## **PAT Configuration:**

```
R1>enable
R1#configure terminal
R1(config)#int g0/0                                  
R1(config-if)#ip nat inside 
R1(config-if)#int g0/1
R1(config-if)#ip nat outside 
R1(config-if)#exit

R1(config)#access-list 10 permit 192.168.1.0 0.0.0.255
R1(config)#ip nat inside source list 10 interface g0/1 overload
```
## **Show Commands:**

```
show ip nat translations
show ip nat statistics
show running-config | include nat
```
## **Debugging Commands:**

```
debug ip nat
debug ip nat detailed
```


Thank you for taking time to read this article, I hope you will 

Thank you for taking time to read this article, I hope you will find it helpful.

Keep up the great work!
























