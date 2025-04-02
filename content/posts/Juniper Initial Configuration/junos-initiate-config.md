+++
title = "[EN] Junos Initial Configuration"
date = "2025-04-02T21:05:37+02:00"
tags = ["Juniper", "Junos"]
categories = ["Network"]
author = "Soner Sahin"
image = "/images/Juniper Initial Configuration/cover.jpg"
+++

Hi everyone, in this article I will cover on how to make initial configuration in Junos.
## **Root Password:**

```
root> configure 
Entering configuration mode

[edit]
root# set system root-authentication plain-text-password 
New password:
Retype new password:
```
## **Hostname:**

```
[edit]
root# set system host-name ssnrshnn 
```
## **System Time:**

```
root> set date 202503241608 
date: connect: Can't assign requested address
Mon Mar 24 16:08:00 UTC 2025

root> show system uptime          
Current time: 2025-03-24 16:08:11 UTC
Time Source:  LOCAL CLOCK 
System booted: 2025-03-24 15:38:44 UTC (00:30:27 ago)
Protocols started: 2025-03-24 15:40:23 UTC (00:28:48 ago)
Last configured: 2025-03-24 14:41:02 UTC (01:28:09 ago) by root
 4:09PM  up 30 mins, 1 users, load averages: 0.60, 0.66, 0.59
```
## **Time Zone:**

```
[edit]                                  
root# set system time-zone Europe/Berlin 
```
## **NTP:**

```
[edit]                                  
root# set system ntp server 88.88.88.88
```
## **User Creating:**

```
[edit]
root# set system login user ssnrshnn uid 1001 class super-user authentication plain-text-password 
New password:
Retype new password:
```
## **RADIUS**:

```
[edit]
root# set system radius-server 50.50.50.1 port 1144 secret PASSWORD 
```
## **TACACS:**

```
[edit]
root# set system tacplus-server 55.55.55.1 port 1142 secret PASSWORD  
```
## **Management Protocols:**

```
[edit]
root# set system services telnet       

[edit]
root# set system services ssh 

[edit]                                  
root# set system services ssh root-login allow 
```
## **SSH-key:**

```
[edit]
root@# set system root-authentication ssh-rsa <ssh-key>
```
## **Management Interface:**

```
[edit]
root@# set interfaces fxp0 unit 0 family inet address <IP/Prefix>
```
## **Domain Name:**

```
[edit]
root@# set system domain-name <domain-name>
```
## **DNS:**

```
[edit]
root@# set system name-server <address>
```
## **CLI idle time-out:**

```
root> set cli idle-timeout 5 
Idle timeout set to 5 minutes
```
## **Logs:**

In default syslog is enabled. You can see logs with the command below.

```
root> show log messages 
```

Sending logs to all users:

```
[edit]
root# set system syslog user * any emergency 
```

Sending logs to the remote server:

```
[edit]
root# set system syslog host 10.10.10.1 any notice 
```
## **Archive:**

```
[edit]
root# set system archival configuration transfer-interval 60                  #every 60 mins

OR

[edit]
root# set system archival configuration transfer-on-commit                    #every commit

[edit]
root# set system archival configuration archive-sites ftp://hostname:password@x.x.x.x 
```

Thank you for taking the time to read this article. I hope you found it useful.

Keep up the great work!