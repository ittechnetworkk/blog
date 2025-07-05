+++
title = "Reveal Lab"
date = '2025-07-05T14:46:23+02:00'
author = "Soner Sahin"
categories = ["Walkthroughs"]
tags = ["walkthroughs", "Cyber Defenders", "Memory Forensics", "Volatility", "MITRE ATT&CK"]
+++



Lab URL: https://cyberdefenders.org/blueteam-ctf-challenges/reveal/

### **Question 1**

**Identifying the name of the malicious process helps in understanding the nature of the attack. What is the name of the malicious process?**

```
vol3 -f 192-Reveal.dmp windows.cmdline
```

![Reveal](/images/Walkthroughs/RevealLab/1.png)

**Answer:** Powershell.exe


### **Question 2**

**Knowing the parent process ID (PPID) of the malicious process aids in tracing the process hierarchy and understanding the attack flow. What is the parent PID of the malicious process?**

```
vol3 -f 192-Reveal.dmp windows.pslist
```

![Reveal](/images/Walkthroughs/RevealLab/2.png)


**Answer:**  4120


### **Question 3**

**Determining the file name used by the malware for executing the second-stage payload is crucial for identifying subsequent malicious activities. What is the file name that the malware uses to execute the second-stage payload?**

```
vol3 -f 192-Reveal.dmp windows.cmdline --pid 3692
```

![Reveal](/images/Walkthroughs/RevealLab/3.png)


**Answer:** 3435.dll

### **Question 4**


**Identifying the shared directory on the remote server helps trace the resources targeted by the attacker. What is the name of the shared directory being accessed on the remote server?**

```
vol3 -f 192-Reveal.dmp windows.cmdline --pid 3692
```

![Reveal](/images/Walkthroughs/RevealLab/4.png)


**Answer:**  davwwwroot


### **Question 5**

**What is the MITRE ATT&CK sub-technique ID that describes the execution of a second-stage payload using a Windows utility to run the malicious file?**

```
vol3 -f 192-Reveal.dmp windows.cmdline --pid 3692
```

![Reveal](/images/Walkthroughs/RevealLab/5.png)

![Reveal](/images/Walkthroughs/RevealLab/5.1.png)


**Answer:**  T1218.01


### **Question 6**

**Identifying the username under which the malicious process runs helps in assessing the compromised account and its potential impact. What is the username that the malicious process runs under?**

```
vol3 -f 192-Reveal.dmp windows.session |grep -e "DESKTOP"
```

![Reveal](/images/Walkthroughs/RevealLab/6.png)


**Answer:** elon


### **Question 7**


**Knowing the name of the malware family is essential for correlating the attack with known threats and developing appropriate defenses. What is the name of the malware family?**

```
vol3 -f 192-Reveal.dmp windows.cmdline |grep power
```

![Reveal](/images/Walkthroughs/RevealLab/7.png)

AnyRun Search

![Reveal](/images/Walkthroughs/RevealLab/7.1.png)

**Answer:** strelastealer


Thank you for taking the time to read this write-up! I hope you found it insightful and helpful.

Keep learning and stay sharp. 👊

Keep up the good work!











