+++
title = "[EN] Wazuh Suricata Integration"
date = "2025-11-07T17:06:01+01:00"
tags = ["wazuh", "suricata", "soc", "linux"]
categories = ["SOC", "Linux"]
author = "Soner Sahin"
image = "/images/wazuhsuricata/cover.png"
+++ 


Hi everyone! In this article I will walk you through installing Suricata on Ubuntu 24.04 and integrating its logs with Wazuh for centralized monitoring.

### Installing Suricata

Start by adding the official Suricata PPA, then update the package cache and install Suricata:

```sh
sudo add-apt-repository ppa:oisf/suricata-stable -y
sudo apt update
sudo apt install suricata -y
```

Enable Suricata to start automatically and launch the service:

```sh
sudo systemctl enable suricata
sudo systemctl start suricata
```

Suricata stores its configuration in `/etc/suricata/`. Custom, community, or commercial rule files can be placed under `/etc/suricata/rules/`.

Edit the main configuration file to fit your environment:

```sh
sudo nano /etc/suricata/suricata.yaml
```

Update the network variables and capture interface as needed. For example:

```sh
HOME_NET: "[10.0.0.0/24]"  
  
  
EXTERNAL_NET: "!$HOME_NET"  
EXTERNAL_NET: "any"  
  
  
af-packet:  
- interface: enp1s0  
```

Pull the latest rule updates and restart the service to apply the changes:

```sh
sudo suricata-update
sudo systemctl restart suricata
```

Suricata writes its logs under the `/var/log/suricata/` folder by default.

### Integrating Suricata with Wazuh

On the Wazuh agent, edit the main configuration file so the agent monitors the Suricata logs:

```sh
sudo nano /var/ossec/etc/ossec.conf
```

Add the following `<localfile>` entries inside the `<ossec_config>` block:

```sh
<!-- Suricata -->
  <localfile>
    <log_format>syslog</log_format>
    <location>/var/log/suricata/fast.log</location>
  </localfile>

  <localfile>
    <log_format>json</log_format>
    <location>/var/log/suricata/eve.json</location>
  </localfile>
```

Save the file and restart the Wazuh agent:

```sh
sudo systemctl restart wazuh-agent
```

Wazuh will now ingest Suricata alerts and events, making them available in the Wazuh dashboard for correlation and alerting.

Thanks for reading keep up the good work !