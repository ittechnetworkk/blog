// Common ports to scan
const COMMON_PORTS = [21, 22, 23, 25, 53, 80, 110, 143, 443, 465, 587, 993, 995, 3306, 3389, 5432, 8080];

async function getIPInfo() {
    try {
        // Reset loading state
        const loadingElements = document.querySelectorAll('.loading');
        loadingElements.forEach(el => el.classList.add('loading'));

        // Get location data first
        const response = await fetch('https://ipwhois.app/json/');
        const data = await response.json();

        if (data && data.success) {
            // Try to get IPv6 address using a different service
            try {
                const ipv6Response = await fetch('https://api-ipv6.ip.sb/ip');
                const ipv6 = await ipv6Response.text();
                
                // Update IP display with separate copy buttons
                const ipAddress = document.getElementById('ip-address');
                ipAddress.innerHTML = `
                    <div class="ip-row">
                        <span>IPv4: ${data.ip}</span>
                        <button class="copy-btn" onclick="copyToClipboard('${data.ip}')">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <div class="ip-row">
                        <span>IPv6: ${ipv6.trim()}</span>
                        <button class="copy-btn" onclick="copyToClipboard('${ipv6.trim()}')">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                `;
            } catch (error) {
                console.log('IPv6 not available, trying alternative service');
                // Try alternative IPv6 service
                try {
                    const altIpv6Response = await fetch('https://v6.ident.me/');
                    const altIpv6 = await altIpv6Response.text();
                    
                    const ipAddress = document.getElementById('ip-address');
                    ipAddress.innerHTML = `
                        <div class="ip-row">
                            <span>IPv4: ${data.ip}</span>
                            <button class="copy-btn" onclick="copyToClipboard('${data.ip}')">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                        <div class="ip-row">
                            <span>IPv6: ${altIpv6.trim()}</span>
                            <button class="copy-btn" onclick="copyToClipboard('${altIpv6.trim()}')">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    `;
                } catch (altError) {
                    // If both IPv6 services fail, show only IPv4
                    const ipAddress = document.getElementById('ip-address');
                    ipAddress.innerHTML = `
                        <div class="ip-row">
                            <span>IPv4: ${data.ip}</span>
                            <button class="copy-btn" onclick="copyToClipboard('${data.ip}')">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                        <div class="ip-row">
                            <span>IPv6: Not available</span>
                        </div>
                    `;
                    
                    // Update Type display for IPv4 only
                    const type = document.getElementById('type');
                    type.textContent = 'IPv4 only';
                }
            }
            
            // Update Type display to show both IPv4 and IPv6
            const type = document.getElementById('type');
            type.textContent = 'IPv4 & IPv6';

            // Update country flag
            const flagImg = document.getElementById('country-flag');
            flagImg.src = `https://flagcdn.com/w160/${data.country_code.toLowerCase()}.png`;
            flagImg.alt = `${data.country} flag`;

            // Update location details
            document.getElementById('country').textContent = data.country;
            document.getElementById('region').textContent = data.region;
            document.getElementById('city').textContent = data.city;
            
            // Update additional info
            document.getElementById('location').textContent = `${data.city}, ${data.country}`;
            document.getElementById('isp').textContent = data.isp || data.connection || 'Not available';

            // Update extended info
            document.getElementById('timezone').textContent = `GMT ${data.timezone_gmt} (${data.timezone})`;
            document.getElementById('coordinates').textContent = `${data.latitude}, ${data.longitude}`;
            document.getElementById('currency').textContent = data.currency || 'Not available';
        } else {
            setErrorState();
        }

        // Remove loading state
        loadingElements.forEach(el => el.classList.remove('loading'));
    } catch (error) {
        console.error('Error fetching IP info:', error);
        setErrorState();
    }
}

function updateIPDisplay(ip) {
    const ipAddress = document.getElementById('ip-address');
    const type = document.getElementById('type');
    
    ipAddress.textContent = ip;
    type.textContent = ip.includes(':') ? 'IPv6' : 'IPv4';
}

function updateLocationInfo(data) {
    // Update country flag
    const flagImg = document.getElementById('country-flag');
    flagImg.src = `https://flagcdn.com/w160/${data.country_code.toLowerCase()}.png`;
    flagImg.alt = `${data.country_name} flag`;

    // Update location details
    document.getElementById('country').textContent = data.country_name;
    document.getElementById('region').textContent = data.region;
    document.getElementById('city').textContent = data.city;
    
    // Update additional info
    document.getElementById('location').textContent = `${data.city}, ${data.country_name}`;
    document.getElementById('isp').textContent = data.org;
}

function updateExtendedInfo(data) {
    document.getElementById('timezone').textContent = data.timezone;
    document.getElementById('coordinates').textContent = `${data.latitude}, ${data.longitude}`;
    document.getElementById('postal').textContent = data.postal || 'Not available';
    document.getElementById('currency').textContent = data.currency || 'Not available';
}

