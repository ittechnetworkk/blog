+++
title = "[EN] Journalctl Commands"
date = "2025-08-08T02:47:54+02:00"
tags = ["linux", "journalctl"]
categories = ["Linux"]
author = "Soner Sahin"
image = "/images/journalctl/cover.png"
draft = false
+++ 


A comprehensive guide to using `journalctl` for viewing and managing systemd journal logs.



## Table of Contents
- [Top 10 Most Useful Commands](#top-10-most-useful-commands)
- [Basic Commands](#basic-commands)
- [Filtering Options](#filtering-options)
- [Time-Based Filtering](#time-based-filtering)
- [Service-Specific Logs](#service-specific-logs)
- [Output Formats](#output-formats)
- [Advanced Usage](#advanced-usage)
- [Common Use Cases](#common-use-cases)
- [Log Management](#log-management)


## Top 10 Most Useful Commands

Here are the 10 most essential journalctl commands you'll use daily:

```bash
# 1. View all journal entries
journalctl

# 2. Follow logs in real-time
journalctl -f

# 3. View logs since last boot
journalctl -b

# 4. View logs for specific service
journalctl -u service_name

# 5. View only error messages
journalctl -p err

# 6. View logs since specific time
journalctl --since "1 hour ago"

# 7. Show last 50 lines
journalctl -n 50

# 8. View logs in reverse order (newest first)
journalctl -r

# 9. Check journal disk usage
journalctl --disk-usage

# 10. Clean up logs older than 7 days
sudo journalctl --vacuum-time=7d
```

## Basic Commands

**View all journal entries**
```bash
journalctl
```

**View logs in real-time (follow mode)**
```bash
journalctl -f
```

**View logs in reverse order (newest first)**
```bash
journalctl -r
```

**Show only the last N lines**
```bash
journalctl -n 50
```

**View logs with no paging**
```bash
journalctl --no-pager
```

## Filtering Options

**Filter by priority level**
```bash
# Emergency messages only
journalctl -p emerg

# Error messages and above
journalctl -p err

# Warning messages and above
journalctl -p warning

# Info messages and above
journalctl -p info

# Debug messages and above
journalctl -p debug
```

**Filter by facility**
```bash
# Kernel messages
journalctl -f kern

# Mail system messages
journalctl -f mail

# Authentication messages
journalctl -f auth
```

**Filter by user**
```bash
# Show logs for specific user
journalctl _UID=1000

# Show logs for current user
journalctl _UID=$(id -u)
```

## Time-Based Filtering

**View logs from specific time**
```bash
# Since specific date
journalctl --since "2024-01-01"

# Since specific date and time
journalctl --since "2024-01-01 12:00:00"

# Since yesterday
journalctl --since yesterday

# Since 1 hour ago
journalctl --since "1 hour ago"

# Since 30 minutes ago
journalctl --since "30 minutes ago"
```

**View logs until specific time**
```bash
# Until specific date
journalctl --until "2024-01-01"

# Until 1 hour ago
journalctl --until "1 hour ago"
```

**Combine since and until**
```bash
# Logs from a specific time range
journalctl --since "2024-01-01" --until "2024-01-02"
```

## Service-Specific Logs

**View logs for specific service**
```bash
# SSH service logs
journalctl -u ssh

# Apache/httpd service logs
journalctl -u httpd

# Nginx service logs
journalctl -u nginx

# Docker service logs
journalctl -u docker
```

**Follow service logs in real-time**
```bash
journalctl -u nginx -f
```

**View service logs with specific priority**
```bash
journalctl -u ssh -p err
```

## Output Formats

**JSON output**
```bash
journalctl -o json
```

**JSON pretty-printed**
```bash
journalctl -o json-pretty
```

**Short format (default)**
```bash
journalctl -o short
```

**Verbose format**
```bash
journalctl -o verbose
```

**Export format**
```bash
journalctl -o export
```

**Cat format (no timestamps)**
```bash
journalctl -o cat
```

## Advanced Usage

**Search for specific text**
```bash
# Grep for specific pattern
journalctl | grep "error"

# Case-insensitive search
journalctl | grep -i "failed"
```

**Filter by executable**
```bash
# Show logs from specific executable
journalctl /usr/bin/dbus-daemon
```

**Filter by process ID**
```bash
# Show logs from specific PID
journalctl _PID=1234
```

**Filter by systemd unit**
```bash
# Show logs from specific unit
journalctl _SYSTEMD_UNIT=ssh.service
```

**Show kernel ring buffer**
```bash
journalctl -k
```

**Show boot logs**
```bash
# Current boot
journalctl -b

# Previous boot
journalctl -b -1

# List all boots
journalctl --list-boots
```

## Common Use Cases

**Troubleshooting failed services**
```bash
# Check service status and recent logs
systemctl status nginx
journalctl -u nginx -n 50

# Check for errors in the last hour
journalctl -u nginx --since "1 hour ago" -p err
```

**Monitoring system startup**
```bash
# View boot messages
journalctl -b -p err

# View specific boot
journalctl -b -2 -p warning
```

**Debugging authentication issues**
```bash
# SSH authentication logs
journalctl -u ssh --since today | grep -i "authentication\|failed\|error"

# System authentication logs
journalctl -f auth --since "10 minutes ago"
```

**Monitoring disk space issues**
```bash
# Check for disk-related errors
journalctl -p err | grep -i "disk\|space\|full"

# Check system logs for I/O errors
journalctl -k | grep -i "i/o\|disk\|ata"
```

**Network troubleshooting**
```bash
# Network-related logs
journalctl -k | grep -i "network\|eth\|wifi"

# DHCP client logs
journalctl -u NetworkManager --since "1 hour ago"
```

## Log Management

**Check disk usage**
```bash
# Show disk usage of journal files
journalctl --disk-usage
```

**Clean up old logs**
```bash
# Remove logs older than 7 days
sudo journalctl --vacuum-time=7d

# Keep only 100MB of logs
sudo journalctl --vacuum-size=100M

# Keep only 10 most recent journal files
sudo journalctl --vacuum-files=10
```

**Verify journal integrity**
```bash
# Verify journal file integrity
journalctl --verify
```

**Rotate journal files**
```bash
# Force rotation of journal files
sudo systemctl kill --kill-who=main --signal=SIGUSR2 systemd-journald.service
```

## Useful Combinations

**Monitor failed services**
```bash
# Watch for failed services in real-time
journalctl -f -p err
```

**System health check**
```bash
# Check for errors and warnings since last boot
journalctl -b -p warning --no-pager
```

**Application debugging**
```bash
# Debug specific application with timestamps
journalctl -u myapp.service -o short-precise -f
```

**Security monitoring**
```bash
# Monitor authentication attempts
journalctl -f _COMM=sshd -o json-pretty
```


Thank you for taking the time to read this write-up! I hope you found it insightful and helpful.

Keep learning and stay sharp. 👊

Keep up the good work!