+++
title = "[EN] Network Time Protocol (NTP)"
date = "2025-05-13T21:23:07+02:00"
tags = ["NTP"]
categories = ["Network"]
author = "Soner Sahin"
image = "/images/ntp/cover.jpg"
+++

In modern networks, accurate time synchronization is crucial for tasks such as logging, authentication, and system coordination. Network Time Protocol (NTP) is a widely used protocol that allows devices on a network to synchronize their clocks with a reliable time source. This guide will walk you through the configuration of NTP on Cisco devices, including manual time setup, using a device as an NTP server, authentication, and debugging.

- UDP Port: 123
- The closest router to the Atomic Clock is called Stratum 1
- A device directly connected to an authorized NTP server is considered Stratum 1. Each subsequent device adds one to the stratum level
- Each hop increases the Stratum value.
- Maximum supported stratum level is 15

## **Configuring Clock and Date Manually:**

```
SW-1#clock set 12:00:00 1 AUG 2019
```
## **Setting the Time Zone:**

```
SW-1#conf t
SW-1(config)#clock timezone EST +2
```
## **Configuring Daylight Saving Time:**

```
SW-1(config)#clock summer-time CEST recurring last Sun Mar 2:00 last Sun Oct 3:00  
```
## **NTP Server Configuration:**

```
SW-1(config)#ip domain-lookup                  # DNS
SW-1(config)#ip name-server 1.1.1.1 8.8.8.8    # DNS

SW-1(config)#ntp server 198.111.152.100         #NTP Server
SW-1(config)#ntp server 0.tr.pool.ntp.org       #NTP Server
SW-1(config)#ntp update-calendar
```

If you want to use an external source for NTP information, you can visit [this site](https://www.ntppool.org/en/) to find NTP servers suitable for your location.

## **Configuring a Cisco Device as an NTP Server:**

```
SW-1(config)#ntp master 2
```
## **NTP Peering:**

```
SW-1(config)#ntp peer 10.53.56.100 source gigabitEthernet 0/0
```
## **NTP Authentication:**

```
#On the NTP Server:
SW-1(config)#ntp authenticate
SW-1(config)#ntp authentication-key 5 md5 Password123!
SW-1(config)#ntp trusted-key 5

#On the NTP Client:
SW-1(config)#ntp authenticate
SW-1(config)#ntp authentication-key 5 md5 Password123!
SW-1(config)#ntp trusted-key 5
SW-1(config)#ntp server 192.168.254.1 key 5
```
## **Enable NTP Logging:**

```
SW-1(config)#ntp logging
```
## **Show Commands:**

```
show clock
show calendar
show ntp status
show ntp associations
show ntp associations detail 
```
## **Debug Commands:**

```
debug ntp packet
debug ntp all
```

Thank you for taking time to read this article, I hope you will find it helpful.

Keep up the great work!
