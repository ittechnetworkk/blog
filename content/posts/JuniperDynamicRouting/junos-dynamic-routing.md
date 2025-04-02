+++
title = "[EN] Junos Dynamic Routing"
date = "2025-04-02T21:49:12+02:00"
tags = ["Juniper", "Junos"]
categories = ["Network"]
author = "Soner Sahin"
image = "/images/Juniper Dynamic Routing/cover.jpg"
+++


Hi everyone, in this article I will show you how to configure dynamic routing in Junos.

```
[edit]
root# edit protocols ospf area 0  

[edit protocols ospf area 0.0.0.0]
root# set interface ge-0/0/0 
```

OR

```
[edit]
root# set protocols ospf area 0.0.0.0 interface ge-0/0/0 
```

Control:

```
root# show |compare 
[edit]
+  protocols {
+      ospf {
+          area 0.0.0.0 {
+              interface ge-0/0/0.0;
+          }
+      }
+  }
```

Thank you for taking the time to read this article. I hope you found it useful.

Keep up the great work!