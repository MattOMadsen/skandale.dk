// js/modal-admin.js
// Admin Dashboard v2 - Password-beskyttet + forbedret UX
// Uploadet 27. maj 2026

function getAdminPassword() {
  return window.SKANDALE_SECRETS?.adminPassword || null;
}

let pendingNotes = JSON.parse(localStorage.getItem('adminPendingNotes') || '[]');

function showAdminLogin() {
    const modal = document.getElementById('adminLoginModal') || createAdminLoginModal();
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function createAdminLoginModal() {
    const modalHTML = `
        <div id="adminLoginModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
            <div class="bg-white dark:bg-slate-800 rounded-xl p-8 w-full max-w-md mx-4">
                <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Admin Login</h2>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Adgangskode</label>
                    <input type="password" id="adminPassword" class="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-red-500" placeholder="Indtast adgangskode">
                </div>
                
                <div id="adminLoginError" class="hidden text-red-600 text-sm mb-4"></div>
                
                <div class="flex gap-3">
                    <button onclick="attemptAdminLogin()" 
                            class="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition">
                        Log ind
                    </button>
                    <button onclick="closeAdminLoginModal()" 
                            class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition">
                        Annuller
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    return document.getElementById('adminLoginModal');
}

function attemptAdminLogin() {
    const passwordInput = document.getElementById('adminPassword');
    const errorDiv = document.getElementById('adminLoginError');
    
    const adminPassword = getAdminPassword();
    if (!adminPassword) {
        errorDiv.textContent = 'Admin er ikke konfigureret (mangler js/config/secrets.js).';
        errorDiv.classList.remove('hidden');
        return;
    }

    if (passwordInput.value === adminPassword) {
        closeAdminLoginModal();
        showAdminDashboard();
    } else {
        errorDiv.textContent = "Forkert adgangskode";
        errorDiv.classList.remove('hidden');
        passwordInput.value = '';
    }
}

function closeAdminLoginModal() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) modal.classList.add('hidden');
}

function showAdminDashboard() {
    const modal = document.getElementById('adminDashboardModal') || createAdminDashboardModal();
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Genopfrisk pending notes
    loadPendingNotes();
}

function createAdminDashboardModal() {
    const modalHTML = `
        <div id="adminDashboardModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
            <div class="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
                <!-- Header -->
                <div class="px-8 py-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-700/50">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h2>
                        <p class="text-sm text-gray-500 dark:text-slate-400">Godkend og tilføj skandaler manuelt</p>
                    </div>
                    <button onclick="closeAdminDashboard()" class="text-gray-400 hover:text-gray-600 dark:hover:text-white text-3xl leading-none">&times;</button>
                </div>

                <div class="p-8 overflow-y-auto flex-1 space-y-8">
                    
                    <!-- Tilføj ny skandale -->
                    <div>
                        <h3 class="font-semibold text-lg mb-4 text-gray-800">Tilføj godkendt skandale</h3>
                        
                        <form id="adminScandalForm" onsubmit="submitAdminScandalForm(event)" class="space-y-4">
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Vælg politiker</label>
                                <select id="adminPoliticianSelect" class="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                                    <option value="">-- Vælg politiker --</option>
                                </select>
                            </div>

                            <div id="newPoliticianFields" class="hidden space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Nyt politiker navn</label>
                                    <input type="text" id="newPoliticianName" class="w-full px-4 py-3 border border-gray-300 rounded-lg">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Nyt politiker ID (f.eks. mette-frederiksen)</label>
                                    <input type="text" id="newPoliticianId" class="w-full px-4 py-3 border border-gray-300 rounded-lg">
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Titel på skandalen</label>
                                <input type="text" id="adminScandalTitle" class="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Beskrivelse</label>
                                <textarea id="adminScandalDescription" rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg" required></textarea>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Alvorlighed</label>
                                    <select id="adminSeverity" class="w-full px-4 py-3 border border-gray-300 rounded-lg">
                                        <option value="lav">Lav</option>
                                        <option value="medium" selected>Medium</option>
                                        <option value="høj">Høj</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Dato</label>
                                    <input type="date" id="adminScandalDate" class="w-full px-4 py-3 border border-gray-300 rounded-lg" value="${new Date().toISOString().split('T')[0]}">
                                </div>
                            </div>

                            <button type="submit" 
                                    class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 rounded-xl transition">
                                Tilføj skandale til siden
                            </button>
                        </form>
                    </div>

                    <!-- Pending noter -->
                    <div>
                        <h3 class="font-semibold text-lg mb-3 text-gray-800">Pending indsendelser (fra Formspree)</h3>
                        <textarea id="pendingNotes" rows="4" 
                                  class="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
                                  placeholder="Skriv noter om indsendte skandaler her..."></textarea>
                        <button onclick="savePendingNotes()" 
                                class="mt-2 text-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
                            Gem noter
                        </button>
                    </div>

                    <!-- JSON Export -->
                    <div id="jsonExportSection" class="hidden">
                        <h3 class="font-semibold text-lg mb-3 text-gray-800">JSON til data-fil</h3>
                        <pre id="jsonExport" class="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto max-h-48"></pre>
                        <button onclick="copyJSONExport()" 
                                class="mt-2 text-sm px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
                            Kopier JSON
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Populér dropdown
    populatePoliticianDropdown();
    
    return document.getElementById('adminDashboardModal');
}

function populatePoliticianDropdown() {
    const select = document.getElementById('adminPoliticianSelect');
    if (!select || !window.politicians) return;

    // Ryd gamle options (undtagen den første)
    while (select.options.length > 1) select.remove(1);

    window.politicians.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = p.name;
        select.appendChild(option);
    });

    // Tilføj "Ny politiker" mulighed
    const newOpt = document.createElement('option');
    newOpt.value = "__new__";
    newOpt.textContent = "+ Tilføj ny politiker";
    select.appendChild(newOpt);

    select.onchange = function() {
        const newFields = document.getElementById('newPoliticianFields');
        if (this.value === "__new__") {
            newFields.classList.remove('hidden');
        } else {
            newFields.classList.add('hidden');
        }
    };
}

