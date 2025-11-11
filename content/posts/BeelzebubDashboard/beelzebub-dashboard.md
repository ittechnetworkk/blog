+++
title = "[EN] Beelzebub Dashboard"
date = "2025-11-11T17:22:34+01:00"
tags = ["honeypot", "soc", "hetzner", "linux"]
categories = ["SOC"]
author = "Soner Sahin"
image = "/images/beelzebubDashboard/cover.png"
+++ 

Hi everyone, in this article I would like to introduce you to my new project about visualizing [Beelzebub](https://github.com/mariocandela/beelzebub) logs, which is an AI-supported open-source honeypot solution that I modified slightly to achieve higher efficiency.

Recently I spun up a cloud machine where I run a Beelzebub honeypot to collect IOCs, attack types, malware samples, etc., and I was having some difficulty dealing with log files to see the big picture. 

Then I decided to create a project to increase the observability, efficiency, and visualization for the log files. This way, I'll be able to see the big picture, filter through logs easily, search for IP addresses and their reputations from some common threat intelligence feeds, and more.

I created this project using Cursor with different low-level LLM models. It has a simple structure and approach to do its job, and it works well, solving my issues.

I also added the log files to the repository, so you'll be able to see what's happening with the honeypot or take actions against malicious IPs if you want.

My aim in the future is to evolve the Beelzebub honeypot into a much more realistic one with its AI support capabilities and create an open-source threat intelligence feed for everyone in real-time.

Here is the project's [repository](https://github.com/ssnrshnn/beelzebubHoneypotTI).

Some screenshots:

![Beelzebub](/images/beelzebubDashboard/1.png)


![Beelzebub](/images/beelzebubDashboard/2.png)


![Beelzebub](/images/beelzebubDashboard/3.png)


![Beelzebub](/images/beelzebubDashboard/4.png)


![Beelzebub](/images/beelzebubDashboard/5.png)


![Beelzebub](/images/beelzebubDashboard/6.png)

You can just clone and run the project easily on your local machine.

Thanks for taking the time to read. I hope you'll find this useful.

Keep up the good work!














