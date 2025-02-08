+++
title = "[EN] SSH Server Configuration"
date = "2025-02-08T15:23:57+01:00"
tags = ["SSH", "Server", "Configuration"]
categories = ["Linux"]
author = "Soner Sahin"
+++

Hi everyone, in this article, I will show you how to configure an SSH server in detail.

SSH (Secure Shell Protocol) is a widely-used protocol that securely connects and manages remote servers. In this tutorial, you will learn how to set up and configure an SSH server from scratch.

To set up an SSH server, you need to install the `openssh-server` package on the server and the `openssh-client` package on the client.

For this demonstration, I will use a Fedora server and an Ubuntu client. 

Although OpenSSH packages are available on most Linux distributions, we will proceed as if they are not installed for demonstration purposes.

# Installing OpenSSH Server and Client:

**Fedora Server:**

```
# Check for updates and install the OpenSSH server package
fedora@fedora:~$ sudo dnf check-update -y && dnf upgrade -y
fedora@fedora:~$ sudo dnf install openssh-server
```

**Check the status of the `sshd` service:**

```
fedora@fedora:~$ systemctl status sshd
● sshd.service - OpenSSH server daemon
     Loaded: loaded (/usr/lib/systemd/system/sshd.service; enabled; preset: enabled)
    Drop-In: /usr/lib/systemd/system/service.d
             └─10-timeout-abort.conf, 50-keep-warm.conf
     Active: active (running) since Sat 2025-02-08 11:53:28 CET; 4min 25s ago
 Invocation: 282bf3a31d9a4e098af76ecc16d44971
       Docs: man:sshd(8)
             man:sshd_config(5)
   Main PID: 11776 (sshd)
      Tasks: 1 (limit: 2248)
     Memory: 1M (peak: 1M)
        CPU: 8ms
     CGroup: /system.slice/sshd.service
             └─11776 "sshd: /usr/sbin/sshd -D [listener] 0 of 10-100 startups"

Feb 08 11:53:28 fedora systemd[1]: Starting sshd.service - OpenSSH server daemon...
Feb 08 11:53:28 fedora (sshd)[11776]: sshd.service: Referenced but unset environment variable evaluates to an empty string: OPTIONS
Feb 08 11:53:28 fedora sshd[11776]: Server listening on 0.0.0.0 port 22.
Feb 08 11:53:28 fedora sshd[11776]: Server listening on :: port 22.
Feb 08 11:53:28 fedora systemd[1]: Started sshd.service - OpenSSH server daemon.
```

 **Ubuntu Client:**

```
# Update the system and install the OpenSSH client package
ubuntu@client:~$ sudo apt update -y && sudo apt upgrade -y
ubuntu@client:~$ sudo apt install openssh-client -y
```

The installation process is complete.

Now we need to configure both machines to establish a secure connection.

# **Configuring the SSH Server:**

 **Fedora Server:**

Modify the SSH configuration file: `/etc/ssh/sshd_config`

```
fedora@fedora:~$ sudo nano /etc/ssh/sshd_config

# Change the default SSH port (22) to a custom port (7216) for additional security.
Port 7216

# We disable root login to prevent unauthorized access via the root user.
PermitRootLogin no

# We disable password authentication to allow only key-based authentication.
PasswordAuthentication no

# Enable a login banner (optional)
Banner /etc/ssh/sshd_banner

# You can also give access for specific users at the end of the file as follows but I won't for now.
AllowUsers John Alex
or 
AllowUsers john@172.16.238.58
```

You can also enable more features to make it more secure depends on your case.

**Enable port 7216 to allow SSH connections:**

```
fedora@fedora:~$ sudo semanage port -a -t ssh_port_t -p tcp 7216
```

**Check Syntax:**

After modifying the configuration file, it's important to check for any syntax errors.

```
# Validate the SSH configuration file to ensure there are no syntax errors.
fedora@fedora:~$ sudo sshd -tf /etc/ssh/sshd_config
```

**Banner Configuration:**

A custom banner can be displayed to users before they log in.

```
fedora@fedora:~$ sudo vi /etc/ssh/sshd_banner

                                                                 #####
                                                                #######
                   #                                            ##O#O##
  ######          ###                                           #VVVVV#
    ##             #                                          ##  VVV  ##
    ##         ###    ### ####   ###    ###  ##### #####     #          ##
    ##        #  ##    ###    ##  ##     ##    ##   ##      #            ##
    ##       #   ##    ##     ##  ##     ##      ###        #            ###
    ##          ###    ##     ##  ##     ##      ###       QQ#           ##Q
    ##       # ###     ##     ##  ##     ##     ## ##    QQQQQQ#       #QQQQQQ
    ##      ## ### #   ##     ##  ###   ###    ##   ##   QQQQQQQ#     #QQQQQQQ
  ############  ###   ####   ####   #### ### ##### #####   QQQQQ#######QQQQQ
```

**Restart the Service:**

```
fedora@fedora:~$ sudo systemctl restart sshd 
```

**Configure Firewall Access**

To ensure that SSH connections can be made on the new port, we need to configure the firewall.

```
fedora@fedora:~$ sudo firewall-cmd --add-port=7216/tcp --permanent
fedora@fedora:~$ sudo systemctl restart firewalld
```

**Check SSH Port:**

```
fedora@fedora:~$ netstat -tunlp  |grep 7216
(No info could be read for "-p": geteuid()=1000 but you should be root.)
tcp        0      0 0.0.0.0:7216            0.0.0.0:*               LISTEN       
tcp6       0      0 :::7216                 :::*                    LISTEN      
```

 **Ubuntu Client:**