async function getNetworkDetails() {
    try {
        const dnsResponse = await fetch('https://cloudflare-dns.com/dns-query', {
            headers: {
                'Accept': 'application/dns-json'
            }
        });
        const dnsData = await dnsResponse.json();
        
        return {
            subnetMask: '255.255.255.0', // Default for most home networks
            gateway: 'Requires local network access',
            dnsServers: ['1.1.1.1', '8.8.8.8'] // Common DNS servers
        };
    } catch (error) {
        console.error('Error fetching network details:', error);
        return {
            subnetMask: 'Not available',
            gateway: 'Not available',
            dnsServers: []
        };
    }
}

async function pingHost(host) {
    const resultBox = document.getElementById('ping-result');
    resultBox.textContent = 'Pinging...';
    resultBox.className = 'result-box';
    
    try {
        const startTime = performance.now();
        await fetch(`https://${host}`, { mode: 'no-cors' });
        const endTime = performance.now();
        const pingTime = Math.round(endTime - startTime);
        
        resultBox.textContent = `Host is reachable\nResponse time: ${pingTime}ms`;
        resultBox.className = 'result-box success';
    } catch (error) {
        resultBox.textContent = 'Host unreachable or error occurred';
        resultBox.className = 'result-box error';
    }
}

async function dnsLookup(domain) {
    const resultBox = document.getElementById('dns-result');
    resultBox.textContent = 'Looking up DNS records...';
    resultBox.className = 'result-box';
    
    try {
        const response = await fetch(`https://dns.google/resolve?name=${domain}`);
        const data = await response.json();
        
        if (data.Answer) {
            const records = data.Answer.map(record => {
                return `${record.name} (${record.type}): ${record.data}`;
            }).join('\n');
            
            resultBox.textContent = records;
            resultBox.className = 'result-box success';
        } else {
            resultBox.textContent = 'No DNS records found';
            resultBox.className = 'result-box error';
        }
    } catch (error) {
        resultBox.textContent = 'Error looking up DNS records';
        resultBox.className = 'result-box error';
    }
}

async function checkHeaders(url) {
    const resultBox = document.getElementById('headers-result');
    resultBox.textContent = 'Checking headers...';
    resultBox.className = 'result-box';
    
    try {
        const response = await fetch(url, { method: 'HEAD' });
        const headers = Array.from(response.headers.entries())
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
        
        resultBox.textContent = headers || 'No headers found';
        resultBox.className = 'result-box success';
    } catch (error) {
        resultBox.textContent = 'Error checking headers';
        resultBox.className = 'result-box error';
    }
}

function setErrorState() {
    const errorElements = [
        'location', 'isp',
        'country', 'region', 'city',
        'timezone', 'coordinates', 'currency'
    ];
    
    // Special handling for IP address with new format
    const ipAddress = document.getElementById('ip-address');
    if (ipAddress) {
        ipAddress.innerHTML = `
            <div class="ip-row">
                <span>IPv4: Not available</span>
            </div>
            <div class="ip-row">
                <span>IPv6: Not available</span>
            </div>
        `;
    }

    errorElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = 'Not available';
            element.classList.remove('loading');
        }
    });

    // Reset flag
    const flagImg = document.getElementById('country-flag');
    flagImg.src = '';
    flagImg.alt = 'Flag not available';
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = 'Copied!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // IP Info
    const refreshButton = document.getElementById('refresh-ip');
    refreshButton.addEventListener('click', getIPInfo);
    
    // Copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.copy;
            const text = document.getElementById(targetId).textContent;
            copyToClipboard(text);
        });
    });

    // Ping Tool
    const pingButton = document.getElementById('start-ping');
    pingButton.addEventListener('click', () => {
        const host = document.getElementById('ping-host').value.trim();
        if (host) {
            pingHost(host);
        }
    });

    // DNS Lookup
    const dnsButton = document.getElementById('start-dns');
    dnsButton.addEventListener('click', () => {
        const domain = document.getElementById('dns-host').value.trim();
        if (domain) {
            dnsLookup(domain);
        }
    });

    // Headers Check
    const headersButton = document.getElementById('check-headers');
    headersButton.addEventListener('click', () => {
        const url = document.getElementById('headers-url').value.trim();
        if (url) {
            checkHeaders(url);
        }
    });
    
    // Initial IP info fetch with a small delay to ensure DOM is fully ready
    setTimeout(getIPInfo, 100);
});

// Also fetch IP info when the window loads completely
window.addEventListener('load', getIPInfo);

// Add CSS styles for the new IP display format
const style = document.createElement('style');
style.textContent = `
.ip-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 5px 0;
}

.ip-row .copy-btn {
    background: transparent;
    border: none;
    color: #4CAF50;
    cursor: pointer;
    padding: 5px;
    transition: color 0.2s;
    margin-left: 5px;
    font-size: 0.9em;
}

.ip-row .copy-btn:hover {
    color: #45a049;
}
`;
document.head.appendChild(style); 