+++
title = "Memory Analysis - Ransomware"
date = '2025-07-05T15:16:47+02:00'
author = "Soner Sahin"
categories = ["Walkthroughs"]
tags = ["walkthroughs", "BTLO", "Memory Forensics", "Volatility"]
+++


Lab URL: https://blueteamlabs.online/home/challenge/memory-analysis-ransomware-7da6c9244d

### **Question 1**

Run “vol.py -f infected.vmem --profile=Win7SP1x86 psscan” that will list all processes. What is the name of the suspicious process?

```
vol.py -f infected.vmem --profile=Win7SP1x86 psscan
```

![MemoryAnalysis-Ransomware](/images/Walkthroughs/MemoryAnalysis-Ransomware/1.png)


**Answer:** @WanaDecryptor


### **Question 2**

What is the parent process ID for the suspicious process? 

```
vol3 -f infected.vmem windows.pslist
```

![MemoryAnalysis-Ransomware](/images/Walkthroughs/MemoryAnalysis-Ransomware/2.png)



**Answer:**  2732


### **Question 3**

What is the initial malicious executable that created this process?

```
vol3 -f infected.vmem windows.cmdline

OR

vol3 -f infected.vmem windows.filescan |grep -E ".exe"
```

![MemoryAnalysis-Ransomware](/images/Walkthroughs/MemoryAnalysis-Ransomware/3.png)


**Answer:**  or4qtckT.exe


### **Question 4**

If you drill down on the suspicious PID (vol.py -f infected.vmem --profile=Win7SP1x86 psscan | grep (PIDhere)), find the process used to delete files 

```
vol.py -f infected.vmem --profile=Win7SP1x86 psscan | grep 2732

OR

vol3 -f infected.vmem windows.psscan |grep 2732
```


![MemoryAnalysis-Ransomware](/images/Walkthroughs/MemoryAnalysis-Ransomware/4.png)


**Answer:**  taskdl.exe


### **Question 5**

Find the path where the malicious file was first executed.

```
vol3 -f infected.vmem windows.pstree

OR

vol3 -f infected.vmem windows.pstree | grep or4q
```


![MemoryAnalysis-Ransomware](/images/Walkthroughs/MemoryAnalysis-Ransomware/5.png)



**Answer:**  C:\Users\hacker\Desktop\or4qtckT.exe


### **Question 6**

Can you identify what ransomware it is?

Google Search 

![MemoryAnalysis-Ransomware](/images/Walkthroughs/MemoryAnalysis-Ransomware/6.png)



**Answer:**  Wanacry

### **Question 7**

What is the filename for the file with the ransomware public key that was used to encrypt the private key? (.eky extension)

```
vol3 -f infected.vmem windows.filescan |grep -i ".eky"
```

![MemoryAnalysis-Ransomware](/images/Walkthroughs/MemoryAnalysis-Ransomware/7.png)


**Answer:**  00000000.eky


Thank you for taking the time to read this write-up! I hope you found it insightful and helpful.

Keep learning and stay sharp. 👊

Keep up the good work!








