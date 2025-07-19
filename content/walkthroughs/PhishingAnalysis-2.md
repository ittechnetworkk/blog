+++
title = "Phishing Analysis 2"
date = '2025-07-05T15:16:47+02:00'
author = "Soner Sahin"
categories = ["Walkthroughs"]
tags = ["walkthroughs", "BTLO", "mail Forensics", "cyberchef", "phishing"]
+++


Lab URL: https://blueteamlabs.online/home/challenge/phishing-analysis-2-a1091574b8

### **Question 1**

**What is the sending email address?**

```
Search for "From"
```

![phishing-2](/images/Phishing-Analysis-2/1.png)

**Answer:** amazon@zyevantoby.cn

### **Question 2**

**What is the recipient email address? 

```
Search for "To"
```

![phishing-2](/images/Phishing-Analysis-2/2.png)

**Answer:** saintington73@outlook.com

### **Question 3**

**What is the subject line of the email?** 

```
Search for "Subject"
```

![phishing-2](/images/Phishing-Analysis-2/3.png)

**Answer:** Your Account has been locked

### **Question 4**

**What company is the attacker trying to imitate?** 

```
Look for "From" 
```

![phishing-2](/images/Phishing-Analysis-2/4.png)

**Answer:** amazon

### **Question 5**

**What is the date and time the email was sent? (As copied from a text editor)** 

```
Search for "Date"
```

![phishing-2](/images/Phishing-Analysis-2/5.png)

**Answer:** Wed, 14 Jul 2021 01:40

### **Question 6**

**What is the URL of the main call-to-action button?**

```
Copy base64 encoded section
CyberChef base64 decode
```

![phishing-2](/images/Phishing-Analysis-2/6.1.png)

```
Copy Output
Create a ".html" file and paste decoded codes
Open it with browser
Hold you mouse cursor on the link
Copy the malicious link
```

![phishing-2](/images/Phishing-Analysis-2/6.2.png)


**Answer:** https://emea01.safelinks.protection.outlook.com/?url=https%3A%2F%2Famaozn.zzyuchengzhika.cn%2F%3Fmailtoken%3Dsaintington73%40outlook.com&data=04%7C01%7C%7C70072381ba6e49d1d12d08d94632811e%7C84df9e7fe9f640afb435aaaaaaaaaaaa%7C1%7C0%7C637618004988892053%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C1000&sdata=oPvTW08ASiViZTLfMECsvwDvguT6ODYKPQZNK3203m0%3D&reserved=0

### **Question 7**

**Look at the URL using URL2PNG. What is the first sentence (heading) displayed on this site? (regardless of whether you think the site is malicious or not)**

```
Go to the link or use URL2PNG
```

![phishing-2](/images/Phishing-Analysis-2/7.png)

**Answer:** This web page could not be loaded.

### **Question 8**

**When looking at the main body content in a text editor, what encoding scheme is being used?** 

```
Search for "Encoding"
```

![phishing-2](/images/Phishing-Analysis-2/8.png)

**Answer:** base64

### **Question 9**

**What is the URL used to retrieve the company's logo in the email?**

```
Search for "logo"
```

![phishing-2](/images/Phishing-Analysis-2/9.png)

**Answer:** https://images.squarespace-cdn.com/content/52e2b6d3e4b06446e8bf13ed/1500584238342-OX2L298XVSKF8AO6I3SV/amazon-logo?format=750w&amp;content-type=image%2Fpng

### **Question 10**

**For some unknown reason one of the URLs contains a Facebook profile URL. What is the username (not necessarily the display name) of this account, based on the URL?** 

```
Search for "facebook"
```

![phishing-2](/images/Phishing-Analysis-2/10.png)


**Answer:** amir.boyka.7


Thank you for taking the time to read this write-up! I hope you found it insightful and helpful.

Keep learning and stay sharp. 👊

Keep up the good work!

