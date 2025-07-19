+++
title = "Fortigate Wazuh Integration"
date = "2025-07-19T15:26:52+02:00"
tags = ["fortigate", "wazuh", "soc", "siem", "syslog", "firewall"]
categories = ["soc", "Firewall"]
author = "Soner Sahin"
image = "/images/wazuh-forti/cover.png"
draft = false
+++ 


Hi everyone, in this article I will guide you through how to integrate Fortigate firewall with the Wazuh SIEM tool for centralized logging and monitoring.

Fortigate is one of the best firewall solutions used in networks of all sizes worldwide. Wazuh is also one of the best open-source SIEM platforms available.

In this article, I will show you how to send Fortigate logs to the Wazuh SIEM platform to centralize all environment logs in one location.

The integration will be done in the following steps:

## **Fortigate Configuration**

Navigate to **Log & Report > Log Settings** in your Fortigate web interface.

![fortigate](/images/wazuh-forti/1.png)

That's all we need to configure on the Fortigate side.

## **Wazuh Server Configuration**

Now it's time to configure Wazuh to listen for Fortigate syslog packets.

Add these lines to the Wazuh ossec.conf file:

**File location:** `/var/ossec/etc/ossec.conf`

```
<remote>  
  <connection>syslog</connection>  
  <port>514</port>  
  <protocol>udp</protocol>                      
  <allowed-ips>10.1.8.1</allowed-ips>               # Fortigate IP
  <local_ip>10.1.8.10</local_ip>                    # Wazuh Server IP
</remote>
```

Restart the Wazuh service to apply the changes:

```
sudo systemctl restart wazuh-manager
```

## **Verification**

Use the following command to verify that Fortigate logs are successfully reaching the Wazuh server:

```
tcpdump -n -i eth0 udp port 514
```

You should see UDP packets coming from your Fortigate IP address.

## **Verification**

After completing the configuration, you should be able to see Fortigate logs in the Wazuh server dashboard. The logs will include:

- Firewall rule hits and blocks
- VPN connection events
- User authentication attempts
- Traffic flow information
- Security alerts and threats
- System events and errors

## **Additional Configuration**

You can enhance the monitoring by:

1. **Creating custom rule sets** for Fortigate devices to detect specific events
2. **Setting up alerts** for critical security events
3. **Configuring log retention policies** based on your requirements
4. **Implementing log correlation** to detect patterns across multiple devices

## **Troubleshooting**

If logs are not appearing in Wazuh:

1. **Check network connectivity** between Fortigate and Wazuh server
2. **Verify syslog configuration** on Fortigate
3. **Check Wazuh server logs** for any errors
4. **Ensure firewall rules** allow UDP port 514 traffic
5. **Verify the syslog server IP** is correctly configured on Fortigate

Thank you for taking the time to read this article. I hope you found it helpful!

Keep up the great work!