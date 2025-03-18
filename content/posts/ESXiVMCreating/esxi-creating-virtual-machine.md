+++
title = "[EN] ESXi Creating Virtual Machine"
date = "2025-03-18T11:11:14+01:00"
tags = ["esxi", "virtualization", "vmware"]
categories = ["Virtualization"]
author = "Soner Sahin"
image = "/images/ESXiVMCreating/cover.jpg"
+++

Hi everyone,

In this article, I will cover how to create a virtual machine on an ESXi node.

ESXi nodes are typically not used as standalone servers; they are usually managed centrally with vCenter, which allows for easier management of multiple ESXi nodes.

However, in this article, I will show you how to create a virtual machine directly on an ESXi node.

I will walk you through the process of creating, installing, and configuring **Windows Server 2022** as an **AD-DC** (Active Directory Domain Controller). The creation process will be as follows:

First, we need to upload an ISO image to the ESXi node.

![esxi](/images/ESXiVMCreating/1.png)

I will create a folder named **ISO's** to store my ISO files.

![esxi](/images/ESXiVMCreating/2.png)

![esxi](/images/ESXiVMCreating/3.png)

![esxi](/images/ESXiVMCreating/4.png)

**ISO Uploading:**

![esxi](/images/ESXiVMCreating/5.png)

![esxi](/images/ESXiVMCreating/6.png)

![esxi](/images/ESXiVMCreating/7.png)

**Create a virtual machine:**

![esxi](/images/ESXiVMCreating/8.png)

![esxi](/images/ESXiVMCreating/9.png)

![esxi](/images/ESXiVMCreating/10.png)

![esxi](/images/ESXiVMCreating/11.png)

![esxi](/images/ESXiVMCreating/12.png)

![esxi](/images/ESXiVMCreating/13.png)

![esxi](/images/ESXiVMCreating/14.png)

Hard Disk section is so important. There are 3 options in this section.

- **Thin Provisioned Disk:** Initially consumes only the used space and grows as more data is added. It optimizes storage usage but may have slightly lower performance.
    
- **Thick Provisioned Lazy Zeroed Disk:** Allocates full disk space at creation, but only writes data when needed, leaving unused blocks uninitialized until first use. It offers faster allocation but may have slight delays on first writes.
    
- **Thick Provisioned Eager Zeroed Disk:** Allocates full space and pre-zeros all blocks at creation. It provides the best performance but takes longer to create and requires more initial storage.

![esxi](/images/ESXiVMCreating/16.png)

Select the appropriate Ethernet adapter.

![esxi](/images/ESXiVMCreating/17.png)

Summary.

![esxi](/images/ESXiVMCreating/18.png)

Power on the machine.

![esxi](/images/ESXiVMCreating/19.png)

![esxi](/images/ESXiVMCreating/20.png)

![esxi](/images/ESXiVMCreating/21.png)

![esxi](/images/ESXiVMCreating/22.png)

![esxi](/images/ESXiVMCreating/23.png)

![esxi](/images/ESXiVMCreating/24.png)

![esxi](/images/ESXiVMCreating/25.png)

![esxi](/images/ESXiVMCreating/26.png)

![esxi](/images/ESXiVMCreating/27.png)

![esxi](/images/ESXiVMCreating/28.png)

![esxi](/images/ESXiVMCreating/29.png)

![esxi](/images/ESXiVMCreating/30.png)

![esxi](/images/ESXiVMCreating/31.png)

![esxi](/images/ESXiVMCreating/32.png)

**VMware Tools Installation:**

VMware Tools is a set of utilities that enhances the performance and management of virtual machines.

1. **Improved Performance:** Enhances graphics, mouse synchronization, and overall VM responsiveness.
2. **Better Integration:** Enables features like clipboard sharing, drag-and-drop, and time synchronization with the host.
3. **Advanced Management:** Allows graceful shutdown, guest OS heartbeat monitoring, and better resource optimization.
4. **Driver Enhancements:** Installs optimized drivers for network, display, and storage to improve compatibility and speed.

![esxi](/images/ESXiVMCreating/33.png)

![esxi](/images/ESXiVMCreating/34.png)

![esxi](/images/ESXiVMCreating/35.png)

![esxi](/images/ESXiVMCreating/36.png)

![esxi](/images/ESXiVMCreating/37.png)

![esxi](/images/ESXiVMCreating/38.png)

![esxi](/images/ESXiVMCreating/39.png)

![esxi](/images/ESXiVMCreating/40.png)

![esxi](/images/ESXiVMCreating/41.png)

![esxi](/images/ESXiVMCreating/42.png)

We have successfully installed the virtual machine.

Thank you for taking the time to read this article. I hope you found it useful.

Keep up the great work!
