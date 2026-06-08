// js/sammenlign/sammenlign-init.js
// Initialisering + orkestrering – holder HTML-filen slank

const SammenlignInit = {
    async init() {
        this.initializeTailwind();
        this.initializeDarkMode();
        this.setupKeyboardSupport();

        const loadingEl = document.getElementById('politician-loading');
        if (loadingEl) loadingEl.classList.remove('hidden');

        try {
            await SammenlignData.loadPoliticians();
            this.initializePoliticianLists();
            this.updatePoliticianCount();
            await SammenlignData.buildCrossReferenceIndex();
            this.loadFromURL();
        } catch (e) {
            console.error('[Sammenlign] Fejl ved indlæsning:', e);
        } finally {
            if (loadingEl) loadingEl.classList.add('hidden');
        }

        const exportBtn = document.getElementById('export-pdf-btn');
        if (exportBtn && !window.selectedPoliticians?.[1]) exportBtn.disabled = true;

        console.log(`%c[Sammenlign] Init færdig – ${SammenlignData.POLITICIANS.length} politikere`, 'color:#64748b');
    },

    updatePoliticianCount() {
        const countEl = document.getElementById('politician-count');
        if (countEl && window.SammenlignData) {
            countEl.textContent = SammenlignData.POLITICIANS.length;
        }
    },

    initializeTailwind() {
        document.documentElement.style.setProperty('--accent', '#c8102e');
        tailwind.config = { darkMode: 'class' };
    },

    initializeDarkMode() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
        }
    },

    toggleDarkMode() {
        const html = document.documentElement;
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    },

    toggleMobileMenu() {
        const menu = document.getElementById('mobile-menu');
        if (menu) menu.classList.toggle('hidden');
    },

    initializePoliticianLists() {
        if (window.SammenlignRender) {
            SammenlignRender.renderPoliticianList(1);
            SammenlignRender.renderPoliticianList(2);
        }
    },

    setupKeyboardSupport() {
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && document.activeElement.tagName === 'BODY') {
                e.preventDefault();
                document.getElementById('search1').focus();
            }
            if (e.key.toLowerCase() === 'r' && (e.metaKey || e.ctrlKey) &&
                window.selectedPoliticians?.[1] && window.selectedPoliticians?.[2]) {
                e.preventDefault();
                this.resetComparison();
            }
            if (e.key === 'Escape') {
                const r = document.getElementById('related-modal');
                const s = document.getElementById('scandal-modal');
                if (r && !r.classList.contains('hidden') && window.SammenlignModals) SammenlignModals.hideRelatedModal();
                else if (s && !s.classList.contains('hidden') && window.SammenlignModals) SammenlignModals.hideScandalModal();
            }
        });

        const search1 = document.getElementById('search1');
        if (search1) search1.placeholder = 'Søg... (tryk / for at fokusere)';
    },

    async showComparison() {
        const area = document.getElementById('comparison-area');
        const empty = document.getElementById('empty-state');
        area.classList.remove('hidden');
        empty.classList.add('hidden');

        const p1 = window.selectedPoliticians[1];
        const p2 = window.selectedPoliticians[2];
        document.getElementById('comparison-subtitle').textContent = `${p1.name} vs ${p2.name}`;

        if (window.SammenlignRender) {
            SammenlignRender.renderPoliticianCard(1, p1);
            SammenlignRender.renderPoliticianCard(2, p2);
        }
        this.updateURL();

        await Promise.all([
            this.loadAndRenderDetails(1, p1),
            this.loadAndRenderDetails(2, p2)
        ]);

        const exportBtn = document.getElementById('export-pdf-btn');
        if (exportBtn) exportBtn.disabled = false;

        area.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    async loadAndRenderDetails(side, politician) {
        const prefixes = ['scandals', 'support', 'promises', 'networks'];
        prefixes.forEach(tab => {
            const el = document.getElementById(`p${side}-${tab}`);
            if (el) el.innerHTML = `<div class=\"loading-placeholder text-sm text-gray-400 py-4\">Indlæser ${tab}...</div>`;
        });

        const data = await SammenlignData.loadDetailedData(politician.slug);

        politician.loadedScandals = data.scandals || [];
        politician.loadedPromises = data.promises || [];
        politician.loadedSupport = data.support || [];
        politician.loadedNetworks = data.networks || [];

        if (window.SammenlignRender) {
            SammenlignRender.renderTabContentWithData(side, 'scandals', data.scandals);
            SammenlignRender.renderTabContentWithData(side, 'support', data.support);
            SammenlignRender.renderTabContentWithData(side, 'promises', data.promises);
            SammenlignRender.renderTabContentWithData(side, 'networks', data.networks);
        }
    },

    swapPoliticians() {
        if (!window.selectedPoliticians) return;
        [window.selectedPoliticians[1], window.selectedPoliticians[2]] =
            [window.selectedPoliticians[2], window.selectedPoliticians[1]];

        if (window.selectedPoliticians[1]) {
            document.getElementById('p1-selected-name').textContent = window.selectedPoliticians[1].name;
            document.getElementById('p1-selected-badge').classList.remove('hidden');
            document.getElementById('p1-selected-badge').classList.add('flex');
        }
        if (window.selectedPoliticians[2]) {
            document.getElementById('p2-selected-name').textContent = window.selectedPoliticians[2].name;
            document.getElementById('p2-selected-badge').classList.remove('hidden');
            document.getElementById('p2-selected-badge').classList.add('flex');
        }
        if (window.selectedPoliticians[1] && window.selectedPoliticians[2]) {
            this.showComparison();
        }
    },

    resetComparison() {
        window.selectedPoliticians = { 1: null, 2: null };
        document.getElementById('comparison-area').classList.add('hidden');
        document.getElementById('empty-state').classList.remove('hidden');

        document.getElementById('p1-selected-badge').classList.add('hidden');
        document.getElementById('p1-selected-badge').classList.remove('flex');
        document.getElementById('p2-selected-badge').classList.add('hidden');
        document.getElementById('p2-selected-badge').classList.remove('flex');

        document.querySelectorAll('.selected-politician').forEach(el =>
            el.classList.remove('selected-politician', 'ring-2', 'ring-offset-2', 'ring-red-500', 'dark:ring-red-400')
        );

        const s1 = document.getElementById('search1');
        const s2 = document.getElementById('search2');
        if (s1) s1.value = '';
        if (s2) s2.value = '';

        if (window.SammenlignRender) {
            SammenlignRender.filterPoliticians(1);
            SammenlignRender.filterPoliticians(2);
        }

        window.history.replaceState({}, '', window.location.pathname);

        if (window.SammenlignModals) {
            SammenlignModals.hideRelatedModal();
            SammenlignModals.hideScandalModal();
        }

        const exportBtn = document.getElementById('export-pdf-btn');
        if (exportBtn) {
            exportBtn.disabled = false;
            exportBtn.innerHTML = '<i class="fas fa-file-pdf mr-2"></i> Eksporter til PDF';
        }
    },

    updateURL() {
        if (!window.selectedPoliticians[1] || !window.selectedPoliticians[2]) return;
        const params = new URLSearchParams();
        params.set('p1', window.selectedPoliticians[1].slug);
        params.set('p2', window.selectedPoliticians[2].slug);
        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    },

    loadFromURL() {
        const params = new URLSearchParams(window.location.search);
        const p1 = SammenlignData.POLITICIANS.find(p => p.slug === params.get('p1'));
        const p2 = SammenlignData.POLITICIANS.find(p => p.slug === params.get('p2'));
        if (p1 && p2) {
            window.selectedPoliticians[1] = p1;
            window.selectedPoliticians[2] = p2;

            document.getElementById('p1-selected-name').textContent = p1.name;
            document.getElementById('p1-selected-badge').classList.remove('hidden');
            document.getElementById('p1-selected-badge').classList.add('flex');

            document.getElementById('p2-selected-name').textContent = p2.name;
            document.getElementById('p2-selected-badge').classList.remove('hidden');
            document.getElementById('p2-selected-badge').classList.add('flex');

            this.showComparison();
        }
    },

    shareComparison() {
        if (!window.selectedPoliticians[1] || !window.selectedPoliticians[2]) return;
        navigator.clipboard.writeText(window.location.href).then(() => {
            const toast = document.createElement('div');
            toast.className = `fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-2.5 rounded-2xl text-sm flex items-center gap-x-2`;
            toast.innerHTML = `<i class="fas fa-check mr-2"></i> Link kopieret`;
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.style.transition = 'all 0.3s';
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 200);
            }, 1800);
        });
    }
};

window.SammenlignInit = SammenlignInit;
window.toggleDarkMode = () => SammenlignInit.toggleDarkMode();
window.toggleMobileMenu = () => SammenlignInit.toggleMobileMenu();
window.showComparison = () => SammenlignInit.showComparison();
window.swapPoliticians = () => SammenlignInit.swapPoliticians();
window.resetComparison = () => SammenlignInit.resetComparison();
window.shareComparison = () => SammenlignInit.shareComparison();
window.filterPoliticians = (side) => window.SammenlignRender?.filterPoliticians(side);
window.switchTab = (side, tab) => window.SammenlignRender?.switchTab(side, tab);