function loadPendingNotes() {
    const textarea = document.getElementById('pendingNotes');
    if (textarea) {
        textarea.value = pendingNotes.join('\n');
    }
}

function savePendingNotes() {
    const textarea = document.getElementById('pendingNotes');
    if (!textarea) return;

    pendingNotes = textarea.value.split('\n').filter(line => line.trim() !== '');
    localStorage.setItem('adminPendingNotes', JSON.stringify(pendingNotes));
    alert("Noter gemt!");
}

function submitAdminScandalForm(e) {
    e.preventDefault();

    const select = document.getElementById('adminPoliticianSelect');
    const title = document.getElementById('adminScandalTitle').value.trim();
    const description = document.getElementById('adminScandalDescription').value.trim();
    const severity = document.getElementById('adminSeverity').value;
    const date = document.getElementById('adminScandalDate').value;

    if (!select.value || !title || !description) {
        alert("Udfyld venligst alle påkrævede felter.");
        return;
    }

    let politicianId = select.value;
    let politicianName = "";

    // Håndter ny politiker
    if (politicianId === "__new__") {
        const newName = document.getElementById('newPoliticianName').value.trim();
        const newId = document.getElementById('newPoliticianId').value.trim().toLowerCase().replace(/\s+/g, '-');
        
        if (!newName || !newId) {
            alert("Udfyld navn og ID for den nye politiker.");
            return;
        }
        politicianId = newId;
        politicianName = newName;

        // Tilføj ny politiker til window.politicians (midlertidigt)
        if (window.politicians) {
            window.politicians.push({
                id: newId,
                name: newName,
                scandals: []
            });
        }
    } else {
        const found = window.politicians?.find(p => p.id === politicianId);
        politicianName = found ? found.name : politicianId;
    }

    // Opret ny skandale objekt
    const newScandal = {
        id: Date.now(),
        title: title,
        description: description,
        severity: severity,
        date: date,
        addedByAdmin: true,
        addedDate: new Date().toISOString()
    };

    // Tilføj til den valgte politiker (hvis den findes i hukommelsen)
    if (window.politicians) {
        const politician = window.politicians.find(p => p.id === politicianId);
        if (politician) {
            if (!politician.scandals) politician.scandals = [];
            politician.scandals.unshift(newScandal);
        }
    }

    // Vis JSON eksport
    showJSONExport(newScandal, politicianId, politicianName);

    // Genindlæs hovedvisningen hvis muligt
    if (typeof filterPoliticians === 'function') {
        setTimeout(() => {
            filterPoliticians();
        }, 300);
    }

    alert(`Skandale tilføjet til ${politicianName}!`);
    
    // Ryd form
    e.target.reset();
    document.getElementById('newPoliticianFields').classList.add('hidden');
}

function showJSONExport(scandal, politicianId, politicianName) {
    const section = document.getElementById('jsonExportSection');
    const pre = document.getElementById('jsonExport');
    
    if (!section || !pre) return;

    const jsonString = JSON.stringify(scandal, null, 2);
    
    pre.textContent = `// Tilføj dette til data/${politicianId}.json under "scandals"\n` +
                      `// Politiker: ${politicianName}\n\n` +
                      jsonString;
    
    section.classList.remove('hidden');
}

function copyJSONExport() {
    const pre = document.getElementById('jsonExport');
    if (!pre) return;
    
    navigator.clipboard.writeText(pre.textContent).then(() => {
        const originalText = pre.textContent;
        pre.textContent = "✅ JSON kopieret til udklipsholder!";
        setTimeout(() => {
            pre.textContent = originalText;
        }, 2000);
    });
}

function closeAdminDashboard() {
    const modal = document.getElementById('adminDashboardModal');
    if (modal) modal.classList.add('hidden');
}

// Gør funktioner globale
window.showAdminLogin = showAdminLogin;