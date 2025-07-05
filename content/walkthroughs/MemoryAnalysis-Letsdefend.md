+++
title = "Memory Analysis"
date = '2025-07-05T15:04:55+02:00'
author = "Soner Sahin"
categories = ["Walkthroughs"]
tags = ["walkthroughs", "Letsdefend", "Memory Forensics", "Volatility"]
+++


Lab URL: https://app.letsdefend.io/challenge/memory-analysis

### **Question 1**

**What was the date and time when Memory from the compromised endpoint was acquired?**

```
vol -f dump.mem windows.info
```

![MemoryAnalysis-Letsdefend](/images/Walkthroughs/MemoryAnalysis-Letsdefend/1.png)



**Answer:** 2022-07-26 18:16:32

### **Question 2**

**What was the suspicious process running on the system? (Format : name.extension)**

```
vol -f dump.mem windows.pslist
```

![MemoryAnalysis-Letsdefend](/images/Walkthroughs/MemoryAnalysis-Letsdefend/2.png)

explorer.exe > lsass.exe ????

**Answer:** lsass.exe

### **Question 3**

**Analyze and find the malicious tool running on the system by the attacker (Format name.extension)**

```
vol -f dump.mem -o . windows.dumpfiles --pid 7592

strings -n 5 file.0xdf0e86793960.0xdf0e8708e520.ImageSectionObject.lsass.exe.img
```


![MemoryAnalysis-Letsdefend](/images/Walkthroughs/MemoryAnalysis-Letsdefend/3.png)

**Answer:** winpeas.exe

### **Question 4**

**Which User Account was compromised? Format (DomainName/USERNAME)**

```
vol -f dump.mem windows.sessions
```

![MemoryAnalysis-Letsdefend](/images/Walkthroughs/MemoryAnalysis-Letsdefend/4.png)

**Answer:** MSEDGEWIN10/CyberJunkie

### **Question 5**

**What is the compromised user password?**

```
vol -f dump.mem windows.hashdump
```

![MemoryAnalysis-Letsdefend](/images/Walkthroughs/MemoryAnalysis-Letsdefend/5.png)


![MemoryAnalysis-Letsdefend](/images/Walkthroughs/MemoryAnalysis-Letsdefend/5.1.png)

**Answer:**  password123


Thank you for taking the time to read this write-up! I hope you found it insightful and helpful.

Keep learning and stay sharp. 👊

Keep up the good work!