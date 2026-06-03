// js/stats/stats-pdf.js
// PDF export functionality for the entire stats page

async function exportToPDF() {
    if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
        alert('jsPDF er ikke indlæst korrekt. Prøv at genindlæse siden.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    let filteredData = politiciansData || [];
    if (currentPartyFilter) {
        filteredData = politiciansData.filter(p => p.party === currentPartyFilter);
    }

    const totalPoliticians = filteredData.length;
    const totalScandals = filteredData.reduce((sum, p) => sum + p.scandalCount, 0);
    const totalBrokenPromises = filteredData.reduce((sum, p) => sum + p.brokenPromiseCount, 0);
    const avgSeverity = filteredData.reduce((sum, p) => sum + parseFloat(p.avgSeverity || 0), 0) / (filteredData.length || 1);

    // Header
    doc.setFillColor(200, 16, 46); // Red theme
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("Skandale.dk - Statistikrapport", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Genereret: ${new Date().toLocaleDateString('da-DK')}`, 105, 28, { align: "center" });

    if (currentPartyFilter) {
        doc.text(`Filter: ${currentPartyFilter}`, 105, 34, { align: "center" });
    }

    let y = 50;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text("Nøgletal", 20, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Politikere i oversigten: ${totalPoliticians}`, 25, y); y += 8;
    doc.text(`Samlede skandaler: ${totalScandals}`, 25, y); y += 8;
    doc.text(`Brudte valgløfter: ${totalBrokenPromises}`, 25, y); y += 8;
    doc.text(`Gennemsnitlig alvorlighed: ${avgSeverity.toFixed(1)} / 5`, 25, y); y += 15;

    // Party distribution
    doc.setFontSize(16);
    doc.text("Fordeling efter parti", 20, y); y += 10;

    const byParty = {};
    filteredData.forEach(p => {
        if (!byParty[p.party]) byParty[p.party] = { count: 0, color: p.color };
        byParty[p.party].count++;
    });

    doc.setFontSize(11);
    Object.keys(byParty).sort((a,b) => byParty[b].count - byParty[a].count).forEach(party => {
        if (y > 260) { doc.addPage(); y = 20; }
        const pct = Math.round((byParty[party].count / totalPoliticians) * 100);
        doc.text(`${party}: ${byParty[party].count} (${pct}%)`, 25, y);
        y += 7;
    });

    y += 8;

    // Top 5
    doc.setFontSize(16);
    doc.text("Top 5 med flest skandaler", 20, y); y += 10;

    const top5 = [...filteredData].sort((a,b) => b.scandalCount - a.scandalCount).slice(0, 5);
    doc.setFontSize(11);
    top5.forEach((p, i) => {
        if (y > 260) { doc.addPage(); y = 20; }
        doc.text(`${i+1}. ${p.name} (${p.partyShort}) – ${p.scandalCount} skandaler`, 25, y);
        y += 7;
    });

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text("Skandale.dk – For større gennemsigtighed i dansk politik", 105, 285, { align: "center" });

    // Save file
    const filename = currentPartyFilter 
        ? `skandale-stats-${currentPartyFilter.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`
        : 'skandale-stats-alle-politikere.pdf';
    
    doc.save(filename);

    // Feedback
    const btn = document.querySelector('button[onclick*="exportToPDF"]');
    if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = '✅ PDF gemt!';
        setTimeout(() => { btn.innerHTML = orig; }, 2000);
    }
}

// Make available globally
window.exportToPDF = exportToPDF;