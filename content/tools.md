---
title: "Tools"
description: "Online tools and services provided by IT Tech Network"
date: 2024-02-27
draft: false
layout: tools
---

<style>
.post {
    padding: 2rem;
    border-radius: 12px;
    margin-bottom: 2rem;
}

.post-title {
    color: #4CAF50;
    text-align: center;
    margin-bottom: 2rem;
}

h2, h3, h4 {
    color: #81c784;
}

p {
    color: #c8e6c9;
    line-height: 1.6;
}

.subnet-calculator {
    background: #2d2d2d;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 2rem 0;
}

.input-group label {
    color: #81c784;
}

.input-group input {
    background: #333;
    border: 1px solid #444;
    color: #c8e6c9;
    padding: 0.5rem;
    border-radius: 4px;
}

.calculate-btn {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
}

.calculate-btn:hover {
    background: #388e3c;
}

#result {
    background: #333;
    padding: 1rem;
    border-radius: 4px;
    margin-top: 1rem;
    color: #c8e6c9;
}
</style>

## Our Tools and Services

Welcome to our tools section! Here you'll find various online tools and services that we've developed to help make your work easier and more efficient.

### Available Tools

#### Subnet Calculator

Our Subnet Calculator helps network administrators and IT professionals quickly calculate subnet information including network address, broadcast address, usable IP range, and more.

<div class="subnet-calculator">
    <div class="input-group">
        <label for="ip">IP Address:</label>
        <input type="text" id="ip" placeholder="e.g., 192.168.1.0">
    </div>
    <div class="input-group">
        <label for="cidr">CIDR Notation (0-32):</label>
        <input type="number" id="cidr" min="0" max="32" placeholder="e.g., 24">
    </div>
    <button class="calculate-btn" onclick="calculateSubnet()">Calculate</button>
    <div id="result"></div>
</div>

### Features

- Professional-grade tools
- Easy to use interfaces
- Regular updates and improvements
- Technical support

Stay tuned for more tools and services. We're working hard to bring you solutions that will enhance your productivity and workflow. 