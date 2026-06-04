// js/sammenlign/sammenlign-modals.js
// Modal-håndtering (skandale-modal + relaterede politikere modal)

const SammenlignModals = {
    showScandalModal(scandal) {
        const modal = document.getElementById('scandal-modal');
        if (!modal) return;

        document.getElementById('scandal-modal-title').textContent = scandal.title;

        const severityEl = document.getElementById('scandal-modal-severity');
        if (severityEl && window.SammenlignRender) {
            severityEl.innerHTML = SammenlignRender.createSeverityStars(scandal.severity);
        }

        const content = document.getElementById('scandal-modal-content');
        if (content) {
            content.innerHTML = `
                <div>
                    <p class="text-gray-700 dark:text-gray-300">${scandal.longDesc || scandal.shortDesc || ''}</p>
                </div>
                ${scandal.consequences ? `
                    <div>
                        <h4 class="font-semibold mb-1">Konsekvenser</h4>
                        <p class="text-sm text-gray-600 dark:text-gray-300">${scandal.consequences}</p>
                    </div>` : ''}
                ${scandal.whatShouldHaveHappened ? `
                    <div>
                        <h4 class="font-semibold mb-1">Hvad burde være sket</h4>
                        <p class="text-sm text-gray-600 dark:text-gray-300">${scandal.whatShouldHaveHappened.content || ''}</p>
                    </div>` : ''}
                <div>
                    <h4 class="font-semibold mb-2">Kilder</h4>
                    <div class="space-y-1">
                        ${(scandal.sources || []).map(s => 
                            `<a href="${s.url}" target="_blank" class="block text-sm text-blue-600 dark:text-blue-400 hover:underline">${s.name} →</a>`
                        ).join('') || '<p class="text-sm text-gray-500">Ingen kilder angivet.</p>'}
                    </div>
                </div>
            `;
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    },

    hideScandalModal() {
        const modal = document.getElementById('scandal-modal');
        if (modal) {
            modal.classList.remove('flex');
            modal.classList.add('hidden');
        }
    },

    showRelatedModal(type, value) {
        const modal = document.getElementById('related-modal');
        const titleEl = document.getElementById('related-modal-title');
        const contentEl = document.getElementById('related-modal-content');
        if (!modal || !titleEl || !contentEl) return;

        let related = [];
        let label = '';

        if (type === 'donor') {
            related = SammenlignData.donorToPoliticians[value] || [];
            label = `Andre politikere der har modtaget støtte fra <strong>${value}</strong>`;
        } else {
            related = SammenlignData.networkToPoliticians[value] || [];
            label = `Andre politikere der har været i <strong>${value}</strong>`;
        }

        const currentNames = [
            window.selectedPoliticians?.[1]?.name, 
            window.selectedPoliticians?.[2]?.name
        ].filter(Boolean);

        related = related.filter(name => !currentNames.includes(name));

        if (related.length === 0) {
            contentEl.innerHTML = `<p class="text-sm text-gray-500 dark:text-gray-400">Ingen andre politikere fundet.</p>`;
        } else {
            contentEl.innerHTML = related.map(name => {
                const pol = SammenlignData.POLITICIANS.find(p => p.name === name);
                return `
                    <div onclick="SammenlignModals.selectPoliticianFromRelated('${pol ? pol.slug : ''}')" 
                         class="flex items-center gap-x-3 p-3 mb-2 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                        <div class="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold" 
                             style="background-color: ${pol ? pol.color : '#64748b'}">
                            ${name.split(' ').map(n => n[0]).join('').slice(0,2)}
                        </div>
                        <div class="font-medium">${name}</div>
                    </div>`;
            }).join('');
        }

        titleEl.innerHTML = label;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    },

    selectPoliticianFromRelated(slug) {
        this.hideRelatedModal();
        if (!slug) return;

        const pol = SammenlignData.POLITICIANS.find(p => p.slug === slug);
        if (pol && window.selectedPoliticians) {
            window.selectedPoliticians[2] = pol;
            document.getElementById('p2-selected-name').textContent = pol.name;
            document.getElementById('p2-selected-badge').classList.remove('hidden');
            document.getElementById('p2-selected-badge').classList.add('flex');

            if (window.SammenlignInit && window.SammenlignInit.showComparison) {
                window.SammenlignInit.showComparison();
            }
        }
    },

    hideRelatedModal() {
        const modal = document.getElementById('related-modal');
        if (modal) {
            modal.classList.remove('flex');
            modal.classList.add('hidden');
        }
    }
};

window.SammenlignModals = SammenlignModals;