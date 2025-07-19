+++
title = "Network Analysis - Ransomware"
date = '2025-07-05T15:16:47+02:00'
author = "Soner Sahin"
categories = ["Walkthroughs"]
tags = ["walkthroughs", "BTLO", "Network Forensics", "wireshark", "ransomware", "teslacrypt"]
+++


Lab URL: https://blueteamlabs.online/home/challenge/network-analysis-ransomware-3dd520c7ec

### **Question 1**

**What is the operating system of the host from which the network traffic was captured?**

```
remnux@remnux:~/Downloads/BTLO Network Analysis - Ransomware/Challenge Files$ file *

help_recover_instructions.HTM: HTML document, ASCII text, with very long lines
help_recover_instructions.png: PNG image data, 1150 x 1000, 8-bit/color RGBA, non-interlaced
help_recover_instructions.TXT: ASCII text, with CRLF line terminators
ransom_traffic.pcapng:         pcapng capture file - version 1.0
Tender.pdf.micro:              data

```


![networkforensics](/images/NetworkAnalysisRansomware/1.png)

```
wireshark ransom_traffic.pcapng
```

**Statistics > Capture File Properties**

![networkforensics](/images/NetworkAnalysisRansomware/1.1.png)

![networkforensics](/images/NetworkAnalysisRansomware/1.2.png)

**Answer:** 32-bit Windows 7 Service Pack 1, build 7601

### **Question 2**

**What is the full URL from which the ransomware executable was downloaded?**

```
Packet 59
```

![networkforensics](/images/NetworkAnalysisRansomware/2.png)

**Answer:** http://10.0.2.15:8000/safecrypt.exe

### **Question 3**

**Name the ransomware executable file?** 

```
Packet 59
```

![networkforensics](/images/NetworkAnalysisRansomware/3.png)

OR

```
File > Export Objects > HTTP
```

![networkforensics](/images/NetworkAnalysisRansomware/3.1.png)

![networkforensics](/images/NetworkAnalysisRansomware/3.2.png)


**Answer:** safecrypt.exe

### **Question 4**

**What is the MD5 hash of the ransomware?** 

```
File > Export Objects > HTTP > Save
```

![networkforensics](/images/NetworkAnalysisRansomware/4.png)

**Answer:** 4a1d88603b1007825a9c6b36d1e5de44

### **Question 5**

**What is the name of the ransomware?** 

```
Search hash in the VirusTotal
```

![networkforensics](/images/NetworkAnalysisRansomware/5.png)

**Answer:** teslacrypt

### **Question 6**

**What is the encryption algorithm used by the ransomware, according to the ransom note?**

```
cat help_recover_instructions.TXT  |grep encryption
```

![networkforensics](/images/NetworkAnalysisRansomware/6.png)

**Answer:** RSA-4096

### **Question 7**

**What is the domain beginning with ‘d’ that is related to ransomware traffic?** 

![networkforensics](/images/NetworkAnalysisRansomware/7.png)

**Answer:** dunyamuzelerimuzesi.com

### **Question 8**

**Decrypt the Tender document and submit the flag**

```
Download a decryptor
https://success.trendmicro.com/en-US/solution/KA-0006362
```

![networkforensics](/images/NetworkAnalysisRansomware/8.2.png)

Run

```
wine RansomwareFileDecryptor\ 1.0.1668\ MUI.exe 
```

![networkforensics](/images/NetworkAnalysisRansomware/8.3.png)

![networkforensics](/images/NetworkAnalysisRansomware/8.4.png)

![networkforensics](/images/NetworkAnalysisRansomware/8.5.png)

![networkforensics](/images/NetworkAnalysisRansomware/8.6.png)

![networkforensics](/images/NetworkAnalysisRansomware/8.7.png)

![networkforensics](/images/NetworkAnalysisRansomware/8.8.png)


**Answer:** BTLO-T3nd3r-Fl@g

Thank you for taking the time to read this write-up! I hope you found it insightful and helpful.

Keep learning and stay sharp. 👊





















