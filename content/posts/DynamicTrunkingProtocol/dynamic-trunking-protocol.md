+++
title = "[EN] Dynamic Trunking Protocol (DTP)"
date = "2025-04-02T22:02:02+02:00"
tags = ["Cisco", "Cisco IOS"]
categories = ["Network"]
author = "Soner Sahin"
image = "/images/Dynamic Trunking Protocol/cover.jpg"
+++

Hi everyone, in this article, I will explain what DTP is and how it works.

DTP is a protocol that allows switch ports to be configured automatically.

In simple terms, if you change the mode of one port on a switch, the corresponding port on the connected switch will automatically adjust its mode. You can refer to the table below to see the possible mode combinations.

![dtp](/images/DynamicTrunkingProtocol/1.png)

For example, if one port of a switch is *dynamic auto* and the port to which the other switch is connected is *trunk*, the ports will automatically switch to *trunk* mode

By default, switches ports are in *dynamic desirable* mode.

For some security reasons you might want to disable this protocol.

**To see the mode of port:**

```
Switch#show interfaces switchport 
```

**To change port mode:**

```
Switch>en
Switch#conf t
Switch(config)#int e0/0
Switch(config-if)#switchport mode access|trunk|dynamic auto|dynamic desirable
```

**To disable DTP:**

```
Switch(config-if)#switchport mode trunk 
Switch(config-if)#switchport nonegotiate
```

**To see status of DTP:**

```
Switch#show dtp interface
```

Thank you for taking the time to read this article.

Keep up the good work!