// js/sammenlign/sammenlign-render.js
// Renderingslogik for sammenlign-siden (lister, cards, metrics, tabs, indhold)

const SammenlignRender = {
    renderAvatar(politician, sizeClass, roundedClass, textSize) {
        const color = politician.color;
        const initials = politician.initials;
        const baseClass = `${sizeClass} ${roundedClass} flex-shrink-0`;

        if (politician.image) {
            const fallback = `this.onerror=null;const p=this.parentElement;p.className='${baseClass} flex items-center justify-center text-white font-bold ${textSize} shadow-inner';p.style.backgroundColor='${color}';p.innerHTML='${initials}';`;
            return `<div class="${baseClass} overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner">
                <img src="${politician.image}" alt="${politician.name}" class="w-full h-full object-cover" loading="lazy" onerror="${fallback}">
            </div>`;
        }

        return `<div class="${baseClass} flex items-center justify-center text-white font-bold ${textSize} shadow-sm" style="background-color: ${color}">${initials}</div>`;
    },

    setAvatarElement(el, politician, sizeClass, roundedClass, textSize) {
        if (!el) return;
        if (politician.image) {
            el.className = `${sizeClass} ${roundedClass} flex-shrink-0 overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner`;
            el.style.backgroundColor = '';
            const fallback = `this.onerror=null;const p=this.parentElement;p.className='${sizeClass} ${roundedClass} flex-shrink-0 flex items-center justify-center text-white font-bold ${textSize} shadow-inner';p.style.backgroundColor='${politician.color}';p.innerHTML='${politician.initials}';`;
            el.innerHTML = `<img src="${politician.image}" alt="${politician.name}" class="w-full h-full object-cover" loading="lazy" onerror="${fallback}">`;
        } else {
            el.className = `${sizeClass} ${roundedClass} flex-shrink-0 flex items-center justify-center text-white font-bold ${textSize} shadow-inner`;
            el.style.backgroundColor = politician.color;
            el.innerHTML = politician.initials;
        }
    },

    renderPoliticianList(side) {
        const container = document.getElementById(`politician-list-${side}`);
        if (!container) return;
        container.innerHTML = '';

        SammenlignData.POLITICIANS.forEach(p => {
            const div = document.createElement('div');
            div.className = `politician-option flex items-center gap-x-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm active:bg-gray-100 dark:active:bg-gray-800`;
            div.innerHTML = `
                ${this.renderAvatar(p, 'w-8 h-8', 'rounded-xl', 'text-xs')}
                <div class="flex-1 min-w-0">
                    <div class="font-medium">${p.name}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">${p.party}</div>
                </div>
            `;
            div.onclick = () => SammenlignRender.selectPolitician(side, p.slug);
            container.appendChild(div);
        });
    },

    filterPoliticians(side) {
        const q = document.getElementById(`search${side}`).value.toLowerCase().trim();
        const container = document.getElementById(`politician-list-${side}`);
        if (!container) return;

        Array.from(container.children).forEach(opt => {
            opt.style.display = opt.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
    },

    selectPolitician(side, slug) {
        const pol = SammenlignData.POLITICIANS.find(p => p.slug === slug);
        if (!pol) return;

        if (!window.selectedPoliticians) window.selectedPoliticians = { 1: null, 2: null };
        window.selectedPoliticians[side] = pol;

        const badge = document.getElementById(`p${side}-selected-badge`);
        document.getElementById(`p${side}-selected-name`).textContent = pol.name;
        badge.classList.remove('hidden');
        badge.classList.add('flex');

        this.highlightSelectedInList(side, slug);

        if (window.selectedPoliticians[1] && window.selectedPoliticians[2]) {
            if (window.SammenlignInit && window.SammenlignInit.showComparison) {
                window.SammenlignInit.showComparison();
            }
        } else {
            const area = document.getElementById('comparison-area');
            const empty = document.getElementById('empty-state');
            if (area) area.classList.add('hidden');
            if (empty) empty.classList.remove('hidden');
        }
    },

    highlightSelectedInList(side, slug) {
        const container = document.getElementById(`politician-list-${side}`);
        if (!container) return;

        const pol = SammenlignData.POLITICIANS.find(p => p.slug === slug);
        if (!pol) return;

        Array.from(container.children).forEach(opt => {
            opt.classList.remove('selected-politician', 'ring-2', 'ring-offset-2', 'ring-blue-500', 'dark:ring-blue-400');
            if (opt.textContent.includes(pol.name)) {
                opt.classList.add('selected-politician', 'ring-2', 'ring-offset-2', 'ring-blue-500', 'dark:ring-blue-400');
            }
        });
    },

    renderPoliticianCard(side, politician) {
        this.setAvatarElement(
            document.getElementById(`p${side}-avatar`),
            politician,
            'w-12 h-12 sm:w-14 sm:h-14',
            'rounded-2xl',
            'text-xl sm:text-2xl'
        );

        const nameEl = document.getElementById(`p${side}-name`);
        if (nameEl) nameEl.textContent = politician.name;

        const partyBadge = document.getElementById(`p${side}-party-badge`);
        if (partyBadge) {
            partyBadge.textContent = `${politician.partyShort} • ${politician.party}`;
            partyBadge.style.backgroundColor = politician.color + '20';
            partyBadge.style.color = politician.color;
        }

        const roleEl = document.getElementById(`p${side}-role`);
        if (roleEl) roleEl.textContent = politician.role || '';

        this.renderMetrics(side, politician);
        this.resetTabs(side);
    },

    renderMetrics(side, politician) {
        const c = document.getElementById(`p${side}-metrics`);
        if (!c) return;

        c.innerHTML = `
            <div class="metric-box bg-gray-50 dark:bg-gray-950 rounded-2xl p-2.5 sm:p-3 text-center border border-gray-100 dark:border-gray-800">
                <div class="text-xl sm:text-2xl font-semibold">${politician.scandalCount}</div>
                <div class="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 tracking-wider">SKANDALER</div>
            </div>
            <div class="metric-box bg-gray-50 dark:bg-gray-950 rounded-2xl p-2.5 sm:p-3 text-center border border-gray-100 dark:border-gray-800">
                <div class="text-xl sm:text-2xl font-semibold flex items-center justify-center gap-x-0.5">${politician.avgSeverity} <span class="text-amber-500 text-base sm:text-lg">★</span></div>
                <div class="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 tracking-wider">ALVORLIGHED</div>
            </div>
            <div class="metric-box bg-gray-50 dark:bg-gray-950 rounded-2xl p-2.5 sm:p-3 text-center border border-gray-100 dark:border-gray-800">
                <div class="text-xl sm:text-2xl font-semibold">${politician.brokenPromises}</div>
                <div class="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 tracking-wider">BRUDTE LØFTER</div>
            </div>
            <div class="metric-box bg-gray-50 dark:bg-gray-950 rounded-2xl p-2.5 sm:p-3 text-center border border-gray-100 dark:border-gray-800">
                <div class="text-xl sm:text-2xl font-semibold">${politician.donorCount}</div>
                <div class="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 tracking-wider">DONORER</div>
            </div>
            <div class="metric-box bg-gray-50 dark:bg-gray-950 rounded-2xl p-2.5 sm:p-3 text-center border border-gray-100 dark:border-gray-800">
                <div class="text-xl sm:text-2xl font-semibold">${politician.networkCount}</div>
                <div class="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 tracking-wider">NETVÆRK</div>
            </div>
        `;
    },

    resetTabs(side) {
        document.querySelectorAll(`[data-tab$="-${side}"]`).forEach(b => b.classList.remove('active'));
        const btn = document.querySelector(`[data-tab="scandals-${side}"]`);
        if (btn) btn.classList.add('active');

        const containers = ['scandals', 'support', 'promises', 'networks'];
        containers.forEach(tab => {
            const el = document.getElementById(`p${side}-${tab}`);
            if (el) el.classList.toggle('hidden', tab !== 'scandals');
        });
    },

    switchTab(side, tab) {
        const pol = window.selectedPoliticians && window.selectedPoliticians[side];
        if (!pol) return;

        const containers = ['scandals', 'support', 'promises', 'networks'];
        containers.forEach(t => {
            const el = document.getElementById(`p${side}-${t}`);
            if (el) el.classList.add('hidden');
        });

        document.querySelectorAll(`[data-tab$="-${side}"]`).forEach(b => b.classList.remove('active'));
        const activeBtn = document.querySelector(`[data-tab="${tab}-${side}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        const target = document.getElementById(`p${side}-${tab}`);
        if (target) target.classList.remove('hidden');
    },

    renderTabContentWithData(side, tab, items) {
        const container = document.getElementById(`p${side}-${tab}`);
        if (!container) return;
        container.innerHTML = '';

        if (!items || items.length === 0) {
            container.innerHTML = `<p class="text-sm text-gray-500 dark:text-gray-400 italic py-4">Ingen data fundet.</p>`;
            return;
        }

        if (tab === 'scandals') {
            items.forEach(item => {
                const div = document.createElement('div');
                div.className = `scandal-item mb-4 last:mb-0 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950`;
                div.innerHTML = `
                    <div class="flex justify-between items-start gap-x-3">
                        <div class="font-semibold">${item.title}</div>
                        <div>${this.createSeverityStars(item.severity)}</div>
                    </div>
                    <p class="text-sm mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">${item.shortDesc}</p>
                    <div class="mt-2 text-xs text-blue-600 dark:text-blue-400">Klik for at læse mere →</div>
                `;
                div.onclick = () => {
                    if (window.SammenlignModals && window.SammenlignModals.showScandalModal) {
                        window.SammenlignModals.showScandalModal(item);
                    }
                };
                container.appendChild(div);
            });
        } else if (tab === 'support') {
            items.forEach(item => {
                const div = document.createElement('div');
                div.className = `donor-item mb-3 last:mb-0 p-3 rounded-xl border border-gray-100 dark:border-gray-800`;
                div.innerHTML = `<div class="font-medium">${item.name}</div><div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">${item.year} • ${item.amount}</div>`;
                div.onclick = () => {
                    if (window.SammenlignModals && window.SammenlignModals.showRelatedModal) {
                        window.SammenlignModals.showRelatedModal('donor', item.name);
                    }
                };
                container.appendChild(div);
            });
        } else if (tab === 'promises') {
            items.forEach(item => {
                const div = document.createElement('div');
                div.className = `promise-item mb-3 last:mb-0 p-3 rounded-xl border border-gray-100 dark:border-gray-800`;
                div.innerHTML = `
                    <div class="font-medium">${item.title}</div>
                    <div class="text-xs mt-1"><span class="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-[10px]">${item.status}</span></div>
                    <p class="text-sm mt-2 text-gray-600 dark:text-gray-300">${item.desc}</p>
                `;
                container.appendChild(div);
            });
        } else if (tab === 'networks') {
            items.forEach(item => {
                const div = document.createElement('div');
                div.className = `network-item mb-3 last:mb-0 p-3 rounded-xl border border-gray-100 dark:border-gray-800`;
                const name = item.name || 'Netværk';
                const org = item.organization || '';
                const year = item.year || '';
                const role = item.role || '';
                div.innerHTML = `<div class="font-medium">${name}</div><div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">${org} ${year ? '• ' + year : ''} ${role ? '• ' + role : ''}</div>`;
                const key = name || org;
                if (key) {
                    div.onclick = () => {
                        if (window.SammenlignModals && window.SammenlignModals.showRelatedModal) {
                            window.SammenlignModals.showRelatedModal('network', key);
                        }
                    };
                }
                container.appendChild(div);
            });
        }
    },

    createSeverityStars(rating) {
        let html = '<div class="flex text-amber-500">';
        for (let i = 1; i <= 5; i++) {
            html += i <= rating 
                ? '<i class="fas fa-star text-sm"></i>' 
                : '<i class="far fa-star text-sm text-gray-300 dark:text-gray-600"></i>';
        }
        return html + '</div>';
    }
};

window.SammenlignRender = SammenlignRender;