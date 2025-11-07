+++
title = "[EN] Wazuh File Integrity Monitoring (FIM)"
date = "2025-11-07T16:59:49+01:00"
tags = ["wazuh", "fim", "linux"]
categories = ["SOC", "Linux"]
author = "Soner Sahin"
image = "/images/wazuhfim/cover.png"
+++ 

Hi everyone, in this article I'll introduce you to Wazuh's File Integrity Monitoring feature.

FIM is one of Wazuh's most powerful features that monitors your environments for new files, changes, and more.

With this feature, you have great monitoring, visibility, and awareness capabilities over your environments.

You can also integrate it with YARA, VirusTotal, ClamAV, and CDB Lists to identify whether files are harmful or not. This is a great capability, and I'll show you how to integrate them in the next ones.

Let's see how to monitor a path.

This config is deployed on the client machines. You can deploy it via the Wazuh dashboard or by manually adding the configs on each client.

The config file is `/var/ossec/etc/ossec.conf`

Here is a basic example of the FIM config.

```sh
  <!-- File integrity monitoring -->
  <syscheck>
   
    <!-- Default -->
    <!-- Directories to check  (perform all possible verifications) -->
    <directories>/etc,/usr/bin,/usr/sbin</directories>
    <directories>/bin,/sbin,/boot</directories>


    <!-- Custom-->
    <!-- In this section you'll add the paths to be monitored for Linux environment -->
    <directories realtime="yes" report_changes="yes" check_md5sum="yes" check_all="yes">/root</directories>
    <directories realtime="yes" report_changes="yes" check_md5sum="yes" check_all="yes">/home/ubuntu</directories>
    <directories realtime="yes" report_changes="yes" check_md5sum="yes" check_all="yes">/etc</directories>
    
    
	<!-- Custom-->
    <!-- In this section you'll add the paths to be monitored for Windows environment -->
    <directories realtime="yes" report_changes="yes" check_md5sum="yes" check_all="yes">C:/Users</directories>
    <directories realtime="yes" report_changes="yes" check_md5sum="yes" check_all="yes">D:/abc</directories>
    

    <!-- Files/directories to ignore -->
    <!-- Here you'll add files to be ignored -->
    <ignore>/etc/mtab</ignore>
    <ignore>/etc/hosts.deny</ignore>


    <!-- File types to ignore -->
    <!-- Here you'll add file types to be ignored -->
    <ignore type="sregex">.log$|.swp$</ignore>

  </syscheck>
```

Restart the service

```sh
sudo systemctl restart wazuh-agent
```

In this file, you can add the paths to be monitored in Linux, Windows, and macOS environments, ignore files or directories to reduce false positives, and ignore file types.

This is just a basic but useful configuration. Keep in mind that you'll also be able to schedule scans, add more file attributes to record, add more exclusions, and much more.

