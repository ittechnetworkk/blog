async function getIPInfo() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('ip-result').style.display = 'none';

    try {
        // Get IPv4 information
        const ipv4Response = await fetch('https://api.ipify.org?format=json');
        const ipv4Data = await ipv4Response.json();
        
        // Get detailed information
        const detailsResponse = await fetch(`https://ipapi.co/${ipv4Data.ip}/json/`);
        const details = await detailsResponse.json();

        // Try multiple services for IPv6 detection
        let ipv6 = '-';
        try {
            // Try first IPv6 service
            const ipv6Response1 = await fetch('https://api64.ipify.org?format=json');
            const ipv6Data1 = await ipv6Response1.json();
            ipv6 = ipv6Data1.ip;
        } catch (error1) {
            try {
                // Try second IPv6 service as fallback
                const ipv6Response2 = await fetch('https://api-ipv6.ip.sb/ip');
                const ipv6Data2 = await ipv6Response2.text();
                ipv6 = ipv6Data2.trim();
            } catch (error2) {
                try {
                    // Try third IPv6 service as final fallback
                    const ipv6Response3 = await fetch('https://v6.ident.me/');
                    const ipv6Data3 = await ipv6Response3.text();
                    ipv6 = ipv6Data3.trim();
                } catch (error3) {
                    console.log('IPv6 not available');
                    ipv6 = 'Not available';
                }
            }
        }

        // Update the UI
        document.getElementById('ipv4').textContent = ipv4Data.ip;
        document.getElementById('ipv6').textContent = ipv6;
        
        // Update country flag and information
        const flagUrl = `https://flagcdn.com/w80/${details.country_code.toLowerCase()}.png`;
        document.getElementById('country-flag').src = flagUrl;
        document.getElementById('country').textContent = details.country_name;
        
        // Update location information
        document.getElementById('city').textContent = details.city;
        document.getElementById('region').textContent = details.region;
        document.getElementById('isp').textContent = details.org;
        document.getElementById('org').textContent = details.org;
        document.getElementById('timezone').textContent = details.timezone;
        document.getElementById('user-agent').textContent = navigator.userAgent;
        document.getElementById('language').textContent = navigator.language;

        document.getElementById('loading').style.display = 'none';
        document.getElementById('ip-result').style.display = 'grid';
    } catch (error) {
        document.getElementById('loading').innerHTML = '<div class="error">Error fetching IP information. Please try again.</div>';
    }
}

function refreshIPInfo() {
    getIPInfo();
}

async function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    try {
        await navigator.clipboard.writeText(text);
        
        // Visual feedback
        const button = element.nextElementSibling;
        button.classList.add('copied');
        
        // Remove the class after animation
        setTimeout(() => {
            button.classList.remove('copied');
        }, 1500);
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', getIPInfo); 