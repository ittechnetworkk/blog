+++
title = "[EN] Windows Logon Types"
date = "2025-08-31T04:04:25+02:00"
tags = ["windows", "logontypes", "soc"]
categories = ["SOC", "Windows"]
author = "Soner Sahin"
image = "/images/windowslogontypes/cover.png"
+++

Hi everyone,

In this article, I will walk you through Windows Logon Types.


Windows operating systems support multiple logon types, each designed for specific authentication scenarios. Understanding these logon types is crucial for system administrators, security professionals, and anyone managing Windows environments. 

Below is a concise overview of the main logon types, along with real-world examples for each.

## 1. Interactive Logon (Type 2)
**Description:**
- Occurs when a user logs on to a computer locally (e.g., at the console or via Remote Desktop).

**Scenario:**
- A user sits at their workstation and enters their username and password to access Windows.

## 2. Network Logon (Type 3)
**Description:**
- Used when accessing shared resources over the network (e.g., file shares, printers) without logging on interactively.

**Scenario:**
- A user on Computer A accesses a shared folder on Computer B using their credentials.

## 3. Batch Logon (Type 4)
**Description:**
- Used by batch servers, where processes may run on behalf of a user without direct interaction.

**Scenario:**
- A scheduled task or script runs automatically using stored credentials.

## 4. Service Logon (Type 5)
**Description:**
- Used by Windows services that start under a specific user account.

**Scenario:**
- The SQL Server service starts using a dedicated service account.

## 5. Unlock (Type 7)
**Description:**
- Occurs when a user unlocks a previously locked workstation.

**Scenario:**
- A user returns from a break and unlocks their computer by entering their password.

## 6. NetworkCleartext (Type 8)
**Description:**
- Used when credentials are sent in clear text over the network (rare and insecure).

**Scenario:**
- An old application sends a username and password over the network without encryption.

## 7. NewCredentials (Type 9)
**Description:**
- Used when a user logs on with alternate credentials without logging off (e.g., `runas` command).

**Scenario:**
- An administrator uses `runas` to open a command prompt as another user.

## 8. RemoteInteractive (Type 10)
**Description:**
- Used for Remote Desktop or Terminal Services logons.

**Scenario:**
- A user connects to a server using Remote Desktop Protocol (RDP).

## 9. CachedInteractive (Type 11)
**Description:**
- Used when a user logs on with cached credentials (e.g., laptop not connected to domain controller).

**Scenario:**
- A user logs into their work laptop at home using previously cached domain credentials.

---

## Relevant Windows Security Event IDs

Windows logs various security events related to logon activity. The most important Event IDs associated with logon types include:

| Event ID | Description |
|----------|-------------|
| **4624** | Successful logon. Indicates a user or service has successfully logged on. The logon type is specified in the event details. |
| **4625** | Logon failure. Indicates an attempt to log on was unsuccessful. The logon type and failure reason are included. |
| **4634** | Logoff. Indicates a user or service has logged off. |
| **4647** | User-initiated logoff. Specifically records when a user initiates a logoff. |
| **4672** | Special privileges assigned to new logon. Indicates a logon with administrative or elevated privileges. |
| **4648** | A logon was attempted using explicit credentials. Often seen with 'runas' or network logons. |
| **4768** | Kerberos authentication ticket (TGT) was requested. Indicates a domain authentication attempt using Kerberos. |
| **4769** | Kerberos service ticket was requested. Indicates a service ticket request in Kerberos authentication. |
| **4771** | Kerberos pre-authentication failed. Indicates a failed Kerberos authentication attempt (e.g., wrong password, expired password). |
| **4776** | The computer attempted to validate the credentials for an account. Indicates NTLM authentication (domain or local). |

**How to Use These Event IDs:**
- **4624** and **4625** are most commonly used to audit successful and failed logon attempts, including 
the logon type (e.g., interactive, network).
- **4634** and **4647** help track when sessions end.
- **4672** is important for monitoring privileged account usage.
- **4648** is useful for tracking when alternate credentials are used.
- **4768**, **4769**, and **4771** are essential for monitoring Kerberos-based domain authentication 
(successes and failures).
- **4776** is used to monitor NTLM authentication attempts, both domain and local.


### Failure Information for Event ID 4625

When a logon attempt fails (Event ID 4625), the event log provides detailed failure information to help diagnose the cause. The key fields are:

- **Failure Reason:** A textual explanation of why the logon failed (e.g., bad password, account disabled).
- **Status and Sub Status:** Hexadecimal codes that provide technical details about the failure reason.

Some common Status and Sub Status codes include:

| Status Code    | Description                                             |
|--------------- |---------------------------------------------------------|
| 0xC0000064     | User name does not exist                                |
| 0xC000006A     | User name is correct but the password is wrong          |
| 0xC0000234     | User is currently locked out                            |
| 0xC0000072     | Account is currently disabled                           |
| 0xC000006F     | User tried to logon outside allowed time restrictions   |
| 0xC0000070     | Workstation restriction or Authentication Policy Silo   |
| 0xC0000193     | Account expiration                                      |
| 0xC0000071     | Expired password                                        |
| 0xC0000133     | Clocks between DC and computer too far out of sync      |
| 0xC0000224     | User must change password at next logon                 |
| 0xC0000225     | Evidently a bug in Windows and not a risk               |
| 0xC000015B     | User not granted requested logon type at this machine   |


### Common Kerberos Error Codes

| Code   | Description                                              |
|--------|----------------------------------------------------------|
| 0x6    | Client not found in Kerberos database (bad username)     |
| 0x7    | Server not found in Kerberos database                    |
| 0xC    | KDC policy rejects request                               |
| 0x12   | Client’s credentials have been revoked                   |
| 0x17   | Password has expired                                     |
| 0x18   | Pre-authentication information was invalid (bad password)|
| 0x25   | Clock skew too great                                     |


These codes are invaluable for troubleshooting failed logon attempts and understanding the specific reason for authentication failures.

**References:**
- [Microsoft Docs: Security Event IDs](https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-ids)
- [Ultimate Windows Security: Event ID 4624](https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/event.aspx?eventid=4624) 
- [Ultimate Windows Security Event ID 4625 documentation](https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/event.aspx?eventID=4625)
