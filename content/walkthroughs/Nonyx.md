+++
title = "Nonyx"
date = '2025-07-06T11:50:38+02:00'
author = "Soner Sahin"
categories = ["Walkthroughs"]
tags = ["walkthroughs", "Cyber Defenders", "Memory Forensics", "Volatility", "MITRE ATT&CK"]
+++



Lab URL: https://blueteamlabs.online/home/investigation/nonyx-63b4769449

### **Question 1**

**Which process most likely contains injected code, providing its name, PID, and memory address? (Format: Name, PID, Address)** 

```
python vol.py -f ../BlackEnergy.vnem malfind
```

![Nonyx](/images/Walkthroughs/Nonyx/1.png)

**Answer:** svchost.exe, 856, 0xc30000

### **Question 2**

**What dump file in the malfind output directory corresponds to the memory address identified for code injection? (Format: Output File Name)**

```
python vol.py -f ../BlackEnergy.vnem --profile=WinXPSP2x86 malfind --dump . --pid 856
```

![Nonyx](/images/Walkthroughs/Nonyx/2.png)

**Answer:** process.0x80ff88d8.0xc30000.dmp

### **Question 3**

**Which full filename path is referenced in the strings output of the memory section identified by malfind as containing a portable executable (PE32/MZ header)? (Format: Filename Path)** 

```
strings -n 5 process.0x80ff88d8.0xc30000.dmp
```

![Nonyx](/images/Walkthroughs/Nonyx/3.png)

**Answer:** C:\WINDOWS\system32\drivers\str.sys

### **Question 4**

**How many functions were hooked and by which module after running the ssdt plugin and filtering out legitimate SSDT entries using egrep -v '(ntoskrnl|win32k)'? (Format: XX, Module)** 

```
python vol.py -f ../BlackEnergy.vnem ssdt | egrep -v '(ntoskrnl|win32k)'
```

![Nonyx](/images/Walkthroughs/Nonyx/4.png)

**Answer:** 14, 00004A2A

### **Question 5**

**Using the modules (or modscan) plugin to identify the hooking driver from the ssdt output, what is the base address for the module found in Q4? (Format: Base Address)** 


```
python vol.py -f ../BlackEnergy.vnem modscan |grep 00004A2A
```

![Nonyx](/images/Walkthroughs/Nonyx/5.png)

**Answer:** 0xff0d1000

### **Question 6**

**What is the hash for the malicious driver from the virtual memory image? (Format: SHA256)** 

```
python vol.py -f ../BlackEnergy.vnem --profile=WinXPSP2x86 moddump -b 0xff0d1000 -D .

sha256sum driver.ff0d1000.sys
```

![Nonyx](/images/Walkthroughs/Nonyx/6.png)

**Answer:** 12b0407d9298e1a7154f5196db4a716052ca3acc70becf2d5489efd35f6c6ec8


Thank you for taking the time to read this write-up! I hope you found it insightful and helpful.

Keep learning and stay sharp. 👊

Keep up the good work!








