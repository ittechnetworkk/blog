+++
title = "[EN] Cisco Device Syslog Integration with Wazuh SIEM"
date = "2025-07-19T14:50:44+02:00"
tags = ["SOC", "cisco", "switch", "router", "wazuh", "siem", "syslog"]
categories = ["soc", "Network"]
author = "Soner Sahin"
image = "/images/wazuh-cisco/cover.png"
draft = false
+++ 


Hi everyone, in this article I will guide you through how to integrate Cisco devices (switches and routers) with the Wazuh SIEM tool for centralized logging and monitoring.

The integration will be done in the following steps:

## **Cisco switch configuration:**

```
# VLAN Configuration for Switch
Switch>enable
Switch#configure terminal
Switch(config)#interface vlan1
Switch(config-if)#ip address 10.1.5.100 255.255.255.0
Switch(config-if)#no shutdown
Switch(config-if)#exit

# Default Gateway Configuration
Switch(config)#ip default-gateway 10.1.5.1

# Syslog Configuration
Switch(config)#logging on
Switch(config)#logging host 10.1.8.10
Switch(config)#logging facility local1
Switch(config)#logging source-interface vlan1
Switch(config)#logging buffered 4096
Switch(config)#logging trap informational

# Routing Configuration
Switch(config)# ip route 10.1.8.0 255.255.255.0 10.1.5.1

# Save 
Switch(config)#end
Switch#wr
```

## **Cisco router configuration:**

```
# Interface Configuration for Router
Router>enable
Router#configure terminal
Router(config)#interface e0/0
Router(config-if)#ip address 10.1.6.100 255.255.255.0
Router(config-if)#no shutdown
Router(config-if)#exit

# Default Gateway Configuration
Router(config)#ip default-gateway 10.1.5.1

# Syslog Configuration
Router(config)#logging on
Router(config)#logging host 10.1.8.10
Router(config)#logging facility local0
Router(config)#logging source-interface e0/0
Router(config)#logging buffered 4096
Router(config)#logging trap informational

# Routing Configuration
Router(config)# ip route 10.1.8.0 255.255.255.0 10.1.5.1

# Save 
Router(config)#end
Router#wr
```

## **Wazuh Server Configuration:**

```
<remote>  
  <connection>syslog</connection>  
  <port>514</port>  
  <protocol>udp</protocol>                      
  <allowed-ips>10.1.5.100</allowed-ips>             # Switch/Router IP
  <local_ip>10.1.8.10</local_ip>                    # Wazuh Server IP
</remote>
```

## **Alternative Port Configuration:**

If you want to use a different port (e.g., 1514 for TCP or 10514 for custom UDP), modify the configuration:

```
<remote>  
  <connection>syslog</connection>  
  <port>1514</port>                                 # Custom port
  <protocol>tcp</protocol>                          # TCP instead of UDP
  <allowed-ips>10.1.5.100</allowed-ips>             # Switch/Router IP
  <local_ip>10.1.8.10</local_ip>                    # Wazuh Server IP
</remote>
```

**Note:** If using a custom port, remember to update the Cisco device syslog configuration accordingly:
```
Switch(config)#logging host 10.1.8.10 transport tcp port 1514
Router(config)#logging host 10.1.8.10 transport tcp port 1514
```

Restart the Wazuh server to apply the changes:

```
sudo systemctl restart wazuh-manager
```

## **Verification**

After completing the configuration, you should be able to see Cisco device logs in the Wazuh server dashboard. The logs will include:

- Interface status changes
- Configuration modifications
- System events
- Security alerts
- Performance metrics

## **Additional Configuration**

You can enhance the monitoring by:

1. **Creating custom rule sets** for Cisco devices to detect specific events
2. **Setting up alerts** for critical network events
3. **Configuring log retention policies** based on your requirements
4. **Implementing log correlation** to detect patterns across multiple devices

## **Troubleshooting**

If logs are not appearing in Wazuh:

1. **Check network connectivity** between Cisco devices and Wazuh server
2. **Verify syslog configuration** on Cisco devices
3. **Check Wazuh server logs** for any errors
4. **Ensure firewall rules** allow UDP port 514 traffic

Thank you for taking the time to read this article. I hope you found it helpful!

Keep up the great work!
