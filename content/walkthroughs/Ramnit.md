+++
title = "Ramnit Lab"
date = '2025-07-05T14:02:53+02:00'
author = "Soner Sahin"
categories = ["Walkthroughs"]
tags = ["walkthroughs", "Cyber Defenders", "Memory Forensics", "Volatility", "Virus Total", "GEO Location"]
+++



Lab URL: https://cyberdefenders.org/blueteam-ctf-challenges/ramnit/


### **Question 1**

**What is the name of the process responsible for the suspicious activity?**

```
vol3 -f memory.dmp windows.pstree
```

![Ramnit](/images/Walkthroughs/RamnitLab/1-2.png)

**Answer:** ChromeSetup.exe


### **Question 2**

**What is the exact path of the executable for the malicious process?**

```
vol3 -f memory.dmp windows.pstree
```

![Ramnit](/images/Walkthroughs/RamnitLab/1-2.png)

**Answer:** C:\Users\alex\Downloads\ChromeSetup.exe


### **Question 3**

**Identifying network connections is crucial for understanding the malware's communication strategy. What IP address did the malware attempt to connect to?**

```
vol3 -f memory.dmp windows.netscan |grep 4628
```

![Ramnit](/images/Walkthroughs/RamnitLab/3.png)

**Answer:** 58.64.204.181


### **Question 4**

**To determine the specific geographical origin of the attack, Which city is associated with the IP address the malware communicated with?**

```
https://www.iplocation.net/ip-lookup
```

![Ramnit](/images/Walkthroughs/RamnitLab/4.png)

**Answer:** Hong Kong


### **Question 5**

**Hashes serve as unique identifiers for files, assisting in the detection of similar threats across different machines. What is the SHA1 hash of the malware executable?**

```
vol3 -f memory.dmp -o a/ windows.dumpfiles --pid 4628
sha1sum file.0xca82b85325a0.0xca85b7e06c80.ImageSectionObject.ChromeSetup.exe.img
```


![Ramnit](/images/Walkthroughs/RamnitLab/5.png)

**Answer:** 280c9d36039f9432433893dee6126d72b9112ad2



### **Question 6**

**Examining the malware's development timeline can provide insights into its deployment. What is the compilation timestamp for the malware?**

```
https://www.virustotal.com/gui/file/1ac890f5fa78c857de42a112983357b0892537b73223d7ec1e1f43f8fc6b7496
```

![Ramnit](/images/Walkthroughs/RamnitLab/6.png)


**Answer:** Compilation Timestamp: 2019-12-01 08:36


### **Question 7**

**Identifying the domains associated with this malware is crucial for blocking future malicious communications and detecting any ongoing interactions with those domains within our network. Can you provide the domain connected to the malware?**

**Virustotal**


![Ramnit](/images/Walkthroughs/RamnitLab/7.png)

**Answer:** dnsnb8.net


Thank you for taking the time to read this write-up! I hope you found it insightful and helpful.

Keep learning and stay sharp. 👊

Keep up the good work!