+++
title = "3CX Supply Chain"
date = '2025-07-05T15:16:47+02:00'
author = "Soner Sahin"
categories = ["Walkthroughs"]
tags = ["walkthroughs", "Cyber Defenders", "apt", "lazarus", "Virus Total"]
+++

Lab URL: https://cyberdefenders.org/blueteam-ctf-challenges/3cx-supply-chain/

### **Question 1**

**Understanding the scope of the attack and identifying which versions exhibit malicious behavior is crucial for making informed decisions if these compromised versions are present in the organization. How many versions of 3CX **running on Windows** have been flagged as malware?**

```
Search for hash
```


![3CX-Supply-Chain](/images/3CX-Supply-Chain/1.png)

**Answer:** 2

### **Question 2**

**Determining the age of the malware can help assess the extent of the compromise and track the evolution of malware families and variants. What's the UTC creation time of the `.msi` malware?**

```
VirusTotal > Details
```

![3CX-Supply-Chain](/images/3CX-Supply-Chain/2.png)


**Answer:** 2023-03-13 06:33

### **Question 3**

**Executable files (`.exe`) are frequently used as primary or secondary malware payloads, while dynamic link libraries (`.dll`) often load malicious code or enhance malware functionality. Analyzing files deposited by the Microsoft Software Installer (`.msi`) is crucial for identifying malicious files and investigating their full potential. Which malicious DLLs were dropped by the `.msi` file?**

```
VirusTotal > Behavior
Files dropped
```

![3CX-Supply-Chain](/images/3CX-Supply-Chain/3.png)

**Answer:** ffmpeg.dll, d3dcompiler_47.dll

### **Question 4**

**Recognizing the persistence techniques used in this incident is essential for current mitigation strategies and future defense improvements. What is the MITRE Technique ID employed by the `.msi` files to load the malicious DLL?**

```
VirusTotal > Behavior
MITRE ATT&CK Tactics and Techniques > Persistence
DLL Side-Loading
```

![3CX-Supply-Chain](/images/3CX-Supply-Chain/4.png)

**Answer:** T1574

### **Question 5**

**Recognizing the malware type (`threat category`) is essential to your investigation, as it can offer valuable insight into the possible malicious actions you'll be examining. What is the threat category of the two malicious DLLs?**

```
VirusTotal
Search for hashes of those dlls
```

![3CX-Supply-Chain](/images/3CX-Supply-Chain/5.1.png)

**Answer:** trojan

### **Question 6**

**As a threat intelligence analyst conducting dynamic analysis, it's vital to understand how malware can evade detection in virtualized environments or analysis systems. This knowledge will help you effectively mitigate or address these evasive tactics. What is the MITRE ID for the virtualization/sandbox evasion techniques used by the two malicious DLLs?**

```
VirusTotal > Behavior
MITRE ATT&CK Tactics and Techniques > Defense Evasion
```

![3CX-Supply-Chain](/images/3CX-Supply-Chain/6.png)

**Answer:** T1497

### **Question 7**

**When conducting malware analysis and reverse engineering, understanding anti-analysis techniques is vital to avoid wasting time. Which hypervisor is targeted by the anti-analysis techniques in the `ffmpeg.dll` file?**

```
VirusTotal Behavior page
Capabilities > Anti-Analysis
```

![3CX-Supply-Chain](/images/3CX-Supply-Chain/7.png)

**Answer:** vmware

### **Question 8**

**Identifying the cryptographic method used in malware is crucial for understanding the techniques employed to bypass defense mechanisms and execute its functions fully. What encryption algorithm is used by the `ffmpeg.dll` file?**

```
VirusTotal Behavior page
```

![3CX-Supply-Chain](/images/3CX-Supply-Chain/8.png)

**Answer:** rc4

### **Question 9**

**As an analyst, you've recognized some TTPs involved in the incident, but identifying the APT group responsible will help you search for their usual TTPs and uncover other potential malicious activities. Which group is responsible for this attack?**

```
Search hash
```

![3CX-Supply-Chain](/images/3CX-Supply-Chain/9.png)

**Answer:** Lazarus

Thank you for taking the time to read this write-up! I hope you found it insightful and helpful.

Keep learning and stay sharp. 👊

Keep up the good work!
