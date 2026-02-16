+++
title = "[EN] Wazuh ClamAV Monitoring"
date = "2026-01-20T10:58:28+01:00"
tags = ["wazuh","clamav","linux","soc"]
categories = ["SOC", "Linux"]
author = "Soner Sahin"
image = "/images/wazuhclamav/cover.png"
+++ 


This guide will walk you through setting up ClamAV antivirus integrating it with Wazuh for centralized security monitoring. This setup enables automatic malware detection, detailed logging through the Wazuh security platform.

# Part 1: Install ClamAV 

## Step 1: Install ClamAV and Dependencies

Update your package list and install ClamAV along with its daemon, update tool, and inotify utilities:

```bash
sudo apt update
sudo apt install clamav clamav-daemon clamav-freshclam inotify-tools -y
```

**Package descriptions:**
- `clamav`: The ClamAV antivirus engine
- `clamav-daemon`: Background service for real-time scanning
- `clamav-freshclam`: Tool for updating virus definitions
- `inotify-tools`: Utilities for monitoring file system events

## Step 2: Stop Services for Configuration

Stop the ClamAV services before configuration to prevent conflicts:

```bash
sudo systemctl stop clamav-daemon
sudo systemctl stop clamav-freshclam
```

## Step 3: Update Virus Definitions

Download the latest virus signature database. This is essential for effective malware detection:

```bash
sudo freshclam
```

**Note:** This process may take several minutes depending on your internet connection speed. The virus database is typically 100-200 MB in size.

## Step 4: Configure ClamAV Daemon

Edit the ClamAV daemon configuration file:

```bash
sudo nano /etc/clamav/clamd.conf
```

**Important:** Comment out or remove the `Example` line at the top of the file if present. Then ensure these settings are configured:

```conf
# Logging
LogFile /var/log/clamav/clamav.log
LogTime yes
LogFileMaxSize 50M
LogVerbose yes
LogRotate yes

# Socket settings
LocalSocket /var/run/clamav/clamd.ctl
FixStaleSocket yes
LocalSocketGroup clamav
LocalSocketMode 666

# User
User clamav

# Scanning settings
ScanOnAccess yes
OnAccessIncludePath /home
OnAccessExcludePath /proc
OnAccessExcludePath /sys
OnAccessExcludePath /dev
OnAccessPrevention no
OnAccessExtraScanning yes
```

## Step 5: Create Log Directory

Create the log directory structure with proper permissions for ClamAV:

```bash
sudo mkdir -p /var/log/clamav
sudo chown clamav:clamav /var/log/clamav
sudo chmod 755 /var/log/clamav
sudo touch /var/log/clamav/clamav.log
sudo touch /var/log/clamav/scan-results.log
sudo chown clamav:clamav /var/log/clamav/*.log
```

This ensures ClamAV can write logs to these files.

## Step 6: Start ClamAV Services

Start and enable ClamAV services to run automatically on system boot:

```bash
sudo systemctl start clamav-freshclam
sudo systemctl start clamav-daemon
sudo systemctl enable clamav-freshclam
sudo systemctl enable clamav-daemon
```

## Step 7: Verify ClamAV is Running

Check that both services are running properly:

```bash
sudo systemctl status clamav-daemon
sudo systemctl status clamav-freshclam
```

# Part 2: Set Up Automated Scanning with Detailed Logs

## Step 8: Create Scanning Script

Create a custom scanning script that will perform scheduled scans and generate detailed logs:

```bash
sudo nano /usr/local/bin/clamav-scan.sh
```

Add the following content:

```bash
#!/bin/bash

# Configuration
SCAN_DIRS="/home /var/www /tmp"
LOG_FILE="/var/log/clamav/scan-results.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Function to log with timestamp
log_message() {
    echo "[$TIMESTAMP] $1" | tee -a "$LOG_FILE"
}

# Start scan
log_message "=== ClamAV Scan Started ==="
log_message "Scanning directories: $SCAN_DIRS"

# Perform scan and capture results
SCAN_OUTPUT=$(clamscan -r -i --log=/tmp/clamscan_temp.log $SCAN_DIRS 2>&1)
SCAN_EXIT_CODE=$?

# Extract summary
INFECTED=$(echo "$SCAN_OUTPUT" | grep "Infected files:" | awk '{print $3}')
SCANNED=$(echo "$SCAN_OUTPUT" | grep "Scanned files:" | awk '{print $3}')

# Log results
cat /tmp/clamscan_temp.log >> "$LOG_FILE"
log_message "Scan completed - Scanned: $SCANNED files, Infected: $INFECTED files"

# If infected files found, log alert
if [ "$INFECTED" != "0" ] && [ -n "$INFECTED" ]; then
    log_message "ALERT: Malware detected! $INFECTED infected file(s) found!"
    log_message "Details:"
    grep "FOUND" /tmp/clamscan_temp.log | tee -a "$LOG_FILE"
fi

log_message "=== ClamAV Scan Finished ==="
echo "" >> "$LOG_FILE"

# Cleanup
rm -f /tmp/clamscan_temp.log

exit $SCAN_EXIT_CODE
```

