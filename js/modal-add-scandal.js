// js/modal-add-scandal.js - Tilføj ny skandale (Formspree integration)

function showAddScandalModal(politician = null) {
    const existingModal = document.getElementById('addScandalModal');
    if (existingModal) existingModal.remove();

    let politicianOptions = '';
    if (window.politicians && Array.isArray(window.politicians)) {
        politicianOptions = window.politicians.map(p => 
            `<option value="${p.id}">${p.name} (${p.party})</option>`
        ).join('');
    }

    const html = `
        <div id="addScandalModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                
                <div class="px-8 pt-8 pb-6 border-b flex items-center justify-between">
                    <div>
                        <h3 class="text-2xl font-bold">Tilføj ny skandale</h3>
                        <p class="text-sm text-slate-500">Data sendes til gennemgang</p>
                    </div>
                    <button onclick="closeAddScandalModal()" class="text-3xl text-slate-400 hover:text-slate-600">×</button>
                </div>

                <div class="p-8 overflow-y-auto max-h-[calc(90vh-160px)]">
                    <form id="addScandalForm" onsubmit="submitScandalForm(event)">
                        
                        <!-- Politiker valg -->
                        <div class="mb-6">
                            <label class="block text-sm font-semibold text-slate-600 mb-2">Politiker</label>
                            <select id="politicianSelect" class="w-full border border-slate-300 rounded-2xl px-4 py-3" required>
                                <option value="">Vælg eksisterende politiker...</option>
                                ${politicianOptions}
                                <option value="new">-- Tilføj ny politiker --</option>
                            </select>
                        </div>

                        <!-- Ny politiker felter (skjult som standard) -->
                        <div id="newPoliticianFields" class="hidden mb-6 space-y-4 border border-slate-200 rounded-2xl p-4">
                            <div>
                                <label class="block text-sm font-medium mb-1">Navn</label>
                                <input type="text" id="newPoliticianName" class="w-full border border-slate-300 rounded-xl px-4 py-2" placeholder="Fuld navn">
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium mb-1">Parti</label>
                                    <input type="text" id="newPoliticianParty" class="w-full border border-slate-300 rounded-xl px-4 py-2">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium mb-1">Rolle</label>
                                    <input type="text" id="newPoliticianRole" class="w-full border border-slate-300 rounded-xl px-4 py-2">
                                </div>
                            </div>
                        </div>

                        <!-- Skandale felter -->
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-semibold text-slate-600 mb-1">Titel på skandalen *</label>
                                <input type="text" id="scandalTitle" class="w-full border border-slate-300 rounded-2xl px-4 py-3" required>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-semibold text-slate-600 mb-1">År</label>
                                    <input type="text" id="scandalYear" class="w-full border border-slate-300 rounded-2xl px-4 py-3" placeholder="f.eks. 2020-2022">
                                </div>
                                <div>
                                    <label class="block text-sm font-semibold text-slate-600 mb-1">Alvorlighed (1-5)</label>
                                    <select id="scandalSeverity" class="w-full border border-slate-300 rounded-2xl px-4 py-3">
                                        <option value="1">1 - Lav</option>
                                        <option value="2">2</option>
                                        <option value="3" selected>3 - Medium</option>
                                        <option value="4">4</option>
                                        <option value="5">5 - Meget alvorlig</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-slate-600 mb-1">Kort beskrivelse *</label>
                                <textarea id="scandalShortDesc" rows="2" class="w-full border border-slate-300 rounded-2xl px-4 py-3" required></textarea>
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-slate-600 mb-1">Lang beskrivelse</label>
                                <textarea id="scandalLongDesc" rows="4" class="w-full border border-slate-300 rounded-2xl px-4 py-3"></textarea>
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-slate-600 mb-1">Kilder (en pr. linje)</label>
                                <textarea id="scandalSources" rows="2" class="w-full border border-slate-300 rounded-2xl px-4 py-3" placeholder="https://...\nhttps://..."></textarea>
                            </div>
                        </div>

                        <div class="mt-8 flex gap-x-3">
                            <button type="button" onclick="closeAddScandalModal()" 
                                    class="flex-1 px-6 py-3 border border-slate-300 rounded-2xl font-medium hover:bg-slate-50">
                                Annuller
                            </button>
                            <button type="submit" 
                                    class="flex-1 px-6 py-3 bg-[#C8102E] text-white rounded-2xl font-medium hover:bg-[#C8102E]/90">
                                Send til gennemgang
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);

    // Toggle new politician fields
    const select = document.getElementById('politicianSelect');
    const newFields = document.getElementById('newPoliticianFields');

    select.addEventListener('change', () => {
        if (select.value === 'new') {
            newFields.classList.remove('hidden');
        } else {
            newFields.classList.add('hidden');
        }
    });

    // Pre-select politician if passed
    if (politician && politician.id) {
        select.value = politician.id;
    }
}

function closeAddScandalModal() {
    const modal = document.getElementById('addScandalModal');
    if (modal) modal.remove();
}

async function submitScandalForm(e) {
    e.preventDefault();

    const form = e.target;
    const select = document.getElementById('politicianSelect');
    const isNewPolitician = select.value === 'new';

    let politicianData = {};
    let politicianName = '';

    if (isNewPolitician) {
        politicianData = {
            name: document.getElementById('newPoliticianName').value,
            party: document.getElementById('newPoliticianParty').value,
            role: document.getElementById('newPoliticianRole').value || ''
        };
        politicianName = politicianData.name;
    } else {
        const pol = window.politicians.find(p => p.id == select.value);
        if (pol) {
            politicianName = pol.name;
            politicianData = { id: pol.id, name: pol.name, party: pol.party };
        }
    }

    const scandalData = {
        title: document.getElementById('scandalTitle').value,
        year: document.getElementById('scandalYear').value,
        severity: parseInt(document.getElementById('scandalSeverity').value),
        shortDesc: document.getElementById('scandalShortDesc').value,
        longDesc: document.getElementById('scandalLongDesc').value || '',
        sources: document.getElementById('scandalSources').value.split('\n').filter(Boolean)
    };

    // Byg payload til Formspree
    const payload = {
        type: isNewPolitician ? 'new_politician_scandal' : 'existing_politician_scandal',
        politician: politicianData,
        scandal: scandalData,
        submitted_at: new Date().toISOString(),
        _subject: `Ny skandale indsendt: ${scandalData.title} - ${politicianName}`
    };

    try {
        const response = await fetch('https://formspree.io/f/meedeyqg', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert('Tak! Din indsendelse er modtaget og sendt til gennemgang.');
            closeAddScandalModal();
        } else {
            throw new Error('Fejl ved afsendelse');
        }
    } catch (error) {
        console.error(error);
        alert('Der opstod en fejl ved afsendelsen. Prøv igen senere eller kontakt os direkte.');
    }
}

// Gør funktionerne globale
window.showAddScandalModal = showAddScandalModal;
window.submitScandalForm = submitScandalForm; // Fix: Gør submit funktionen global