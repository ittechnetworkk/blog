+++
title = "[EN] A Honeypot Story"
date = "2025-10-29T10:36:54+01:00"
tags = ["beelzebub", "honeypot", "ai"]
categories = ["Linux", "SOC"]
author = "Soner Sahin"
image = "/images/ahoneypotstory/cover.png"
+++ 

Hi everyone. In this article, I’ll walk you through my research on an AI-powered honeypot project that I deployed in the cloud to observe various attacker Tactic and Technics.

I built a honeypot in a cloud environment using [Beelzebub](https://beelzebub.ai/), an AI-supported honeypot, to evaluate how effective it is—and it performed very well.

Before AI honeypots, you typically had two choices: convert a real machine into a honeypot (very effective but risky), or deploy traditional honeypots (safer but easier for attackers to detect). The core idea of a honeypot is to imitate a real system inside or outside your network so you can observe malicious behavior and act before a real breach occurs. However, depending on your network configuration, attackers may still identify the deception. If you allow outbound internet access, an attacker might leverage it for malicious activity that could harm your organization’s reputation. If you don’t allow outbound access, you either need to simulate realistic responses or accept that the system may be exposed as a honeypot.

This is where AI honeypots step in and say, “Stand up—your father is here!”

This capability meaningfully evolves these systems. Beelzebub supports various protocols including SSH, HTTP, MCP, and MySQL. Here is an example AI-supported SSH config file:

```yaml
apiVersion: "v1"
protocol: "ssh"
address: ":2222"
description: "SSH interactive ChatGPT"
commands:
  - regex: "^(.+)$"
    plugin: "LLMHoneypot"
serverVersion: "OpenSSH"
serverName: "root"
passwordRegex: "^(admin123|root123|jenkins123|Admin123|root|admin|test)$"
deadlineTimeoutSeconds: 6000
plugin:
  llmProvider: "openai"
  llmModel: "gpt-4o-mini"
  openAISecretKey: "sk-proj-"
```

Beelzebub allows you to provide a custom prompt, as shown below.

```yaml
apiVersion: "v1"
protocol: "ssh"
address: ":2222"
description: "SSH interactive OpenAI  GPT-4"
commands:
  - regex: "^(.+)$"
    plugin: "LLMHoneypot"
serverVersion: "OpenSSH"
serverName: "ubuntu"
passwordRegex: "^(root|qwerty|Smoker666|123456|jenkins|minecraft|sinus|alex|postgres|Ly123456)$"
deadlineTimeoutSeconds: 60
plugin:
   llmProvider: "openai"
   llmModel: "gpt-4o"
   openAISecretKey: "sk-proj-123456"
   prompt: "You will act as an Ubuntu Linux terminal. The user will type commands, and you are to reply with what the terminal should show. Your responses must be contained within a single code block."
```

I tested both approaches, but I prefer the configuration without a prompt unless you have a well-crafted prompt and an appropriate LLM model.

Here are some commands and responses.

```sh
ubuntu@root:~$ ls
Documents  
Downloads  
Music  
Pictures  
Videos  

ubuntu@root:~$ whoami
user

ubuntu@root:~$ w
 10:01:20 up  1:01,  1 user,  load average: 0.00, 0.01, 0.05  
USER     TTY      FROM            LOGIN@   IDLE   JCPU   PCPU WHAT  
user     pts/0    192.168.1.2     10:00    1.00s  0.01s  0.00s w  

ubuntu@root:~$ echo "1" >> test.txt

ubuntu@root:~$ ls      
Documents  
Downloads  
Music  
Pictures  
test.txt  
Videos  

ubuntu@root:~$ cat test.txt
1

ubuntu@root:~$ ping 8.8.8.8
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.  
64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=14.0 ms  
64 bytes from 8.8.8.8: icmp_seq=2 ttl=117 time=13.8 ms  
64 bytes from 8.8.8.8: icmp_seq=3 ttl=117 time=14.2 ms  
64 bytes from 8.8.8.8: icmp_seq=4 ttl=117 time=14.1 ms  

--- 8.8.8.8 ping statistics ---  
4 packets transmitted, 4 received, 0% packet loss, time 3005ms  
rtt min/avg/max/mdev = 13.8/14.0/14.2/0.2 ms
```

As you can see, it convincingly emulates a real system. 

Here’s a short video demonstrating its capabilities:


{{< youtube tiyIoUM8l1E >}}


Throughout this project, I collected many username–password combinations, scripts, commands, and artifacts from different sources. Below are some of the usernames, passwords, and unique IPs observed.

**Unique IPs**

```sh
webserver1@webserver1:~/beelzebub/logs$ grep -oE '\b([0-9]{1,3}\.){3}[0-9]{1,3}\b' beelzebub.log | sort -u |wc -l
159
webserver1@webserver1:~/beelzebub/logs$ grep -oE '\b([0-9]{1,3}\.){3}[0-9]{1,3}\b' beelzebub.log | sort -u
101.126.149.60
101.36.98.91
102.88.137.213
103.107.183.97
103.148.195.161
103.171.85.146
103.172.205.208
103.173.229.117
103.174.114.50
103.213.238.91
103.241.43.23
103.243.26.174
103.26.136.173
103.31.38.141
103.45.234.227
103.48.84.29
103.56.115.6
103.90.225.35
104.215.255.146
106.12.29.184
108.65.131.227
109.230.200.203
112.118.173.168
113.7.221.72
115.190.10.158
115.190.44.104
116.193.190.134
117.216.211.19
118.163.132.211
118.195.235.226
119.36.31.170
121.165.204.105
121.37.9.228
123.139.218.0
123.240.255.61
123.253.22.49
1.238.106.229
124.221.16.51
125.20.16.22
125.25.172.245
125.39.179.192
125.86.2.69
125.94.106.195
128.1.131.163
132.145.213.106
134.209.206.143
139.59.46.176
140.249.181.31
14.103.127.58
14.103.145.231
14.103.54.150
142.250.190.14
144.24.195.5
146.190.19.87
151.19.94.164
151.35.124.229
151.43.121.249
151.44.141.61
151.57.113.223
15.206.55.26
154.16.10.170
156.54.108.185
157.230.211.219
159.223.146.141
159.223.238.134
159.65.196.99
160.20.186.237
161.35.25.59
162.240.54.168
163.44.173.168
165.154.201.122
167.99.41.9
169.254.169.254
172.16.2.10
172.190.89.127
172.217.16.46
175.107.193.10
175.12.108.55
176.213.141.182
176.65.151.22
176.95.247.26
179.33.210.213
180.106.83.59
180.76.53.187
181.49.50.6
182.43.76.19
182.57.16.58
183.234.64.3
183.56.205.82
183.66.149.42
185.156.73.233
185.225.22.80
185.65.202.184
186.10.86.130
189.146.171.237
192.146.138.58
192.227.128.4
192.81.208.35
194.0.234.21
195.177.94.29
195.178.110.30
196.251.114.14
197.5.145.150
201.76.120.30
203.6.235.111
206.189.103.33
206.189.202.201
210.79.142.221
211.72.129.211
211.72.129.212
218.92.247.138
221.159.150.85
2.57.122.177
27.111.32.174
27.79.0.78
34.57.181.41
38.85.247.104
40.83.182.122
41.59.229.33
42.117.155.28
43.135.172.68
43.138.184.249
43.157.169.99
45.11.152.12
45.120.216.232
45.130.148.125
45.164.39.253
45.182.207.45
45.186.228.252
45.9.116.195
46.191.141.152
47.236.76.100
47.237.30.186
49.254.74.18
51.195.46.102
51.68.199.166
51.79.86.83
52.187.9.8
57.129.74.123
57.132.175.132
59.126.195.45
64.226.124.227
71.70.164.48
77.222.100.142
78.109.200.135
78.128.112.74
80.136.13.254
80.190.82.51
80.253.251.63
80.94.95.116
80.94.95.118
81.68.91.167
85.215.195.9
89.126.208.241
89.144.35.100
89.97.218.142
9.223.176.221
94.42.110.21
95.214.232.18
```

**Most attempted usernames**

```sh
webserver1@webserver1:~/beelzebub/logs$ jq -r '.event.User | select(. != null and . != "")' beelzebub.log | sort | uniq -c | sort -rn | head -30
2661 root
314 ubuntu
284 admin
237 user
184 test
149 oracle
136 debian
128 postgres
88 mysql
71 pi
56 guest
54 administrator
52 newuser
46 adminuser
45 12345
44 docker
41 1234
40 webadmin
39 jenkins
37 password
35 alex
33 Welcome123
33 user123
33 Password
33 Jenkins123
33 ftpuser
33 1234567
32 ubuntu123
32 Smoker666
32 P@ssw0rd
```

**Most attempted passwords**

```sh
webserver1@webserver1:~/beelzebub/logs$ jq -r '.event.Password | select(. != null and . != "")' beelzebub.log | sort | uniq -c | sort -rn | head -30
1023 123456
895 password
889 12345
867 123456789
767 iloveyou
764 princess
215 1234
137 123
111 root
105 alex
103 postgres
99 sinus
99 minecraft
99 Ly123456
94 qwerty
92 admin
70 1q2w3e4r
67 jenkins
65 password1
59 admin123
55 12345678
48 1234567890
45 Admin123
45 123abc
43 qwerty123
43 654321
40 test
40 pass123
40 123123
37 1234567
```

**Most executed commands**

```sh
webserver1@webserver1:~/beelzebub/logs$ jq -r '.event.Command | select(. != null and . != "")' beelzebub.log | sort | uniq -c | sort -rn | head -50
41 ls
11 uname -a
10 whoami
9 pwd
8 w
8 uname -m
6 cd ~; chattr -ia .ssh; lockr -ia .ssh
5 uname
5 top
5 ls -lh $(which ls)
5 lscpu | grep Model
5 free -m | grep Mem | awk '{print $2 ,$3, $4, $5, $6, $7}'
5 df -h | head -n 2 | awk 'FNR == 2 {print $2;}'
5 crontab -l
5 cd ~ && rm -rf .ssh && mkdir .ssh && echo "ssh-rsa AAAAB3NzaC1yc2EAAAABJQAAAQEArDp4cun2lhr4KUhBGE7VvAcwdli2a8dbnrTOrbMz1+5O73fcBOx8NVbUT0bUanUV9tJ2/9p7+vD0EpZ3Tz/+0kX34uAx1RV/75GVOmNx+9EuWOnvNoaJe0QXxziIg9eLBHpgLMuakb5+BgTFB+rKJAw9u9FSTDengvS8hX1kNFS4Mjux0hJOK8rvcEmPecjdySYMb66nylAKGwCEE6WEQHmd1mUPgHwGQ0hWCwsQk13yCGPK5w6hYp5zYkFnvlC8hGmd4Ww+u97k6pfTGTUbJk14ujvcD9iUKQTTWYYjIIu5PmUux5bsZ0R4WFwdIe6+i6rBLAsPKgAySVKPRK+oRw== mdrfckr">>.ssh/authorized_keys && chmod -R go= ~/.ssh && cd ~
5 cat /proc/cpuinfo | grep processor | wc -l
5 cat /proc/cpuinfo | grep name | wc -l
5 cat /proc/cpuinfo | grep name | head -n 1 | awk '{print $4,$5,$6,$7,$8,$9;}'
5 cat /proc/cpuinfo | grep model | grep name | wc -l
4 rm -rf .bash_history;rm -rf /var/run/utmp;rm -rf /var/run/wtmp -;rm -rf /var/log/lastlog;rm -rf /usr/adm/lastlog;rm -rf .bash_history;cd /home;rm -rf yum.log;cd /var/log/;rm -rf wtmp;rm -rf secure;rm -rf lastlog;rm -rf messages;touch messagess;touch wtmp;touch secure;touch lastlog;cd /root;rm -rf .bash_history;touch .bash_history;unset HISTFILE;unset HISTSAVE;history -n;unset WATCH;cd;HISTFILE=/dev/null;history -c && rm -f ~/.bash_history;cd ..
4 ping 8.8.8.8
4 passwd
4 cat /etc/passwd
3 ll
3 cd /dev/shm || cd /tmp || cd /var/run || cd /mnt || cd /root || cd / && cat > netai
2 uname -s -v -n -r -m
2 uname -r | awk '{printf $1}'
2 uname -n | awk '{printf $1}'
2 uname -m | awk '{printf $1}'
2 nvidia-smi -q | grep "Product Name" | awk '{print $4, $5, $6, $7, $8, $9, $10, $11}' | wc -l | head -c 1
2 nvidia-smi -q | grep "Product Name"
2 nproc
2 lspci | egrep VGA && lspci | grep 3D
2 kill -9 $(ps aux | grep xrx |grep -v grep | awk '{print $2}');kill -9 $(ps aux | grep biden1 |grep -v grep | awk '{print $2}');kill -9 $(ps aux | grep zzh |grep -v grep | awk '{print $2}');kill -9 $(ps aux | grep arx645 |grep -v grep | awk '{print $2}');kill -9 $(ps aux | grep kthreaddk |grep -v grep | awk '{print $2}');kill -9 $(ps aux | grep ab |grep -v grep | awk '{print $2}');kill -9 $(ps aux | grep kdevtmpfsi |grep -v grep | awk '{print $2}')
2 cd
1 uname -s -m
1 uname -s
1 /tmp/kal64
1 /tmp/amd64
1 sudo su
1 sudo -l
1 sh -c 'for d in /dev/shm /tmp /var/run /mnt /root /; do cd "$d" 2>/dev/null && pwd && break; done'
1 sdv
1 scp -t /var/tmp/8ixni5b4yfecmq07ecilanp4ug
1 scp -t /usr/local/bin/8ixni5b4yfecmq07ecilanp4ug
1 scp -t /usr/bin/8ixni5b4yfecmq07ecilanp4ug
```

As shown above, attackers commonly attempted to fingerprint the system (often to assess cryptojacking potential), upload SSH keys for persistence, and run reconnaissance or cleanup commands.

I will write detailed posts about specific attacks to show what happens behind the scenes.

Thank you for taking the time to read this article—I hope you find it useful.

Keep up the good work.