Make it executable:

```bash
sudo chmod +x /usr/local/bin/clamav-scan.sh
```

## Step 9: Set Up Scheduled Scanning (Cron Job)

Configure automatic scheduled scans using cron. Edit the root crontab:

```bash
sudo crontab -e
```

**Option 1: Daily scan at 2 AM (recommended for most environments):**

```cron
0 2 * * * /usr/local/bin/clamav-scan.sh
```

**Option 2: Hourly scans (for high-security environments):**

```cron
0 * * * * /usr/local/bin/clamav-scan.sh
```

**Option 3: Multiple times per day (e.g., every 6 hours):**

```cron
0 */6 * * * /usr/local/bin/clamav-scan.sh
```

**Note:** More frequent scans provide better security but consume more system resources.

## Step 10: Test the Scanning Script

Run the script manually to verify it works correctly:

```bash
sudo /usr/local/bin/clamav-scan.sh
```

Check the log file to verify the scan completed successfully:

```bash
sudo cat /var/log/clamav/scan-results.log
```

You should see output similar to:
```
[2024-01-20 10:30:00] === ClamAV Scan Started ===
[2024-01-20 10:30:00] Scanning directories: /home /var/www /tmp
[2024-01-20 10:35:00] Scan completed - Scanned: 12345 files, Infected: 0 files
[2024-01-20 10:35:00] === ClamAV Scan Finished ===
```


# Part 3: Install and Configure Wazuh Agent

## Step 11: Install Wazuh Agent

**Installation method (using Wazuh repository):**

```bash
# Add Wazuh repository
curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | gpg --no-default-keyring --keyring gnupg-ring:/usr/share/keyrings/wazuh.gpg --import && \
chmod 644 /usr/share/keyrings/wazuh.gpg && \
echo "deb [signed-by=/usr/share/keyrings/wazuh.gpg] https://packages.wazuh.com/4.x/apt/ stable main" | tee -a /etc/apt/sources.list.d/wazuh.list

# Install agent
sudo apt update
sudo WAZUH_MANAGER='<wazuh-manager-ip>' \
     WAZUH_AGENT_GROUP='<agent-group>' \
     WAZUH_AGENT_NAME='<agent-name>' \
     apt install wazuh-agent -y
```

## Step 12: Configure Wazuh Agent to Monitor ClamAV Logs

Edit the Wazuh agent configuration file to monitor ClamAV log files:

```bash
sudo nano /var/ossec/etc/ossec.conf
```

Locate the `<ossec_config>` section and add the following configuration before the closing `</ossec_config>` tag:

```xml
  <!-- ClamAV Log Monitoring -->
  <localfile>
    <log_format>syslog</log_format>
    <location>/var/log/clamav/clamav.log</location>
  </localfile>

  <localfile>
    <log_format>syslog</log_format>
    <location>/var/log/clamav/scan-results.log</location>
  </localfile>
```

## Step 13: Restart Wazuh Agent

Reload systemd, enable the agent to start on boot, and start the service:

```bash
sudo systemctl daemon-reload 
sudo systemctl enable wazuh-agent 
sudo systemctl start wazuh-agent
```

## Step 14: Check Wazuh Agent Status

Verify the agent is running and connected to the manager:

```bash
sudo systemctl status wazuh-agent
```

Check agent connection status:

```bash
sudo /var/ossec/bin/agent_control -l
```

You should see your agent listed with status "Active". If the agent is not connecting, check the logs:

```bash
sudo tail -f /var/ossec/logs/ossec.log
```


# Part 4: Configure Wazuh Manager for ClamAV Alerts

## Step 15: Add ClamAV Detection Rules on Wazuh Manager

**Important:** These steps must be performed on the **Wazuh Manager** server, not on the agent.

SSH into your Wazuh Manager and create or edit the local rules file:

```bash
sudo nano /var/ossec/etc/rules/local_rules.xml
```

If the file doesn't exist, create it with the following structure. Add these custom rules for ClamAV detection:

