function calculateSubnet() {
    const ip = document.getElementById('ip').value;
    const cidr = parseInt(document.getElementById('cidr').value);
    const numSubnets = parseInt(document.getElementById('numSubnets')?.value || '0');
    
    // Check if IPv6
    if (isValidIPv6(ip)) {
        if (cidr < 0 || cidr > 128) {
            document.getElementById('result').innerHTML = '<div class="error">IPv6 prefix must be between 0 and 128</div>';
            return;
        }
        
        try {
            const networkAddress = calculateIPv6Subnet(ip, cidr);
            document.getElementById('result').innerHTML = `
                <div class="result-item">
                    <strong>IPv6 Network Address:</strong> ${networkAddress}
                </div>
                <div class="result-item">
                    <strong>Prefix Length:</strong> /${cidr}
                </div>
                <div class="result-item">
                    <strong>Total Addresses:</strong> 2^${128 - cidr}
                </div>
            `;
            return;
        } catch (error) {
            document.getElementById('result').innerHTML = '<div class="error">Error calculating IPv6 subnet</div>';
            return;
        }
    }
    
    // IPv4 validation and calculation
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipPattern.test(ip)) {
        document.getElementById('result').innerHTML = '<div class="error">Invalid IP address format</div>';
        return;
    }
    
    const ipParts = ip.split('.');
    for (let part of ipParts) {
        if (parseInt(part) > 255) {
            document.getElementById('result').innerHTML = '<div class="error">IP address octets must be between 0 and 255</div>';
            return;
        }
    }
    
    if (isNaN(cidr) || cidr < 0 || cidr > 32) {
        document.getElementById('result').innerHTML = '<div class="error">CIDR must be between 0 and 32</div>';
        return;
    }
    
    try {
        const subnetMask = calculateSubnetMask(cidr);
        const networkAddress = calculateNetworkAddress(ip, subnetMask);
        const broadcastAddress = calculateBroadcastAddress(networkAddress, cidr);
        const usableRange = calculateUsableRange(networkAddress, broadcastAddress);
        const totalHosts = Math.pow(2, (32 - cidr)) - 2;
        const wildcardMask = calculateWildcardMask(subnetMask);
        const ipClass = getIPClass(parseInt(ipParts[0]));
        
        let resultHTML = `
            <div class="result-item">
                <strong>IP Address (Binary):</strong> ${getBinaryRepresentation(ip)}
            </div>
            <div class="result-item">
                <strong>Subnet Mask:</strong> ${subnetMask}
            </div>
            <div class="result-item">
                <strong>Subnet Mask (Binary):</strong> ${getBinaryRepresentation(subnetMask)}
            </div>
            <div class="result-item">
                <strong>Wildcard Mask:</strong> ${wildcardMask}
            </div>
            <div class="result-item">
                <strong>Network Address:</strong> ${networkAddress}
            </div>
            <div class="result-item">
                <strong>Broadcast Address:</strong> ${broadcastAddress}
            </div>
            <div class="result-item">
                <strong>Usable IP Range:</strong> ${usableRange}
            </div>
            <div class="result-item">
                <strong>Total Usable Hosts:</strong> ${totalHosts}
            </div>
            <div class="result-item">
                <strong>IP Address Class:</strong> ${ipClass}
            </div>
        `;
        
        // Add subnet division information if requested
        if (numSubnets > 1) {
            try {
                const subnets = calculateSubnets(networkAddress, cidr, numSubnets);
                resultHTML += '<div class="result-item"><strong>Subnet Divisions:</strong><ul>';
                subnets.forEach((subnet, index) => {
                    resultHTML += `
                        <li>Subnet ${index + 1}:<br>
                        Network: ${subnet.network}/${subnet.cidr}<br>
                        Broadcast: ${subnet.broadcast}<br>
                        Usable Range: ${subnet.usableRange}<br>
                        Usable Hosts: ${subnet.usableHosts}</li>
                    `;
                });
                resultHTML += '</ul></div>';
            } catch (error) {
                resultHTML += `<div class="error">${error.message}</div>`;
            }
        }
        
        document.getElementById('result').innerHTML = resultHTML;
    } catch (error) {
        document.getElementById('result').innerHTML = '<div class="error">An error occurred during calculation</div>';
    }
}

function calculateSubnetMask(cidr) {
    const mask = [];
    for (let i = 0; i < 4; i++) {
        const n = Math.min(8, Math.max(0, cidr - 8 * i));
        mask.push(256 - Math.pow(2, 8 - n));
    }
    return mask.join('.');
}

function calculateNetworkAddress(ip, subnetMask) {
    const ipParts = ip.split('.');
    const maskParts = subnetMask.split('.');
    const networkParts = [];
    
    for (let i = 0; i < 4; i++) {
        networkParts.push(parseInt(ipParts[i]) & parseInt(maskParts[i]));
    }
    
    return networkParts.join('.');
}

