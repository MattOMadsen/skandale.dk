// js/modal-admin.js - Password-beskyttet Admin Dashboard (v1)

const ADMIN_PASSWORD = 'skandale2026'; // Kan ændres senere

let adminDashboardModal = null;

function showAdminLogin() {
    const existing = document.getElementById('adminLoginModal');
    if (existing) existing.remove();

    const html = `
        <div id="adminLoginModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl">
                <div class="px-8 pt-8 pb-6 border-b">
                    <h3 class="text-2xl font-bold">Admin Adgang</h3>
                    <p class="text-sm text-slate-500 mt-1">Indtast adgangskode for at åbne admin-dashboardet</p>
                </div>
                
                <div class="p-8">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-slate-600 mb-2">Adgangskode</label>
                        <input type="password" id="adminPasswordInput" 
                               class="w-full border border-slate-300 rounded-2xl px-4 py-3 text-lg"
                               placeholder="Indtast kode..."
                               onkeyup="if (event.key === 'Enter') verifyAdminPassword()">
                    </div>
                    
                    <div class="flex gap-x-3">
                        <button onclick="closeAdminLogin()" 
                                class="flex-1 px-6 py-3 border border-slate-300 rounded-2xl font-medium hover:bg-slate-50">
                            Annuller
                        </button>
                        <button onclick="verifyAdminPassword()" 
                                class="flex-1 px-6 py-3 bg-[#C8102E] text-white rounded-2xl font-medium hover:bg-[#C8102E]/90">
                            Log ind
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    setTimeout(() => {
        const input = document.getElementById('adminPasswordInput');
        if (input) input.focus();
    }, 100);
}

function verifyAdminPassword() {
    const input = document.getElementById('adminPasswordInput');
    if (!input) return;

    if (input.value === ADMIN_PASSWORD) {
        closeAdminLogin();
        showAdminDashboard();
    } else {
        alert('Forkert adgangskode');
        input.value = '';
        input.focus();
    }
}

function closeAdminLogin() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) modal.remove();
}

function showAdminDashboard() {
    const existing = document.getElementById('adminDashboardModal');
    if (existing) existing.remove();

    const html = `
        <div id="adminDashboardModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[250] flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
                
                <!-- Header -->
                <div class="px-8 pt-8 pb-6 border-b flex items-center justify-between flex-shrink-0">
                    <div>
                        <h3 class="text-3xl font-bold tracking-tight">Admin Dashboard</h3>
                        <p class="text-sm text-slate-500">Godkendelse af indsendte skandaler (Formspree)</p>
                    </div>
                    <button onclick="closeAdminDashboard()" class="text-3xl text-slate-400 hover:text-slate-600">×</button>
                </div>

                <div class="flex-1 overflow-y-auto p-8">
                    
                    <!-- Info -->
                    <div class="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                        <p class="text-sm text-slate-600">
                            <strong>Sådan bruger du dashboardet:</strong><br>
                            1. Du modtager en mail fra Formspree når nogen indsender en skandale.<br>
                            2. Brug formularen nedenfor til at tilføje den godkendte skandale manuelt.<br>
                            3. Data bliver midlertidigt tilføjet til siden (genindlæs for at nulstille).
                        </p>
                    </div>

                    <!-- Manuel tilføjelse af skandale -->
                    <h4 class="font-bold text-xl mb-4">Tilføj godkendt skandale manuelt</h4>
                    
                    <form id="adminAddScandalForm" onsubmit="submitAdminScandal(event)">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            <!-- Politiker -->
                            <div>
                                <label class="block text-sm font-semibold text-slate-600 mb-1">Politiker ID eller navn</label>
                                <input type="text" id="adminPoliticianId" class="w-full border border-slate-300 rounded-2xl px-4 py-3" 
                                       placeholder="F.eks. 1 eller navn på ny politiker" required>
                                <p class="text-xs text-slate-500 mt-1">Brug ID fra eksisterende politiker eller skriv navn hvis ny</p>
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-slate-600 mb-1">Parti (hvis ny politiker)</label>
                                <input type="text" id="adminParty" class="w-full border border-slate-300 rounded-2xl px-4 py-3" placeholder="f.eks. Socialdemokratiet">
                            </div>

                            <!-- Skandale felter -->
                            <div class="md:col-span-2">
                                <label class="block text-sm font-semibold text-slate-600 mb-1">Titel på skandalen *</label>
                                <input type="text" id="adminTitle" class="w-full border border-slate-300 rounded-2xl px-4 py-3" required>
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-slate-600 mb-1">År</label>
                                <input type="text" id="adminYear" class="w-full border border-slate-300 rounded-2xl px-4 py-3" placeholder="2023-2024">
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-slate-600 mb-1">Alvorlighed (1-5)</label>
                                <select id="adminSeverity" class="w-full border border-slate-300 rounded-2xl px-4 py-3">
                                    <option value="1">1 - Lav</option>
                                    <option value="2">2</option>
                                    <option value="3" selected>3 - Medium</option>
                                    <option value="4">4</option>
                                    <option value="5">5 - Meget alvorlig</option>
                                </select>
                            </div>

                            <div class="md:col-span-2">
                                <label class="block text-sm font-semibold text-slate-600 mb-1">Kort beskrivelse *</label>
                                <textarea id="adminShortDesc" rows="2" class="w-full border border-slate-300 rounded-2xl px-4 py-3" required></textarea>
                            </div>

                            <div class="md:col-span-2">
                                <label class="block text-sm font-semibold text-slate-600 mb-1">Kilder (en pr. linje)</label>
                                <textarea id="adminSources" rows="2" class="w-full border border-slate-300 rounded-2xl px-4 py-3" placeholder="https://...\nhttps://..."></textarea>
                            </div>
                        </div>

                        <div class="mt-8 flex gap-x-3">
                            <button type="button" onclick="closeAdminDashboard()" 
                                    class="flex-1 px-6 py-3 border border-slate-300 rounded-2xl font-medium hover:bg-slate-50">
                                Luk
                            </button>
                            <button type="submit" 
                                    class="flex-1 px-6 py-3 bg-[#C8102E] text-white rounded-2xl font-medium hover:bg-[#C8102E]/90">
                                Godkend og tilføj midlertidigt
                            </button>
                        </div>
                    </form>
                </div>

                <div class="px-8 py-4 border-t bg-slate-50 text-xs text-slate-500 flex-shrink-0">
                    Dette er en midlertidig løsning. Data forsvinder ved genindlæsning af siden.
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
}

