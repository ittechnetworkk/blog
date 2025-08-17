+++
title = "[EN] Wazuh Sysmon Integration"
date = "2025-08-12T00:33:51+02:00"
tags = ["wazuh", "windows", "sysmon"]
categories = ["soc", "windows"]
author = "Soner Sahin"
image = "/images/wazuhsysmon/cover.png"
+++ 


Hi everyone, in this article I will guide you how to integrate Sysmon and Wazuh SIEM tool. 

Sysmon is a tool that allows us to collect and analyse logs easier in a center. Sysmon has also some other benefits that makes our investigations easier.

Sysmon is used in Linux systems as well. (https://github.com/microsoft/SysmonForLinux)

In this article I will show you how to download, install Sysmon and then how to send Sysmon logs into Wazuh SIEM tool.

Steps will be as follows.

## **Download the Sysmon package from Microsoft**

**Installing Sysmon**

Link: https://download.sysinternals.com/files/Sysmon.zip

![wazuh](/images/wazuhsysmon/1.png)


Run a cmd as Administrator and type:

```
cd C:\Users\Administrator\Downloads\Sysmon                   #where the Sysmon files located
Sysmon.exe -i -accepteula
```

![wazuh](/images/wazuhsysmon/2.png)

## **Installing Wazuh agent**

Run a Powershell as Administrator and type:

```
Invoke-WebRequest -Uri https://packages.wazuh.com/4.x/windows/wazuh-agent-4.12.0-1.msi -OutFile $env:tmp\wazuh-agent; msiexec.exe /i $env:tmp\wazuh-agent /q WAZUH_MANAGER='YOUR-WAZUH-SERVER-IP' WAZUH_AGENT_GROUP='YOUR-AGENT-GROUP-NAME' WAZUH_AGENT_NAME='YOUR-AGENT-NAME'
```

then

```
NET START WazuhSvc
```

## **Sysmon Wazuh Configuration**

Windows:

Windows Start menu > OSSEC > Manage Agent > More > Run as administrator

![wazuh](/images/wazuhsysmon/3.png)

Wazuh Agent > View Config

![wazuh](/images/wazuhsysmon/4.png)

Add these lines to the config file under " **Log Analysis** " as follows.

```
<!-- Log Analysis -->

<localfile>      
  <location>Microsoft-Windows-Sysmon/Operational</location>      
  <log_format>eventchannel</log_format>  
</localfile>
```

![wazuh](/images/wazuhsysmon/5.png)

Save, close and restart the agent service.

![wazuh](/images/wazuhsysmon/6.png)

That's all.

After this configuration, you will be able to view Sysmon logs in Wazuh SIEM.

![wazuh](/images/wazuhsysmon/7.png)


Thank you for taking time to read this article, I hope you will find it helpful.

Keep up the great work!


