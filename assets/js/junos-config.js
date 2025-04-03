document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => content.style.display = 'none');
            
            // Show the selected tab content
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-content`).style.display = 'block';
        });
    });
    
    // Toggle sections based on checkboxes
    const toggleSections = [
        { checkbox: 'interface-description-enabled', section: 'description-group' },
        { checkbox: 'ipv6-enabled', section: 'ipv6-config' },
        { checkbox: 'vlan-enabled', section: 'vlan-config' },
        { checkbox: 'firewall-filter-enabled', section: 'firewall-filter-config' },
        { checkbox: 'zones-enabled', section: 'zones-config' },
        { checkbox: 'ntp-enabled', section: 'ntp-config' },
        { checkbox: 'ntp-source-interface-enabled', section: 'ntp-source-interface-group' },
        { checkbox: 'dhcp-server-enabled', section: 'dhcp-server-config' },
        { checkbox: 'syslog-enabled', section: 'syslog-config' },
        { checkbox: 'snmp-enabled', section: 'snmp-config' },
        { checkbox: 'policy-options-enabled', section: 'policy-options-config' },
        { checkbox: 'cos-enabled', section: 'cos-config' },
        { checkbox: 'routing-policy-prefix-list-enabled', section: 'routing-policy-prefix-list-group' },
        { checkbox: 'bgp-peer-import-policy-enabled', section: 'bgp-peer-import-policy' },
        { checkbox: 'bgp-peer-export-policy-enabled', section: 'bgp-peer-export-policy' }
    ];
    
    // Set up toggle sections
    toggleSections.forEach(item => {
        const checkbox = document.getElementById(item.checkbox + '-0');
        if (checkbox) {
            const section = document.getElementById(item.section + '-0');
            if (section) {
                checkbox.addEventListener('change', () => {
                    section.style.display = checkbox.checked ? 'block' : 'none';
                });
            }
        }
        
        // Also set up the base checkbox without an index (for global sections)
        const baseCheckbox = document.getElementById(item.checkbox);
        if (baseCheckbox) {
            const baseSection = document.getElementById(item.section);
            if (baseSection) {
                baseCheckbox.addEventListener('change', () => {
                    baseSection.style.display = baseCheckbox.checked ? 'block' : 'none';
                });
            }
        }
    });
    
    const staticEnabledCheck = document.getElementById('static-enabled');
    const ospfEnabledCheck = document.getElementById('ospf-enabled');
    const bgpEnabledCheck = document.getElementById('bgp-enabled');
    
    const staticRoutesConfig = document.getElementById('static-routes-config');
    const ospfConfig = document.getElementById('ospf-config');
    const bgpConfig = document.getElementById('bgp-config');
    
    if (staticEnabledCheck && staticRoutesConfig) {
        staticEnabledCheck.addEventListener('change', () => {
            staticRoutesConfig.style.display = staticEnabledCheck.checked ? 'block' : 'none';
        });
    }
    
    if (ospfEnabledCheck && ospfConfig) {
        ospfEnabledCheck.addEventListener('change', () => {
            ospfConfig.style.display = ospfEnabledCheck.checked ? 'block' : 'none';
        });
    }
    
    if (bgpEnabledCheck && bgpConfig) {
        bgpEnabledCheck.addEventListener('change', () => {
            bgpConfig.style.display = bgpEnabledCheck.checked ? 'block' : 'none';
        });
    }
    
    // Handle protocol-specific toggles
    const termProtocolSelect = document.getElementById('term-protocol-0');
    const portFields = document.getElementById('port-fields-0');
    
    if (termProtocolSelect && portFields) {
        termProtocolSelect.addEventListener('change', () => {
            if (termProtocolSelect.value === 'tcp' || termProtocolSelect.value === 'udp') {
                portFields.style.display = 'block';
            } else {
                portFields.style.display = 'none';
            }
        });
    }
    
    // Interface management
    let interfaceCounter = 1;
    const addInterfaceBtn = document.getElementById('add-interface');
    const interfacesList = document.getElementById('interfaces-list');
    
    if (addInterfaceBtn && interfacesList) {
        addInterfaceBtn.addEventListener('click', () => {
            const newInterface = document.createElement('div');
            newInterface.className = 'interface-item';
            newInterface.innerHTML = `
                <div class="interface-header">
                    <div class="input-group">
                        <label for="interface-type-${interfaceCounter}">Interface:</label>
                        <select id="interface-type-${interfaceCounter}" class="interface-type-select">
                            <option value="ge-0/0/0">ge-0/0/0</option>
                            <option value="ge-0/0/1">ge-0/0/1</option>
                            <option value="xe-0/0/0">xe-0/0/0</option>
                            <option value="xe-0/0/1">xe-0/0/1</option>
                            <option value="et-0/0/0">et-0/0/0</option>
                            <option value="lo0">lo0</option>
                            <option value="em0">em0</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                    <div class="input-group custom-interface-name" id="custom-interface-name-${interfaceCounter}" style="display: none;">
                        <label for="custom-interface-value-${interfaceCounter}">Custom Interface Name:</label>
                        <input type="text" id="custom-interface-value-${interfaceCounter}" placeholder="Enter interface name (e.g., ae0)">
                    </div>
                    <button class="remove-interface" data-id="${interfaceCounter}">Remove</button>
                </div>
                <div class="interface-config">
                    <div class="input-group">
                        <label for="unit-number-${interfaceCounter}">Unit Number:</label>
                        <input type="number" id="unit-number-${interfaceCounter}" placeholder="0" value="0" min="0" max="16385">
                    </div>
                    <div class="input-group">
                        <label for="ip-address-${interfaceCounter}">IP Address:</label>
                        <input type="text" id="ip-address-${interfaceCounter}" placeholder="192.168.1.1">
                    </div>
                    <div class="input-group">
                        <label for="prefix-length-${interfaceCounter}">Prefix Length:</label>
                        <input type="number" id="prefix-length-${interfaceCounter}" placeholder="24" value="24" min="1" max="32">
                    </div>
                    <div class="checkbox-group">
                        <input type="checkbox" id="ipv6-enabled-${interfaceCounter}">
                        <label for="ipv6-enabled-${interfaceCounter}">Configure IPv6</label>
                    </div>
                    <div class="ipv6-config" id="ipv6-config-${interfaceCounter}" style="display: none;">
                        <div class="input-group">
                            <label for="ipv6-address-${interfaceCounter}">IPv6 Address:</label>
                            <input type="text" id="ipv6-address-${interfaceCounter}" placeholder="2001:db8::1">
                        </div>
                        <div class="input-group">
                            <label for="ipv6-prefix-length-${interfaceCounter}">Prefix Length:</label>
                            <input type="number" id="ipv6-prefix-length-${interfaceCounter}" placeholder="64" value="64" min="1" max="128">
                        </div>
                    </div>
                    <div class="checkbox-group">
                        <input type="checkbox" id="interface-description-enabled-${interfaceCounter}">
                        <label for="interface-description-enabled-${interfaceCounter}">Add Description</label>
                    </div>
                    <div class="input-group description-input" id="description-group-${interfaceCounter}" style="display: none;">
                        <label for="interface-description-${interfaceCounter}">Description:</label>
                        <input type="text" id="interface-description-${interfaceCounter}" placeholder="LAN Interface">
                    </div>
                    <div class="checkbox-group">
                        <input type="checkbox" id="vlan-enabled-${interfaceCounter}">
                        <label for="vlan-enabled-${interfaceCounter}">Configure VLAN</label>
                    </div>
                    <div class="vlan-config" id="vlan-config-${interfaceCounter}" style="display: none;">
                        <div class="input-group">
                            <label for="vlan-id-${interfaceCounter}">VLAN ID:</label>
                            <input type="number" id="vlan-id-${interfaceCounter}" placeholder="10" min="1" max="4094">
                        </div>
                    </div>
                </div>
            `;
            
            interfacesList.appendChild(newInterface);
            
            // Set up listeners for the new interface
            const ipv6Checkbox = document.getElementById(`ipv6-enabled-${interfaceCounter}`);
            ipv6Checkbox.addEventListener('change', function() {
                const ipv6Config = document.getElementById(`ipv6-config-${interfaceCounter}`);
                ipv6Config.style.display = this.checked ? 'block' : 'none';
            });
            
            const descCheckbox = document.getElementById(`interface-description-enabled-${interfaceCounter}`);
            descCheckbox.addEventListener('change', function() {
                const descGroup = document.getElementById(`description-group-${interfaceCounter}`);
                descGroup.style.display = this.checked ? 'block' : 'none';
            });
            
            const vlanCheckbox = document.getElementById(`vlan-enabled-${interfaceCounter}`);
            vlanCheckbox.addEventListener('change', function() {
                const vlanConfig = document.getElementById(`vlan-config-${interfaceCounter}`);
                vlanConfig.style.display = this.checked ? 'block' : 'none';
            });
            
            const removeBtn = newInterface.querySelector('.remove-interface');
            removeBtn.addEventListener('click', function() {
                if (document.querySelectorAll('.interface-item').length > 1) {
                    interfacesList.removeChild(newInterface);
                } else {
                    alert('You need at least one interface.');
                }
            });
            
            // Set up custom interface listener
            const interfaceTypeSelect = document.getElementById(`interface-type-${interfaceCounter}`);
            interfaceTypeSelect.addEventListener('change', function() {
                const customInterfaceField = document.getElementById(`custom-interface-name-${interfaceCounter}`);
                customInterfaceField.style.display = this.value === 'custom' ? 'block' : 'none';
            });
            
            // Update select dropdowns that need interface references
            updateInterfaceSelects();
            
            interfaceCounter++;
        });
        
        // Add event listener to the first interface's remove button
        const firstInterfaceRemoveBtn = document.querySelector('.remove-interface');
        if (firstInterfaceRemoveBtn) {
            firstInterfaceRemoveBtn.addEventListener('click', function() {
                // Don't remove if it's the only one remaining
                if (document.querySelectorAll('.interface-item').length > 1) {
                    const interfaceId = this.getAttribute('data-id');
                    const interfaceItem = this.closest('.interface-item');
                    interfacesList.removeChild(interfaceItem);
                } else {
                    alert('You need at least one interface.');
                }
            });
        }
    }
    
    // Static Routes management
    let routeCounter = 1;
    const addStaticRouteBtn = document.getElementById('add-static-route');
    const staticRoutesList = document.getElementById('static-routes-list');
    
    if (addStaticRouteBtn && staticRoutesList) {
        addStaticRouteBtn.addEventListener('click', () => {
            const newRoute = document.createElement('div');
            newRoute.className = 'static-route-item';
            newRoute.innerHTML = `
                <div class="input-group">
                    <label for="route-destination-${routeCounter}">Destination Network:</label>
                    <input type="text" id="route-destination-${routeCounter}" placeholder="192.168.2.0">
                </div>
                <div class="input-group">
                    <label for="route-prefix-${routeCounter}">Prefix Length:</label>
                    <input type="number" id="route-prefix-${routeCounter}" placeholder="24" value="24" min="1" max="32">
                </div>
                <div class="input-group">
                    <label for="next-hop-${routeCounter}">Next Hop:</label>
                    <input type="text" id="next-hop-${routeCounter}" placeholder="10.0.0.2">
                </div>
                <div class="input-group">
                    <label for="route-preference-${routeCounter}">Preference (optional):</label>
                    <input type="number" id="route-preference-${routeCounter}" placeholder="10" min="1" max="255">
                </div>
                <button class="remove-route" data-id="${routeCounter}">Remove</button>
            `;
            
            staticRoutesList.appendChild(newRoute);
            
            // Add event listener for the remove button
            const removeBtn = newRoute.querySelector('.remove-route');
            removeBtn.addEventListener('click', function() {
                if (document.querySelectorAll('.static-route-item').length > 1) {
                    staticRoutesList.removeChild(newRoute);
                } else {
                    alert('You need at least one static route.');
                }
            });
            
            routeCounter++;
        });
        
        // Add event listener to the first route's remove button
        const firstRouteRemoveBtn = document.querySelector('.remove-route');
        if (firstRouteRemoveBtn) {
            firstRouteRemoveBtn.addEventListener('click', function() {
                // Don't remove if it's the only one remaining
                if (document.querySelectorAll('.static-route-item').length > 1) {
                    const routeId = this.getAttribute('data-id');
                    const routeItem = this.closest('.static-route-item');
                    staticRoutesList.removeChild(routeItem);
                } else {
                    alert('You need at least one static route.');
                }
            });
        }
    }
    
    // OSPF Areas management
    let ospfAreaCounter = 1;
    const addOspfAreaBtn = document.getElementById('add-ospf-area');
    const ospfAreasList = document.getElementById('ospf-areas');
    
    if (addOspfAreaBtn && ospfAreasList) {
        addOspfAreaBtn.addEventListener('click', () => {
            const newArea = document.createElement('div');
            newArea.className = 'ospf-area-item';
            newArea.innerHTML = `
                <div class="input-group">
                    <label for="ospf-area-id-${ospfAreaCounter}">Area ID:</label>
                    <input type="text" id="ospf-area-id-${ospfAreaCounter}" placeholder="0.0.0.0" value="0.0.0.0">
                </div>
                <div class="input-group">
                    <label for="ospf-area-interfaces-${ospfAreaCounter}">Interfaces (comma separated):</label>
                    <input type="text" id="ospf-area-interfaces-${ospfAreaCounter}" placeholder="ge-0/0/0.0, lo0.0">
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="ospf-area-stub-${ospfAreaCounter}">
                    <label for="ospf-area-stub-${ospfAreaCounter}">Stub Area</label>
                </div>
                <button class="remove-ospf-area" data-id="${ospfAreaCounter}">Remove</button>
            `;
            
            ospfAreasList.appendChild(newArea);
            
            // Add event listener for the remove button
            const removeBtn = newArea.querySelector('.remove-ospf-area');
            removeBtn.addEventListener('click', function() {
                if (document.querySelectorAll('.ospf-area-item').length > 1) {
                    ospfAreasList.removeChild(newArea);
                } else {
                    alert('You need at least one OSPF area.');
                }
            });
            
            ospfAreaCounter++;
        });
        
        // Add event listener to the first area's remove button
        const firstAreaRemoveBtn = document.querySelector('.remove-ospf-area');
        if (firstAreaRemoveBtn) {
            firstAreaRemoveBtn.addEventListener('click', function() {
                // Don't remove if it's the only one remaining
                if (document.querySelectorAll('.ospf-area-item').length > 1) {
                    const areaId = this.getAttribute('data-id');
                    const areaItem = this.closest('.ospf-area-item');
                    ospfAreasList.removeChild(areaItem);
                } else {
                    alert('You need at least one OSPF area.');
                }
            });
        }
    }
    
    // BGP Neighbors management
    let bgpNeighborCounter = 1;
    const addBgpNeighborBtn = document.getElementById('add-bgp-neighbor');
    const bgpNeighborsList = document.getElementById('bgp-neighbors');
    
    if (addBgpNeighborBtn && bgpNeighborsList) {
        addBgpNeighborBtn.addEventListener('click', () => {
            const newNeighbor = document.createElement('div');
            newNeighbor.className = 'bgp-neighbor-item';
            newNeighbor.innerHTML = `
                <div class="input-group">
                    <label for="bgp-peer-address-${bgpNeighborCounter}">Peer Address:</label>
                    <input type="text" id="bgp-peer-address-${bgpNeighborCounter}" placeholder="192.168.1.2">
                </div>
                <div class="input-group">
                    <label for="bgp-peer-as-${bgpNeighborCounter}">Peer AS Number:</label>
                    <input type="number" id="bgp-peer-as-${bgpNeighborCounter}" placeholder="65001" min="1" max="4294967295">
                </div>
                <div class="input-group">
                    <label for="bgp-peer-description-${bgpNeighborCounter}">Description:</label>
                    <input type="text" id="bgp-peer-description-${bgpNeighborCounter}" placeholder="Connection to ISP">
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="bgp-peer-import-policy-enabled-${bgpNeighborCounter}">
                    <label for="bgp-peer-import-policy-enabled-${bgpNeighborCounter}">Import Policy</label>
                </div>
                <div class="input-group" id="bgp-peer-import-policy-${bgpNeighborCounter}" style="display: none;">
                    <label for="bgp-peer-import-policy-name-${bgpNeighborCounter}">Import Policy Name:</label>
                    <input type="text" id="bgp-peer-import-policy-name-${bgpNeighborCounter}" placeholder="import-from-isp">
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="bgp-peer-export-policy-enabled-${bgpNeighborCounter}">
                    <label for="bgp-peer-export-policy-enabled-${bgpNeighborCounter}">Export Policy</label>
                </div>
                <div class="input-group" id="bgp-peer-export-policy-${bgpNeighborCounter}" style="display: none;">
                    <label for="bgp-peer-export-policy-name-${bgpNeighborCounter}">Export Policy Name:</label>
                    <input type="text" id="bgp-peer-export-policy-name-${bgpNeighborCounter}" placeholder="export-to-isp">
                </div>
                <button class="remove-bgp-neighbor" data-id="${bgpNeighborCounter}">Remove</button>
            `;
            
            bgpNeighborsList.appendChild(newNeighbor);
            
            // Add event listeners for toggles
            const importPolicyEnabled = newNeighbor.querySelector(`#bgp-peer-import-policy-enabled-${bgpNeighborCounter}`);
            const importPolicySection = newNeighbor.querySelector(`#bgp-peer-import-policy-${bgpNeighborCounter}`);
            
            if (importPolicyEnabled && importPolicySection) {
                importPolicyEnabled.addEventListener('change', () => {
                    importPolicySection.style.display = importPolicyEnabled.checked ? 'block' : 'none';
                });
            }
            
            const exportPolicyEnabled = newNeighbor.querySelector(`#bgp-peer-export-policy-enabled-${bgpNeighborCounter}`);
            const exportPolicySection = newNeighbor.querySelector(`#bgp-peer-export-policy-${bgpNeighborCounter}`);
            
            if (exportPolicyEnabled && exportPolicySection) {
                exportPolicyEnabled.addEventListener('change', () => {
                    exportPolicySection.style.display = exportPolicyEnabled.checked ? 'block' : 'none';
                });
            }
            
            // Add event listener for the remove button
            const removeBtn = newNeighbor.querySelector('.remove-bgp-neighbor');
            removeBtn.addEventListener('click', function() {
                if (document.querySelectorAll('.bgp-neighbor-item').length > 1) {
                    bgpNeighborsList.removeChild(newNeighbor);
                } else {
                    alert('You need at least one BGP neighbor.');
                }
            });
            
            bgpNeighborCounter++;
        });
        
        // Add event listener to the first neighbor's remove button
        const firstNeighborRemoveBtn = document.querySelector('.remove-bgp-neighbor');
        if (firstNeighborRemoveBtn) {
            firstNeighborRemoveBtn.addEventListener('click', function() {
                // Don't remove if it's the only one remaining
                if (document.querySelectorAll('.bgp-neighbor-item').length > 1) {
                    const neighborId = this.getAttribute('data-id');
                    const neighborItem = this.closest('.bgp-neighbor-item');
                    bgpNeighborsList.removeChild(neighborItem);
                } else {
                    alert('You need at least one BGP neighbor.');
                }
            });
        }
        
        // Set up toggle for the first neighbor
        const firstImportPolicyEnabled = document.getElementById('bgp-peer-import-policy-enabled-0');
        const firstImportPolicySection = document.getElementById('bgp-peer-import-policy-0');
        
        if (firstImportPolicyEnabled && firstImportPolicySection) {
            firstImportPolicyEnabled.addEventListener('change', () => {
                firstImportPolicySection.style.display = firstImportPolicyEnabled.checked ? 'block' : 'none';
            });
        }
        
        const firstExportPolicyEnabled = document.getElementById('bgp-peer-export-policy-enabled-0');
        const firstExportPolicySection = document.getElementById('bgp-peer-export-policy-0');
        
        if (firstExportPolicyEnabled && firstExportPolicySection) {
            firstExportPolicyEnabled.addEventListener('change', () => {
                firstExportPolicySection.style.display = firstExportPolicyEnabled.checked ? 'block' : 'none';
            });
        }
    }
    
    // Generate Configuration button
    const generateBtn = document.getElementById('generate-config');
    const configOutput = document.getElementById('config-output');
    const configOutputContainer = document.getElementById('config-output-container');
    
    if (generateBtn && configOutput && configOutputContainer) {
        generateBtn.addEventListener('click', () => {
            generateConfiguration();
            
            // Scroll to the output
            configOutputContainer.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Reset Form button
    const resetBtn = document.getElementById('reset-form');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset the form? All your configuration will be lost.')) {
                window.location.reload();
            }
        });
    }
    
    // Copy configuration button
    const copyBtn = document.getElementById('copy-config');
    const copyTooltip = document.getElementById('copy-tooltip');
    
    if (copyBtn && configOutput && copyTooltip) {
        copyBtn.addEventListener('click', () => {
            copyToClipboard(configOutput.textContent);
            
            // Show the tooltip
            copyTooltip.style.display = 'block';
            
            // Hide tooltip after 2 seconds
            setTimeout(() => {
                copyTooltip.style.display = 'none';
            }, 2000);
        });
    }
    
    // Copy to clipboard function
    function copyToClipboard(text) {
        // Create a temporary textarea
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        
        // Select and copy
        textarea.select();
        document.execCommand('copy');
        
        // Remove the textarea
        document.body.removeChild(textarea);
    }
    
    // Configuration generation function
    function generateConfiguration() {
        // Get the configuration output
        const config = document.getElementById('config-output');
        const hostname = document.getElementById('hostname').value || 'router';
        const domainName = document.getElementById('domain-name').value;
        
        // Start building configuration
        let configText = '';
        
        // System configuration
        configText += 'system {\n';
        configText += `    host-name ${hostname};\n`;
        
        if (domainName) {
            configText += `    domain-name ${domainName};\n`;
        }
        
        // Root password
        const rootPassword = document.getElementById('root-password').value;
        const useEncryptedPassword = document.getElementById('use-encrypted-password').checked;
        
        if (rootPassword) {
            if (useEncryptedPassword) {
                configText += '    root-authentication {\n';
                configText += `        encrypted-password "$9$XXXXXXXXXXXXXXXXXXXXXX"; # Reference only, replace with real encrypted password\n`;
                configText += '    }\n';
            } else {
                configText += '    root-authentication {\n';
                configText += `        plain-text-password-value "${rootPassword}";\n`;
                configText += '    }\n';
            }
        }
        
        // Login user
        const loginUser = document.getElementById('login-user').value;
        const loginPassword = document.getElementById('login-password').value;
        const userClass = document.getElementById('user-class').value;
        
        if (loginUser && loginPassword) {
            configText += '    login {\n';
            configText += `        user ${loginUser} {\n`;
            configText += `            class ${userClass};\n`;
            configText += '            authentication {\n';
            if (useEncryptedPassword) {
                configText += `                encrypted-password "$9$XXXXXXXXXXXXXXXXXXXXXX"; # Reference only, replace with real encrypted password\n`;
            } else {
                configText += `                plain-text-password-value "${loginPassword}";\n`;
            }
            configText += '            }\n';
            configText += '        }\n';
            configText += '    }\n';
        }
        
        // System timezone
        const timezone = document.getElementById('system-timezone').value;
        configText += `    time-zone ${timezone};\n`;
        
        // DNS servers
        const dnsServers = document.getElementById('dns-servers').value;
        if (dnsServers) {
            configText += '    name-server {\n';
            dnsServers.split(',').forEach(server => {
                const trimmedServer = server.trim();
                if (trimmedServer) {
                    configText += `        ${trimmedServer};\n`;
                }
            });
            configText += '    }\n';
        }
        
        configText += '}\n\n';
        
        // Generate interfaces configuration
        configText += 'interfaces {\n';
        const interfaces = document.querySelectorAll('.interface-item');
        interfaces.forEach((interfaceItem, index) => {
            // Get the interface type/name
            let interfaceType = interfaceItem.querySelector(`#interface-type-${index}`).value;
            if (interfaceType === 'custom') {
                const customInterfaceField = document.getElementById(`custom-interface-name-${index}`);
                const customInterfaceValue = interfaceItem.querySelector(`#custom-interface-value-${index}`).value;
                if (customInterfaceValue) {
                    interfaceType = customInterfaceValue;
                } else {
                    // If no custom value provided, skip this interface or use a default
                    console.warn('Custom interface selected but no value provided, using a default');
                    interfaceType = 'ge-0/0/0'; // Default fallback
                }
            }
            
            const unitNumber = interfaceItem.querySelector(`#unit-number-${index}`).value || '0';
            const ipAddress = interfaceItem.querySelector(`#ip-address-${index}`).value;
            const prefixLength = interfaceItem.querySelector(`#prefix-length-${index}`).value || '24';
            
            // Begin interface configuration block
            configText += `    ${interfaceType} {\n`;
            
            // Add description if enabled
            const descEnabled = interfaceItem.querySelector(`#interface-description-enabled-${index}`).checked;
            if (descEnabled) {
                const description = interfaceItem.querySelector(`#interface-description-${index}`).value;
                if (description) {
                    configText += `        description "${description}";\n`;
                }
            }
            
            // Add VLAN configuration if enabled
            const vlanEnabled = interfaceItem.querySelector(`#vlan-enabled-${index}`).checked;
            if (vlanEnabled) {
                const vlanId = interfaceItem.querySelector(`#vlan-id-${index}`).value;
                if (vlanId) {
                    configText += `        vlan-tagging;\n`;
                }
            }
            
            // Unit configuration
            configText += `        unit ${unitNumber} {\n`;
            
            // Add VLAN ID if enabled
            if (vlanEnabled) {
                const vlanId = interfaceItem.querySelector(`#vlan-id-${index}`).value;
                if (vlanId) {
                    configText += `            vlan-id ${vlanId};\n`;
                }
            }
            
            // Add IP address
            if (ipAddress) {
                configText += '            family inet {\n';
                configText += `                address ${ipAddress}/${prefixLength};\n`;
                configText += '            }\n';
            }
            
            // Add IPv6 if enabled
            const ipv6Enabled = interfaceItem.querySelector(`#ipv6-enabled-${index}`).checked;
            if (ipv6Enabled) {
                const ipv6Address = interfaceItem.querySelector(`#ipv6-address-${index}`).value;
                const ipv6PrefixLength = interfaceItem.querySelector(`#ipv6-prefix-length-${index}`).value || '64';
                
                if (ipv6Address) {
                    configText += '            family inet6 {\n';
                    configText += `                address ${ipv6Address}/${ipv6PrefixLength};\n`;
                    configText += '            }\n';
                }
            }
            
            // Close unit and interface blocks
            configText += '        }\n';
            configText += '    }\n';
        });
        configText += '}\n\n';
        
        // Generate routing configuration
        const staticEnabled = document.getElementById('static-enabled') && document.getElementById('static-enabled').checked;
        const ospfEnabled = document.getElementById('ospf-enabled') && document.getElementById('ospf-enabled').checked;
        const bgpEnabled = document.getElementById('bgp-enabled') && document.getElementById('bgp-enabled').checked;
        
        // Check if any routing protocol is enabled
        if (staticEnabled || ospfEnabled || bgpEnabled) {
            configText += 'routing-options {\n';
            
            // Add static routes if static routing is selected
            if (staticEnabled) {
                configText += '    static {\n';
                const staticRoutes = document.querySelectorAll('.static-route-item');
                staticRoutes.forEach((route, index) => {
                    const destination = route.querySelector(`#route-destination-${index}`).value;
                    const prefix = route.querySelector(`#route-prefix-${index}`).value || '24';
                    const nextHop = route.querySelector(`#next-hop-${index}`).value;
                    
                    if (destination && nextHop) {
                        configText += `        route ${destination}/${prefix} next-hop ${nextHop};\n`;
                    }
                });
                configText += '    }\n';
            }
            
            // Add router ID for OSPF
            if (ospfEnabled) {
                const routerId = document.getElementById('ospf-router-id').value;
                if (routerId) {
                    configText += `    router-id ${routerId};\n`;
                }
            }
            
            // Add router ID and autonomous system for BGP
            if (bgpEnabled) {
                const routerId = document.getElementById('bgp-router-id').value;
                if (routerId) {
                    configText += `    router-id ${routerId};\n`;
                }
                
                const localAs = document.getElementById('bgp-local-as').value;
                if (localAs) {
                    configText += `    autonomous-system ${localAs};\n`;
                }
            }
            
            configText += '}\n\n';
        }
        
        // Add protocol-specific configuration
        if (ospfEnabled || bgpEnabled) {
            configText += 'protocols {\n';
            
            // OSPF Configuration
            if (ospfEnabled) {
                configText += '    ospf {\n';
                
                const ospfAreas = document.querySelectorAll('.ospf-area-item');
                ospfAreas.forEach((area, index) => {
                    const areaId = area.querySelector(`#ospf-area-id-${index}`).value;
                    const interfaces = area.querySelector(`#ospf-area-interfaces-${index}`).value;
                    
                    if (areaId && interfaces) {
                        configText += `        area ${areaId} {\n`;
                        
                        interfaces.split(',').forEach(iface => {
                            const trimmedIface = iface.trim();
                            if (trimmedIface) {
                                configText += `            interface ${trimmedIface};\n`;
                            }
                        });
                        
                        configText += '        }\n';
                    }
                });
                
                configText += '    }\n';
            }
            
            // BGP Configuration
            if (bgpEnabled) {
                configText += '    bgp {\n';
                configText += '        group external-peers {\n';
                configText += '            type external;\n';
                
                const bgpNeighbors = document.querySelectorAll('.bgp-neighbor-item');
                bgpNeighbors.forEach((neighbor, index) => {
                    const peerAddress = neighbor.querySelector(`#bgp-peer-address-${index}`).value;
                    const peerAs = neighbor.querySelector(`#bgp-peer-as-${index}`).value;
                    
                    if (peerAddress && peerAs) {
                        configText += `            neighbor ${peerAddress} {\n`;
                        configText += `                peer-as ${peerAs};\n`;
                        
                        // Check for export policies
                        const exportPolicyEnabled = neighbor.querySelector(`#bgp-peer-export-policy-enabled-${index}`);
                        if (exportPolicyEnabled && exportPolicyEnabled.checked) {
                            const exportPolicy = neighbor.querySelector(`#bgp-peer-export-policy-${index}`).value;
                            if (exportPolicy) {
                                configText += `                export ${exportPolicy};\n`;
                            }
                        }
                        
                        configText += '            }\n';
                    }
                });
                
                configText += '        }\n';
                configText += '    }\n';
            }
            
            configText += '}\n\n';
        }
        
        // Generate security configuration
        const securityEnabled = document.getElementById('security-enabled');
        if (securityEnabled && securityEnabled.checked) {
            configText += 'security {\n';
            
            // Add security zones
            const zones = document.querySelectorAll('.zone-item');
            if (zones.length > 0) {
                configText += '    zones {\n';
                
                zones.forEach((zone, index) => {
                    const zoneName = zone.querySelector(`#zone-name-${index}`).value;
                    const zoneInterfaces = zone.querySelector(`#zone-interfaces-${index}`).value;
                    
                    if (zoneName) {
                        configText += `        security-zone ${zoneName} {\n`;
                        
                        // Add interfaces
                        if (zoneInterfaces) {
                            zoneInterfaces.split(',').forEach(iface => {
                                const trimmedIface = iface.trim();
                                if (trimmedIface) {
                                    configText += `            interfaces ${trimmedIface};\n`;
                                }
                            });
                        }
                        
                        // Add inbound services
                        const allowedServices = zone.querySelector(`#zone-allowed-services-${index}`).value;
                        if (allowedServices) {
                            configText += '            host-inbound-traffic {\n';
                            configText += '                system-services {\n';
                            
                            allowedServices.split(',').forEach(service => {
                                const trimmedService = service.trim();
                                if (trimmedService) {
                                    configText += `                    ${trimmedService};\n`;
                                }
                            });
                            
                            configText += '                }\n';
                            configText += '            }\n';
                        }
                        
                        configText += '        }\n';
                    }
                });
                
                configText += '    }\n';
            }
            
            // Add security policies
            const policies = document.querySelectorAll('.policy-item');
            if (policies.length > 0) {
                configText += '    policies {\n';
                
                policies.forEach((policy, index) => {
                    const policyName = policy.querySelector(`#policy-name-${index}`).value;
                    const fromZone = policy.querySelector(`#policy-from-zone-${index}`).value;
                    const toZone = policy.querySelector(`#policy-to-zone-${index}`).value;
                    
                    if (policyName && fromZone && toZone) {
                        configText += `        from-zone ${fromZone} to-zone ${toZone} {\n`;
                        configText += `            policy ${policyName} {\n`;
                        configText += '                match {\n';
                        
                        const sourceAddress = policy.querySelector(`#policy-source-address-${index}`).value;
                        const destinationAddress = policy.querySelector(`#policy-destination-address-${index}`).value;
                        const application = policy.querySelector(`#policy-application-${index}`).value;
                        
                        if (sourceAddress) {
                            configText += `                    source-address ${sourceAddress};\n`;
                        } else {
                            configText += '                    source-address any;\n';
                        }
                        
                        if (destinationAddress) {
                            configText += `                    destination-address ${destinationAddress};\n`;
                        } else {
                            configText += '                    destination-address any;\n';
                        }
                        
                        if (application) {
                            configText += '                    application [ ';
                            application.split(',').forEach(app => {
                                const trimmedApp = app.trim();
                                if (trimmedApp) {
                                    configText += `${trimmedApp} `;
                                }
                            });
                            configText += '];\n';
                        } else {
                            configText += '                    application any;\n';
                        }
                        
                        configText += '                }\n';
                        
                        const action = policy.querySelector(`#policy-action-${index}`).value;
                        const logEnabled = policy.querySelector(`#policy-log-${index}`).checked;
                        
                        configText += '                then {\n';
                        configText += `                    ${action};\n`;
                        
                        if (logEnabled) {
                            configText += '                    log {\n';
                            configText += '                        session-init;\n';
                            configText += '                        session-close;\n';
                            configText += '                    }\n';
                        }
                        
                        configText += '                }\n';
                        configText += '            }\n';
                        configText += '        }\n';
                    }
                });
                
                configText += '    }\n';
            }
            
            configText += '}\n\n';
        }
        
        // Generate firewall filters
        const firewallFilterEnabled = document.getElementById('firewall-filter-enabled');
        if (firewallFilterEnabled && firewallFilterEnabled.checked) {
            const filters = document.querySelectorAll('.filter-item');
            if (filters.length > 0) {
                configText += 'firewall {\n';
                
                filters.forEach((filter, filterIndex) => {
                    const filterName = filter.querySelector(`#filter-name-${filterIndex}`).value;
                    const filterFamily = filter.querySelector(`#filter-family-${filterIndex}`).value;
                    
                    if (filterName) {
                        configText += `    filter ${filterName} {\n`;
                        
                        // Add filter terms
                        const terms = filter.querySelectorAll('.filter-term');
                        terms.forEach((term, termIndex) => {
                            const termName = term.querySelector(`#term-name-${filterIndex}-${termIndex}`).value;
                            
                            if (termName) {
                                configText += `        term ${termName} {\n`;
                                configText += '            from {\n';
                                
                                const sourceAddress = term.querySelector(`#term-source-${filterIndex}-${termIndex}`).value;
                                const destinationAddress = term.querySelector(`#term-destination-${filterIndex}-${termIndex}`).value;
                                const protocol = term.querySelector(`#term-protocol-${filterIndex}-${termIndex}`).value;
                                
                                if (sourceAddress) {
                                    configText += `                source-address ${sourceAddress};\n`;
                                }
                                
                                if (destinationAddress) {
                                    configText += `                destination-address ${destinationAddress};\n`;
                                }
                                
                                if (protocol) {
                                    configText += `                protocol ${protocol};\n`;
                                    
                                    // Add port if TCP/UDP
                                    if (protocol === 'tcp' || protocol === 'udp') {
                                        const port = term.querySelector(`#term-port-${filterIndex}-${termIndex}`).value;
                                        if (port) {
                                            configText += `                ${protocol}-destination-port ${port};\n`;
                                        }
                                    }
                                }
                                
                                configText += '            }\n';
                                
                                const action = term.querySelector(`#term-action-${filterIndex}-${termIndex}`).value;
                                
                                configText += '            then {\n';
                                configText += `                ${action};\n`;
                                configText += '            }\n';
                                
                                configText += '        }\n';
                            }
                        });
                        
                        configText += '    }\n';
                        
                        // Add filter application to interface if specified
                        const filterInterface = filter.querySelector(`#filter-interface-${filterIndex}`).value;
                        const filterDirection = filter.querySelector(`#filter-direction-${filterIndex}`).value;
                        
                        if (filterInterface && filterDirection) {
                            // Only add the interfaces part if it's a valid value (not empty)
                            if (filterInterface.trim() !== '') {
                                configText += `    interfaces {\n`;
                                configText += `        ${filterInterface} {\n`;
                                configText += `            filter {\n`;
                                configText += `                ${filterDirection} ${filterName};\n`;
                                configText += `            }\n`;
                                configText += `        }\n`;
                                configText += `    }\n`;
                            }
                        }
                    }
                });
                
                configText += '}\n\n';
            }
        }
        
        // Generate services configuration
        let hasSystemServices = false;
        let systemServicesText = '';
        
        // NTP configuration
        const ntpEnabled = document.getElementById('ntp-enabled');
        if (ntpEnabled && ntpEnabled.checked) {
            const ntpServers = document.getElementById('ntp-servers').value;
            
            if (ntpServers) {
                hasSystemServices = true;
                systemServicesText += '    ntp {\n';
                
                ntpServers.split(',').forEach(server => {
                    const trimmedServer = server.trim();
                    if (trimmedServer) {
                        systemServicesText += `        server ${trimmedServer};\n`;
                    }
                });
                
                systemServicesText += '    }\n';
            }
        }
        
        // DHCP server configuration
        const dhcpEnabled = document.getElementById('dhcp-server-enabled');
        if (dhcpEnabled && dhcpEnabled.checked) {
            hasSystemServices = true;
            systemServicesText += '    services {\n';
            systemServicesText += '        dhcp {\n';
            
            const dhcpPools = document.querySelectorAll('.dhcp-pool');
            dhcpPools.forEach((pool, index) => {
                const poolName = pool.querySelector(`#dhcp-name-${index}`).value;
                const poolNetwork = pool.querySelector(`#dhcp-subnet-${index}`).value;
                const poolRangeLow = pool.querySelector(`#dhcp-range-low-${index}`).value;
                const poolRangeHigh = pool.querySelector(`#dhcp-range-high-${index}`).value;
                const poolRange = poolRangeLow && poolRangeHigh ? `${poolRangeLow} to ${poolRangeHigh}` : '';
                const defaultRouter = pool.querySelector(`#dhcp-router-${index}`).value;
                const dnsServer = pool.querySelector(`#dhcp-dns-${index}`).value;
                const domainName = pool.querySelector(`#dhcp-domain-${index}`).value;
                const leaseTime = pool.querySelector(`#dhcp-lease-${index}`).value;
                
                if (poolName && poolNetwork && (poolRangeLow || poolRangeHigh)) {
                    systemServicesText += `            pool ${poolName} {\n`;
                    systemServicesText += `                subnet ${poolNetwork};\n`;
                    systemServicesText += `                address-range ${poolRange};\n`;
                    
                    if (defaultRouter) {
                        systemServicesText += `                router ${defaultRouter};\n`;
                    }
                    
                    if (dnsServer) {
                        systemServicesText += `                name-server ${dnsServer};\n`;
                    }
                    
                    if (domainName) {
                        systemServicesText += `                domain-name "${domainName}";\n`;
                    }
                    
                    if (leaseTime) {
                        systemServicesText += `                maximum-lease-time ${leaseTime};\n`;
                    }
                    
                    systemServicesText += '            }\n';
                }
            });
            
            systemServicesText += '        }\n';
            systemServicesText += '    }\n';
        }
        
        // Syslog configuration
        const syslogEnabled = document.getElementById('syslog-enabled');
        if (syslogEnabled && syslogEnabled.checked) {
            const syslogServer = document.getElementById('syslog-server').value;
            const syslogFacility = document.getElementById('syslog-facility').value;
            const syslogSeverity = document.getElementById('syslog-severity').value;
            
            if (syslogServer) {
                hasSystemServices = true;
                systemServicesText += '    syslog {\n';
                systemServicesText += `        host ${syslogServer} {\n`;
                systemServicesText += `            facility ${syslogFacility};\n`;
                systemServicesText += `            level ${syslogSeverity};\n`;
                systemServicesText += '        }\n';
                systemServicesText += '    }\n';
            }
        }
        
        // SNMP configuration
        const snmpEnabled = document.getElementById('snmp-enabled');
        if (snmpEnabled && snmpEnabled.checked) {
            const snmpCommunity = document.getElementById('snmp-community').value;
            const snmpLocation = document.getElementById('snmp-location').value;
            const snmpContact = document.getElementById('snmp-contact').value;
            const snmpClients = document.getElementById('snmp-clients').value;
            
            if (snmpCommunity) {
                hasSystemServices = true;
                systemServicesText += '    snmp {\n';
                
                if (snmpLocation) {
                    systemServicesText += `        location "${snmpLocation}";\n`;
                }
                
                if (snmpContact) {
                    systemServicesText += `        contact "${snmpContact}";\n`;
                }
                
                systemServicesText += `        community ${snmpCommunity} {\n`;
                
                if (snmpClients) {
                    snmpClients.split(',').forEach(client => {
                        const trimmedClient = client.trim();
                        if (trimmedClient) {
                            systemServicesText += `            client-list ${trimmedClient};\n`;
                        }
                    });
                } else {
                    systemServicesText += '            authorization read-only;\n';
                }
                
                systemServicesText += '        }\n';
                systemServicesText += '    }\n';
            }
        }
        
        // Add system services to the config if any are enabled
        if (hasSystemServices) {
            configText += 'system {\n';
            configText += systemServicesText;
            configText += '}\n\n';
        }
        
        // Policy options configuration
        const policyOptionsEnabled = document.getElementById('policy-options-enabled');
        if (policyOptionsEnabled && policyOptionsEnabled.checked) {
            configText += 'policy-options {\n';
            
            // Prefix lists
            const prefixLists = document.querySelectorAll('.prefix-list-item');
            prefixLists.forEach((prefixList, index) => {
                const prefixListName = prefixList.querySelector(`#prefix-list-name-${index}`).value;
                const prefixListPrefixes = prefixList.querySelector(`#prefix-list-prefixes-${index}`).value;
                
                if (prefixListName && prefixListPrefixes) {
                    configText += `    prefix-list ${prefixListName} {\n`;
                    
                    prefixListPrefixes.split('\n').forEach(prefix => {
                        const trimmedPrefix = prefix.trim();
                        if (trimmedPrefix) {
                            configText += `        ${trimmedPrefix};\n`;
                        }
                    });
                    
                    configText += '    }\n';
                }
            });
            
            // Route filters
            const routeFilters = document.querySelectorAll('.route-filter-item');
            routeFilters.forEach((routeFilter, index) => {
                const routeFilterName = routeFilter.querySelector(`#route-filter-name-${index}`).value;
                const routeFilterPrefix = routeFilter.querySelector(`#route-filter-prefix-${index}`).value;
                const routeFilterType = routeFilter.querySelector(`#route-filter-type-${index}`).value;
                
                if (routeFilterName && routeFilterPrefix && routeFilterType) {
                    configText += `    route-filter-list ${routeFilterName} {\n`;
                    configText += `        ${routeFilterPrefix} ${routeFilterType};\n`;
                    configText += '    }\n';
                }
            });
            
            // Routing policies
            const routingPolicies = document.querySelectorAll('.routing-policy-item');
            routingPolicies.forEach((routingPolicy, index) => {
                const policyName = routingPolicy.querySelector(`#routing-policy-name-${index}`).value;
                const termName = routingPolicy.querySelector(`#routing-policy-term-name-${index}`).value;
                const fromProtocol = routingPolicy.querySelector(`#routing-policy-from-protocol-${index}`).value;
                const prefixListEnabled = routingPolicy.querySelector(`#routing-policy-prefix-list-enabled-${index}`);
                const thenAction = routingPolicy.querySelector(`#routing-policy-then-action-${index}`).value;
                
                if (policyName && termName) {
                    configText += `    policy-statement ${policyName} {\n`;
                    configText += `        term ${termName} {\n`;
                    
                    // From conditions
                    configText += '            from {\n';
                    
                    if (fromProtocol) {
                        configText += `                protocol ${fromProtocol};\n`;
                    }
                    
                    if (prefixListEnabled && prefixListEnabled.checked) {
                        const prefixList = routingPolicy.querySelector(`#routing-policy-prefix-list-${index}`).value;
                        if (prefixList) {
                            configText += `                prefix-list ${prefixList};\n`;
                        }
                    }
                    
                    configText += '            }\n';
                    
                    // Then actions
                    configText += '            then {\n';
                    configText += `                ${thenAction};\n`;
                    configText += '            }\n';
                    
                    configText += '        }\n';
                    configText += '    }\n';
                }
            });
            
            configText += '}\n\n';
        }
        
        // Class of Service (CoS) configuration
        const cosEnabled = document.getElementById('cos-enabled');
        if (cosEnabled && cosEnabled.checked) {
            configText += 'class-of-service {\n';
            
            const classifierName = document.getElementById('cos-classifier-name').value || 'default';
            
            // Forwarding classes
            const forwardingClasses = document.querySelectorAll('.forwarding-class-item');
            if (forwardingClasses.length > 0) {
                configText += '    forwarding-classes {\n';
                
                forwardingClasses.forEach((forwardingClass, index) => {
                    const className = forwardingClass.querySelector(`#forwarding-class-name-${index}`).value;
                    const queueNumber = forwardingClass.querySelector(`#forwarding-class-queue-${index}`).value;
                    
                    if (className && queueNumber) {
                        configText += `        class ${className} queue ${queueNumber};\n`;
                    }
                });
                
                configText += '    }\n';
            }
            
            // Code points
            const codePoints = document.querySelectorAll('.code-point-item');
            if (codePoints.length > 0) {
                configText += `    classifiers {\n`;
                configText += `        dscp ${classifierName} {\n`;
                
                codePoints.forEach((codePoint, index) => {
                    const codePointValue = codePoint.querySelector(`#code-point-value-${index}`).value;
                    const forwardingClass = codePoint.querySelector(`#code-point-forwarding-class-${index}`).value;
                    
                    if (codePointValue && forwardingClass) {
                        configText += `            forwarding-class ${forwardingClass} {\n`;
                        configText += `                dscp ${codePointValue};\n`;
                        configText += '            }\n';
                    }
                });
                
                configText += '        }\n';
                configText += '    }\n';
            }
            
            configText += '}\n\n';
        }
        
        // After all configuration is generated
        // Set the output and show the container
        if (config) {
            config.textContent = configText;
            const configOutputContainer = document.getElementById('config-output-container');
            if (configOutputContainer) {
                configOutputContainer.style.display = 'block';
            }
        }
        
        return configText;
    }
    
    // Firewall Filters management
    let filterCounter = 1;
    const addFilterBtn = document.getElementById('add-filter');
    const filtersList = document.getElementById('filters-list');
    
    if (addFilterBtn && filtersList) {
        addFilterBtn.addEventListener('click', () => {
            const newFilter = document.createElement('div');
            newFilter.className = 'filter-item';
            newFilter.innerHTML = `
                <div class="input-group">
                    <label for="filter-name-${filterCounter}">Filter Name:</label>
                    <input type="text" id="filter-name-${filterCounter}" placeholder="INGRESS_FILTER">
                </div>
                <div class="input-group">
                    <label for="filter-family-${filterCounter}">Family:</label>
                    <select id="filter-family-${filterCounter}">
                        <option value="inet">inet (IPv4)</option>
                        <option value="inet6">inet6 (IPv6)</option>
                    </select>
                </div>
                <div class="filter-terms" id="filter-terms-${filterCounter}">
                    <div class="filter-term">
                        <div class="input-group">
                            <label for="term-name-${filterCounter}-0">Term Name:</label>
                            <input type="text" id="term-name-${filterCounter}-0" placeholder="allow-ssh">
                        </div>
                        <div class="input-group">
                            <label for="term-source-${filterCounter}-0">Source Address (optional):</label>
                            <input type="text" id="term-source-${filterCounter}-0" placeholder="192.168.1.0/24">
                        </div>
                        <div class="input-group">
                            <label for="term-destination-${filterCounter}-0">Destination Address (optional):</label>
                            <input type="text" id="term-destination-${filterCounter}-0" placeholder="10.0.0.0/8">
                        </div>
                        <div class="input-group">
                            <label for="term-protocol-${filterCounter}-0">Protocol (optional):</label>
                            <select id="term-protocol-${filterCounter}-0">
                                <option value="">Select Protocol</option>
                                <option value="tcp">TCP</option>
                                <option value="udp">UDP</option>
                                <option value="icmp">ICMP</option>
                            </select>
                        </div>
                        <div class="input-group term-port-group" style="display: none;">
                            <label for="term-port-${filterCounter}-0">Port (optional):</label>
                            <input type="text" id="term-port-${filterCounter}-0" placeholder="22">
                        </div>
                        <div class="input-group">
                            <label for="term-action-${filterCounter}-0">Action:</label>
                            <select id="term-action-${filterCounter}-0">
                                <option value="accept">accept</option>
                                <option value="discard">discard</option>
                                <option value="reject">reject</option>
                            </select>
                        </div>
                    </div>
                </div>
                <button class="add-term" data-filter-id="${filterCounter}">Add Term</button>
                <div class="input-group">
                    <label for="filter-interface-${filterCounter}">Apply to Interface (optional):</label>
                    <input type="text" id="filter-interface-${filterCounter}" placeholder="ge-0/0/0">
                </div>
                <div class="input-group">
                    <label for="filter-direction-${filterCounter}">Direction:</label>
                    <select id="filter-direction-${filterCounter}">
                        <option value="input">input</option>
                        <option value="output">output</option>
                    </select>
                </div>
                <button class="remove-filter" data-id="${filterCounter}">Remove Filter</button>
            `;
            
            filtersList.appendChild(newFilter);
            
            // Add event listener for protocol selection
            const protocolSelect = newFilter.querySelector(`#term-protocol-${filterCounter}-0`);
            const portGroup = newFilter.querySelector('.term-port-group');
            
            if (protocolSelect && portGroup) {
                protocolSelect.addEventListener('change', () => {
                    if (protocolSelect.value === 'tcp' || protocolSelect.value === 'udp') {
                        portGroup.style.display = 'block';
                    } else {
                        portGroup.style.display = 'none';
                    }
                });
            }
            
            // Add event listener for adding new terms
            const addTermBtn = newFilter.querySelector('.add-term');
            const termsContainer = newFilter.querySelector(`#filter-terms-${filterCounter}`);
            
            if (addTermBtn && termsContainer) {
                let termCounter = 1;
                
                addTermBtn.addEventListener('click', () => {
                    const newTerm = document.createElement('div');
                    newTerm.className = 'filter-term';
                    newTerm.innerHTML = `
                        <div class="input-group">
                            <label for="term-name-${filterCounter}-${termCounter}">Term Name:</label>
                            <input type="text" id="term-name-${filterCounter}-${termCounter}" placeholder="allow-http">
                        </div>
                        <div class="input-group">
                            <label for="term-source-${filterCounter}-${termCounter}">Source Address (optional):</label>
                            <input type="text" id="term-source-${filterCounter}-${termCounter}" placeholder="192.168.1.0/24">
                        </div>
                        <div class="input-group">
                            <label for="term-destination-${filterCounter}-${termCounter}">Destination Address (optional):</label>
                            <input type="text" id="term-destination-${filterCounter}-${termCounter}" placeholder="10.0.0.0/8">
                        </div>
                        <div class="input-group">
                            <label for="term-protocol-${filterCounter}-${termCounter}">Protocol (optional):</label>
                            <select id="term-protocol-${filterCounter}-${termCounter}">
                                <option value="">Select Protocol</option>
                                <option value="tcp">TCP</option>
                                <option value="udp">UDP</option>
                                <option value="icmp">ICMP</option>
                            </select>
                        </div>
                        <div class="input-group term-port-group-${termCounter}" style="display: none;">
                            <label for="term-port-${filterCounter}-${termCounter}">Port (optional):</label>
                            <input type="text" id="term-port-${filterCounter}-${termCounter}" placeholder="80">
                        </div>
                        <div class="input-group">
                            <label for="term-action-${filterCounter}-${termCounter}">Action:</label>
                            <select id="term-action-${filterCounter}-${termCounter}">
                                <option value="accept">accept</option>
                                <option value="discard">discard</option>
                                <option value="reject">reject</option>
                            </select>
                        </div>
                        <button class="remove-term">Remove Term</button>
                    `;
                    
                    termsContainer.appendChild(newTerm);
                    
                    // Add event listener for protocol selection in new term
                    const newProtocolSelect = newTerm.querySelector(`#term-protocol-${filterCounter}-${termCounter}`);
                    const newPortGroup = newTerm.querySelector(`.term-port-group-${termCounter}`);
                    
                    if (newProtocolSelect && newPortGroup) {
                        newProtocolSelect.addEventListener('change', () => {
                            if (newProtocolSelect.value === 'tcp' || newProtocolSelect.value === 'udp') {
                                newPortGroup.style.display = 'block';
                            } else {
                                newPortGroup.style.display = 'none';
                            }
                        });
                    }
                    
                    // Add event listener for removing the term
                    const removeTermBtn = newTerm.querySelector('.remove-term');
                    if (removeTermBtn) {
                        removeTermBtn.addEventListener('click', () => {
                            termsContainer.removeChild(newTerm);
                        });
                    }
                    
                    termCounter++;
                });
            }
            
            // Add event listener for removing the filter
            const removeFilterBtn = newFilter.querySelector('.remove-filter');
            if (removeFilterBtn) {
                removeFilterBtn.addEventListener('click', () => {
                    if (document.querySelectorAll('.filter-item').length > 1) {
                        filtersList.removeChild(newFilter);
                    } else {
                        alert('You need at least one filter.');
                    }
                });
            }
            
            filterCounter++;
        });
        
        // Setup for the first filter
        const firstProtocolSelect = document.querySelector('#term-protocol-0-0');
        const firstPortGroup = document.querySelector('.term-port-group');
        
        if (firstProtocolSelect && firstPortGroup) {
            firstProtocolSelect.addEventListener('change', () => {
                if (firstProtocolSelect.value === 'tcp' || firstProtocolSelect.value === 'udp') {
                    firstPortGroup.style.display = 'block';
                } else {
                    firstPortGroup.style.display = 'none';
                }
            });
        }
        
        // Add event listener for the first filter's remove button
        const firstFilterRemoveBtn = document.querySelector('.remove-filter');
        if (firstFilterRemoveBtn) {
            firstFilterRemoveBtn.addEventListener('click', function() {
                if (document.querySelectorAll('.filter-item').length > 1) {
                    const filterId = this.getAttribute('data-id');
                    const filterItem = this.closest('.filter-item');
                    filtersList.removeChild(filterItem);
                } else {
                    alert('You need at least one filter.');
                }
            });
        }
        
        // Add event listener for adding terms to the first filter
        const firstAddTermBtn = document.querySelector('.add-term');
        const firstTermsContainer = document.querySelector('#filter-terms-0');
        
        if (firstAddTermBtn && firstTermsContainer) {
            let firstFilterTermCounter = 1;
            
            firstAddTermBtn.addEventListener('click', () => {
                const newTerm = document.createElement('div');
                newTerm.className = 'filter-term';
                newTerm.innerHTML = `
                    <div class="input-group">
                        <label for="term-name-0-${firstFilterTermCounter}">Term Name:</label>
                        <input type="text" id="term-name-0-${firstFilterTermCounter}" placeholder="allow-http">
                    </div>
                    <div class="input-group">
                        <label for="term-source-0-${firstFilterTermCounter}">Source Address (optional):</label>
                        <input type="text" id="term-source-0-${firstFilterTermCounter}" placeholder="192.168.1.0/24">
                    </div>
                    <div class="input-group">
                        <label for="term-destination-0-${firstFilterTermCounter}">Destination Address (optional):</label>
                        <input type="text" id="term-destination-0-${firstFilterTermCounter}" placeholder="10.0.0.0/8">
                    </div>
                    <div class="input-group">
                        <label for="term-protocol-0-${firstFilterTermCounter}">Protocol (optional):</label>
                        <select id="term-protocol-0-${firstFilterTermCounter}">
                            <option value="">Select Protocol</option>
                            <option value="tcp">TCP</option>
                            <option value="udp">UDP</option>
                            <option value="icmp">ICMP</option>
                        </select>
                    </div>
                    <div class="input-group term-port-group-${firstFilterTermCounter}" style="display: none;">
                        <label for="term-port-0-${firstFilterTermCounter}">Port (optional):</label>
                        <input type="text" id="term-port-0-${firstFilterTermCounter}" placeholder="80">
                    </div>
                    <div class="input-group">
                        <label for="term-action-0-${firstFilterTermCounter}">Action:</label>
                        <select id="term-action-0-${firstFilterTermCounter}">
                            <option value="accept">accept</option>
                            <option value="discard">discard</option>
                            <option value="reject">reject</option>
                        </select>
                    </div>
                    <button class="remove-term">Remove Term</button>
                `;
                
                firstTermsContainer.appendChild(newTerm);
                
                // Add event listener for protocol selection in new term
                const newProtocolSelect = newTerm.querySelector(`#term-protocol-0-${firstFilterTermCounter}`);
                const newPortGroup = newTerm.querySelector(`.term-port-group-${firstFilterTermCounter}`);
                
                if (newProtocolSelect && newPortGroup) {
                    newProtocolSelect.addEventListener('change', () => {
                        if (newProtocolSelect.value === 'tcp' || newProtocolSelect.value === 'udp') {
                            newPortGroup.style.display = 'block';
                        } else {
                            newPortGroup.style.display = 'none';
                        }
                    });
                }
                
                // Add event listener for removing the term
                const removeTermBtn = newTerm.querySelector('.remove-term');
                if (removeTermBtn) {
                    removeTermBtn.addEventListener('click', () => {
                        firstTermsContainer.removeChild(newTerm);
                    });
                }
                
                firstFilterTermCounter++;
            });
        }
    }
    
    // Security Zones management
    let zoneCounter = 1;
    const addZoneBtn = document.getElementById('add-zone');
    const zonesList = document.getElementById('zones-list');
    
    if (addZoneBtn && zonesList) {
        addZoneBtn.addEventListener('click', () => {
            const newZone = document.createElement('div');
            newZone.className = 'zone-item';
            newZone.innerHTML = `
                <div class="input-group">
                    <label for="zone-name-${zoneCounter}">Zone Name:</label>
                    <input type="text" id="zone-name-${zoneCounter}" placeholder="trust">
                </div>
                <div class="input-group">
                    <label for="zone-interfaces-${zoneCounter}">Interfaces (comma separated):</label>
                    <input type="text" id="zone-interfaces-${zoneCounter}" placeholder="ge-0/0/0.0, ge-0/0/1.0">
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="zone-ping-${zoneCounter}">
                    <label for="zone-ping-${zoneCounter}">Allow Ping</label>
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="zone-ssh-${zoneCounter}">
                    <label for="zone-ssh-${zoneCounter}">Allow SSH</label>
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="zone-web-${zoneCounter}">
                    <label for="zone-web-${zoneCounter}">Allow Web (HTTP/HTTPS)</label>
                </div>
                <button class="remove-zone" data-id="${zoneCounter}">Remove Zone</button>
            `;
            
            zonesList.appendChild(newZone);
            
            // Add event listener for the remove button
            const removeZoneBtn = newZone.querySelector('.remove-zone');
            if (removeZoneBtn) {
                removeZoneBtn.addEventListener('click', function() {
                    if (document.querySelectorAll('.zone-item').length > 1) {
                        zonesList.removeChild(newZone);
                    } else {
                        alert('You need at least one security zone.');
                    }
                });
            }
            
            zoneCounter++;
        });
        
        // Add event listener to the first zone's remove button
        const firstZoneRemoveBtn = document.querySelector('.remove-zone');
        if (firstZoneRemoveBtn) {
            firstZoneRemoveBtn.addEventListener('click', function() {
                // Don't remove if it's the only one remaining
                if (document.querySelectorAll('.zone-item').length > 1) {
                    const zoneId = this.getAttribute('data-id');
                    const zoneItem = this.closest('.zone-item');
                    zonesList.removeChild(zoneItem);
                } else {
                    alert('You need at least one security zone.');
                }
            });
        }
    }
    
    // Security Policies management
    let policyCounter = 1;
    const addPolicyBtn = document.getElementById('add-policy');
    const policiesList = document.getElementById('policies-list');
    
    if (addPolicyBtn && policiesList) {
        addPolicyBtn.addEventListener('click', () => {
            const newPolicy = document.createElement('div');
            newPolicy.className = 'policy-item';
            newPolicy.innerHTML = `
                <div class="input-group">
                    <label for="policy-name-${policyCounter}">Policy Name:</label>
                    <input type="text" id="policy-name-${policyCounter}" placeholder="allow-internal-to-dmz">
                </div>
                <div class="input-group">
                    <label for="policy-from-zone-${policyCounter}">From Zone:</label>
                    <input type="text" id="policy-from-zone-${policyCounter}" placeholder="trust">
                </div>
                <div class="input-group">
                    <label for="policy-to-zone-${policyCounter}">To Zone:</label>
                    <input type="text" id="policy-to-zone-${policyCounter}" placeholder="dmz">
                </div>
                <div class="input-group">
                    <label for="policy-source-address-${policyCounter}">Source Address:</label>
                    <input type="text" id="policy-source-address-${policyCounter}" placeholder="192.168.1.0/24">
                </div>
                <div class="input-group">
                    <label for="policy-destination-address-${policyCounter}">Destination Address:</label>
                    <input type="text" id="policy-destination-address-${policyCounter}" placeholder="10.0.0.1/32">
                </div>
                <div class="input-group">
                    <label for="policy-application-${policyCounter}">Application (comma separated):</label>
                    <input type="text" id="policy-application-${policyCounter}" placeholder="junos-http, junos-https, junos-ssh">
                </div>
                <div class="input-group">
                    <label for="policy-action-${policyCounter}">Action:</label>
                    <select id="policy-action-${policyCounter}">
                        <option value="permit">permit</option>
                        <option value="deny">deny</option>
                    </select>
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="policy-log-${policyCounter}">
                    <label for="policy-log-${policyCounter}">Enable Logging</label>
                </div>
                <button class="remove-policy" data-id="${policyCounter}">Remove Policy</button>
            `;
            
            policiesList.appendChild(newPolicy);
            
            // Add event listener for the remove button
            const removePolicyBtn = newPolicy.querySelector('.remove-policy');
            if (removePolicyBtn) {
                removePolicyBtn.addEventListener('click', function() {
                    if (document.querySelectorAll('.policy-item').length > 1) {
                        policiesList.removeChild(newPolicy);
                    } else {
                        alert('You need at least one security policy.');
                    }
                });
            }
            
            policyCounter++;
        });
        
        // Add event listener to the first policy's remove button
        const firstPolicyRemoveBtn = document.querySelector('.remove-policy');
        if (firstPolicyRemoveBtn) {
            firstPolicyRemoveBtn.addEventListener('click', function() {
                if (document.querySelectorAll('.policy-item').length > 1) {
                    const policyId = this.getAttribute('data-id');
                    const policyItem = this.closest('.policy-item');
                    policiesList.removeChild(policyItem);
                } else {
                    alert('You need at least one security policy.');
                }
            });
        }
    }
    
    // Prefix Lists management
    let prefixListCounter = 1;
    const addPrefixListBtn = document.getElementById('add-prefix-list');
    const prefixListsList = document.getElementById('prefix-lists');
    
    if (addPrefixListBtn && prefixListsList) {
        addPrefixListBtn.addEventListener('click', () => {
            const newPrefixList = document.createElement('div');
            newPrefixList.className = 'prefix-list-item';
            newPrefixList.innerHTML = `
                <div class="input-group">
                    <label for="prefix-list-name-${prefixListCounter}">Prefix List Name:</label>
                    <input type="text" id="prefix-list-name-${prefixListCounter}" placeholder="internal-networks">
                </div>
                <div class="prefix-entries" id="prefix-entries-${prefixListCounter}">
                    <div class="prefix-entry">
                        <div class="input-group">
                            <label for="prefix-entry-${prefixListCounter}-0">Prefix:</label>
                            <input type="text" id="prefix-entry-${prefixListCounter}-0" placeholder="192.168.0.0/16">
                        </div>
                    </div>
                </div>
                <button class="add-prefix-entry" data-list-id="${prefixListCounter}">Add Prefix</button>
                <button class="remove-prefix-list" data-id="${prefixListCounter}">Remove Prefix List</button>
            `;
            
            prefixListsList.appendChild(newPrefixList);
            
            // Add event listener for adding prefixes
            const addPrefixEntryBtn = newPrefixList.querySelector('.add-prefix-entry');
            const prefixEntriesContainer = newPrefixList.querySelector(`#prefix-entries-${prefixListCounter}`);
            
            if (addPrefixEntryBtn && prefixEntriesContainer) {
                let prefixEntryCounter = 1;
                
                addPrefixEntryBtn.addEventListener('click', () => {
                    const newEntry = document.createElement('div');
                    newEntry.className = 'prefix-entry';
                    newEntry.innerHTML = `
                        <div class="input-group">
                            <label for="prefix-entry-${prefixListCounter}-${prefixEntryCounter}">Prefix:</label>
                            <input type="text" id="prefix-entry-${prefixListCounter}-${prefixEntryCounter}" placeholder="10.0.0.0/8">
                        </div>
                        <button class="remove-prefix-entry">Remove</button>
                    `;
                    
                    prefixEntriesContainer.appendChild(newEntry);
                    
                    // Add event listener for removing the entry
                    const removeEntryBtn = newEntry.querySelector('.remove-prefix-entry');
                    if (removeEntryBtn) {
                        removeEntryBtn.addEventListener('click', () => {
                            prefixEntriesContainer.removeChild(newEntry);
                        });
                    }
                    
                    prefixEntryCounter++;
                });
            }
            
            // Add event listener for removing the prefix list
            const removePrefixListBtn = newPrefixList.querySelector('.remove-prefix-list');
            if (removePrefixListBtn) {
                removePrefixListBtn.addEventListener('click', function() {
                    if (document.querySelectorAll('.prefix-list-item').length > 1) {
                        prefixListsList.removeChild(newPrefixList);
                    } else {
                        alert('You need at least one prefix list.');
                    }
                });
            }
            
            prefixListCounter++;
        });
        
        // Add event listener to the first prefix list's add prefix button
        const firstAddPrefixEntryBtn = document.querySelector('.add-prefix-entry');
        const firstPrefixEntriesContainer = document.querySelector('#prefix-entries-0');
        
        if (firstAddPrefixEntryBtn && firstPrefixEntriesContainer) {
            let firstListPrefixEntryCounter = 1;
            
            firstAddPrefixEntryBtn.addEventListener('click', () => {
                const newEntry = document.createElement('div');
                newEntry.className = 'prefix-entry';
                newEntry.innerHTML = `
                    <div class="input-group">
                        <label for="prefix-entry-0-${firstListPrefixEntryCounter}">Prefix:</label>
                        <input type="text" id="prefix-entry-0-${firstListPrefixEntryCounter}" placeholder="10.0.0.0/8">
                    </div>
                    <button class="remove-prefix-entry">Remove</button>
                `;
                
                firstPrefixEntriesContainer.appendChild(newEntry);
                
                // Add event listener for removing the entry
                const removeEntryBtn = newEntry.querySelector('.remove-prefix-entry');
                if (removeEntryBtn) {
                    removeEntryBtn.addEventListener('click', () => {
                        firstPrefixEntriesContainer.removeChild(newEntry);
                    });
                }
                
                firstListPrefixEntryCounter++;
            });
        }
        
        // Add event listener to the first prefix list's remove button
        const firstPrefixListRemoveBtn = document.querySelector('.remove-prefix-list');
        if (firstPrefixListRemoveBtn) {
            firstPrefixListRemoveBtn.addEventListener('click', function() {
                if (document.querySelectorAll('.prefix-list-item').length > 1) {
                    const prefixListId = this.getAttribute('data-id');
                    const prefixListItem = this.closest('.prefix-list-item');
                    prefixListsList.removeChild(prefixListItem);
                } else {
                    alert('You need at least one prefix list.');
                }
            });
        }
    }
    
    // Route Filters management
    let routeFilterCounter = 1;
    const addRouteFilterBtn = document.getElementById('add-route-filter');
    const routeFiltersList = document.getElementById('route-filters');
    
    if (addRouteFilterBtn && routeFiltersList) {
        addRouteFilterBtn.addEventListener('click', () => {
            const newRouteFilter = document.createElement('div');
            newRouteFilter.className = 'route-filter-item';
            newRouteFilter.innerHTML = `
                <div class="input-group">
                    <label for="route-filter-prefix-${routeFilterCounter}">Route Filter Prefix:</label>
                    <input type="text" id="route-filter-prefix-${routeFilterCounter}" placeholder="0.0.0.0/0">
                </div>
                <div class="input-group">
                    <label for="route-filter-action-${routeFilterCounter}">Action:</label>
                    <select id="route-filter-action-${routeFilterCounter}">
                        <option value="accept">accept</option>
                        <option value="reject">reject</option>
                    </select>
                </div>
                <button class="remove-route-filter" data-id="${routeFilterCounter}">Remove Filter</button>
            `;
            
            routeFiltersList.appendChild(newRouteFilter);
            
            // Add event listener for removing the route filter
            const removeRouteFilterBtn = newRouteFilter.querySelector('.remove-route-filter');
            if (removeRouteFilterBtn) {
                removeRouteFilterBtn.addEventListener('click', function() {
                    if (document.querySelectorAll('.route-filter-item').length > 1) {
                        routeFiltersList.removeChild(newRouteFilter);
                    } else {
                        alert('You need at least one route filter.');
                    }
                });
            }
            
            routeFilterCounter++;
        });
        
        // Add event listener to the first route filter's remove button
        const firstRouteFilterRemoveBtn = document.querySelector('.remove-route-filter');
        if (firstRouteFilterRemoveBtn) {
            firstRouteFilterRemoveBtn.addEventListener('click', function() {
                if (document.querySelectorAll('.route-filter-item').length > 1) {
                    const routeFilterId = this.getAttribute('data-id');
                    const routeFilterItem = this.closest('.route-filter-item');
                    routeFiltersList.removeChild(routeFilterItem);
                } else {
                    alert('You need at least one route filter.');
                }
            });
        }
    }
    
    // Routing Policies management
    let policyListCounter = 1;
    const addPolicyListBtn = document.getElementById('add-policy-list');
    const policyListsList = document.getElementById('policy-lists');
    
    if (addPolicyListBtn && policyListsList) {
        addPolicyListBtn.addEventListener('click', () => {
            const newPolicyList = document.createElement('div');
            newPolicyList.className = 'policy-list-item';
            newPolicyList.innerHTML = `
                <div class="input-group">
                    <label for="policy-list-name-${policyListCounter}">Policy Name:</label>
                    <input type="text" id="policy-list-name-${policyListCounter}" placeholder="export-to-isp">
                </div>
                <div class="policy-statements" id="policy-statements-${policyListCounter}">
                    <div class="policy-statement">
                        <div class="input-group">
                            <label for="statement-name-${policyListCounter}-0">Statement Name:</label>
                            <input type="text" id="statement-name-${policyListCounter}-0" placeholder="match-prefixes">
                        </div>
                        <div class="input-group">
                            <label for="statement-from-${policyListCounter}-0">From (prefix-list or route-filter):</label>
                            <input type="text" id="statement-from-${policyListCounter}-0" placeholder="internal-networks">
                        </div>
                        <div class="input-group">
                            <label for="statement-then-${policyListCounter}-0">Then:</label>
                            <select id="statement-then-${policyListCounter}-0">
                                <option value="accept">accept</option>
                                <option value="reject">reject</option>
                            </select>
                        </div>
                    </div>
                </div>
                <button class="add-statement" data-policy-id="${policyListCounter}">Add Statement</button>
                <button class="remove-policy-list" data-id="${policyListCounter}">Remove Policy</button>
            `;
            
            policyListsList.appendChild(newPolicyList);
            
            // Add event listener for adding statements
            const addStatementBtn = newPolicyList.querySelector('.add-statement');
            const statementsContainer = newPolicyList.querySelector(`#policy-statements-${policyListCounter}`);
            
            if (addStatementBtn && statementsContainer) {
                let statementCounter = 1;
                
                addStatementBtn.addEventListener('click', () => {
                    const newStatement = document.createElement('div');
                    newStatement.className = 'policy-statement';
                    newStatement.innerHTML = `
                        <div class="input-group">
                            <label for="statement-name-${policyListCounter}-${statementCounter}">Statement Name:</label>
                            <input type="text" id="statement-name-${policyListCounter}-${statementCounter}" placeholder="set-attributes">
                        </div>
                        <div class="input-group">
                            <label for="statement-from-${policyListCounter}-${statementCounter}">From (prefix-list or route-filter):</label>
                            <input type="text" id="statement-from-${policyListCounter}-${statementCounter}" placeholder="internal-networks">
                        </div>
                        <div class="input-group">
                            <label for="statement-then-${policyListCounter}-${statementCounter}">Then:</label>
                            <select id="statement-then-${policyListCounter}-${statementCounter}">
                                <option value="accept">accept</option>
                                <option value="reject">reject</option>
                            </select>
                        </div>
                        <button class="remove-statement">Remove</button>
                    `;
                    
                    statementsContainer.appendChild(newStatement);
                    
                    // Add event listener for removing the statement
                    const removeStatementBtn = newStatement.querySelector('.remove-statement');
                    if (removeStatementBtn) {
                        removeStatementBtn.addEventListener('click', () => {
                            statementsContainer.removeChild(newStatement);
                        });
                    }
                    
                    statementCounter++;
                });
            }
            
            // Add event listener for removing the policy list
            const removePolicyListBtn = newPolicyList.querySelector('.remove-policy-list');
            if (removePolicyListBtn) {
                removePolicyListBtn.addEventListener('click', function() {
                    if (document.querySelectorAll('.policy-list-item').length > 1) {
                        policyListsList.removeChild(newPolicyList);
                    } else {
                        alert('You need at least one policy.');
                    }
                });
            }
            
            policyListCounter++;
        });
        
        // Add event listener to the first policy list's add statement button
        const firstAddStatementBtn = document.querySelector('.add-statement');
        const firstStatementsContainer = document.querySelector('#policy-statements-0');
        
        if (firstAddStatementBtn && firstStatementsContainer) {
            let firstPolicyStatementCounter = 1;
            
            firstAddStatementBtn.addEventListener('click', () => {
                const newStatement = document.createElement('div');
                newStatement.className = 'policy-statement';
                newStatement.innerHTML = `
                    <div class="input-group">
                        <label for="statement-name-0-${firstPolicyStatementCounter}">Statement Name:</label>
                        <input type="text" id="statement-name-0-${firstPolicyStatementCounter}" placeholder="set-attributes">
                    </div>
                    <div class="input-group">
                        <label for="statement-from-0-${firstPolicyStatementCounter}">From (prefix-list or route-filter):</label>
                        <input type="text" id="statement-from-0-${firstPolicyStatementCounter}" placeholder="internal-networks">
                    </div>
                    <div class="input-group">
                        <label for="statement-then-0-${firstPolicyStatementCounter}">Then:</label>
                        <select id="statement-then-0-${firstPolicyStatementCounter}">
                            <option value="accept">accept</option>
                            <option value="reject">reject</option>
                        </select>
                    </div>
                    <button class="remove-statement">Remove</button>
                `;
                
                firstStatementsContainer.appendChild(newStatement);
                
                // Add event listener for removing the statement
                const removeStatementBtn = newStatement.querySelector('.remove-statement');
                if (removeStatementBtn) {
                    removeStatementBtn.addEventListener('click', () => {
                        firstStatementsContainer.removeChild(newStatement);
                    });
                }
                
                firstPolicyStatementCounter++;
            });
        }
        
        // Add event listener to the first policy list's remove button
        const firstPolicyListRemoveBtn = document.querySelector('.remove-policy-list');
        if (firstPolicyListRemoveBtn) {
            firstPolicyListRemoveBtn.addEventListener('click', function() {
                if (document.querySelectorAll('.policy-list-item').length > 1) {
                    const policyListId = this.getAttribute('data-id');
                    const policyListItem = this.closest('.policy-list-item');
                    policyListsList.removeChild(policyListItem);
                } else {
                    alert('You need at least one policy.');
                }
            });
        }
    }
    
    // Add validation functionality
    const validateBtn = document.getElementById('validate-config');
    const validationContainer = document.getElementById('validation-container');
    const validationResults = document.getElementById('validation-results');
    const validationErrorsCount = document.getElementById('validation-errors');
    const validationWarningsCount = document.getElementById('validation-warnings');
    const validationInfoCount = document.getElementById('validation-info');
    
    if (validateBtn && validationContainer) {
        validateBtn.addEventListener('click', () => {
            const issues = validateConfiguration();
            displayValidationResults(issues);
        });
        
        // Close validation panel
        const closeValidationBtn = document.getElementById('close-validation');
        if (closeValidationBtn) {
            closeValidationBtn.addEventListener('click', () => {
                validationContainer.style.display = 'none';
            });
        }
    }
    
    // Validation rules and patterns
    const validationRules = {
        ipAddress: /^(\d{1,3}\.){3}\d{1,3}$/,
        ipv6Address: /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,7}:|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})$|^:((:[0-9a-fA-F]{1,4}){1,7}|:)$/,
        hostname: /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?$/,
        domainName: /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
        passwordStrength: function(password) {
            return password && password.length >= 8;
        },
        validSubnet: function(ip, prefix) {
            if (!ip || !prefix) return false;
            
            // Basic IP validation
            if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) return false;
            
            // Check prefix is valid
            if (prefix < 0 || prefix > 32) return false;
            
            return true;
        },
        validIpv6Subnet: function(ip, prefix) {
            if (!ip || !prefix) return false;
            
            // Basic IPv6 validation (simplified)
            if (!/^[0-9a-fA-F:]+$/.test(ip)) return false;
            
            // Check prefix is valid
            if (prefix < 0 || prefix > 128) return false;
            
            return true;
        },
        securityChecks: [
            {
                id: 'root-password',
                check: () => document.getElementById('root-password').value.length > 0,
                message: 'Root password is not set. This is a security risk in production environments.',
                severity: 'error',
                fix: () => { alert('Please set a strong root password'); document.getElementById('root-password').focus(); }
            },
            {
                id: 'ssh-access',
                check: () => {
                    const interfaces = document.querySelectorAll('.interface-item');
                    let hasManagementInterface = false;
                    interfaces.forEach(interface => {
                        const type = interface.querySelector('select').value;
                        if (type === 'em0' || type === 'fxp0') {
                            hasManagementInterface = true;
                        }
                    });
                    return hasManagementInterface;
                },
                message: 'No dedicated management interface (em0/fxp0) detected. It is recommended to have a separate management interface for secure access.',
                severity: 'warning',
                fix: () => { 
                    alert('Add a management interface (em0 or fxp0) for secure management access');
                    const addInterfaceBtn = document.getElementById('add-interface');
                    if (addInterfaceBtn) addInterfaceBtn.click();
                }
            },
            {
                id: 'ntp-config',
                check: () => {
                    const ntpEnabled = document.getElementById('ntp-enabled');
                    return ntpEnabled && ntpEnabled.checked;
                },
                message: 'NTP is not configured. Accurate time is important for logging, authentication, and security features.',
                severity: 'info',
                fix: () => { 
                    const ntpEnabled = document.getElementById('ntp-enabled');
                    if (ntpEnabled) {
                        ntpEnabled.checked = true;
                        ntpEnabled.dispatchEvent(new Event('change'));
                    }
                }
            },
            {
                id: 'syslog-config',
                check: () => {
                    const syslogEnabled = document.getElementById('syslog-enabled');
                    return syslogEnabled && syslogEnabled.checked;
                },
                message: 'Syslog is not configured. Remote logging is recommended for security and troubleshooting.',
                severity: 'info',
                fix: () => { 
                    const syslogEnabled = document.getElementById('syslog-enabled');
                    if (syslogEnabled) {
                        syslogEnabled.checked = true;
                        syslogEnabled.dispatchEvent(new Event('change'));
                    }
                }
            }
        ]
    };
    
    // Function to validate the configuration
    function validateConfiguration() {
        const issues = [];
        
        // Check hostname
        const hostname = document.getElementById('hostname').value;
        if (!hostname) {
            issues.push({
                id: 'hostname-empty',
                message: 'Hostname is not set. This is required for device identification.',
                severity: 'error',
                fix: () => { document.getElementById('hostname').focus(); }
            });
        } else if (!validationRules.hostname.test(hostname)) {
            issues.push({
                id: 'hostname-invalid',
                message: 'Hostname contains invalid characters. Use only alphanumeric characters and hyphens.',
                severity: 'error',
                fix: () => { document.getElementById('hostname').focus(); }
            });
        }
        
        // Check domain name if present
        const domainName = document.getElementById('domain-name').value;
        if (domainName && !validationRules.domainName.test(domainName)) {
            issues.push({
                id: 'domain-invalid',
                message: 'Domain name is invalid. Use a valid domain format like example.com.',
                severity: 'warning',
                fix: () => { document.getElementById('domain-name').focus(); }
            });
        }
        
        // Check interfaces
        const interfaces = document.querySelectorAll('.interface-item');
        if (interfaces.length === 0) {
            issues.push({
                id: 'no-interfaces',
                message: 'No interfaces configured. At least one interface is recommended.',
                severity: 'warning',
                fix: () => { 
                    const addInterfaceBtn = document.getElementById('add-interface');
                    if (addInterfaceBtn) addInterfaceBtn.click();
                }
            });
        } else {
            interfaces.forEach((interface, index) => {
                const ipAddress = interface.querySelector(`#ip-address-${index}`).value;
                const prefixLength = interface.querySelector(`#prefix-length-${index}`).value;
                
                if (ipAddress && !validationRules.ipAddress.test(ipAddress)) {
                    issues.push({
                        id: `interface-${index}-ip-invalid`,
                        message: `Interface ${index+1} has an invalid IP address format. Use IPv4 format (e.g., 192.168.1.1).`,
                        severity: 'error',
                        fix: () => { interface.querySelector(`#ip-address-${index}`).focus(); }
                    });
                } else if (ipAddress && !validationRules.validSubnet(ipAddress, prefixLength)) {
                    issues.push({
                        id: `interface-${index}-subnet-invalid`,
                        message: `Interface ${index+1} has an invalid subnet configuration. Check IP and prefix length.`,
                        severity: 'error',
                        fix: () => { interface.querySelector(`#prefix-length-${index}`).focus(); }
                    });
                }
                
                // Check IPv6 if enabled
                const ipv6Enabled = interface.querySelector(`#ipv6-enabled-${index}`).checked;
                if (ipv6Enabled) {
                    const ipv6Address = interface.querySelector(`#ipv6-address-${index}`).value;
                    const ipv6PrefixLength = interface.querySelector(`#ipv6-prefix-length-${index}`).value;
                    
                    if (!ipv6Address) {
                        issues.push({
                            id: `interface-${index}-ipv6-empty`,
                            message: `Interface ${index+1} has IPv6 enabled but no address specified.`,
                            severity: 'warning',
                            fix: () => { interface.querySelector(`#ipv6-address-${index}`).focus(); }
                        });
                    } else if (!validationRules.validIpv6Subnet(ipv6Address, ipv6PrefixLength)) {
                        issues.push({
                            id: `interface-${index}-ipv6-invalid`,
                            message: `Interface ${index+1} has an invalid IPv6 configuration. Check address and prefix length.`,
                            severity: 'error',
                            fix: () => { interface.querySelector(`#ipv6-address-${index}`).focus(); }
                        });
                    }
                }
            });
        }
        
        // Check routing configuration
        const staticEnabled = document.getElementById('static-enabled') && document.getElementById('static-enabled').checked;
        const ospfEnabled = document.getElementById('ospf-enabled') && document.getElementById('ospf-enabled').checked;
        const bgpEnabled = document.getElementById('bgp-enabled') && document.getElementById('bgp-enabled').checked;
        
        // Check static routes
        if (staticEnabled) {
            const staticRoutes = document.querySelectorAll('.static-route-item');
            if (staticRoutes.length === 0) {
                issues.push({
                    id: 'no-static-routes',
                    message: 'Static routing is enabled but no routes are configured.',
                    severity: 'warning',
                    fix: () => { 
                        const addStaticRouteBtn = document.getElementById('add-static-route');
                        if (addStaticRouteBtn) addStaticRouteBtn.click();
                    }
                });
            } else {
                staticRoutes.forEach((route, index) => {
                    const destination = route.querySelector(`#route-destination-${index}`).value;
                    const prefix = route.querySelector(`#route-prefix-${index}`).value || '24';
                    const nextHop = route.querySelector(`#next-hop-${index}`).value;
                    
                    if (!destination || !nextHop) {
                        issues.push({
                            id: `static-route-${index}-incomplete`,
                            message: `Static route ${index+1} is incomplete. Destination and next hop are required.`,
                            severity: 'error',
                            fix: () => { 
                                if (!destination) route.querySelector(`#route-destination-${index}`).focus();
                                else if (!nextHop) route.querySelector(`#next-hop-${index}`).focus();
                            }
                        });
                    } else if (!validationRules.ipAddress.test(destination)) {
                        issues.push({
                            id: `static-route-${index}-destination-invalid`,
                            message: `Static route ${index+1} has an invalid destination address format.`,
                            severity: 'error',
                            fix: () => { route.querySelector(`#route-destination-${index}`).focus(); }
                        });
                    } else if (!validationRules.ipAddress.test(nextHop)) {
                        issues.push({
                            id: `static-route-${index}-nexthop-invalid`,
                            message: `Static route ${index+1} has an invalid next hop address format.`,
                            severity: 'error',
                            fix: () => { route.querySelector(`#next-hop-${index}`).focus(); }
                        });
                    }
                });
            }
        }
        
        // Check OSPF configuration
        if (ospfEnabled) {
            const routerId = document.getElementById('ospf-router-id').value;
            if (!routerId) {
                issues.push({
                    id: 'ospf-router-id-missing',
                    message: 'OSPF is enabled but router ID is not set. This is required for OSPF operation.',
                    severity: 'error',
                    fix: () => { document.getElementById('ospf-router-id').focus(); }
                });
            } else if (!validationRules.ipAddress.test(routerId)) {
                issues.push({
                    id: 'ospf-router-id-invalid',
                    message: 'OSPF router ID has an invalid format. It should be in IPv4 format (e.g., 1.1.1.1).',
                    severity: 'error',
                    fix: () => { document.getElementById('ospf-router-id').focus(); }
                });
            }
            
            const ospfAreas = document.querySelectorAll('.ospf-area-item');
            if (ospfAreas.length === 0) {
                issues.push({
                    id: 'no-ospf-areas',
                    message: 'OSPF is enabled but no areas are configured.',
                    severity: 'error',
                    fix: () => { 
                        const addOspfAreaBtn = document.getElementById('add-ospf-area');
                        if (addOspfAreaBtn) addOspfAreaBtn.click();
                    }
                });
            } else {
                ospfAreas.forEach((area, index) => {
                    const areaId = area.querySelector(`#ospf-area-id-${index}`).value;
                    const interfaces = area.querySelector(`#ospf-area-interfaces-${index}`).value;
                    
                    if (!areaId || !interfaces) {
                        issues.push({
                            id: `ospf-area-${index}-incomplete`,
                            message: `OSPF area ${index+1} is incomplete. Area ID and interfaces are required.`,
                            severity: 'error',
                            fix: () => { 
                                if (!areaId) area.querySelector(`#ospf-area-id-${index}`).focus();
                                else if (!interfaces) area.querySelector(`#ospf-area-interfaces-${index}`).focus();
                            }
                        });
                    }
                });
            }
        }
        
        // Check BGP configuration
        if (bgpEnabled) {
            const localAs = document.getElementById('bgp-local-as').value;
            const routerId = document.getElementById('bgp-router-id').value;
            
            if (!localAs) {
                issues.push({
                    id: 'bgp-local-as-missing',
                    message: 'BGP is enabled but local AS number is not set. This is required for BGP operation.',
                    severity: 'error',
                    fix: () => { document.getElementById('bgp-local-as').focus(); }
                });
            }
            
            if (!routerId) {
                issues.push({
                    id: 'bgp-router-id-missing',
                    message: 'BGP is enabled but router ID is not set. This is required for BGP operation.',
                    severity: 'error',
                    fix: () => { document.getElementById('bgp-router-id').focus(); }
                });
            } else if (!validationRules.ipAddress.test(routerId)) {
                issues.push({
                    id: 'bgp-router-id-invalid',
                    message: 'BGP router ID has an invalid format. It should be in IPv4 format (e.g., 1.1.1.1).',
                    severity: 'error',
                    fix: () => { document.getElementById('bgp-router-id').focus(); }
                });
            }
            
            const bgpNeighbors = document.querySelectorAll('.bgp-neighbor-item');
            if (bgpNeighbors.length === 0) {
                issues.push({
                    id: 'no-bgp-neighbors',
                    message: 'BGP is enabled but no neighbors are configured.',
                    severity: 'error',
                    fix: () => { 
                        const addBgpNeighborBtn = document.getElementById('add-bgp-neighbor');
                        if (addBgpNeighborBtn) addBgpNeighborBtn.click();
                    }
                });
            } else {
                bgpNeighbors.forEach((neighbor, index) => {
                    const peerAddress = neighbor.querySelector(`#bgp-peer-address-${index}`).value;
                    const peerAs = neighbor.querySelector(`#bgp-peer-as-${index}`).value;
                    
                    if (!peerAddress || !peerAs) {
                        issues.push({
                            id: `bgp-neighbor-${index}-incomplete`,
                            message: `BGP neighbor ${index+1} is incomplete. Peer address and AS number are required.`,
                            severity: 'error',
                            fix: () => { 
                                if (!peerAddress) neighbor.querySelector(`#bgp-peer-address-${index}`).focus();
                                else if (!peerAs) neighbor.querySelector(`#bgp-peer-as-${index}`).focus();
                            }
                        });
                    } else if (!validationRules.ipAddress.test(peerAddress)) {
                        issues.push({
                            id: `bgp-neighbor-${index}-address-invalid`,
                            message: `BGP neighbor ${index+1} has an invalid peer address format.`,
                            severity: 'error',
                            fix: () => { neighbor.querySelector(`#bgp-peer-address-${index}`).focus(); }
                        });
                    }
                });
            }
        }
        
        // Run security checks
        validationRules.securityChecks.forEach(check => {
            if (!check.check()) {
                issues.push({
                    id: check.id,
                    message: check.message,
                    severity: check.severity,
                    fix: check.fix
                });
            }
        });
        
        return issues;
    }
    
    // Function to display validation results
    function displayValidationResults(issues) {
        if (!validationContainer || !validationResults) return;
        
        // Clear previous results
        validationResults.innerHTML = '';
        
        // Count issues by severity
        const errorCount = issues.filter(issue => issue.severity === 'error').length;
        const warningCount = issues.filter(issue => issue.severity === 'warning').length;
        const infoCount = issues.filter(issue => issue.severity === 'info').length;
        
        // Update counts
        if (validationErrorsCount) validationErrorsCount.textContent = `${errorCount} Error${errorCount !== 1 ? 's' : ''}`;
        if (validationWarningsCount) validationWarningsCount.textContent = `${warningCount} Warning${warningCount !== 1 ? 's' : ''}`;
        if (validationInfoCount) validationInfoCount.textContent = `${infoCount} Suggestion${infoCount !== 1 ? 's' : ''}`;
        
        // If no issues, add success message
        if (issues.length === 0) {
            const successItem = document.createElement('div');
            successItem.className = 'validation-item info';
            successItem.innerHTML = `
                <div class="validation-icon info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>
                <div class="validation-content">
                    <div class="validation-title">Configuration Validated</div>
                    <div class="validation-message">No issues found. Your configuration looks good!</div>
                </div>
            `;
            validationResults.appendChild(successItem);
        } else {
            // Sort issues by severity: error, warning, info
            const sortedIssues = [...issues].sort((a, b) => {
                const severityOrder = { error: 0, warning: 1, info: 2 };
                return severityOrder[a.severity] - severityOrder[b.severity];
            });
            
            // Add each issue
            sortedIssues.forEach(issue => {
                const issueItem = document.createElement('div');
                issueItem.className = `validation-item ${issue.severity}`;
                
                let iconSvg = '';
                if (issue.severity === 'error') {
                    iconSvg = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    `;
                } else if (issue.severity === 'warning') {
                    iconSvg = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    `;
                } else {
                    iconSvg = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                    `;
                }
                
                let fixButton = '';
                if (issue.fix) {
                    fixButton = `<button class="validation-fix">Fix Issue</button>`;
                }
                
                issueItem.innerHTML = `
                    <div class="validation-icon ${issue.severity}">
                        ${iconSvg}
                    </div>
                    <div class="validation-content">
                        <div class="validation-title">${issue.severity === 'info' ? 'Suggestion' : issue.severity === 'warning' ? 'Warning' : 'Error'}</div>
                        <div class="validation-message">${issue.message}</div>
                        ${fixButton}
                    </div>
                `;
                
                validationResults.appendChild(issueItem);
                
                // Add click handler for fix button if present
                if (issue.fix) {
                    const fixBtn = issueItem.querySelector('.validation-fix');
                    if (fixBtn) {
                        fixBtn.addEventListener('click', () => {
                            issue.fix();
                        });
                    }
                }
            });
        }
        
        // Show validation container
        validationContainer.style.display = 'block';
    }
    
    // Handle custom interface name visibility
    function setupInterfaceTypeListeners() {
        document.querySelectorAll('.interface-type-select').forEach(select => {
            select.addEventListener('change', function() {
                const index = this.id.split('-').pop();
                const customInterfaceField = document.getElementById(`custom-interface-name-${index}`);
                
                if (this.value === 'custom') {
                    customInterfaceField.style.display = 'block';
                } else {
                    customInterfaceField.style.display = 'none';
                }
            });
        });
    }
    
    // Set up initial listeners for the first interface
    setupInterfaceTypeListeners();
    
    // Add interface function
    function addInterface() {
        const interfacesList = document.getElementById('interfaces-list');
        const interfaces = interfacesList.querySelectorAll('.interface-item');
        const newIndex = interfaces.length;
        
        const newInterface = document.createElement('div');
        newInterface.className = 'interface-item';
        newInterface.innerHTML = `
            <div class="interface-header">
                <div class="input-group">
                    <label for="interface-type-${newIndex}">Interface:</label>
                    <select id="interface-type-${newIndex}" class="interface-type-select">
                        <option value="ge-0/0/0">ge-0/0/0</option>
                        <option value="ge-0/0/1">ge-0/0/1</option>
                        <option value="xe-0/0/0">xe-0/0/0</option>
                        <option value="xe-0/0/1">xe-0/0/1</option>
                        <option value="et-0/0/0">et-0/0/0</option>
                        <option value="lo0">lo0</option>
                        <option value="em0">em0</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>
                <div class="input-group custom-interface-name" id="custom-interface-name-${newIndex}" style="display: none;">
                    <label for="custom-interface-value-${newIndex}">Custom Interface Name:</label>
                    <input type="text" id="custom-interface-value-${newIndex}" placeholder="Enter interface name (e.g., ae0)">
                </div>
                <button class="remove-interface" data-id="${newIndex}">Remove</button>
            </div>
            <div class="interface-config">
                <div class="input-group">
                    <label for="unit-number-${newIndex}">Unit Number:</label>
                    <input type="number" id="unit-number-${newIndex}" placeholder="0" value="0" min="0" max="16385">
                </div>
                <div class="input-group">
                    <label for="ip-address-${newIndex}">IP Address:</label>
                    <input type="text" id="ip-address-${newIndex}" placeholder="192.168.1.1">
                </div>
                <div class="input-group">
                    <label for="prefix-length-${newIndex}">Prefix Length:</label>
                    <input type="number" id="prefix-length-${newIndex}" placeholder="24" value="24" min="1" max="32">
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="ipv6-enabled-${newIndex}">
                    <label for="ipv6-enabled-${newIndex}">Configure IPv6</label>
                </div>
                <div class="ipv6-config" id="ipv6-config-${newIndex}" style="display: none;">
                    <div class="input-group">
                        <label for="ipv6-address-${newIndex}">IPv6 Address:</label>
                        <input type="text" id="ipv6-address-${newIndex}" placeholder="2001:db8::1">
                    </div>
                    <div class="input-group">
                        <label for="ipv6-prefix-length-${newIndex}">Prefix Length:</label>
                        <input type="number" id="ipv6-prefix-length-${newIndex}" placeholder="64" value="64" min="1" max="128">
                    </div>
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="interface-description-enabled-${newIndex}">
                    <label for="interface-description-enabled-${newIndex}">Add Description</label>
                </div>
                <div class="input-group description-input" id="description-group-${newIndex}" style="display: none;">
                    <label for="interface-description-${newIndex}">Description:</label>
                    <input type="text" id="interface-description-${newIndex}" placeholder="LAN Interface">
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="vlan-enabled-${newIndex}">
                    <label for="vlan-enabled-${newIndex}">Configure VLAN</label>
                </div>
                <div class="vlan-config" id="vlan-config-${newIndex}" style="display: none;">
                    <div class="input-group">
                        <label for="vlan-id-${newIndex}">VLAN ID:</label>
                        <input type="number" id="vlan-id-${newIndex}" placeholder="10" min="1" max="4094">
                    </div>
                </div>
            </div>
        `;
        
        interfacesList.appendChild(newInterface);
        
        // Set up listeners for the new interface
        const ipv6Checkbox = document.getElementById(`ipv6-enabled-${newIndex}`);
        ipv6Checkbox.addEventListener('change', function() {
            const ipv6Config = document.getElementById(`ipv6-config-${newIndex}`);
            ipv6Config.style.display = this.checked ? 'block' : 'none';
        });
        
        const descCheckbox = document.getElementById(`interface-description-enabled-${newIndex}`);
        descCheckbox.addEventListener('change', function() {
            const descGroup = document.getElementById(`description-group-${newIndex}`);
            descGroup.style.display = this.checked ? 'block' : 'none';
        });
        
        const vlanCheckbox = document.getElementById(`vlan-enabled-${newIndex}`);
        vlanCheckbox.addEventListener('change', function() {
            const vlanConfig = document.getElementById(`vlan-config-${newIndex}`);
            vlanConfig.style.display = this.checked ? 'block' : 'none';
        });
        
        const removeBtn = newInterface.querySelector('.remove-interface');
        removeBtn.addEventListener('click', function() {
            if (document.querySelectorAll('.interface-item').length > 1) {
                interfacesList.removeChild(newInterface);
            } else {
                alert('You need at least one interface.');
            }
        });
        
        // Set up custom interface listener
        const interfaceTypeSelect = document.getElementById(`interface-type-${newIndex}`);
        interfaceTypeSelect.addEventListener('change', function() {
            const customInterfaceField = document.getElementById(`custom-interface-name-${newIndex}`);
            customInterfaceField.style.display = this.value === 'custom' ? 'block' : 'none';
        });
        
        // Update select dropdowns that need interface references
        updateInterfaceSelects();
    }
    
    // Add event listener to add interface button
    let interfaceAddBtn = document.getElementById('add-interface');
    if (interfaceAddBtn) {
        interfaceAddBtn.addEventListener('click', addInterface);
    }
    
    // Set up listeners for the first interface
    const initialIpv6Checkbox = document.getElementById('ipv6-enabled-0');
    if (initialIpv6Checkbox) {
        initialIpv6Checkbox.addEventListener('change', function() {
            const ipv6Config = document.getElementById('ipv6-config-0');
            ipv6Config.style.display = this.checked ? 'block' : 'none';
        });
    }
    
    const initialDescCheckbox = document.getElementById('interface-description-enabled-0');
    if (initialDescCheckbox) {
        initialDescCheckbox.addEventListener('change', function() {
            const descGroup = document.getElementById('description-group-0');
            descGroup.style.display = this.checked ? 'block' : 'none';
        });
    }
    
    const initialVlanCheckbox = document.getElementById('vlan-enabled-0');
    if (initialVlanCheckbox) {
        initialVlanCheckbox.addEventListener('change', function() {
            const vlanConfig = document.getElementById('vlan-config-0');
            vlanConfig.style.display = this.checked ? 'block' : 'none';
        });
    }
    
    // Set up the custom interface listener for the first interface
    const initialInterfaceTypeSelect = document.getElementById('interface-type-0');
    if (initialInterfaceTypeSelect) {
        initialInterfaceTypeSelect.classList.add('interface-type-select');
        initialInterfaceTypeSelect.addEventListener('change', function() {
            const customInterfaceField = document.getElementById('custom-interface-name-0');
            if (customInterfaceField) {
                customInterfaceField.style.display = this.value === 'custom' ? 'block' : 'none';
            }
        });
    }
    
    // Function to update interface dropdowns in other sections
    function updateInterfaceSelects() {
        // Get all interfaces
        const interfaces = [];
        const interfaceItems = document.querySelectorAll('.interface-item');
        
        interfaceItems.forEach((item, index) => {
            let interfaceType = item.querySelector(`#interface-type-${index}`).value;
            if (interfaceType === 'custom') {
                const customValue = item.querySelector(`#custom-interface-value-${index}`).value;
                if (customValue) {
                    interfaceType = customValue;
                } else {
                    interfaceType = 'ge-0/0/0'; // Default
                }
            }
            
            const unitNumber = item.querySelector(`#unit-number-${index}`).value || '0';
            const interfaceWithUnit = `${interfaceType}.${unitNumber}`;
            
            interfaces.push({
                name: interfaceWithUnit,
                value: interfaceWithUnit
            });
        });
        
        // Find all selects that need interface options
        const interfaceSelects = document.querySelectorAll('.interface-select');
        
        interfaceSelects.forEach(select => {
            // Save the current value
            const currentValue = select.value;
            
            // Clear options
            select.innerHTML = '';
            
            // Add empty option
            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = '-- Select Interface --';
            select.appendChild(emptyOption);
            
            // Add interface options
            interfaces.forEach(iface => {
                const option = document.createElement('option');
                option.value = iface.value;
                option.textContent = iface.name;
                select.appendChild(option);
            });
            
            // Restore the value if it exists in the new options
            if (currentValue) {
                select.value = currentValue;
            }
        });
    }
}); 