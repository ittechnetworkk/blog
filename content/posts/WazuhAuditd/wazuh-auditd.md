+++
title = "[EN] Wazuh Auditd Integration"
date = "2025-11-07T17:11:11+01:00"
tags = ["wazuh", "linux", "auditd"]
categories = ["SOC", "Linux"]
author = "Soner Sahin"
image = "/images/wazuhauditd/cover.png"
+++ 



Hi everyone! In this article I’ll walk you through installing Auditd on a Linux system and integrating it with Wazuh.

Auditd (the Linux Auditing System) records security-relevant activity so you can understand what is happening on your hosts. By tailoring the ruleset, you can increase visibility and build detections that match your environment.

### Installation

Install Auditd on Debian/Ubuntu with the following command:

```sh
sudo apt -y install auditd
```

Start the service and enable it at boot:

```sh
sudo systemctl start auditd
sudo systemctl enable auditd
```

Add the rules to the `/etc/audit/audit.rules` file.

```sh
echo "-a exit,always -F auid=1000 -F egid!=994 -F auid!=-1 -F arch=b32 -S execve -k audit-wazuh-c" >> /etc/audit/audit.rules
echo "-a exit,always -F auid=1000 -F egid!=994 -F auid!=-1 -F arch=b64 -S execve -k audit-wazuh-c" >> /etc/audit/audit.rules
```

If you need more comprehensive coverage, consider importing community-maintained rule sets such as:

