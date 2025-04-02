+++
title = "[EN] Junos Static Routing"
date = "2025-04-02T21:46:23+02:00"
tags = ["Juniper", "Junos"]
categories = ["Network"]
author = "Soner Sahin"
image = "/images/Juniper Static Routing/cover.jpg"
+++


In Junos devices static routing configuration will be done in the following way.

**Routing Preferences in Junos:**

```
- Direct/Local                           0
- Static Route                           5
- OSPF Internal                          10
- ISIS Internal L1/L2                    15-18
- RIP                                    100
- OSPF External                          150
- ISIS External L1/L2                    160/165
- BGP                                    170
```

**Static Route Configuration:**

```
[edit] 
root# edit routing-options 

[edit routing-options]
root# set static route 10.10.10.0/24 next-hop 9.9.9.1
```

OR

```
[edit]
root# set routing-options static route 10.10.10.0/24 next-hop 9.9.9.1
```

Adding a backup route with different preference value.

```
[edit] 
root# edit routing-options 

[edit routing-options]
root# set static route 10.10.10.0/24 qualified-next-hop 8.8.8.1 preference 20  
```

Changing default preference value. This configuration will effect all static routes that you will configure later on.

```
[edit] 
root# edit routing-options 

[edit routing-options]
root# edit static defaults preference      

[edit routing-options static defaults preference]
root# set 60  
```

**Control**

```
[edit]
root# edit routing-options    

[edit routing-options]
root# show 
static {
    defaults {
        preference 60;
    }
    route 10.10.10.0/24 {
        next-hop 9.9.9.1;
        qualified-next-hop 8.8.8.1 {
            preference 20;
        }
    }
}
```

**Default Route:**

```
[edit]
root# set routing-options static route 0.0.0.0/0 next-hop 192.168.1.1

```

**Show Commands:**

```
root> show route  
root> show route detail  
root> show route forwarding-table 
root> show route protocol static 
root> show route terse                  
```

Thank you for taking the time to read this article. I hope you found it useful.

Keep up the great work!