```xml
<!-- ClamAV Detection Rules -->  
<group name="clamav,malware,">  
  
 <!-- Rule for scan started -->  
 <rule id="100101" level="3">  
   <decoded_as>clamav-started</decoded_as>  
   <description>ClamAV: Scan initiated</description>  
 </rule>  
  
 <!-- Rule for scan completed with summary -->  
 <rule id="100102" level="3">  
   <decoded_as>clamav-summary</decoded_as>  
   <field name="infected_files">^0$</field>  
   <description>ClamAV: Scan completed successfully - Scanned: $(scanned_files) files, No infections found</description>  
 </rule>  
  
 <!-- Rule for malware detection alert -->  
 <rule id="100103" level="12">  
   <decoded_as>clamav-malware</decoded_as>  
   <description>ClamAV: ALERT - $(infected_count) infected file(s) detected!</description>  
   <group>malware_detected,pci_dss_11.4,gdpr_IV_35.7.d,hipaa_164.312.b,nist_800_53_SI.3,tsc_CC6.8,tsc_CC7.2,</group>  
 </rule>  
  
 <!-- Rule for individual infected file detection -->  
 <rule id="100104" level="10">  
   <decoded_as>clamav-file-infected</decoded_as>  
   <description>ClamAV: Malware found - $(virus_name) in $(file_path)</description>  
   <group>malware_detected,pci_dss_11.4,gdpr_IV_35.7.d,hipaa_164.312.b,nist_800_53_SI.3,</group>  
 </rule>  
  
 <!-- Critical alert for multiple infections -->  
 <rule id="100105" level="15">  
   <if_sid>100103</if_sid>  
   <field name="infected_count">^[2-9]$|^\d{2,}$</field>  
   <description>ClamAV: CRITICAL - Multiple infections detected ($(infected_count) files)</description>  
   <group>malware_detected,critical,pci_dss_11.4,gdpr_IV_35.7.d,</group>  
 </rule>  
  
 <!-- Rule for scan completed WITH infections -->  
 <rule id="100106" level="12">  
   <decoded_as>clamav-summary</decoded_as>  
   <field name="infected_files">^[1-9]\d*$</field>  
   <description>ClamAV: Scan completed - $(scanned_files) files scanned, $(infected_files) INFECTED files found</descript  
ion>  
   <group>malware_detected,pci_dss_11.4,gdpr_IV_35.7.d,</group>  
 </rule>  
  
</group>
```

## Step 16: Add ClamAV Decoder on Wazuh Manager

Create or edit the local decoder file on the Wazuh Manager:

```bash
sudo nano /var/ossec/etc/decoders/local_decoder.xml
```

If the file doesn't exist, create it. Add the following decoders to parse ClamAV log messages:

```xml
<!--  
 - Local decoders  
 - Copyright (C) 2015, Wazuh Inc.  
-->  
  
<decoder name="clamav-started">  
 <prematch>ClamAV Scan Started</prematch>  
</decoder>  
  
<decoder name="clamav-summary">  
 <prematch>Scan completed</prematch>  
 <regex>Scan completed - Scanned: (\d+) files, Infected: (\d+) files</regex>  
 <order>scanned_files,infected_files</order>  
</decoder>  
  
<decoder name="clamav-malware">  
 <prematch>ALERT: Malware detected</prematch>  
 <regex>ALERT: Malware detected! (\d+) infected file</regex>  
 <order>infected_count</order>  
</decoder>  
  
<decoder name="clamav-file-infected">  
 <prematch>FOUND</prematch>  
 <regex>(\S+): (\S+) FOUND</regex>  
 <order>file_path,virus_name</order>  
</decoder>
```

## Step 17: Restart Wazuh Manager

After adding the rules and decoders, restart the Wazuh Manager to apply the changes:

```bash
sudo systemctl restart wazuh-manager
```

Verify the manager started successfully:

```bash
sudo systemctl status wazuh-manager
```

**Note:** It may take a few moments for the manager to fully restart and reload all configurations.


# Part 5: Test the Complete Setup

## Step 18: Create a Test Virus File on the Agent

**Warning:** The EICAR test file is a harmless test file used to verify antivirus functionality. It is not a real virus but is detected by all antivirus software.

On your Ubuntu agent, download the EICAR test file:

```bash
cd /tmp
wget https://files.trendmicro.com/products/eicar-file/eicar.com
```

**Note:** This file is intentionally detected as malware by ClamAV for testing purposes.

## Step 19: Run a Manual Scan

Execute the scanning script to detect the test file:

```bash
sudo /usr/local/bin/clamav-scan.sh
```

## Step 20: Check the Logs

**On the Ubuntu Agent:**

Check ClamAV scan results:
```bash
sudo tail -30 /var/log/clamav/scan-results.log
```

Check Wazuh agent logs for any errors:
```bash
sudo tail -f /var/ossec/logs/ossec.log
```

**On the Wazuh Manager:**

Check if alerts are being generated:
```bash
sudo tail -f /var/ossec/logs/alerts/alerts.log | grep -i clamav
```

You should see alerts with level 10, 12, or 15 indicating malware detection.

## Step 21: View Alerts in Wazuh Dashboard

You should see alerts for the detected EICAR test file.

![WazuhClamAV](/images/wazuhclamav/1.png)

Thank you for taking the time to read this article. I hope you find it useful.

Keep up the great work!

