+++
title = "Red Stealer"
date = '2025-07-05T15:16:47+02:00'
author = "Soner Sahin"
categories = ["Walkthroughs"]
tags = ["walkthroughs", "Cyber Defenders", "wireshark"]
+++

Lab URL: https://cyberdefenders.org/blueteam-ctf-challenges/red-stealer/

### **Question 1**

**Categorizing malware enables a quicker and clearer understanding of its unique behaviors and attack vectors. What category has Microsoft identified for that malware in VirusTotal?**

```
Search Hash in VirusTotal
248FCC901AFF4E4B4C48C91E4D78A939BF681C9A1BC24ADDC3551B32768F907B
```

![RedStealer](/images/RedStealer/1.png)

**Answer:** trojan

### **Question 2**

**Clearly identifying the name of the malware file improves communication among the SOC team. What is the file name associated with this malware?**

```
Take a look at the top of the Virus total Page
```

![RedStealer](/images/RedStealer/2.png)

**Answer:** wextract

### **Question 3**

**Knowing the exact timestamp of when the malware was first observed can help prioritize response actions. Newly detected malware may require urgent containment and eradication compared to older, well-documented threats. What is the UTC timestamp of the malware's first submission to VirusTotal?**

```
Take a look at the Details page in the VirusTotal
```

![RedStealer](/images/RedStealer/3.png)

**Answer:** 2023-10-06 04:41

### **Question 4**

**Understanding the techniques used by malware helps in strategic security planning. What is the MITRE ATT&CK technique ID for the malware's data collection from the system before exfiltration?**

```
Take a look at the Behavior page in the VirusTotal

MITRE ATT&CK Tactics and Techniques
```

![RedStealer](/images/RedStealer/4.png)

**Answer:** T1005

### **Question 5**

**Following execution, which social media-related domain names did the malware resolve via DNS queries?**

```
Take a look at the Behavior page in the VirusTotal

DNS Resolutions
```

![RedStealer](/images/RedStealer/5.png)

**Answer:** facebook.com

### **Question 6**

**Once the malicious IP addresses are identified, network security devices such as firewalls can be configured to block traffic to and from these addresses. Can you provide the IP address and destination port the malware communicates with?**

```
Take a look at the Behavior page in the VirusTotal

IP Traffic
OR
Memory Pattern Urls
OR
Memory Pattern IPs
```

![RedStealer](/images/RedStealer/6.png)

**Answer:** 77.91.124.55:19071

### **Question 7**

**YARA rules are designed to identify specific malware patterns and behaviors. Using MalwareBazaar, what's the name of the YARA rule created by "`Varp0s`" that detects the identified malware?**

```
MalwareBazaar
Sha256:248FCC901AFF4E4B4C48C91E4D78A939BF681C9A1BC24ADDC3551B32768F907B
```

![RedStealer](/images/RedStealer/7.1.png)

![RedStealer](/images/RedStealer/7.2.png)

**Answer:** detect_Redline_Stealer

### **Question 8**

**Understanding which malware families are targeting the organization helps in strategic security planning for the future and prioritizing resources based on the threat. Can you provide the different malware alias associated with the malicious IP address according to **ThreatFox**?**

```
ThreatFox
Search
ioc:77.91.124.55
```

![RedStealer](/images/RedStealer/8.1.png)

![RedStealer](/images/RedStealer/8.2.png)

**Answer:** RECORDSTEALER

### **Question 9**

**By identifying the malware's imported DLLs, we can configure security tools to monitor for the loading or unusual usage of these specific DLLs. Can you provide the DLL utilized by the malware for privilege escalation?**

![RedStealer](/images/RedStealer/9.1.png)

![RedStealer](/images/RedStealer/9.2.png)

OR

![RedStealer](/images/RedStealer/9.3.png)

**Answer:** advapi32.dll


Thank you for taking the time to read this write-up! I hope you found it insightful and helpful.

Keep learning and stay sharp. 👊

Keep up the good work!
