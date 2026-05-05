// js/modal-share.js - Ny version med lille modal (i stedet for dropdown)

function initShareButton(politician) {
    const shareBtn = document.getElementById('share-btn');
    if (!shareBtn) return;

    shareBtn.onclick = () => {
        showShareModal(politician);
    };
}

function showShareModal(politician) {
    const baseUrl = window.location.origin + window.location.pathname;
    const slug = politician.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const shareUrl = `${baseUrl}?politician=${slug}`;
    
    const shareText = `Se fakta, skandaler og økonomisk støtte for ${politician.name} på Skandale.dk`;
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);

    const html = `
        <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4" id="shareModal">
            <div onclick="event.target.id === 'shareModal' && closeShareModal()" 
                 class="bg-white rounded-3xl max-w-sm w-full shadow-2xl">
                
                <!-- Header -->
                <div class="px-6 pt-6 pb-4 border-b flex items-center justify-between">
                    <div>
                        <h3 class="text-xl font-bold">Del ${politician.name}</h3>
                        <p class="text-sm text-slate-500">Vælg hvor du vil dele</p>
                    </div>
                    <button onclick="closeShareModal()" class="text-3xl text-slate-400 hover:text-slate-600">×</button>
                </div>
                
                <!-- Del muligheder -->
                <div class="p-4 space-y-1">
                    <!-- Kopiér link -->
                    <button onclick="copyLink('${shareUrl}'); closeShareModal()" 
                            class="w-full flex items-center gap-x-4 px-4 py-3.5 text-left hover:bg-slate-100 rounded-2xl transition-colors">
                        <i class="fa-solid fa-link w-6 text-[#C8102E]"></i>
                        <span class="font-medium">Kopiér link</span>
                    </button>
                    
                    <!-- X (Twitter) -->
                    <button onclick="shareToX('${encodedText}', '${encodedUrl}'); closeShareModal()" 
                            class="w-full flex items-center gap-x-4 px-4 py-3.5 text-left hover:bg-slate-100 rounded-2xl transition-colors">
                        <i class="fab fa-x-twitter w-6 text-black"></i>
                        <span class="font-medium">Del på X</span>
                    </button>
                    
                    <!-- Facebook -->
                    <button onclick="shareToFacebook('${encodedUrl}'); closeShareModal()" 
                            class="w-full flex items-center gap-x-4 px-4 py-3.5 text-left hover:bg-slate-100 rounded-2xl transition-colors">
                        <i class="fab fa-facebook-f w-6 text-[#1877F2]"></i>
                        <span class="font-medium">Del på Facebook</span>
                    </button>
                    
                    <!-- LinkedIn -->
                    <button onclick="shareToLinkedIn('${encodedUrl}'); closeShareModal()" 
                            class="w-full flex items-center gap-x-4 px-4 py-3.5 text-left hover:bg-slate-100 rounded-2xl transition-colors">
                        <i class="fab fa-linkedin-in w-6 text-[#0A66C2]"></i>
                        <span class="font-medium">Del på LinkedIn</span>
                    </button>
                    
                    <!-- WhatsApp -->
                    <button onclick="shareToWhatsApp('${encodedText}', '${encodedUrl}'); closeShareModal()" 
                            class="w-full flex items-center gap-x-4 px-4 py-3.5 text-left hover:bg-slate-100 rounded-2xl transition-colors">
                        <i class="fab fa-whatsapp w-6 text-[#25D366]"></i>
                        <span class="font-medium">Del på WhatsApp</span>
                    </button>
                </div>
                
                <div class="px-6 py-4 border-t bg-slate-50 text-xs text-slate-400 text-center rounded-b-3xl">
                    Linket åbner direkte i modalen hos modtageren
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
}

function closeShareModal() {
    const modal = document.getElementById('shareModal');
    if (modal) modal.remove();
}

// Hjælpefunktioner
function copyLink(url) {
    navigator.clipboard.writeText(url).then(() => {
        showToast('Link kopieret!');
    }).catch(() => {
        prompt('Kopiér linket:', url);
    });
}

function shareToX(text, url) {
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function shareToFacebook(url) {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareToLinkedIn(url) {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
}

function shareToWhatsApp(text, url) {
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-6 left-1/2 -translate-x/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-x-3 z-[999]';
    toast.innerHTML = `<i class="fa-solid fa-check-circle text-emerald-400"></i> <span>${message}</span>`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transition = 'all 0.3s';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2200);
}