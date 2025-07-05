+++
title = "BlackEnergy Lab"
date = '2025-07-05T13:40:46+02:00'
author = "Soner Sahin"
categories = ["Walkthroughs"]
tags = ["walkthroughs", "Cyber Defenders", "Memory Forensics", "Volatility"]
+++

Lab URL: https://cyberdefenders.org/blueteam-ctf-challenges/blackenergy/



### **Question 1**

**Which volatility profile would be best for this machine?**

```
vol.py -f CYBERDEF-567078-20230213-171333.raw imageinfo
```

**Answer:** WinXPSP2x86

### **Question 2**

**How many processes were running when the image was acquired?**

```
vol.py -f CYBERDEF-567078-20230213-171333.raw --profile=WinXPSP2x86 pslist
```

**Answer:** 19


![maliciousPowershellAnalysis](/images/Walkthroughs/BlackEnergyLab/2.png)


### **Question 3**

**What is the process ID of `cmd.exe`?** 

```
vol.py -f CYBERDEF-567078-20230213-171333.raw --profile=WinXPSP2x86 pslist |grep cmd
```

**Answer:** 1960


![maliciousPowershellAnalysis](/images/Walkthroughs/BlackEnergyLab/3.png)


### **Question 4**

**What is the name of the most suspicious process?**

```
vol.py -f CYBERDEF-567078-20230213-171333.raw --profile=WinXPSP2x86 pslist
```

**Answer:** rootkit.exe


![maliciousPowershellAnalysis](/images/Walkthroughs/BlackEnergyLab/4.png)


### **Question 5**

**Which process shows the highest likelihood of code injection?**

```
vol3 -f CYBERDEF-567078-20230213-171333.raw windows.malfind
```

**Answer:** svchost.exe



![maliciousPowershellAnalysis](/images/Walkthroughs/BlackEnergyLab/5.png)


### **Question 6**

**There is an odd file referenced in the recent process. Provide the full path of that file.**

```
vol3 -f CYBERDEF-567078-20230213-171333.raw windows.handles --pid 880 |grep -i ".sys"
```

**Answer:** C:\WINDOWS\system32\drivers\str.sys


![maliciousPowershellAnalysis](/images/Walkthroughs/BlackEnergyLab/6.png)


### **Question 7**

**What is the name of the injected DLL file loaded from the recent process?**

```
vol3 -f CYBERDEF-567078-20230213-171333.raw windows.ldrmodules --pid 880
OR
vol3 -f CYBERDEF-567078-20230213-171333.raw windows.dlllist --pid 880
```

**Answer:** msxml3r.dll


![maliciousPowershellAnalysis](/images/Walkthroughs/BlackEnergyLab/7.png)


### **Question 8**

**What is the base address of the injected DLL?**
```
vol3 -f CYBERDEF-567078-20230213-171333.raw windows.malfind --pid 880
```

**Answer:** 0x980000


![maliciousPowershellAnalysis](/images/Walkthroughs/BlackEnergyLab/8.png)


Thank you for taking the time to read this write-up! I hope you found it insightful and helpful.

Keep learning and stay sharp. 👊

Keep up the good work!











