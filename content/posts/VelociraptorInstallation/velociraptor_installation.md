+++
title = "[EN] Velociraptor Installation"
date = "2026-01-05T10:46:36+01:00"
tags = ["velociraptor","dfir","soc"]
categories = ["SOC"]
author = "Soner Sahin"
image = "/images/velociraptorinstallation/cover.png"
+++ 



Velociraptor is a powerful digital forensics and incident response (DFIR) platform that allows security teams to collect, monitor, and hunt across endpoints. This guide will walk you through installing both the Velociraptor server and client components.

# Part 1: Server Installation

## Step 1: Download Velociraptor

Create a setup directory and download the latest Velociraptor binary:

```bash
mkdir ~/velociraptor_setup && cd ~/velociraptor_setup

# Download the latest version (check GitHub for the latest release)
wget -O velociraptor https://github.com/Velocidex/velociraptor/releases/download/v0.74/velociraptor-v0.74.1-linux-amd64

# Make it executable
chmod +x velociraptor
```

## Step 2: Create the Server Configuration File

Generate the server configuration interactively:

```bash
./velociraptor config generate -i
```

This interactive wizard will prompt you for:
- Server name
- Organization name
- Data store location
- Frontend bind address and port
- GUI bind address and port
- Certificate configuration
- Authentication method

Follow the prompts and provide the required information. The configuration file `server.config.yaml` will be created in the current directory.

![Velociraptor](/images/velociraptorinstallation/1.png)

![Velociraptor](/images/velociraptorinstallation/2.png)

![Velociraptor](/images/velociraptorinstallation/3.png)

![Velociraptor](/images/velociraptorinstallation/4.png)

![Velociraptor](/images/velociraptorinstallation/5.png)

![Velociraptor](/images/velociraptorinstallation/6.png)

## Step 3: Configure Network Bindings

Edit the generated `server.config.yaml` file to allow remote access:

```bash
nano server.config.yaml
```

**Change GUI bind address:**

Find and modify:
```yaml
GUI:
  bind_address: 127.0.0.1
```

To:
```yaml
GUI:
  bind_address: 0.0.0.0
```

**Change Frontend bind address:**

Find and modify:
```yaml
Frontend:
  bind_address: 127.0.0.1
```

To:
```yaml
Frontend:
  bind_address: 0.0.0.0
```

**Note:** Binding to `0.0.0.0` allows access from any network interface. For production environments, consider binding to a specific IP address or using a reverse proxy.

Save and close the file.

## Step 4: Create the Server Installation Package

**For Debian/Ubuntu-based systems:**

```bash
./velociraptor debian server --config ./server.config.yaml
```

**For RHEL/CentOS/RPM-based systems:**

```bash
./velociraptor rpm server --config ./server.config.yaml
```

This will create a `.deb` or `.rpm` package file in the current directory. Example output:

```
Creating amd64 server package at velociraptor_server_0.74.1_amd64.deb
```

## Step 5: Install the Server Component

**For Debian/Ubuntu:**

```bash
sudo dpkg -i velociraptor_server_0.74.1_amd64.deb
```

**For RHEL/CentOS:**

```bash
sudo rpm -Uvh velociraptor_server_0.74.1_amd64.rpm
```

The installation will:
- Copy the Velociraptor binary to `/usr/local/bin/velociraptor.bin`
- Copy the configuration to `/etc/velociraptor/server.config.yaml`
- Create and enable a systemd service

## Step 6: Verify Server Installation

Check the service status:

```bash
sudo systemctl status velociraptor_server.service
```

The service should show as "active (running)". If it's not running, check the logs:

```bash
sudo journalctl -u velociraptor_server.service -n 50
```

## Step 7: Verify Network Ports

Verify that the GUI and Frontend ports are listening:

```bash
# Check GUI port (default: 8889)
nc -vz localhost 8889

# Check Frontend port (default: 8000)
nc -vz localhost 8000
```

Both commands should show successful connections.

## Step 8: Access the Velociraptor Web Interface

The Velociraptor server is now available at:

```
https://<server-ip>:8889
```

**Note:** Replace `<server-ip>` with your server's IP address or hostname.

**Default credentials:**
- Username: `admin`
- Password: The password you set during the interactive configuration

If you need to reset the admin password, you can use:

```bash
sudo velociraptor --config /etc/velociraptor/server.config.yaml user reset --user admin
```

![Velociraptor](/images/velociraptorinstallation/7.png)

![Velociraptor](/images/velociraptorinstallation/8.png)

## Part 2: Client Installation

## Windows Client Installation

**Method 1: Using the Web Interface**

1. Log in to the Velociraptor web interface
2. Navigate to **Server Artifacts** → **New Collection**
3. Select **Windows.Client.Installer** artifact
4. Configure the collection parameters
5. Click **Launch** to start the collection
6. Download the generated installer file
7. Distribute and run the installer on Windows endpoints

![Velociraptor](/images/velociraptorinstallation/9.png)

![Velociraptor](/images/velociraptorinstallation/10.png)

![Velociraptor](/images/velociraptorinstallation/11.png)

**Method 2: Using Command Line**

You can also generate Windows installers from the command line:

```bash
./velociraptor config client --config server.config.yaml > client.config.yaml
./velociraptor --config server.config.yaml msiexec --config client.config.yaml
```

## Linux Client Installation

### For Debian/Ubuntu Systems

**Step 1: Create Client Configuration**

Generate a client configuration file from the server configuration:

```bash
./velociraptor config client --org "root" --config server.config.yaml > client.root.config.yaml
```

**Note:** Replace `"root"` with your organization name if different.

**Step 2: Create Client Installation Package**

Generate the Debian package:

```bash
./velociraptor debian client --config client.root.config.yaml
```

This will create a file like `velociraptor_client_0.74.1_amd64.deb`.

**Step 3: Install on Client Machines**

Transfer the `.deb` package to your Linux clients and install:

```bash
sudo dpkg -i velociraptor_client_0.74.1_amd64.deb
```

**Step 4: Verify Client Service**

Check that the client service is running:

```bash
sudo systemctl status velociraptor_client
```

The service should be active and connected to the server.

### For RHEL/CentOS/RPM Systems

**Step 1: Create Client Configuration**

```bash
./velociraptor config client --org "root" --config server.config.yaml > client.root.config.yaml
```

**Step 2: Create Client Installation Package**

```bash
./velociraptor rpm client --config client.root.config.yaml
```

This will create a file like `velociraptor_client_0.74.1_amd64.rpm`.

**Step 3: Install on Client Machines**

Transfer the `.rpm` package to your Linux clients and install:

```bash
sudo rpm -Uvh velociraptor_client_0.74.1_amd64.rpm
```

**Step 4: Verify Client Service**

```bash
sudo systemctl status velociraptor_client
```

## Verify Client Connection

After installing the client packages on your endpoints, they should appear in the Velociraptor dashboard under **Hosts**. You can verify the connection by:

1. Logging into the web interface
2. Navigating to **Hosts**
3. Confirming your endpoints are listed and showing as "Online"

![Velociraptor](/images/velociraptorinstallation/12.png)


Thank you for taking the time to read this article. I hope you find it useful.

Keep up the great work!