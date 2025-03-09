+++
title = "[EN] DHCP Server Configuration"
date = "2025-01-23T01:06:35+01:00"
tags = ["dhcp", "server", "ubuntu"]
categories = ["linux"]
author = "Soner Sahin"
image = "/images/UbuntuDHCPServer/cover.jpg"
+++

Hello there!

In this article, I’m going to show you how to install and configure a DHCP server.

I’m going to install the DHCP server role on an Ubuntu server. However, the process is almost the same for all distributions.

We need to install the `isc-dhcp-server` package for DHCP role.

Let's get started.

```
ubuntu@ubuntu:~$ sudo apt install isc-dhcp-server
```

After the package is installed, let’s check the service called `isc-dhcp-server`.

```
ubuntu@ubuntu:~$ systemctl status isc-dhcp-server
× isc-dhcp-server.service - ISC DHCP IPv4 server
     Loaded: loaded (/lib/systemd/system/isc-dhcp-server.service; enabled; vendor preset: enabled)
     Active: failed (Result: exit-code) since Wed 2025-01-22 22:22:49 UTC; 1min 46s ago
       Docs: man:dhcpd(8)
    Process: 1553 ExecStart=/bin/sh -ec      CONFIG_FILE=/etc/dhcp/dhcpd.conf;      if [ -f /etc/ltsp/dhcpd.conf ]; then CONFIG_F>
   Main PID: 1553 (code=exited, status=1/FAILURE)
        CPU: 7ms
```

As you can see, the service is currently not working. We will configure it and then start the service.

Now, let’s configure the related file `/etc/dhcp/dhcpd.conf`.

I want it to distribute IP addresses within the range `10.0.1.55 - 10.0.1.60`.

```
# Authoritative
authoritative;

# Lease Time
default-lease-time 600;
max-lease-time  7200;

# Network
subnet 10.0.1.0 netmask 255.255.255.0 {
        range 10.0.1.55 10.0.1.60;
        option routers  10.0.1.2;
        option domain-name-servers      8.8.8.8, 1.1.1.1;
}
```

After configuration, we have to start the server and check its status

```
ubuntu@ubuntu:~$ sudo systemctl start isc-dhcp-server
ubuntu@ubuntu:~$ sudo systemctl status isc-dhcp-server
● isc-dhcp-server.service - ISC DHCP IPv4 server
     Loaded: loaded (/lib/systemd/system/isc-dhcp-server.service; enabled; vendor preset: enabled)
     Active: active (running) since Wed 2025-01-22 22:39:56 UTC; 5s ago
       Docs: man:dhcpd(8)
   Main PID: 2320 (dhcpd)
      Tasks: 4 (limit: 2182)
     Memory: 4.8M
        CPU: 9ms
     CGroup: /system.slice/isc-dhcp-server.service
             └─2320 dhcpd -user dhcpd -group dhcpd -f -4 -pf /run/dhcp-server/dhcpd.pid -cf /etc/dhcp/dhcpd.conf
```

As you can see all look great.

Now, I have a client machine on the same network. I'm going to let it get an IP address from the DHCP server.

The client machine has a different IP address which is `10.0.1.129` as follows.

```
debian@debian:~$ ip a |grep ens33
2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    inet 10.0.1.129/24 brd 10.0.1.255 scope global dynamic ens33
```

Let’s force it to leave its current IP address and then get a new one from the DHCP server.

```
debian@debian:~$ dhclient -r
debian@debian:~$ dhclient
debian@debian:~$ ip a |grep ens33
2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    inet 10.0.1.55/24 brd 10.0.1.255 scope global dynamic ens33
```

The client now has an IP address of `10.0.1.55`.

However, there are additional parameters we need to configure.

First, I want to specify the log file for the DHCP server. I have to add a line to the same file, which is `/etc/dhcp/dhcpd.conf`.

```
# Log
log-facility local7;
```

After that, we have to add another line to the `/etc/rsyslog.conf` file.

At the end of that file, I will add the following line.

```
# DHCP
local7.*                                                /var/log/dhcpd.log
```

Now, let's restart two services.

```
ubuntu@ubuntu:~$ sudo systemctl restart isc-dhcp-server
ubuntu@ubuntu:~$ sudo systemctl restart rsyslog
```

To make sure, I will make the client leave its IP and then get one again in order to see the changes in the log file.

You can see the logs live with the following command.

```
debian@debian:~$ dhclient -r
debian@debian:~$ dhclient
```

Logs:

