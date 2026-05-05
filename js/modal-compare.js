// js/modal-compare.js - Sammenlign to politikere

let selectedPolitician1 = null;
let selectedPolitician2 = null;

function showCompareModal() {
    const html = `
        <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex items-center justify-center p-4" id="compareModal">
            <div onclick="event.target.id === 'compareModal' && closeCompareModal()" 
                 class="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl">
                
                <!-- Header -->
                <div class="px-8 pt-8 pb-6 border-b flex items-center justify-between">
                    <div>
                        <h3 class="text-3xl font-bold tracking-tight">Sammenlign to politikere</h3>
                        <p class="text-slate-500 mt-1">Vælg to politikere for at sammenligne dem</p>
                    </div>
                    <button onclick="closeCompareModal()" class="text-3xl text-slate-400 hover:text-slate-600">×</button>
                </div>
                
                <div class="p-8">
                    <!-- Valg af politikere -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <!-- Politiker 1 -->
                        <div>
                            <label class="block text-sm font-semibold text-slate-500 mb-2">Politiker 1</label>
                            <select id="politician1-select" onchange="selectPolitician(1, this.value)" 
                                    class="w-full border border-slate-300 rounded-2xl px-4 py-3 text-lg focus:border-[#C8102E] outline-none">
                                <option value="">Vælg politiker...</option>
                            </select>
                        </div>
                        
                        <!-- Politiker 2 -->
                        <div>
                            <label class="block text-sm font-semibold text-slate-500 mb-2">Politiker 2</label>
                            <select id="politician2-select" onchange="selectPolitician(2, this.value)" 
                                    class="w-full border border-slate-300 rounded-2xl px-4 py-3 text-lg focus:border-[#C8102E] outline-none">
                                <option value="">Vælg politiker...</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Sammenligning -->
                    <div id="comparison-result" class="hidden">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Politiker 1 Result -->
                            <div id="result-1" class="border border-slate-200 rounded-3xl p-6">
                                <!-- JS populates -->
                            </div>
                            
                            <!-- Politiker 2 Result -->
                            <div id="result-2" class="border border-slate-200 rounded-3xl p-6">
                                <!-- JS populates -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    
    // Fylder dropdowns
    populatePoliticianSelects();
}

function populatePoliticianSelects() {
    const select1 = document.getElementById('politician1-select');
    const select2 = document.getElementById('politician2-select');
    
    politicians.forEach(p => {
        const option1 = new Option(p.name, p.id);
        const option2 = new Option(p.name, p.id);
        select1.appendChild(option1);
        select2.appendChild(option2);
    });
}

function selectPolitician(slot, politicianId) {
    const politician = politicians.find(p => p.id == politicianId);
    if (!politician) return;
    
    if (slot === 1) {
        selectedPolitician1 = politician;
    } else {
        selectedPolitician2 = politician;
    }
    
    // Opdater sammenligning hvis begge er valgt
    if (selectedPolitician1 && selectedPolitician2) {
        showComparisonResult();
    }
}

function showComparisonResult() {
    const resultContainer = document.getElementById('comparison-result');
    const result1 = document.getElementById('result-1');
    const result2 = document.getElementById('result-2');
    
    resultContainer.classList.remove('hidden');
    
    // Render begge politikere
    result1.innerHTML = createPoliticianComparisonHTML(selectedPolitician1);
    result2.innerHTML = createPoliticianComparisonHTML(selectedPolitician2);
    
    // Tilføj "Vinder" indikatorer
    highlightWinners();
}

function createPoliticianComparisonHTML(politician) {
    const scandals = politician.scandals || [];
    const totalSeverity = scandals.reduce((sum, s) => sum + (s.severity || 0), 0);
    const avgSeverity = scandals.length > 0 ? (totalSeverity / scandals.length).toFixed(1) : '0.0';
    
    const support = politician.economicSupport || [];
    const totalSupport = support.reduce((sum, s) => {
        return sum + parseInt(s.amount.replace(/[^0-9]/g, '')) || 0;
    }, 0);
    
    const brokenPromises = politician.brokenPromises ? politician.brokenPromises.length : 0;
    const affiliations = politician.affiliations ? politician.affiliations.length : 0;
    
    return `
        <div class="text-center mb-6">
            <div class="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-white text-4xl font-bold mb-4" 
                 style="background-color: ${politician.avatarColor || politician.partyColor}">
                ${politician.initials}
            </div>
            <div class="font-bold text-2xl">${politician.name}</div>
            <div class="text-sm text-slate-500">${politician.party}</div>
        </div>
        
        <div class="space-y-4">
            <div class="flex justify-between items-center py-2 border-b">
                <span class="text-slate-600">Skandaler</span>
                <span class="font-bold text-xl">${scandals.length}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b">
                <span class="text-slate-600">Gennemsnitlig alvorlighed</span>
                <span class="font-bold text-xl">${avgSeverity}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b">
                <span class="text-slate-600">Økonomisk støtte</span>
                <span class="font-bold text-xl">${(totalSupport / 1000).toFixed(0)}k kr</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b">
                <span class="text-slate-600">Brudte valgløfter</span>
                <span class="font-bold text-xl">${brokenPromises}</span>
            </div>
            <div class="flex justify-between items-center py-2">
                <span class="text-slate-600">Internationale netværk</span>
                <span class="font-bold text-xl">${affiliations}</span>
            </div>
        </div>
    `;
}

function highlightWinners() {
    // Simpel logik til at vise "bedre" værdi
    // Kan udvides senere med farver
    console.log('%c[Sammenlign] Sammenligning vist', 'color:#10b981');
}

function closeCompareModal() {
    const modal = document.getElementById('compareModal');
    if (modal) modal.remove();
    
    // Reset valg
    selectedPolitician1 = null;
    selectedPolitician2 = null;
}