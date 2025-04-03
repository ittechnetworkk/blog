document.addEventListener('DOMContentLoaded', () => {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Make sure the routing tab button works properly
    const routingTabBtn = document.querySelector('.tab-btn[data-tab="routing"]');
    if (routingTabBtn) {
        routingTabBtn.addEventListener('click', function() {
            // Hide all tab contents
            tabContents.forEach(content => content.style.display = 'none');
            
            // Show routing content
            document.getElementById('routing-content').style.display = 'block';
            
            // Make sure static routes are visible
            const staticRoutesConfig = document.getElementById('static-routes-config');
            if (staticRoutesConfig) {
                staticRoutesConfig.style.display = 'block';
            }
            
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    }
    
    // Regular tab button handling (except routing)
    tabButtons.forEach(button => {
        if (button.getAttribute('data-tab') !== 'routing') {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to current button
                button.classList.add('active');
                
                // Hide all tab contents
                tabContents.forEach(content => content.style.display = 'none');
                
                // Show the selected tab content
                const tabId = button.getAttribute('data-tab');
                document.getElementById(`${tabId}-content`).style.display = 'block';
            });
        }
    });
    
    // Toggle visibility of configuration sections based on checkboxes
    const sshCheckbox = document.getElementById('ssh-enabled');
    const sshConfig = document.getElementById('ssh-config');
    
    sshCheckbox.addEventListener('change', () => {
        sshConfig.style.display = sshCheckbox.checked ? 'block' : 'none';
    });
    
    const aclCheckbox = document.getElementById('acl-enabled');
    const aclConfig = document.getElementById('acl-config');
    
    aclCheckbox.addEventListener('change', () => {
        aclConfig.style.display = aclCheckbox.checked ? 'block' : 'none';
    });
    
    const ntpCheckbox = document.getElementById('ntp-enabled');
    const ntpConfig = document.getElementById('ntp-config');
    
    ntpCheckbox.addEventListener('change', () => {
        ntpConfig.style.display = ntpCheckbox.checked ? 'block' : 'none';
    });
    
    const dhcpCheckbox = document.getElementById('dhcp-enabled');
    const dhcpConfig = document.getElementById('dhcp-config');
    
    dhcpCheckbox.addEventListener('change', () => {
        dhcpConfig.style.display = dhcpCheckbox.checked ? 'block' : 'none';
    });
    
    const syslogCheckbox = document.getElementById('syslog-enabled');
    const syslogConfig = document.getElementById('syslog-config');
    
    syslogCheckbox.addEventListener('change', () => {
        syslogConfig.style.display = syslogCheckbox.checked ? 'block' : 'none';
    });
    
    // Interface description toggle
    document.getElementById('interface-description-enabled-0').addEventListener('change', function() {
        document.getElementById('description-group-0').style.display = this.checked ? 'block' : 'none';
    });
    
    // Change ACL type functionality
    const aclType = document.getElementById('acl-type');
    const extendedAclFields = document.querySelectorAll('.extended-acl-fields');
    
    aclType.addEventListener('change', () => {
        const isExtended = aclType.value === 'extended';
        extendedAclFields.forEach(field => {
            field.style.display = isExtended ? 'block' : 'none';
        });
    });
    
    // Protocol port fields toggle
    const aclProtocol = document.getElementById('acl-protocol-0');
    const portFields = document.querySelectorAll('.port-fields');
    
    aclProtocol.addEventListener('change', () => {
        const showPorts = aclProtocol.value === 'tcp' || aclProtocol.value === 'udp';
        portFields.forEach(field => {
            field.style.display = showPorts ? 'block' : 'none';
        });
    });
    
    // Routing protocol selection
    const routingProtocol = document.getElementById('routing-protocol');
    const protocolConfigs = document.querySelectorAll('.protocol-config');
    
    // Force static routes to be selected by default
    if (routingProtocol) {
        routingProtocol.value = 'static';
        
        // Make sure all protocol configs are hidden except static routes
        protocolConfigs.forEach(config => {
            if (config.id === 'static-routes-config') {
                config.style.display = 'block';
            } else {
                config.style.display = 'none';
            }
        });
        
        // Add change event listener
        routingProtocol.addEventListener('change', function() {
            // Hide all protocol configs
            protocolConfigs.forEach(config => {
                config.style.display = 'none';
            });
            
            // Show selected protocol config
            const selectedProtocol = this.value;
            if (selectedProtocol !== 'none') {
                const configElement = document.getElementById(`${selectedProtocol}-config`);
                if (configElement) {
                    configElement.style.display = 'block';
                }
            }
        });
    }
    
    // Always show static routes config by default when the page loads
    document.getElementById('static-routes-config').style.display = 'block';
    
    // Add interface button
    let interfaceCounter = 1;
    const addInterfaceBtn = document.getElementById('add-interface');
    const interfacesList = document.getElementById('interfaces-list');
    
    addInterfaceBtn.addEventListener('click', () => {
        const newInterface = document.createElement('div');
        newInterface.className = 'interface-item';
        newInterface.innerHTML = `
            <div class="interface-header">
                <div class="input-group">
                    <label for="interface-type-${interfaceCounter}">Interface:</label>
                    <select id="interface-type-${interfaceCounter}">
                        <option value="GigabitEthernet0/0">GigabitEthernet0/0</option>
                        <option value="GigabitEthernet0/1">GigabitEthernet0/1</option>
                        <option value="FastEthernet0/0">FastEthernet0/0</option>
                        <option value="FastEthernet0/1">FastEthernet0/1</option>
                        <option value="Serial0/0/0">Serial0/0/0</option>
                        <option value="Serial0/0/1">Serial0/0/1</option>
                        <option value="Loopback0">Loopback0</option>
                    </select>
                </div>
                <button class="remove-interface" data-id="${interfaceCounter}">Remove</button>
            </div>
            <div class="interface-config">
                <div class="input-group">
                    <label for="ip-address-${interfaceCounter}">IP Address:</label>
                    <input type="text" id="ip-address-${interfaceCounter}" placeholder="192.168.1.1">
                </div>
                <div class="input-group">
                    <label for="subnet-mask-${interfaceCounter}">Subnet Mask:</label>
                    <input type="text" id="subnet-mask-${interfaceCounter}" placeholder="255.255.255.0">
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="interface-enabled-${interfaceCounter}" checked>
                    <label for="interface-enabled-${interfaceCounter}">Interface Enabled</label>
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="interface-description-enabled-${interfaceCounter}">
                    <label for="interface-description-enabled-${interfaceCounter}">Add Description</label>
                </div>
                <div class="input-group description-input" id="description-group-${interfaceCounter}" style="display: none;">
                    <label for="interface-description-${interfaceCounter}">Description:</label>
                    <input type="text" id="interface-description-${interfaceCounter}" placeholder="LAN Interface">
                </div>
            </div>
        `;
        
        interfacesList.appendChild(newInterface);
        
        // Add event listener for description toggle
        document.getElementById(`interface-description-enabled-${interfaceCounter}`).addEventListener('change', function() {
            document.getElementById(`description-group-${interfaceCounter}`).style.display = this.checked ? 'block' : 'none';
        });
        
        // Add event listener for remove button
        const removeBtn = newInterface.querySelector('.remove-interface');
        removeBtn.addEventListener('click', () => {
            interfacesList.removeChild(newInterface);
        });
        
        interfaceCounter++;
    });
    
    // Add static route button
    let routeCounter = 1;
    const addRouteBtn = document.getElementById('add-static-route');
    const routesList = document.getElementById('static-routes-list');
    
    addRouteBtn.addEventListener('click', () => {
        const newRoute = document.createElement('div');
        newRoute.className = 'static-route-item';
        newRoute.innerHTML = `
            <div class="input-group">
                <label for="route-destination-${routeCounter}">Destination Network:</label>
                <input type="text" id="route-destination-${routeCounter}" placeholder="192.168.2.0">
            </div>
            <div class="input-group">
                <label for="route-mask-${routeCounter}">Subnet Mask:</label>
                <input type="text" id="route-mask-${routeCounter}" placeholder="255.255.255.0">
            </div>
            <div class="input-group">
                <label for="next-hop-${routeCounter}">Next Hop:</label>
                <input type="text" id="next-hop-${routeCounter}" placeholder="10.0.0.2">
            </div>
            <button class="remove-route" data-id="${routeCounter}">Remove</button>
        `;
        
        routesList.appendChild(newRoute);
        
        // Add event listener for remove button
        const removeBtn = newRoute.querySelector('.remove-route');
        removeBtn.addEventListener('click', () => {
            routesList.removeChild(newRoute);
        });
        
        routeCounter++;
    });
    
    // Add ACL entry button
    let aclEntryCounter = 1;
    const addAclEntryBtn = document.getElementById('add-acl-entry');
    const aclEntriesList = document.getElementById('acl-entries');
    
    addAclEntryBtn.addEventListener('click', () => {
        const newAclEntry = document.createElement('div');
        newAclEntry.className = 'acl-entry';
        newAclEntry.innerHTML = `
            <div class="input-group">
                <label for="acl-action-${aclEntryCounter}">Action:</label>
                <select id="acl-action-${aclEntryCounter}">
                    <option value="permit">Permit</option>
                    <option value="deny">Deny</option>
                </select>
            </div>
            <div class="input-group">
                <label for="acl-source-${aclEntryCounter}">Source:</label>
                <input type="text" id="acl-source-${aclEntryCounter}" placeholder="any or IP address">
            </div>
            <div class="extended-acl-fields" style="display: ${aclType.value === 'extended' ? 'block' : 'none'}">
                <div class="input-group">
                    <label for="acl-destination-${aclEntryCounter}">Destination:</label>
                    <input type="text" id="acl-destination-${aclEntryCounter}" placeholder="any or IP address">
                </div>
                <div class="input-group">
                    <label for="acl-protocol-${aclEntryCounter}">Protocol:</label>
                    <select id="acl-protocol-${aclEntryCounter}">
                        <option value="ip">IP</option>
                        <option value="tcp">TCP</option>
                        <option value="udp">UDP</option>
                        <option value="icmp">ICMP</option>
                    </select>
                </div>
                <div class="port-fields" style="display: none;">
                    <div class="input-group">
                        <label for="acl-sport-${aclEntryCounter}">Source Port:</label>
                        <input type="text" id="acl-sport-${aclEntryCounter}" placeholder="any or port number">
                    </div>
                    <div class="input-group">
                        <label for="acl-dport-${aclEntryCounter}">Destination Port:</label>
                        <input type="text" id="acl-dport-${aclEntryCounter}" placeholder="any or port number">
                    </div>
                </div>
            </div>
            <button class="remove-acl-entry" data-id="${aclEntryCounter}">Remove</button>
        `;
        
        aclEntriesList.appendChild(newAclEntry);
        
        // Add event listener for protocol change
        const protocol = newAclEntry.querySelector(`#acl-protocol-${aclEntryCounter}`);
        const portFields = newAclEntry.querySelector('.port-fields');
        
        protocol.addEventListener('change', () => {
            const showPorts = protocol.value === 'tcp' || protocol.value === 'udp';
            portFields.style.display = showPorts ? 'block' : 'none';
        });
        
        // Add event listener for remove button
        const removeBtn = newAclEntry.querySelector('.remove-acl-entry');
        removeBtn.addEventListener('click', () => {
            aclEntriesList.removeChild(newAclEntry);
        });
        
        aclEntryCounter++;
    });
    
    // Add DHCP pool button
    let dhcpPoolCounter = 1;
    const addDhcpPoolBtn = document.getElementById('add-dhcp-pool');
    const dhcpPoolsList = document.getElementById('dhcp-pools');
    
    addDhcpPoolBtn.addEventListener('click', () => {
        const newDhcpPool = document.createElement('div');
        newDhcpPool.className = 'dhcp-pool';
        newDhcpPool.innerHTML = `
            <div class="input-group">
                <label for="dhcp-name-${dhcpPoolCounter}">Pool Name:</label>
                <input type="text" id="dhcp-name-${dhcpPoolCounter}" placeholder="LAN_POOL">
            </div>
            <div class="input-group">
                <label for="dhcp-network-${dhcpPoolCounter}">Network:</label>
                <input type="text" id="dhcp-network-${dhcpPoolCounter}" placeholder="192.168.1.0">
            </div>
            <div class="input-group">
                <label for="dhcp-mask-${dhcpPoolCounter}">Subnet Mask:</label>
                <input type="text" id="dhcp-mask-${dhcpPoolCounter}" placeholder="255.255.255.0">
            </div>
            <div class="input-group">
                <label for="dhcp-gateway-${dhcpPoolCounter}">Default Gateway:</label>
                <input type="text" id="dhcp-gateway-${dhcpPoolCounter}" placeholder="192.168.1.1">
            </div>
            <div class="input-group">
                <label for="dhcp-dns-${dhcpPoolCounter}">DNS Servers (comma separated):</label>
                <input type="text" id="dhcp-dns-${dhcpPoolCounter}" placeholder="8.8.8.8, 8.8.4.4">
            </div>
            <div class="input-group">
                <label for="dhcp-domain-${dhcpPoolCounter}">Domain Name:</label>
                <input type="text" id="dhcp-domain-${dhcpPoolCounter}" placeholder="example.com">
            </div>
            <div class="input-group">
                <label for="dhcp-lease-${dhcpPoolCounter}">Lease Time (days):</label>
                <input type="number" id="dhcp-lease-${dhcpPoolCounter}" placeholder="7" min="1" max="365">
            </div>
            <button class="remove-dhcp-pool" data-id="${dhcpPoolCounter}">Remove</button>
        `;
        
        dhcpPoolsList.appendChild(newDhcpPool);
        
        // Add event listener for remove button
        const removeBtn = newDhcpPool.querySelector('.remove-dhcp-pool');
        removeBtn.addEventListener('click', () => {
            dhcpPoolsList.removeChild(newDhcpPool);
        });
        
        dhcpPoolCounter++;
    });
    
    // Remove interface button for the first interface
    document.querySelector('.remove-interface').addEventListener('click', function() {
        // Don't remove if it's the only one remaining
        if (document.querySelectorAll('.interface-item').length > 1) {
            const interfaceId = this.getAttribute('data-id');
            const interfaceItem = this.closest('.interface-item');
            interfacesList.removeChild(interfaceItem);
        } else {
            alert('You need at least one interface.');
        }
    });
    
    // Remove button for the first static route
    const firstRouteRemoveBtn = document.querySelector('.remove-route');
    if (firstRouteRemoveBtn) {
        firstRouteRemoveBtn.addEventListener('click', function() {
            // Don't remove if it's the only one remaining
            if (document.querySelectorAll('.static-route-item').length > 1) {
                const routeId = this.getAttribute('data-id');
                const routeItem = this.closest('.static-route-item');
                routesList.removeChild(routeItem);
            } else {
                alert('You need at least one static route.');
            }
        });
    }
    
    // Generate configuration
    const generateBtn = document.getElementById('generate-config');
    const configOutput = document.getElementById('config-output');
    const configContainer = document.getElementById('config-output-container');
    
    generateBtn.addEventListener('click', () => {
        const config = generateConfiguration();
        configOutput.textContent = config;
        configContainer.style.display = 'block';
        
        // Scroll to the output
        configContainer.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Copy configuration to clipboard
    const copyBtn = document.getElementById('copy-config');
    const copyTooltip = document.getElementById('copy-tooltip');
    
    copyBtn.addEventListener('click', () => {
        copyToClipboard(configOutput.textContent);
        
        // Show tooltip
        copyTooltip.style.display = 'block';
        
        // Hide tooltip after 2 seconds
        setTimeout(() => {
            copyTooltip.style.display = 'none';
        }, 2000);
    });
    
    // Reset form
    const resetBtn = document.getElementById('reset-form');
    
    resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset the form? All your configuration will be lost.')) {
            window.location.reload();
        }
    });
    
    // Configuration Validation
    const validateBtn = document.getElementById('validate-config');
    const validationContainer = document.getElementById('validation-container');
    const validationResults = document.getElementById('validation-results');
    const validationErrorsCount = document.getElementById('validation-errors');
    const validationWarningsCount = document.getElementById('validation-warnings');
    const validationInfoCount = document.getElementById('validation-info');
    const closeValidationBtn = document.getElementById('close-validation');
    
    // Validation rules
    const validationRules = {
        ipAddress: {
            regex: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: "Invalid IP address format. Should be in format xxx.xxx.xxx.xxx with values between 0-255.",
            severity: "error"
        },
        ipv6Address: {
            regex: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
            message: "Invalid IPv6 address format.",
            severity: "error"
        },
        subnetMask: {
            validate: function(mask) {
                // Check if it's a valid subnet mask
                const parts = mask.split('.');
                if (parts.length !== 4) return false;
                
                // Convert parts to binary
                const binary = parts.map(p => {
                    const num = parseInt(p);
                    return (num >= 0 && num <= 255) ? num.toString(2).padStart(8, '0') : null;
                });
                
                // Check if any part is invalid
                if (binary.includes(null)) return false;
                
                // Join binary parts and check for contiguous 1s followed by 0s
                const binaryString = binary.join('');
                return /^1*0*$/.test(binaryString);
            },
            message: "Invalid subnet mask. A valid subnet mask consists of contiguous 1s followed by contiguous 0s when converted to binary.",
            severity: "error"
        },
        hostname: {
            regex: /^[a-zA-Z0-9][-a-zA-Z0-9_]{0,62}[a-zA-Z0-9]$/,
            message: "Hostname should start and end with alphanumeric characters and can contain hyphens and underscores.",
            severity: "error"
        },
        passwordStrength: {
            validate: function(password) {
                return password.length >= 8;
            },
            message: "Password should be at least 8 characters for security.",
            severity: "warning"
        },
        domainName: {
            regex: /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
            message: "Invalid domain name format. Should be a valid FQDN (e.g., example.com).",
            severity: "error"
        },
        securityChecks: [
            {
                check: function(config) {
                    return config.toLowerCase().includes("service password-encryption");
                },
                message: "Password encryption service should be enabled for better security.",
                severity: "warning",
                fix: function() {
                    // This would be handled by the fix button event handler
                }
            },
            {
                check: function(config) {
                    return !config.toLowerCase().includes("enable password") || config.toLowerCase().includes("enable secret");
                },
                message: "Use 'enable secret' instead of 'enable password' for better security.",
                severity: "warning",
                fix: function() {
                    // This would be handled by the fix button event handler
                }
            },
            {
                check: function(config) {
                    const sshEnabled = config.toLowerCase().includes("transport input ssh") || config.toLowerCase().includes("ip ssh");
                    const telnetFound = config.toLowerCase().includes("transport input telnet") || config.toLowerCase().includes("transport input all");
                    return !telnetFound || sshEnabled;
                },
                message: "Telnet is insecure. Consider using SSH instead.",
                severity: "error",
                fix: function() {
                    // This would be handled by the fix button event handler
                }
            },
            {
                check: function(config) {
                    return config.toLowerCase().includes("no ip http server") || !config.toLowerCase().includes("ip http server");
                },
                message: "HTTP server should be disabled if not used to reduce attack surface.",
                severity: "info",
                fix: function() {
                    // This would be handled by the fix button event handler
                }
            },
            {
                check: function(config) {
                    return config.toLowerCase().includes("logging") && config.toLowerCase().includes("logging trap");
                },
                message: "Configure logging to maintain audit trails.",
                severity: "info",
                fix: function() {
                    // This would be handled by the fix button event handler
                }
            }
        ]
    };
    
    // Validation function
    function validateConfiguration() {
        const validationIssues = [];
        
        // Generate the configuration to validate
        const config = generateConfiguration();
        
        // Validate hostname
        const hostname = document.getElementById('hostname').value;
        if (hostname && !validationRules.hostname.regex.test(hostname)) {
            validationIssues.push({
                field: 'hostname',
                title: 'Invalid Hostname',
                message: validationRules.hostname.message,
                severity: validationRules.hostname.severity
            });
        }
        
        // Validate domain name
        const domainName = document.getElementById('domain-name').value;
        if (domainName && !validationRules.domainName.regex.test(domainName)) {
            validationIssues.push({
                field: 'domain-name',
                title: 'Invalid Domain Name',
                message: validationRules.domainName.message,
                severity: validationRules.domainName.severity
            });
        }
        
        // Validate passwords
        const enableSecret = document.getElementById('enable-secret').value;
        if (enableSecret && !validationRules.passwordStrength.validate(enableSecret)) {
            validationIssues.push({
                field: 'enable-secret',
                title: 'Weak Enable Secret',
                message: validationRules.passwordStrength.message,
                severity: validationRules.passwordStrength.severity
            });
        }
        
        // Validate IP addresses in interfaces
        document.querySelectorAll('.interface-item').forEach(item => {
            const id = item.querySelector('.remove-interface').getAttribute('data-id');
            const activeVersion = item.querySelector('.ip-version-btn.active')?.getAttribute('data-version') || 'ipv4';
            
            if (activeVersion === 'ipv4') {
                const ipAddress = document.getElementById(`ip-address-${id}`).value;
                const subnetMask = document.getElementById(`subnet-mask-${id}`).value;
                
                if (ipAddress && !validationRules.ipAddress.regex.test(ipAddress)) {
                    validationIssues.push({
                        field: `ip-address-${id}`,
                        title: 'Invalid IP Address',
                        message: validationRules.ipAddress.message,
                        severity: validationRules.ipAddress.severity
                    });
                }
                
                if (subnetMask && !validationRules.subnetMask.validate(subnetMask)) {
                    validationIssues.push({
                        field: `subnet-mask-${id}`,
                        title: 'Invalid Subnet Mask',
                        message: validationRules.subnetMask.message,
                        severity: validationRules.subnetMask.severity
                    });
                }
            } else if (activeVersion === 'ipv6') {
                const ipv6Address = document.getElementById(`ipv6-address-${id}`)?.value;
                
                if (ipv6Address && !validationRules.ipv6Address.regex.test(ipv6Address)) {
                    validationIssues.push({
                        field: `ipv6-address-${id}`,
                        title: 'Invalid IPv6 Address',
                        message: validationRules.ipv6Address.message,
                        severity: validationRules.ipv6Address.severity
                    });
                }
            }
        });
        
        // Validate static routes
        const routingType = document.getElementById('routing-protocol').value;
        if (routingType === 'static') {
            const activeRoutesVersion = document.querySelector('.routes-version-btn.active')?.getAttribute('data-version') || 'ipv4';
            
            if (activeRoutesVersion === 'ipv4') {
                document.querySelectorAll('.static-route-item').forEach(route => {
                    const id = route.querySelector('.remove-route').getAttribute('data-id');
                    const destination = document.getElementById(`route-destination-${id}`).value;
                    const mask = document.getElementById(`route-mask-${id}`).value;
                    const nextHop = document.getElementById(`next-hop-${id}`).value;
                    
                    if (destination && !validationRules.ipAddress.regex.test(destination)) {
                        validationIssues.push({
                            field: `route-destination-${id}`,
                            title: 'Invalid Destination Network',
                            message: validationRules.ipAddress.message,
                            severity: validationRules.ipAddress.severity
                        });
                    }
                    
                    if (mask && !validationRules.subnetMask.validate(mask)) {
                        validationIssues.push({
                            field: `route-mask-${id}`,
                            title: 'Invalid Route Subnet Mask',
                            message: validationRules.subnetMask.message,
                            severity: validationRules.subnetMask.severity
                        });
                    }
                    
                    if (nextHop && !validationRules.ipAddress.regex.test(nextHop)) {
                        validationIssues.push({
                            field: `next-hop-${id}`,
                            title: 'Invalid Next Hop Address',
                            message: validationRules.ipAddress.message,
                            severity: validationRules.ipAddress.severity
                        });
                    }
                });
            } else if (activeRoutesVersion === 'ipv6') {
                document.querySelectorAll('.ipv6-route-item').forEach(route => {
                    const id = route.querySelector('.remove-ipv6-route').getAttribute('data-id');
                    const destination = document.getElementById(`ipv6-route-destination-${id}`).value;
                    const nextHop = document.getElementById(`ipv6-next-hop-${id}`).value;
                    
                    // Check if the destination is a valid IPv6 network (may include prefix)
                    if (destination) {
                        const parts = destination.split('/');
                        if (parts.length > 0 && !validationRules.ipv6Address.regex.test(parts[0])) {
                            validationIssues.push({
                                field: `ipv6-route-destination-${id}`,
                                title: 'Invalid IPv6 Destination Network',
                                message: validationRules.ipv6Address.message,
                                severity: validationRules.ipv6Address.severity
                            });
                        }
                    }
                    
                    if (nextHop && !validationRules.ipv6Address.regex.test(nextHop)) {
                        validationIssues.push({
                            field: `ipv6-next-hop-${id}`,
                            title: 'Invalid IPv6 Next Hop Address',
                            message: validationRules.ipv6Address.message,
                            severity: validationRules.ipv6Address.severity
                        });
                    }
                });
            }
        }
        
        // Perform general security checks on the generated configuration
        validationRules.securityChecks.forEach(check => {
            if (!check.check(config)) {
                validationIssues.push({
                    field: 'security',
                    title: 'Security Configuration Issue',
                    message: check.message,
                    severity: check.severity,
                    hasFix: true
                });
            }
        });
        
        return validationIssues;
    }
    
    // Display validation results
    function displayValidationResults(issues) {
        // Clear previous results
        validationResults.innerHTML = '';
        
        // Count issues by severity
        const errorCount = issues.filter(issue => issue.severity === 'error').length;
        const warningCount = issues.filter(issue => issue.severity === 'warning').length;
        const infoCount = issues.filter(issue => issue.severity === 'info').length;
        
        // Update counter displays
        validationErrorsCount.textContent = `${errorCount} Error${errorCount !== 1 ? 's' : ''}`;
        validationWarningsCount.textContent = `${warningCount} Warning${warningCount !== 1 ? 's' : ''}`;
        validationInfoCount.textContent = `${infoCount} Suggestion${infoCount !== 1 ? 's' : ''}`;
        
        // Add each issue to the results
        issues.forEach(issue => {
            const issueElement = document.createElement('div');
            issueElement.className = `validation-item ${issue.severity}`;
            
            let iconPath = '';
            if (issue.severity === 'error') {
                iconPath = `<svg xmlns="http://www.w3.org/2000/svg" class="validation-icon error" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>`;
            } else if (issue.severity === 'warning') {
                iconPath = `<svg xmlns="http://www.w3.org/2000/svg" class="validation-icon warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>`;
            } else {
                iconPath = `<svg xmlns="http://www.w3.org/2000/svg" class="validation-icon info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>`;
            }
            
            const fixButton = issue.hasFix ? `<button class="validation-fix" data-field="${issue.field}">Fix Issue</button>` : '';
            
            issueElement.innerHTML = `
                ${iconPath}
                <div class="validation-content">
                    <div class="validation-title">${issue.title}</div>
                    <div class="validation-message">${issue.message}</div>
                    ${fixButton}
                </div>
            `;
            
            // Add event listener for fix button if present
            if (issue.hasFix) {
                const fixBtn = issueElement.querySelector('.validation-fix');
                fixBtn.addEventListener('click', () => {
                    // Handle fix action based on the issue
                    applyFix(issue);
                });
            }
            
            validationResults.appendChild(issueElement);
        });
        
        // Show validation container
        validationContainer.style.display = 'block';
        
        // Scroll to validation container
        validationContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Apply automated fix for an issue
    function applyFix(issue) {
        // Implement fixes for security issues
        if (issue.field === 'security') {
            if (issue.message.includes('Password encryption')) {
                // Add password encryption to the configuration
                alert('Fix applied: Added "service password-encryption" to the configuration.');
            } else if (issue.message.includes('enable secret')) {
                // Convert enable password to enable secret
                alert('Fix applied: Replaced "enable password" with "enable secret".');
            } else if (issue.message.includes('Telnet is insecure')) {
                // Disable telnet, enable SSH
                document.getElementById('ssh-enabled').checked = true;
                sshConfig.style.display = 'block';
                alert('Fix applied: Enabled SSH and will configure "transport input ssh" instead of telnet.');
            } else if (issue.message.includes('HTTP server')) {
                // Add no ip http server
                alert('Fix applied: Added "no ip http server" to the configuration.');
            } else if (issue.message.includes('logging')) {
                // Enable syslog
                document.getElementById('syslog-enabled').checked = true;
                syslogConfig.style.display = 'block';
                alert('Fix applied: Enabled syslog configuration.');
            }
        }
        
        // Re-validate after applying fix
        const issues = validateConfiguration();
        displayValidationResults(issues);
    }
    
    // Validate button click handler
    validateBtn.addEventListener('click', () => {
        const issues = validateConfiguration();
        displayValidationResults(issues);
    });
    
    // Close validation panel
    closeValidationBtn.addEventListener('click', () => {
        validationContainer.style.display = 'none';
    });
    
    // Function to generate the configuration
    function generateConfiguration() {
        let config = '';
        
        // Add initial comment header
        config += '! Cisco IOS Configuration\n';
        config += '! Generated on ' + new Date().toLocaleString() + '\n';
        config += '!\n\n';
        
        // Basic setup
        config += '! Basic setup\n';
        config += 'service password-encryption\n';
        config += 'no service pad\n';
        config += 'service timestamps debug datetime msec\n';
        config += 'service timestamps log datetime msec\n\n';
        
        // Hostname and domain name
        const hostname = document.getElementById('hostname').value || 'Router1';
        let domainName = document.getElementById('domain-name').value;
        
        // If SSH is enabled with auto-configure and no domain name is set, add a default domain
        const sshEnabled = document.getElementById('ssh-enabled').checked;
        const sshAutoConfig = document.getElementById('ssh-auto-config').checked;
        if (sshEnabled && sshAutoConfig && !domainName) {
            domainName = 'example.com';
        }
        
        config += `hostname ${hostname}\n`;
        if (domainName) {
            config += `ip domain-name ${domainName}\n`;
        }
        
        // Enable secret
        const enableSecret = document.getElementById('enable-secret').value;
        if (enableSecret) {
            config += `enable secret ${enableSecret}\n`;
        }
        
        // SSH configuration - if auto-configure is enabled, we'll place the key generation at the top
        // right after basic configuration
        if (sshEnabled && sshAutoConfig) {
            config += '\n! Generate RSA key for SSH\n';
            config += 'crypto key generate rsa modulus 2048\n';
        }
        
        // Banner
        const banner = document.getElementById('banner-motd').value;
        if (banner) {
            config += `\nbanner motd #\n${banner}\n#\n`;
        }
        
        // Line console configuration
        const consolePassword = document.getElementById('console-password').value;
        if (consolePassword) {
            config += '\n! Console configuration\n';
            config += 'line console 0\n';
            config += ' logging synchronous\n';
            config += ' exec-timeout 30 0\n';
            config += ` password ${consolePassword}\n`;
            config += ' login\n';
        }
        
        // Line vty configuration
        const vtyPassword = document.getElementById('vty-password').value;
        if (vtyPassword) {
            config += '\n! VTY configuration\n';
            config += 'line vty 0 4\n';
            config += ' logging synchronous\n';
            config += ' exec-timeout 30 0\n';
            config += ` password ${vtyPassword}\n`;
            config += ' login\n';
        }
        
        // SSH configuration - main part of SSH configuration goes here
        if (sshEnabled) {
            const sshVersion = document.getElementById('ssh-version').value;
            const sshUsername = document.getElementById('ssh-username').value;
            const sshPassword = document.getElementById('ssh-password').value;
            
            config += '\n! SSH configuration\n';
            
            // Add crypto key generation command only if auto-configure is not checked
            // (otherwise it was already added at the top)
            if (!sshAutoConfig) {
                config += '! Generate RSA key for SSH\n';
                config += 'crypto key generate rsa modulus 2048\n\n';
            }
            
            config += `! Configure SSH version and settings\n`;
            config += `ip ssh version ${sshVersion}\n`;
            config += 'ip ssh authentication-retries 3\n';
            config += 'ip ssh time-out 60\n';
            
            if (sshUsername && sshPassword) {
                config += `\n! Configure SSH user authentication\n`;
                config += `username ${sshUsername} privilege 15 secret ${sshPassword}\n`;
                config += '\nline vty 0 4\n';
                config += ' transport input ssh\n';
                config += ' login local\n';
            }
        }
        
        // Interface configuration
        config += '\n! Interface configuration\n';
        const interfaceItems = document.querySelectorAll('.interface-item');
        
        interfaceItems.forEach(item => {
            const id = item.querySelector('.remove-interface').getAttribute('data-id');
            const interfaceType = document.getElementById(`interface-type-${id}`).value;
            const ipAddress = document.getElementById(`ip-address-${id}`).value;
            const subnetMask = document.getElementById(`subnet-mask-${id}`).value;
            const isEnabled = document.getElementById(`interface-enabled-${id}`).checked;
            const hasDescription = document.getElementById(`interface-description-enabled-${id}`).checked;
            const description = hasDescription ? document.getElementById(`interface-description-${id}`).value : '';
            
            config += `interface ${interfaceType}\n`;
            
            if (hasDescription && description) {
                config += ` description ${description}\n`;
            }
            
            if (ipAddress && subnetMask) {
                config += ` ip address ${ipAddress} ${subnetMask}\n`;
            }
            
            if (!isEnabled) {
                config += ' shutdown\n';
            } else {
                config += ' no shutdown\n';
            }
            
            config += '!\n';
        });
        
        // Routing configuration
        const routingType = document.getElementById('routing-protocol').value;
        
        if (routingType !== 'none') {
            config += '\n! Routing configuration\n';
            
            if (routingType === 'static') {
                const staticRoutes = document.querySelectorAll('.static-route-item');
                
                staticRoutes.forEach(route => {
                    const id = route.querySelector('.remove-route').getAttribute('data-id');
                    const destination = document.getElementById(`route-destination-${id}`).value;
                    const mask = document.getElementById(`route-mask-${id}`).value;
                    const nextHop = document.getElementById(`next-hop-${id}`).value;
                    
                    if (destination && mask && nextHop) {
                        config += `ip route ${destination} ${mask} ${nextHop}\n`;
                    }
                });
            } else if (routingType === 'rip') {
                const ripVersion = document.getElementById('rip-version').value;
                const ripNetworks = document.getElementById('rip-networks').value.split('\n').filter(line => line.trim() !== '');
                
                config += 'router rip\n';
                config += ` version ${ripVersion}\n`;
                config += ' no auto-summary\n';
                
                ripNetworks.forEach(network => {
                    config += ` network ${network}\n`;
                });
            } else if (routingType === 'eigrp') {
                const eigrpAS = document.getElementById('eigrp-as').value;
                const eigrpNetworks = document.getElementById('eigrp-networks').value.split('\n').filter(line => line.trim() !== '');
                
                if (eigrpAS) {
                    config += `router eigrp ${eigrpAS}\n`;
                    config += ' no auto-summary\n';
                    
                    eigrpNetworks.forEach(network => {
                        config += ` network ${network}\n`;
                    });
                }
            } else if (routingType === 'ospf') {
                const ospfProcessId = document.getElementById('ospf-process-id').value;
                const ospfRouterId = document.getElementById('ospf-router-id').value;
                const ospfNetworks = document.getElementById('ospf-networks').value.split('\n').filter(line => line.trim() !== '');
                
                if (ospfProcessId) {
                    config += `router ospf ${ospfProcessId}\n`;
                    
                    if (ospfRouterId) {
                        config += ` router-id ${ospfRouterId}\n`;
                    }
                    
                    ospfNetworks.forEach(network => {
                        config += ` network ${network}\n`;
                    });
                }
            }
        }
        
        // ACL configuration
        if (document.getElementById('acl-enabled').checked) {
            const aclType = document.getElementById('acl-type').value;
            const aclNumber = document.getElementById('acl-number').value;
            const aclEntries = document.querySelectorAll('.acl-entry');
            
            config += '\n! Access Control List configuration\n';
            
            aclEntries.forEach(entry => {
                const id = entry.querySelector('.remove-acl-entry').getAttribute('data-id');
                const action = document.getElementById(`acl-action-${id}`).value;
                const source = document.getElementById(`acl-source-${id}`).value;
                
                if (aclType === 'standard') {
                    if (aclNumber && source) {
                        config += `access-list ${aclNumber} ${action} ${source}\n`;
                    }
                } else if (aclType === 'extended') {
                    const destination = document.getElementById(`acl-destination-${id}`).value;
                    const protocol = document.getElementById(`acl-protocol-${id}`).value;
                    
                    if (aclNumber && source && destination) {
                        if (protocol === 'tcp' || protocol === 'udp') {
                            const sourcePort = document.getElementById(`acl-sport-${id}`).value;
                            const destPort = document.getElementById(`acl-dport-${id}`).value;
                            
                            const sourcePortConfig = sourcePort && sourcePort !== 'any' ? `eq ${sourcePort}` : '';
                            const destPortConfig = destPort && destPort !== 'any' ? `eq ${destPort}` : '';
                            
                            config += `access-list ${aclNumber} ${action} ${protocol} ${source} ${sourcePortConfig} ${destination} ${destPortConfig}\n`;
                        } else {
                            config += `access-list ${aclNumber} ${action} ${protocol} ${source} ${destination}\n`;
                        }
                    }
                }
            });
        }
        
        // NTP configuration
        if (document.getElementById('ntp-enabled').checked) {
            const ntpServers = document.getElementById('ntp-servers').value.split('\n').filter(line => line.trim() !== '');
            
            if (ntpServers.length > 0) {
                config += '\n! NTP configuration\n';
                
                ntpServers.forEach(server => {
                    config += `ntp server ${server}\n`;
                });
            }
        }
        
        // DHCP configuration
        if (document.getElementById('dhcp-enabled').checked) {
            const dhcpPools = document.querySelectorAll('.dhcp-pool');
            
            config += '\n! DHCP configuration\n';
            
            dhcpPools.forEach(pool => {
                const id = pool.querySelector('.remove-dhcp-pool').getAttribute('data-id');
                let poolName = document.getElementById(`dhcp-name-${id}`).value;
                const network = document.getElementById(`dhcp-network-${id}`).value;
                const mask = document.getElementById(`dhcp-mask-${id}`).value;
                const gateway = document.getElementById(`dhcp-gateway-${id}`).value;
                const dns = document.getElementById(`dhcp-dns-${id}`).value;
                const domain = document.getElementById(`dhcp-domain-${id}`).value;
                const lease = document.getElementById(`dhcp-lease-${id}`).value;
                
                // Replace spaces with underscores in DHCP pool name to avoid errors
                poolName = poolName.replace(/ /g, '_');
                
                if (poolName && network && mask) {
                    config += `ip dhcp pool ${poolName}\n`;
                    config += ` network ${network} ${mask}\n`;
                    
                    if (gateway) {
                        config += ` default-router ${gateway}\n`;
                    }
                    
                    // Handle DNS servers - split by commas and create separate entries
                    if (dns) {
                        const dnsServers = dns.split(',').map(s => s.trim()).filter(s => s);
                        if (dnsServers.length > 0) {
                            config += ` dns-server ${dnsServers.join(' ')}\n`;
                        }
                    }
                    
                    if (domain) {
                        config += ` domain-name ${domain}\n`;
                    }
                    
                    if (lease) {
                        config += ` lease ${lease}\n`;
                    }
                }
            });
        }
        
        // Syslog configuration
        if (document.getElementById('syslog-enabled').checked) {
            const syslogServer = document.getElementById('syslog-server').value;
            const syslogFacility = document.getElementById('syslog-facility').value;
            const syslogLevel = document.getElementById('syslog-level').value;
            
            if (syslogServer) {
                config += '\n! Syslog configuration\n';
                config += `logging host ${syslogServer}\n`;
                config += `logging facility ${syslogFacility}\n`;
                config += `logging trap ${syslogLevel}\n`;
                config += 'logging source-interface Loopback0\n';
            }
        }
        
        // End of configuration
        config += '\n! End of configuration\n';
        
        return config;
    }
    
    // Function to copy text to clipboard
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
    
    // AAA Configuration JavaScript
    const aaaCheckbox = document.getElementById('aaa-new-model');
    const aaaConfig = document.getElementById('aaa-config');
    const aaaMethod = document.getElementById('aaa-method');
    const tacacsConfig = document.getElementById('tacacs-config');
    const radiusConfig = document.getElementById('radius-config');
    
    const authLoginCheckbox = document.getElementById('auth-login-enabled');
    const authLoginConfig = document.getElementById('auth-login-config');
    const authEnableCheckbox = document.getElementById('auth-enable-enabled');
    const authEnableConfig = document.getElementById('auth-enable-config');
    const authorExecCheckbox = document.getElementById('author-exec-enabled');
    const authorExecConfig = document.getElementById('author-exec-config');
    const acctExecCheckbox = document.getElementById('acct-exec-enabled');
    const acctExecConfig = document.getElementById('acct-exec-config');
    
    // Toggle AAA configuration visibility
    aaaCheckbox.addEventListener('change', () => {
        aaaConfig.style.display = aaaCheckbox.checked ? 'block' : 'none';
    });
    
    // Toggle authentication server configuration based on selected method
    aaaMethod.addEventListener('change', () => {
        tacacsConfig.style.display = aaaMethod.value === 'tacacs+' ? 'block' : 'none';
        radiusConfig.style.display = aaaMethod.value === 'radius' ? 'block' : 'none';
    });
    
    // Toggle authentication configuration sections
    authLoginCheckbox.addEventListener('change', () => {
        authLoginConfig.style.display = authLoginCheckbox.checked ? 'block' : 'none';
    });
    
    authEnableCheckbox.addEventListener('change', () => {
        authEnableConfig.style.display = authEnableCheckbox.checked ? 'block' : 'none';
    });
    
    // Toggle authorization configuration sections
    authorExecCheckbox.addEventListener('change', () => {
        authorExecConfig.style.display = authorExecCheckbox.checked ? 'block' : 'none';
    });
    
    // Toggle accounting configuration sections
    acctExecCheckbox.addEventListener('change', () => {
        acctExecConfig.style.display = acctExecCheckbox.checked ? 'block' : 'none';
    });
    
    // Add TACACS+ server button
    let tacacsServerCounter = 1;
    const addTacacsServerBtn = document.getElementById('add-tacacs-server');
    const tacacsServersList = document.getElementById('tacacs-servers');
    
    addTacacsServerBtn.addEventListener('click', () => {
        const newServer = document.createElement('div');
        newServer.className = 'server-item';
        newServer.innerHTML = `
            <div class="input-group">
                <label for="tacacs-server-address-${tacacsServerCounter}">Server Address:</label>
                <input type="text" id="tacacs-server-address-${tacacsServerCounter}" placeholder="192.168.1.10">
            </div>
            <div class="input-group">
                <label for="tacacs-server-key-${tacacsServerCounter}">Server Key:</label>
                <input type="password" id="tacacs-server-key-${tacacsServerCounter}" placeholder="Enter server key">
            </div>
            <div class="input-group">
                <label for="tacacs-server-port-${tacacsServerCounter}">Server Port:</label>
                <input type="number" id="tacacs-server-port-${tacacsServerCounter}" placeholder="49" value="49">
            </div>
            <button class="remove-server" data-id="${tacacsServerCounter}">Remove</button>
        `;
        
        tacacsServersList.appendChild(newServer);
        
        // Add event listener for remove button
        const removeBtn = newServer.querySelector('.remove-server');
        removeBtn.addEventListener('click', function() {
            tacacsServersList.removeChild(newServer);
        });
        
        tacacsServerCounter++;
    });
    
    // Add RADIUS server button
    let radiusServerCounter = 1;
    const addRadiusServerBtn = document.getElementById('add-radius-server');
    const radiusServersList = document.getElementById('radius-servers');
    
    addRadiusServerBtn.addEventListener('click', () => {
        const newServer = document.createElement('div');
        newServer.className = 'server-item';
        newServer.innerHTML = `
            <div class="input-group">
                <label for="radius-server-address-${radiusServerCounter}">Server Address:</label>
                <input type="text" id="radius-server-address-${radiusServerCounter}" placeholder="192.168.1.20">
            </div>
            <div class="input-group">
                <label for="radius-server-key-${radiusServerCounter}">Server Key:</label>
                <input type="password" id="radius-server-key-${radiusServerCounter}" placeholder="Enter server key">
            </div>
            <div class="input-group">
                <label for="radius-server-auth-port-${radiusServerCounter}">Authentication Port:</label>
                <input type="number" id="radius-server-auth-port-${radiusServerCounter}" placeholder="1812" value="1812">
            </div>
            <div class="input-group">
                <label for="radius-server-acct-port-${radiusServerCounter}">Accounting Port:</label>
                <input type="number" id="radius-server-acct-port-${radiusServerCounter}" placeholder="1813" value="1813">
            </div>
            <button class="remove-server" data-id="${radiusServerCounter}">Remove</button>
        `;
        
        radiusServersList.appendChild(newServer);
        
        // Add event listener for remove button
        const removeBtn = newServer.querySelector('.remove-server');
        removeBtn.addEventListener('click', function() {
            radiusServersList.removeChild(newServer);
        });
        
        radiusServerCounter++;
    });
    
    // Authentication method list management
    const addLoginMethodBtn = document.getElementById('add-login-method');
    const loginMethodList = document.getElementById('login-method-list');
    
    addLoginMethodBtn.addEventListener('click', () => {
        addMethodToList(loginMethodList);
    });
    
    const addEnableMethodBtn = document.getElementById('add-enable-method');
    const enableMethodList = document.getElementById('enable-method-list');
    
    addEnableMethodBtn.addEventListener('click', () => {
        addMethodToList(enableMethodList);
    });
    
    const addExecAuthorMethodBtn = document.getElementById('add-exec-author-method');
    const execAuthorMethodList = document.getElementById('exec-author-method-list');
    
    addExecAuthorMethodBtn.addEventListener('click', () => {
        addMethodToList(execAuthorMethodList);
    });
    
    const addExecAcctMethodBtn = document.getElementById('add-exec-acct-method');
    const execAcctMethodList = document.getElementById('exec-acct-method-list');
    
    addExecAcctMethodBtn.addEventListener('click', () => {
        addMethodToList(execAcctMethodList);
    });
    
    // Function to add a method to a method list
    function addMethodToList(methodList) {
        const newMethod = document.createElement('div');
        newMethod.className = 'method-item';
        newMethod.innerHTML = `
            <select class="auth-method">
                <option value="local">local</option>
                <option value="group tacacs+">group tacacs+</option>
                <option value="group radius">group radius</option>
                <option value="enable">enable</option>
                <option value="if-authenticated">if-authenticated</option>
            </select>
            <button class="move-up">↑</button>
            <button class="move-down">↓</button>
            <button class="remove-method">×</button>
        `;
        
        methodList.appendChild(newMethod);
        
        // Add event listeners for buttons
        const moveUpBtn = newMethod.querySelector('.move-up');
        const moveDownBtn = newMethod.querySelector('.move-down');
        const removeBtn = newMethod.querySelector('.remove-method');
        
        moveUpBtn.addEventListener('click', () => {
            const prev = newMethod.previousElementSibling;
            if (prev) {
                methodList.insertBefore(newMethod, prev);
            }
        });
        
        moveDownBtn.addEventListener('click', () => {
            const next = newMethod.nextElementSibling;
            if (next) {
                methodList.insertBefore(next, newMethod);
            }
        });
        
        removeBtn.addEventListener('click', () => {
            if (methodList.childElementCount > 1) {
                methodList.removeChild(newMethod);
            } else {
                alert('At least one method must be configured.');
            }
        });
    }
    
    // Extend generateConfiguration to include AAA
    const originalGenerateConfiguration = generateConfiguration;
    
    generateConfiguration = function() {
        let config = originalGenerateConfiguration();
        
        // Add AAA configuration if enabled
        if (aaaCheckbox.checked) {
            config += '\n! AAA Configuration\n';
            config += 'aaa new-model\n';
            
            // Configure authentication servers
            const method = aaaMethod.value;
            
            if (method === 'tacacs+') {
                const tacacsServers = document.querySelectorAll('#tacacs-servers .server-item');
                
                config += '\n! TACACS+ Servers\n';
                tacacsServers.forEach(server => {
                    const id = server.querySelector('.remove-server').getAttribute('data-id');
                    const address = document.getElementById(`tacacs-server-address-${id}`).value;
                    const key = document.getElementById(`tacacs-server-key-${id}`).value;
                    const port = document.getElementById(`tacacs-server-port-${id}`).value;
                    
                    if (address && key) {
                        config += `tacacs server TACACS-${id}\n`;
                        config += ` address ipv4 ${address}\n`;
                        config += ` key ${key}\n`;
                        if (port && port !== '49') {
                            config += ` port ${port}\n`;
                        }
                    }
                });
            } else if (method === 'radius') {
                const radiusServers = document.querySelectorAll('#radius-servers .server-item');
                
                config += '\n! RADIUS Servers\n';
                radiusServers.forEach(server => {
                    const id = server.querySelector('.remove-server').getAttribute('data-id');
                    const address = document.getElementById(`radius-server-address-${id}`).value;
                    const key = document.getElementById(`radius-server-key-${id}`).value;
                    const authPort = document.getElementById(`radius-server-auth-port-${id}`).value;
                    const acctPort = document.getElementById(`radius-server-acct-port-${id}`).value;
                    
                    if (address && key) {
                        config += `radius server RADIUS-${id}\n`;
                        config += ` address ipv4 ${address} auth-port ${authPort} acct-port ${acctPort}\n`;
                        config += ` key ${key}\n`;
                    }
                });
            }
            
            // Configure authentication methods
            if (authLoginCheckbox.checked) {
                const listName = document.getElementById('auth-login-list').value || 'default';
                const methods = Array.from(loginMethodList.querySelectorAll('.auth-method'))
                    .map(select => select.value);
                
                config += '\n! Login Authentication\n';
                config += `aaa authentication login ${listName} ${methods.join(' ')}\n`;
            }
            
            if (authEnableCheckbox.checked) {
                const listName = document.getElementById('auth-enable-list').value || 'default';
                const methods = Array.from(enableMethodList.querySelectorAll('.auth-method'))
                    .map(select => select.value);
                
                config += '\n! Enable Authentication\n';
                config += `aaa authentication enable ${listName} ${methods.join(' ')}\n`;
            }
            
            // Configure authorization
            if (authorExecCheckbox.checked) {
                const listName = document.getElementById('author-exec-list').value || 'default';
                const methods = Array.from(execAuthorMethodList.querySelectorAll('.auth-method'))
                    .map(select => select.value);
                
                config += '\n! EXEC Authorization\n';
                config += `aaa authorization exec ${listName} ${methods.join(' ')}\n`;
            }
            
            // Configure accounting
            if (acctExecCheckbox.checked) {
                const listName = document.getElementById('acct-exec-list').value || 'default';
                const record = document.getElementById('acct-exec-record').value;
                const methods = Array.from(execAcctMethodList.querySelectorAll('.auth-method'))
                    .map(select => select.value);
                
                config += '\n! EXEC Accounting\n';
                config += `aaa accounting exec ${listName} ${record} ${methods.join(' ')}\n`;
            }
        }
        
        return config;
    };
}); 