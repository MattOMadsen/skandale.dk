// js/modal-share.js
// Skandale.dk v6.7+ – Deleknap Version 2 (med sociale ikoner)
// Tilpasset din eksisterende modal og design

function initShareButton(politician) {
    const shareBtn = document.getElementById('share-btn');
    const shareOptions = document.getElementById('share-options');
    
    if (!shareBtn || !shareOptions) return;

    shareBtn.onclick = () => {
        shareOptions.style.display = (shareOptions.style.display === 'flex') ? 'none' : 'flex';
    };

    setupSocialButtons(politician, shareOptions);
}

function setupSocialButtons(politician, container) {
    const baseUrl = window.location.origin + window.location.pathname;
    const slug = politician.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const shareUrl = `${baseUrl}?politician=${slug}`;
    
    const shareText = `Se fakta, skandaler og økonomisk støtte for ${politician.name} på Skandale.dk`;
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);

    container.innerHTML = '';

    // Kopiér link
    container.appendChild(createSocialButton('Kopiér link', 'fa-solid fa-link', () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            showShareToast('Link kopieret!');
            container.style.display = 'none';
        }).catch(() => prompt('Kopiér link:', shareUrl));
    }));

    // X
    container.appendChild(createSocialButton('X', 'fab fa-x-twitter', () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank');
        container.style.display = 'none';
    }));

    // Facebook
    container.appendChild(createSocialButton('Facebook', 'fab fa-facebook-f', () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
        container.style.display = 'none';
    }));

    // LinkedIn
    container.appendChild(createSocialButton('LinkedIn', 'fab fa-linkedin-in', () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank');
        container.style.display = 'none';
    }));

    // WhatsApp
    container.appendChild(createSocialButton('WhatsApp', 'fab fa-whatsapp', () => {
        window.open(`https://wa.me/?text=${encodedText}%20${encodedUrl}`, '_blank');
        container.style.display = 'none';
    }));
}

function createSocialButton(label, icon, onClick) {
    const btn = document.createElement('button');
    btn.className = 'w-full flex items-center gap-x-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-2xl transition-colors';
    btn.innerHTML = `<i class="${icon} w-5 text-center"></i> <span>${label}</span>`;
    btn.onclick = onClick;
    return btn;
}

function showShareToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-x-3 z-[999]';
    toast.innerHTML = `<i class="fa-solid fa-check-circle text-emerald-400"></i> <span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.transition = 'all 0.3s';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2200);
}