+++
title = "Amadey"
date = '2025-07-05T15:16:47+02:00'
author = "Soner Sahin"
categories = ["Walkthroughs"]
tags = ["walkthroughs", "Cyber Defenders", "volatility", "memory forensics"]
+++


Lab URL: https://cyberdefenders.org/blueteam-ctf-challenges/amadey/

### **Question 1**

**In the memory dump analysis, determining the root of the malicious activity is essential for comprehending the extent of the intrusion. What is the name of the parent process that triggered this malicious behavior?**

```
python3 vol.py -f windows.vmem windows.pslist
```

![amadey](/images/Amadey/1.png)

**Answer:** lssass.exe

### **Question 2**

**Once the rogue process is identified, its exact location on the device can reveal more about its nature and source. Where is this process housed on the workstation?**

```
python3 vol.py -f win.vmem windows.filescan |grep lssass.exe
```

![amadey](/images/Amadey/2.png)

**Answer:** C:\Users\0XSH3R~1\AppData\Local\Temp\925e7e99c5\lssass.exe

### **Question 3**

**Persistent external communications suggest the malware's attempts to reach out C2C server. Can you identify the Command and Control (C2C) server IP that the process interacts with?**

```
python3 vol.py -f win.vmem windows.netscan |grep lssass.exe
```

![amadey](/images/Amadey/3.png)

**Answer:** 41.75.84.12

### **Question 4**

**Following the malware link with the C2C, the malware is likely fetching additional tools or modules. How many distinct files is it trying to bring onto the compromised workstation?**

```
python3 vol.py -f win.vmem windows.memmap --pid 2748 --dump

strings -n 5 pid.2748.dmp |grep GET
```

GET /rock/Plugins/cred64.dll HTTP/1.1

GET /rock/Plugins/clip64.dll HTTP/1.1

![amadey](/images/Amadey/4.png)

**Answer:** 2

### **Question 5**

**Identifying the storage points of these additional components is critical for containment and cleanup. What is the full path of the file downloaded and used by the malware in its malicious activity?**

```
python3 vol.py -f win.vmem windows.filescan |grep clip64.dll
```

![amadey](/images/Amadey/5.png)

**Answer:** C:\Users\0xSh3rl0ck\AppData\Roaming\116711e5a2ab05\clip64.dll

### **Question 6**

**Once retrieved, the malware aims to activate its additional components. Which child process is initiated by the malware to execute these files?**

```
python3 vol.py -f win.vmem windows.pstree
```

![amadey](/images/Amadey/6.png)

**Answer:** rundll32.exe

### **Question 7**

**Understanding the full range of Amadey's persistence mechanisms can help in an effective mitigation. Apart from the locations already spotlighted, where else might the malware be ensuring its consistent presence?**

```
python3 vol.py -f win.vmem windows.filescan |grep lssass.exe
```

![amadey](/images/Amadey/7.png)

**Answer:** C:\Windows\System32\Tasks\lssass.exe


Thank you for taking the time to read this write-up! I hope you found it insightful and helpful.

Keep learning and stay sharp. 👊

Keep up the good work!