Create a folder to store your SSH keys.

```
ubuntu@client:~$ mkdir ~/.abc
```

We will create an SSH key pair to enable passwordless login. This method is more secure than password-based authentication.

```
ubuntu@client:~$ ssh-keygen -t ed25519
Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/ubuntu/.ssh/id_ed25519): /home/ubuntu/.abc/test
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /home/ubuntu/.abc/test
Your public key has been saved in /home/ubuntu/.abc/test.pub
The key fingerprint is:
SHA256:b1TcQNWwbHkSrp/vUmtcENvlyG4cTcDlA8y+9qBSwI4 ubuntu@client
The key's randomart image is:
+--[ED25519 256]--+
|           .=+==.|
|           . B+=+|
|        .   +.OX+|
|         o . +*o=|
|        S o .o.o |
|       E + . =+.o|
|          + o.*.o|
|         o .  .* |
|          .   .oo|
+----[SHA256]-----
```

The private key (`test`) must be kept secure and should not be shared, while the public key (`test.pub`) can be safely transferred to the server.

Verify that the key files have been created successfully:

```
ubuntu@client:~$ ls /home/ubuntu/.abc/
test  test.pub
```

Next, we will transfer the public key to the server and add it to the `authorized_keys` file, which allows key-based login.

```
ubuntu@client:~$ ssh-copy-id -i ~/.abc/test.pub fedora@172.16.238.131
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/home/ubuntu/.abc/test.pub"
The authenticity of host '172.16.238.131 (172.16.238.131)' can't be established.
ED25519 key fingerprint is SHA256:wzM5fXPbeyvU6ld5yz7aJXTDtJ7xtnG3jhMd3KDyhTU.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
fedora@172.16.238.131's password: 

Number of key(s) added: 1

Now try logging into the machine, with:   "ssh 'fedora@172.16.238.131'"
and check to make sure that only the key(s) you wanted were added.
```

You could also manually copy the client's public key and paste it on the server, but this method is often less efficient.

The public key has been successfully added to the server's authorized keys.

 **Fedora Server:**

View authorized clients:

```
fedora@fedora:~$ cat .ssh/authorized_keys
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIExqdXj5Z395PcHNnld9nFRheKyUHaorWOKwOPBUunz1 ubuntu@client
```

As you can see our public key has been added here.

Now, if I want to connect to the Fedora server from the Ubuntu client via SSH, I need to use my private key with the following command.

 **Ubuntu Client:**

```
ubuntu@client:~$ ssh -p 7216 fedora@172.16.238.131 -i .abc/test 
                                                                 #####
                                                                #######
                   #                                            ##O#O##
  ######          ###                                           #VVVVV#
    ##             #                                          ##  VVV  ##
    ##         ###    ### ####   ###    ###  ##### #####     #          ##
    ##        #  ##    ###    ##  ##     ##    ##   ##      #            ##
    ##       #   ##    ##     ##  ##     ##      ###        #            ###
    ##          ###    ##     ##  ##     ##      ###       QQ#           ##Q
    ##       # ###     ##     ##  ##     ##     ## ##    QQQQQQ#       #QQQQQQ
    ##      ## ### #   ##     ##  ###   ###    ##   ##   QQQQQQQ#     #QQQQQQQ
  ############  ###   ####   ####   #### ### ##### #####   QQQQQ#######QQQQQ

Enter passphrase for key '.abc/test': 

Last login: Sat Feb  8 13:09:37 2025 from 172.16.238.142
fedora@fedora:~$ 
```

Excellent! We have now successfully established a secure connection to the Fedora server using SSH key-based authentication. 

But typing the full command every time can be tedious, so let's simplify the process.

To avoid typing the full command every time, create a `.ssh/config` file to store your connection details.

This configuration simplifies future connections by storing all necessary connection details.  

```
ubuntu@client:~$ nano .ssh/config

Host Fedora
  Hostname 172.16.238.131                 # The IP address of the Fedora server
  Port 7216                               # Custom SSH port
  User fedora                             # Username on the server
  IdentityFile /home/ubuntu/.abc/test     # Path to the private key file
```

After that, you can connect to your server by simply typing the following command:

```
ubuntu@client:~$ ssh Fedora
                                                                 #####
                                                                #######
                   #                                            ##O#O##
  ######          ###                                           #VVVVV#
    ##             #                                          ##  VVV  ##
    ##         ###    ### ####   ###    ###  ##### #####     #          ##
    ##        #  ##    ###    ##  ##     ##    ##   ##      #            ##
    ##       #   ##    ##     ##  ##     ##      ###        #            ###
    ##          ###    ##     ##  ##     ##      ###       QQ#           ##Q
    ##       # ###     ##     ##  ##     ##     ## ##    QQQQQQ#       #QQQQQQ
    ##      ## ### #   ##     ##  ###   ###    ##   ##   QQQQQQQ#     #QQQQQQQ
  ############  ###   ####   ####   #### ### ##### #####   QQQQQ#######QQQQQ

Enter passphrase for key '/home/ubuntu/.abc/test': 

Last login: Sat Feb  8 13:51:38 2025 from 172.16.238.142
fedora@fedora:~$ 
```

I hope this article has helped you understand how to configure a secure SSH server and client connection.

Thank you for taking the time to read this article.

Keep up the good work!