+++
title = "[EN] Junos User Accounts"
date = "2025-04-02T21:40:28+02:00"
tags = ["Juniper", "Junos"]
categories = ["Network"]
author = "Soner Sahin"
image = "/images/Juniper User Accounts/cover.jpg"
+++

In this article I will show you user accounts in Junos.

**Login Classes:**

In Junos you can create a login class to assign detailed privileges per class and add user to that class.

**Authorization:**

- **super-user:** all permissions
- **operator:** clear, reset, trace, view
- **read-only:** view
- **unauthorized:** nothing

Allowed or denied commands can be specified for each class.

**User Authentication:**

In Junos you can authenticate users by;

- Local Database,
- Radius Server,
- Tacacs Server.

**User Creating:**

```
[edit]
root# set system login user ssnrshnn uid 1001 class super-user authentication plain-text-password 
New password:
Retype new password:
```

**Control**

```
root# show | compare 
[edit system]
+   login {
+       user ssnrshnn {
+           uid 1001;
+           class super-user;
+           authentication {
+               encrypted-password "$6$AI7RPF/8$4Gkm6UOQxdDvHKZ2EqVylOHgvGXMUjwwlANxXivDzX9vsdSSdbfi6lp2tYzQkMy06khf7xRWor1Y6O.sqxEPr1"; ## SECRET-DATA
+           }
+       }
+   }
```

**RADIUS**:

```
[edit]
root# set system radius-server 50.50.50.1 port 1144 secret PASSWORD 
```

**TACACS:**

```
[edit]
root# set system tacplus-server 55.55.55.1 port 1142 secret PASSWORD  
```

**Control:**

```
[edit]
root# show | compare 
[edit system]
+  radius-server {
+      50.50.50.1 {
+          port 1144;
+          secret "$9$DNj.fTQ39t0X7.fz6tpW8XxNV"; ## SECRET-DATA
+      }
+  }
+  tacplus-server {
+      55.55.55.1 {
+          port 1142;
+          secret "$9$0J6LOESrlvL7dqmESeW7NiHq.PT"; ## SECRET-DATA
+      }
+  }
```

Thank you for taking the time to read this article. I hope you found it useful.

Keep up the great work!



