function closeAdminDashboard() {
    const modal = document.getElementById('adminDashboardModal');
    if (modal) modal.remove();
}

// Håndterer indsendelse fra admin-formularen
function submitAdminScandal(e) {
    e.preventDefault();

    if (!window.politicians) {
        alert('Data er ikke indlæst endnu. Prøv igen om et øjeblik.');
        return;
    }

    const title = document.getElementById('adminTitle').value.trim();
    const shortDesc = document.getElementById('adminShortDesc').value.trim();
    const year = document.getElementById('adminYear').value.trim();
    const severity = parseInt(document.getElementById('adminSeverity').value);
    const sources = document.getElementById('adminSources').value.split('\n').filter(Boolean);

    const politicianInput = document.getElementById('adminPoliticianId').value.trim();
    const party = document.getElementById('adminParty').value.trim();

    // Find eller opret politiker
    let politician = window.politicians.find(p => 
        p.id == politicianInput || p.name.toLowerCase() === politicianInput.toLowerCase()
    );

    if (!politician) {
        // Opret ny midlertidig politiker
        const newId = Math.max(0, ...window.politicians.map(p => p.id || 0)) + 1;
        politician = {
            id: newId,
            name: politicianInput,
            party: party || 'Ukendt parti',
            role: '',
            scandals: []
        };
        window.politicians.push(politician);
    }

    // Tilføj skandalen
    if (!politician.scandals) politician.scandals = [];

    const newScandal = {
        id: Date.now(),
        title: title,
        year: year || new Date().getFullYear().toString(),
        severity: severity,
        shortDesc: shortDesc,
        longDesc: shortDesc,
        sources: sources,
        status: 'godkendt'
    };

    politician.scandals.push(newScandal);

    alert('Skandalen er midlertidigt tilføjet! Genindlæs siden for at se den i listen.');
    closeAdminDashboard();

    // Genopfrisk visningen hvis muligt
    if (typeof filterPoliticians === 'function') {
        filterPoliticians();
    }
}

// Gør funktionerne globale
window.showAdminLogin = showAdminLogin;
window.showAdminDashboard = showAdminDashboard;