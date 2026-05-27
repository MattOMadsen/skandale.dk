// js/about-modal.js - Om Skandale.dk modal (1 fil = 1 funktion)

function showAboutModal() {
    const modalHTML = `
        <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4" id="aboutModal">
            <div onclick="event.target.id === 'aboutModal' && closeAboutModal()" 
                 class="bg-white rounded-3xl max-w-2xl w-full shadow-2xl">
                <div class="px-8 pt-8 pb-6 border-b flex items-center justify-between">
                    <h3 class="text-3xl font-bold tracking-tight">Om Skandale.dk</h3>
                    <button onclick="closeAboutModal()" class="text-3xl text-slate-400 hover:text-slate-600">×</button>
                </div>
                <div class="p-8 text-slate-600 leading-relaxed">
                    <p class="mb-4">Skandale.dk er et uafhængigt, non-profit projekt, der har til formål at skabe større gennemsigtighed i dansk politik.</p>
                    <p class="mb-4">Vi samler offentligt tilgængelige oplysninger om politiske skandaler, økonomisk støtte, internationale netværk og brudte valgløfter – alt på én overskuelig platform.</p>
                    <p class="mb-6">Projektet er stadig under udvikling. Har du forslag, fundet fejl eller vil du bidrage? Skriv gerne til os på <a href="mailto:kontakt@skandale.dk" class="text-[#C8102E] underline">kontakt@skandale.dk</a>.</p>
                    <div class="text-xs text-slate-400 mt-4">Data er baseret på offentligt tilgængelige kilder. Vi tager forbehold for fejl og mangler.</div>
                    
                    <!-- Diskret admin adgang -->
                    <div class="mt-6 pt-4 border-t text-xs">
                        <span class="text-slate-400">Admin?</span> 
                        <a href="#" onclick="event.preventDefault(); if (typeof showAdminLogin === 'function') showAdminLogin();" class="text-[#C8102E] hover:underline">Log ind her</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeAboutModal() {
    const modal = document.getElementById('aboutModal');
    if (modal) modal.remove();
}

// Eksponer globalt
window.showAboutModal = showAboutModal;
window.closeAboutModal = closeAboutModal;