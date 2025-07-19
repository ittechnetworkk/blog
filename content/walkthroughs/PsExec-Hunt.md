+++
title = "PsExec Hunt"
date = '2025-07-05T15:16:47+02:00'
author = "Soner Sahin"
categories = ["Walkthroughs"]
tags = ["walkthroughs", "Cyber Defenders", "wireshark", "network forensics"]
+++


Lab URL: https://cyberdefenders.org/blueteam-ctf-challenges/psexec-hunt/

### **Question 1**

**To effectively trace the attacker's activities within our network, can you identify the IP address of the machine from which the attacker initially gained access?**

```
wireshark > Statistics > IPv4
```

![psexec](/images/PsExec-Hunt/1.png)

**Answer:** 10.0.0.130

### **Question 2**

**To fully understand the extent of the breach, can you determine the machine's hostname to which the attacker first pivoted?**

```
Wireshark Filter
ip.addr==10.0.0.130

Packet 131
NetBIOS Domain Name
```

![psexec](/images/PsExec-Hunt/2.png)

**Answer:** sales-pc

### **Question 3**

**Knowing the username of the account the attacker used for authentication will give us insights into the extent of the breach. What is the username utilized by the attacker for authentication?**

```
Wireshark Filter
ip.addr==10.0.0.130

Packet 132
User: \ssales
```

![psexec](/images/PsExec-Hunt/3.png)

**Answer:** ssales

### **Question 4**

**After figuring out how the attacker moved within our network, we need to know what they did on the target machine. What's the name of the service executable the attacker set up on the target?**

```
Wireshark Filter
ip.addr==10.0.0.130

Packet 144
Create Request File: psexesvc
```

![psexec](/images/PsExec-Hunt/4.png)

**Answer:** psexesvc

### **Question 5**

**We need to know how the attacker installed the service on the compromised machine to understand the attacker's lateral movement tactics. This can help identify other affected systems. Which network share was used by PsExec to install the service on the target machine?**

```
Wireshark Filter
ip.addr==10.0.0.130

Packet 138
Connect Request Tree: \\10.0.0.133\ADMIN$
```

![psexec](/images/PsExec-Hunt/5.png)

**Answer:** admin$

### **Question 6**

**We must identify the network share used to communicate between the two machines. Which network share did PsExec use for communication?**

```
Wireshark Filter
ip.addr==10.0.0.130

Packet 133
Connect Request Tree: \\10.0.0.133\IPC$
```

![psexec](/images/PsExec-Hunt/6.png)

**Answer:** IPC$

### **Question 7**

**Now that we have a clearer picture of the attacker's activities on the compromised machine, it's important to identify any further lateral movement. What is the hostname of the second machine the attacker targeted to pivot within our network?**

```
Wireshark Filter
ip.addr==10.0.0.130 and not ip.addr==10.0.0.133

Packet 38514
NetBIOS domain name: MARKETING-PC
```

![psexec](/images/PsExec-Hunt/7.png)

**Answer:** marketing-pc


Thank you for taking the time to read this write-up! I hope you found it insightful and helpful.

Keep learning and stay sharp. 👊

Keep up the good work!