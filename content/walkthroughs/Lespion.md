+++
title = "Lespion"
date = '2025-07-05T15:16:47+02:00'
author = "Soner Sahin"
categories = ["Walkthroughs"]
tags = ["walkthroughs", "Cyber Defenders", "osint"]
+++


Lab URL: https://cyberdefenders.org/blueteam-ctf-challenges/lespion/

### **Question 1**

**File -> Github.txt: What API key did the insider add to his GitHub repositories?**

```
cat Github.txt
https://github.com/EMarseille99
```

![lespion](/images/Lespion/1.1.png)

![lespion](/images/Lespion/1.2.png)

![lespion](/images/Lespion/1.3.png)

![lespion](/images/Lespion/1.4.png)

**Answer:** aJFRaLHjMXvYZgLPwiJkroYLGRkNBW

### **Question 2**

**File -> Github.txt: What plaintext password did the insider add to his GitHub repositories?**

```
Search: Password
UGljYXNzb0JhZ3VldHRlOTk=
Decode Base64
```

```
echo "UGljYXNzb0JhZ3VldHRlOTk=" |base64 -d
```

![lespion](/images/Lespion/2.1.png)

![lespion](/images/Lespion/2.2.png)

**Answer:** PicassoBaguette99

### **Question 3**

**File -> Github.txt: What cryptocurrency mining tool did the insider use?**

```
Surfing on the Repositories Page
```

![lespion](/images/Lespion/3.png)

**Answer:** xmrig

### **Question 4**

**On which gaming website did the insider have an account?**

```
Show hint
Go to google and search her username same as Github
Take a look at her Instagram account
There is a QR code
Scan that QR code
```

![lespion](/images/Lespion/4.png)

**Answer:** Steam

### **Question 5**

**What is the link to the insider Instagram profile?**

```
Search her Github name on Google
```

![lespion](/images/Lespion/5.png)

**Answer:** https://www.instagram.com/emarseille99

### **Question 6**

**Which country did the insider visit on her holiday?**

```
Take a look of her photos
```

![lespion](/images/Lespion/6.png)

**Answer:** Singapore

### **Question 7**

**Which city does the insider family live in?**

```
Take a look of her photos
Find the flag
```

![lespion](/images/Lespion/7.png)

**Answer:** Dubai

### **Question 8**

**File -> office.jpg: You have been provided with a picture of the building in which the company has an office. Which city is the company located in?**

```
Search keywords what you see on the picture
like: grand central odeon
```

![lespion](/images/Lespion/8.1.png)

![lespion](/images/Lespion/8.2.png)

**Answer:** Birmingham

### **Question 9**

**File -> Webcam.png: With the intel, you have provided, our ground surveillance unit is now overlooking the person of interest suspected address. They saw them leaving their apartment and followed them to the airport. Their plane took off and landed in another country. Our intelligence team spotted the target with this IP camera. Which state is this camera in?**

```
Search keywords on the picture
like: a view from the dome earthcam
You will see University o Notre Dame
Search: Notre Dam state?
```

![lespion](/images/Lespion/9.1.png)

![lespion](/images/Lespion/9.2.png)

**Answer:** Indiana


Thank you for taking the time to read this write-up! I hope you found it insightful and helpful.

Keep learning and stay sharp. 👊

Keep up the good work!