```
ubuntu@ubuntu:~$ tail -f /var/log/dhcpd.log 

Jan 22 23:15:18 ubuntu dhcpd[2601]: DHCPDISCOVER from 00:0c:29:13:c7:1d via ens33
Jan 22 23:15:19 ubuntu dhcpd[2601]: DHCPOFFER on 10.0.1.55 to 00:0c:29:13:c7:1d (debian) via ens33
Jan 22 23:15:19 ubuntu dhcpd[2601]: DHCPREQUEST for 10.0.1.55 (10.0.1.128) from 00:0c:29:13:c7:1d (debian) via ens33
Jan 22 23:15:19 ubuntu dhcpd[2601]: DHCPACK on 10.0.1.55 to 00:0c:29:13:c7:1d (debian) via ens33
```

As you can see, the IP address retrieval process was successful.

We can also reserve an IP address to a device. So that IP address will always be assigned to that device.

Let's do it.

We have to add some commands as follows in order to reserve an IP address to a host on `/etc/dhcp/dhcpd.conf`.

It’s possible to reserve an IP address even if it isn’t within the specified range.

For example let's dedicate `10.0.1.80` IP address to our client machine.

```
# Reservation
host debian { 
        hardware ethernet       00:0c:29:13:c7:1d;
        fixed-address           10.0.1.80;
}
```

Restart the service to apply changes.

```
ubuntu@ubuntu:~$ sudo systemctl restart isc-dhcp-server
```

Now, I’m going to release the IP on the client machine and request a new one.

```
debian@debian:~$ sudo dhclient -r
debian@debian:~$ sudo dhclient
debian@debian:~$ ip a |grep ens33
2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    inet 10.0.1.80/24 brd 10.0.1.255 scope global dynamic ens33
```

Logs:

```
ubuntu@ubuntu:~$ tail -f /var/log/dhcpd.log

Jan 22 23:32:17 ubuntu dhcpd[2648]: DHCPDISCOVER from 00:0c:29:13:c7:1d via ens33
Jan 22 23:32:17 ubuntu dhcpd[2648]: DHCPOFFER on 10.0.1.80 to 00:0c:29:13:c7:1d via ens33
Jan 22 23:32:17 ubuntu dhcpd[2648]: DHCPREQUEST for 10.0.1.80 (10.0.1.128) from 00:0c:29:13:c7:1d via ens33
Jan 22 23:32:17 ubuntu dhcpd[2648]: DHCPACK on 10.0.1.80 to 00:0c:29:13:c7:1d via ens33
```

We made the client machine get an IP address outside our range.

In the following file, you can see the leased machines and their details: `/var/lib/dhcp/dhcpd.leases`.

```
ubuntu@ubuntu:~$ cat /var/lib/dhcp/dhcpd.leases

# The format of this file is documented in the dhcpd.leases(5) manual page.
# This lease file was written by isc-dhcp-4.4.1

# authoring-byte-order entry is generated, DO NOT DELETE
authoring-byte-order little-endian;

lease 10.0.1.55 {
  starts 3 2025/01/22 23:28:40;
  ends 3 2025/01/22 23:38:40;
  tstp 3 2025/01/22 23:38:40;
  cltt 3 2025/01/22 23:28:40;
  binding state active;
  next binding state free;
  rewind binding state free;
  hardware ethernet 00:0c:29:13:c7:1d;
  client-hostname "debian";
}
server-duid "\000\001\000\001/$0<\000\014)>+B";

lease 10.0.1.55 {
  starts 3 2025/01/22 23:28:40;
  ends 3 2025/01/22 23:31:55;
  tstp 3 2025/01/22 23:31:55;
  cltt 3 2025/01/22 23:28:40;
  binding state free;
  hardware ethernet 00:0c:29:13:c7:1d;
}
```

I want to show you all the parameters in the file, as follows.

`/etc/dhcp/dhcpd.conf`

```
# Authoritative
authoritative;

# Lease Time
default-lease-time 600;
max-lease-time  7200;

# Network
subnet 10.0.1.0 netmask 255.255.255.0 {
        range 10.0.1.55 10.0.1.60;
        option routers  10.0.1.2;
        option domain-name-servers      8.8.8.8, 1.1.1.1;
}

# Log
log-facility local7;

# Reservation
host debian {
        hardware ethernet       00:0c:29:13:c7:1d;
        fixed-address   10.0.1.80;
}
```

`/etc/rsyslog.conf`

```
# DHCP
local7.*						/var/log/dhcpd.log
```

Thank you for taking the time to read this article!

Keep up the good work!





