+++
title = "[EN] Linux Process Prioritization"
date = "2025-01-11T05:03:17+01:00"
tags = ["linux"]
categories = ["Linux"]
author = "Soner Sahin"
+++

In this article I am going to talk about Linux process Prioritization. 

Sometimes we may want to prioritize our more important processes in Linux. 

We prioritize process or processes that are more important for us with "NICE" parameters. 

Each process has a "NICE" value. This value prioritizes processes. 

The lower we set this value, the higher the priority of the process. However, this value can only be set between "+20" and "-20".

We can arrange this value using the "renice" command. And structure must be as follows:

```
renice -n <priority-value> <proccess-ID>
renice -n 10 1394
```

Let me make a simple example.

I have two processes named "pedestrian.sh" and "bicycle.sh" and I'm going to provide them run on the same core. Then, I will show you how much resources they consume. Afterwards  I will set lower NICE value to the "pedestrian" process to give it a higher priority.

Let's find out our processes' ID's.

```
─ 💁 ssnrshnn at 💻 Monster in 📁 ~
╰λ ps aux |grep pedestrian.sh
ssnrshnn  26340  100  0.0   2800  1536 pts/0  R  03:15  1:30 sh pedestrian.sh

╭─ 💁 ssnrshnn at 💻 Monster in 📁 ~
╰λ ps aux |grep bicycle.sh 
ssnrshnn  26350  99.9  0.0   2800  1536 pts/0  R  03:15  1:32 sh bicycle.sh
```

As you can see;

- The process ID of "pedestrian.sh" is `26340`. 
- The process ID of "bicycle.sh" is `26350`.

Now, let's assign them to run on the same core using the following command:

```
╭─ 💁 ssnrshnn at 💻 Monster in 📁 ~
╰λ taskset -cp 0 26340
pid 26340's current affinity list: 0-11
pid 26340's new affinity list: 0


╭─ 💁 ssnrshnn at 💻 Monster in 📁 ~
╰λ taskset -cp 0 26350
pid 26350's current affinity list: 0-11
pid 26350's new affinity list: 0
```

![linux-process-prioritization](/images/LinuxProcessPrioritization/1.png)

Now, you can see in the image above, both process is running on the same core which is "0". 

These processes are consuming equal resources.

You can also notice that both processes have the same "NI" value, which is "0."

Next, I will assign a lower NICE value to "pedestrian.sh" to prioritize it further. Here’s the command:

```
╭─ 💁 ssnrshnn at 💻 Monster in 📁 ~
╰λ renice -n -10 26340
26340 (process ID) old priority 0, new priority 10
```

![linux-process-prioritization](/images/LinuxProcessPrioritization/2.png)

Now, the "pedestrian.sh" process has a higher priority. Its NICE value is now `-10`, and as shown in the image, its priority value has been updated to reflect this change.

Next, let's set the NICE value of "pedestrian.sh" to 5

```
╭─ 💁 ssnrshnn at 💻 Monster in 📁 ~
╰λ sudo renice -n 5 26340
26340 (process ID) old priority -10, new priority 5
```

![linux-process-prioritization](/images/LinuxProcessPrioritization/3.png)

Now, the "bicycle.sh" process has become the higher priority process, with a priority value of `20`. Its NICE value is `5`.

The priority of a process is determined proportionally based on the NICE value assigned.

If you want to reset the process to its default value, you can do so by setting its NICE value to `0`:

```
╭─ 💁 ssnrshnn at 💻 Monster in 📁 ~
╰λ sudo renice -n 0 26340
26340 (process ID) old priority 5, new priority 0
```

![linux-process-prioritization](/images/LinuxProcessPrioritization/4.png)

Thank you for taking the time to read this article.

Keep up the good work!