Here is what you're able to do with [Wazuh's FIM feature](https://documentation.wazuh.com/current/user-manual/capabilities/index.html).


### Demo:

I've configured FIM on my lab environment and will show you how it looks on the Wazuh dashboard.

I'll add a file named malware.cc in the `/home/ubuntu/Downloads/` folder on one of the client machines.

![Wazuh](/images/wazuhfim/1.png)

**Wazuh Dashboard**

![Wazuh](/images/wazuhfim/2.png)

**JSON Output**

```json
{
  "_index": "wazuh-alerts-4.x-2025.11.07",
  "_id": "QfD7XpoBs8kxnuBm99FE",
  "_score": null,
  "_source": {
    "syscheck": {
      "uname_after": "ubuntu",
      "mtime_after": "2025-11-07T15:42:38",
      "size_after": "0",
      "gid_after": "1000",
      "mode": "realtime",
      "path": "/home/ubuntu/Downloads/malware.cc",
      "sha1_after": "da39a3ee5e6b4b0d3255bfef95601890afd80709",
      "gname_after": "ubuntu",
      "uid_after": "1000",
      "perm_after": "rw-rw-r--",
      "event": "added",
      "md5_after": "d41d8cd98f00b204e9800998ecf8427e",
      "sha256_after": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "inode_after": 6029902
    },
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
    "rule": {
      "firedtimes": 1,
      "mail": false,
      "level": 5,
      "pci_dss": [
        "11.5"
      ],
      "hipaa": [
        "164.312.c.1",
        "164.312.c.2"
      ],
      "tsc": [
        "PI1.4",
        "PI1.5",
        "CC6.1",
        "CC6.8",
        "CC7.2",
        "CC7.3"
      ],
      "description": "File added to the system.",
      "groups": [
        "ossec",
        "syscheck",
        "syscheck_entry_added",
        "syscheck_file"
      ],
      "id": "554",
      "nist_800_53": [
        "SI.7"
      ],
      "gpg13": [
        "4.11"
      ],
      "gdpr": [
        "II_5.1.f"
      ]
    },
    "location": "syscheck",
    "decoder": {
      "name": "syscheck_new_entry"
    },
    "id": "1762530158.1059299",
    "full_log": "File '/home/ubuntu/Downloads/malware.cc' added\nMode: realtime\n",
    "timestamp": "2025-11-07T15:42:38.587+0000"
  },
  "fields": {
    "syscheck.mtime_after": [
      "2025-11-07T15:42:38.000Z"
    ],
    "timestamp": [
      "2025-11-07T15:42:38.587Z"
    ]
  },
  "sort": [
    1762530158587
  ]
}
```


Now, let me add something inside that file.

![Wazuh](/images/wazuhfim/3.png)

**Wazuh Dashboard**

![Wazuh](/images/wazuhfim/4.png)

**JSON Output**

```json
{
  "_index": "wazuh-alerts-4.x-2025.11.07",
  "_id": "T_D-XpoBs8kxnuBmutG-",
  "_score": null,
  "_source": {
    "syscheck": {
      "size_before": "0",
      "uname_after": "ubuntu",
      "mtime_after": "2025-11-07T15:45:41",
      "size_after": "22",
      "gid_after": "1000",
      "md5_before": "d41d8cd98f00b204e9800998ecf8427e",
      "diff": "0a1\n> this is not a malware\n",
      "sha256_before": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "mtime_before": "2025-11-07T15:42:38",
      "mode": "realtime",
      "path": "/home/ubuntu/Downloads/malware.cc",
      "sha1_after": "0305ee037a2380eaa71c6cf2e07778032fdbcef2",
      "changed_attributes": [
        "size",
        "mtime",
        "md5",
        "sha1",
        "sha256"
      ],
      "gname_after": "ubuntu",
      "uid_after": "1000",
      "perm_after": "rw-rw-r--",
      "event": "modified",
      "md5_after": "c830a5a786c739b8b39edfb82310b009",
      "sha1_before": "da39a3ee5e6b4b0d3255bfef95601890afd80709",
      "sha256_after": "80d6e49563d0ed0c735868ac7f9cb428ea95137b067e39dfd1dfb60974c779be",
      "inode_after": 6029902
    },
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
    "rule": {
      "mail": false,
      "level": 7,
      "pci_dss": [
        "11.5"
      ],
      "hipaa": [
        "164.312.c.1",
        "164.312.c.2"
      ],
      "tsc": [
        "PI1.4",
        "PI1.5",
        "CC6.1",
        "CC6.8",
        "CC7.2",
        "CC7.3"
      ],
      "description": "Integrity checksum changed.",
      "groups": [
        "ossec",
        "syscheck",
        "syscheck_entry_modified",
        "syscheck_file"
      ],
      "nist_800_53": [
        "SI.7"
      ],
      "gdpr": [
        "II_5.1.f"
      ],
      "firedtimes": 1,
      "mitre": {
        "technique": [
          "Stored Data Manipulation"
        ],
        "id": [
          "T1565.001"
        ],
        "tactic": [
          "Impact"
        ]
      },
      "id": "550",
      "gpg13": [
        "4.11"
      ]
    },
    "location": "syscheck",
    "decoder": {
      "name": "syscheck_integrity_changed"
    },
    "id": "1762530341.1063077",
    "full_log": "File '/home/ubuntu/Downloads/malware.cc' modified\nMode: realtime\nChanged attributes: size,mtime,md5,sha1,sha256\nSize changed from '0' to '22'\nOld modification time was: '1762530158', now it is '1762530341'\nOld md5sum was: 'd41d8cd98f00b204e9800998ecf8427e'\nNew md5sum is : 'c830a5a786c739b8b39edfb82310b009'\nOld sha1sum was: 'da39a3ee5e6b4b0d3255bfef95601890afd80709'\nNew sha1sum is : '0305ee037a2380eaa71c6cf2e07778032fdbcef2'\nOld sha256sum was: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'\nNew sha256sum is : '80d6e49563d0ed0c735868ac7f9cb428ea95137b067e39dfd1dfb60974c779be'\n",
    "timestamp": "2025-11-07T15:45:41.563+0000"
  },
  "fields": {
    "syscheck.mtime_after": [
      "2025-11-07T15:45:41.000Z"
    ],
    "syscheck.mtime_before": [
      "2025-11-07T15:42:38.000Z"
    ],
    "timestamp": [
      "2025-11-07T15:45:41.563Z"
    ]
  },
  "sort": [
    1762530341563
  ]
}
```

That's how it looks. 

As I mentioned, FIM is much more than this. Depending on your needs, environments, etc., you're able to configure it accordingly.

Thanks for reading, I hope you'll find it useful.

Keep up the good work!