function calculateBroadcastAddress(networkAddress, cidr) {
    const networkParts = networkAddress.split('.');
    const hostBits = 32 - cidr;
    const broadcast = [];
    
    for (let i = 0; i < 4; i++) {
        const n = Math.min(8, Math.max(0, hostBits - 8 * (3 - i)));
        broadcast.push(parseInt(networkParts[i]) | (Math.pow(2, n) - 1));
    }
    
    return broadcast.join('.');
}

function calculateUsableRange(networkAddress, broadcastAddress) {
    const networkParts = networkAddress.split('.');
    const broadcastParts = broadcastAddress.split('.');
    
    // First usable IP
    networkParts[3] = parseInt(networkParts[3]) + 1;
    const firstUsable = networkParts.join('.');
    
    // Last usable IP
    broadcastParts[3] = parseInt(broadcastParts[3]) - 1;
    const lastUsable = broadcastParts.join('.');
    
    return `${firstUsable} - ${lastUsable}`;
}

function toBinary(number) {
    return ('00000000' + (number >>> 0).toString(2)).slice(-8);
}

function getIPClass(firstOctet) {
    if (firstOctet >= 1 && firstOctet <= 126) return 'A';
    if (firstOctet >= 128 && firstOctet <= 191) return 'B';
    if (firstOctet >= 192 && firstOctet <= 223) return 'C';
    if (firstOctet >= 224 && firstOctet <= 239) return 'D (Multicast)';
    if (firstOctet >= 240 && firstOctet <= 255) return 'E (Reserved)';
    return 'Invalid';
}

function calculateWildcardMask(subnetMask) {
    const maskParts = subnetMask.split('.');
    return maskParts.map(part => 255 - parseInt(part)).join('.');
}

function getBinaryRepresentation(ip) {
    return ip.split('.').map(octet => toBinary(parseInt(octet))).join('.');
}

function calculateSubnets(networkAddress, cidr, numSubnets) {
    const subnets = [];
    const newBits = Math.ceil(Math.log2(numSubnets));
    const newCidr = cidr + newBits;
    
    if (newCidr > 32) {
        throw new Error('Too many subnets requested for this network');
    }
    
    const subnetSize = Math.pow(2, 32 - newCidr);
    const networkParts = networkAddress.split('.');
    let baseNetwork = networkParts.map(part => parseInt(part));
    
    for (let i = 0; i < numSubnets; i++) {
        const currentNetwork = [...baseNetwork];
        let increment = i * subnetSize;
        
        for (let j = 3; j >= 0; j--) {
            const addValue = increment % 256;
            currentNetwork[j] = (currentNetwork[j] + addValue) % 256;
            increment = Math.floor(increment / 256);
        }

        const networkAddr = currentNetwork.join('.');
        const subnetMask = calculateSubnetMask(newCidr);
        const broadcastAddr = calculateBroadcastAddress(networkAddr, newCidr);
        const usableRange = calculateUsableRange(networkAddr, broadcastAddr);
        
        subnets.push({
            network: networkAddr,
            cidr: newCidr,
            usableHosts: Math.pow(2, 32 - newCidr) - 2,
            usableRange: usableRange,
            broadcast: broadcastAddr
        });
    }
    
    return subnets;
}

function isValidIPv6(address) {
    const ipv6Pattern = /^(?:(?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,7}:|(?:[0-9A-Fa-f]{1,4}:){1,6}:[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,5}(?::[0-9A-Fa-f]{1,4}){1,2}|(?:[0-9A-Fa-f]{1,4}:){1,4}(?::[0-9A-Fa-f]{1,4}){1,3}|(?:[0-9A-Fa-f]{1,4}:){1,3}(?::[0-9A-Fa-f]{1,4}){1,4}|(?:[0-9A-Fa-f]{1,4}:){1,2}(?::[0-9A-Fa-f]{1,4}){1,5}|[0-9A-Fa-f]{1,4}:(?:(?::[0-9A-Fa-f]{1,4}){1,6})|:(?:(?::[0-9A-Fa-f]{1,4}){1,7}|:))$/;
    return ipv6Pattern.test(address);
}

function calculateIPv6Subnet(address, prefix) {
    const segments = address.split(':');
    const fullSegments = segments.map(seg => seg || '0000').map(seg => ('0000' + seg).slice(-4));
    const binaryAddress = fullSegments.map(seg => parseInt(seg, 16).toString(2).padStart(16, '0')).join('');
    
    const networkPortion = binaryAddress.slice(0, prefix);
    const hostPortion = binaryAddress.slice(prefix).replace(/./g, '0');
    
    const networkBinary = networkPortion + hostPortion;
    const networkSegments = [];
    
    for (let i = 0; i < 8; i++) {
        const segment = networkBinary.slice(i * 16, (i + 1) * 16);
        networkSegments.push(parseInt(segment, 2).toString(16).padStart(4, '0'));
    }
    
    return networkSegments.join(':');
} 