- [Neo23x0/auditd](https://github.com/Neo23x0/auditd)
- [prathamghadge/audit.rules](https://gist.github.com/prathamghadge/7225227d627907adcc97cf2c244df500)
- [bfuzzy/auditd-attack](https://github.com/bfuzzy/auditd-attack/tree/master)
- [linux-audit/audit-userspace/rules](https://github.com/linux-audit/audit-userspace/tree/master/rules)
- [znsstudio/audit.rules](https://gist.github.com/znsstudio/48cf5919b08d487cbd0064b6b9586399)
- [coh7eiqu8thaBu/audit.rules](https://gist.github.com/coh7eiqu8thaBu/32617a4b5fbb5e2f0bdbc6cece429f69)

Reload the rules and confirm they are active:

```sh
sudo auditctl -R /etc/audit/audit.rules
sudo auditctl -l
```

Example output:

```sh
No rules
enabled 1
failure 1
pid 267349
rate_limit 0
backlog_limit 8192
lost 0
backlog 3
backlog_wait_time 60000
backlog_wait_time_actual 0
enabled 1
failure 1
pid 267349
rate_limit 0
backlog_limit 8192
lost 0
backlog 7
backlog_wait_time 60000
backlog_wait_time_actual 0
enabled 1
failure 1
pid 267349
rate_limit 0
backlog_limit 8192
lost 0
backlog 9
backlog_wait_time 60000
backlog_wait_time_actual 0
-a always,exit -F arch=b32 -S execve -F auid=1000 -F egid!=994 -F auid!=-1 -F key=audit-wazuh-c
-a always,exit -F arch=b64 -S execve -F auid=1000 -F egid!=994 -F auid!=-1 -F key=audit-wazuh-c
```

Auditd configuration files live in `/etc/audit`, and logs are written to `/var/log/audit/audit.log`.

### Wazuh Integration

The next step is to forward Auditd logs to Wazuh. The instructions below assume you already have the Wazuh manager and agent installed.

**Wazuh agent:**

```sh
sudo nano /var/ossec/etc/ossec.conf
```

Add the following block near the end of the configuration file to ingest Auditd logs:

```sh
<localfile>
  <log_format>audit</log_format>
  <location>/var/log/audit/audit.log</location>
</localfile>
```

Restart the agent to apply the change:

```sh
sudo systemctl restart wazuh-agent
```

**Wazuh manager:**

Verify that the Auditd key list contains the expected values:

```sh
cat /var/ossec/etc/lists/audit-keys

audit-wazuh-w:write
audit-wazuh-r:read
audit-wazuh-a:attribute
audit-wazuh-x:execute
audit-wazuh-c:command
```

**Catch everything!**

To raise high-priority alerts for suspicious commands, create (or edit) a lookup list that tags binaries as suspicious:

```sh
sudo nano /var/ossec/etc/lists/suspicious-programs
```

```sh
tcpdump:suspicious
whoami:suspicious
uname:suspicious
wget:suspicious
rm:suspicious
grep:suspicious
```

Reference the list under the `<ruleset>` section in `ossec.conf`:

```sh
sudo nano /var/ossec/etc/ossec.conf

<list>etc/lists/suspicious-programs</list>
```

Create a custom rule that raises an alert whenever one of these commands runs:

```sh
sudo nano /var/ossec/etc/rules/local_rules.xml

<group name="audit">
  <rule id="100210" level="12">
    <if_sid>80792</if_sid>
    <list field="audit.command" lookup="match_key_value" check_value="suspicious">etc/lists/suspicious-programs</list>
    <description>Audit: Highly Suspicious Command executed: $(audit.exe)</description>
    <group>audit_command,</group>
  </rule>
</group>
```

Restart the Wazuh manager so the new rule takes effect:

```sh
sudo systemctl restart wazuh-manager
```

### Attack emulation

Trigger a few of the suspicious commands on a monitored endpoint to generate events:

```sh
root@ubuntu:/home/ubuntu# grep
Usage: grep [OPTION]... PATTERNS [FILE]...
Try 'grep --help' for more information.

root@ubuntu:/home/ubuntu# uname
Linux

root@ubuntu:/home/ubuntu# whoami
root
```

**Wazuh**

![Wazuh](/images/wazuhauditd/1.png)

**JSON output**

```json
{
  "_index": "wazuh-alerts-4.x-2025.11.07",
  "_id": "RvAjXpoBs8kxnuBmRsyH",
  "_score": null,
  "_source": {
    "input": {
      "type": "log"
    },
    "agent": {
      "ip": "192.168.1.118",
      "name": "client1",
      "id": "001"
    },
    "manager": {
      "name": "wazuh-server"
    },
    "data": {
      "audit": {
        "syscall": "59",
        "gid": "0",
        "fsgid": "0",
        "session": "5",
        "pid": "7443",
        "suid": "0",
        "type": "SYSCALL",
        "uid": "0",
        "egid": "0",
        "exe": "/usr/bin/whoami",
        "file": {
          "inode": "2363254",
          "mode": "0100755",
          "name": "/usr/bin/whoami"
        },
        "sgid": "0",
        "id": "1373",
        "key": "audit-wazuh-c",
        "auid": "1000",
        "execve": {
          "argc": "1",
          "a0": "whoami"
        },
        "euid": "0",
        "command": "whoami",
        "ppid": "4881",
        "fsuid": "0",
        "exit": "0",
        "cwd": "/home/ubuntu",
        "success": "yes",
        "tty": "pts2",
        "arch": "c000003e"
      }
    },
    "rule": {
      "firedtimes": 3,
      "mail": true,
      "level": 12,
      "description": "Audit: Highly Suspicious Command executed: /usr/bin/whoami",
      "groups": [
        "auditaudit_command"
      ],
      "id": "100210"
    },
    "location": "/var/log/audit/audit.log",
    "decoder": {
      "parent": "auditd",
      "name": "auditd"
    },
    "id": "1762515957.74820",
    "full_log": "type=SYSCALL msg=audit(1762515956.917:1373): arch=c000003e syscall=59 success=yes exit=0 a0=5802fab5e320 a1=5802fab5e2c0 a2=5802fab24d50 a3=5802fab5e2c0 items=2 ppid=4881 pid=7443 auid=1000 uid=0 gid=0 euid=0 suid=0 fsuid=0 egid=0 sgid=0 fsgid=0 tty=pts2 ses=5 comm=\"whoami\" exe=\"/usr/bin/whoami\" subj=unconfined key=\"audit-wazuh-c\"\u001dARCH=x86_64 SYSCALL=execve AUID=\"ubuntu\" UID=\"root\" GID=\"root\" EUID=\"root\" SUID=\"root\" FSUID=\"root\" EGID=\"root\" SGID=\"root\" FSGID=\"root\" type=EXECVE msg=audit(1762515956.917:1373): argc=1 a0=\"whoami\" type=CWD msg=audit(1762515956.917:1373): cwd=\"/home/ubuntu\" type=PATH msg=audit(1762515956.917:1373): item=0 name=\"/usr/bin/whoami\" inode=2363254 dev=fc:00 mode=0100755 ouid=0 ogid=0 rdev=00:00 nametype=NORMAL cap_fp=0 cap_fi=0 cap_fe=0 cap_fver=0 cap_frootid=0\u001dOUID=\"root\" OGID=\"root\" type=PATH msg=audit(1762515956.917:1373): item=1 name=\"/lib64/ld-linux-x86-64.so.2\" inode=2394929 dev=fc:00 mode=0100755 ouid=0 ogid=0 rdev=00:00 nametype=NORMAL cap_fp=0 cap_fi=0 cap_fe=0 cap_fver=0 cap_frootid=0\u001dOUID=\"root\" OGID=\"root\" type=PROCTITLE msg=audit(1762515956.917:1373): proctitle=\"whoami\"",
    "timestamp": "2025-11-07T11:45:57.150+0000"
  },
  "fields": {
    "timestamp": [
      "2025-11-07T11:45:57.150Z"
    ]
  },
  "sort": [
    1762515957150
  ]
}
```

That’s it! Feel free to extend these examples to match your environment so you can improve visibility, efficiency, and security.

Thank you for taking time to read this article, I hope you'll find this article useful.

Keep up the good work!

