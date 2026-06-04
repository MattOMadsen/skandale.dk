// js/sammenlign/sammenlign-pdf.js
// Forbedret og rigere PDF-eksport til sammenlign-siden
// Mere detaljeret end den gamle version: fulde beskrivelser, kilder, bedre layout

async function exportComparisonToPDF() {
    if (!window.selectedPoliticians || !window.selectedPoliticians[1] || !window.selectedPoliticians[2]) {
        alert('Vælg to politikere først');
        return;
    }

    const p1 = window.selectedPoliticians[1];
    const p2 = window.selectedPoliticians[2];

    const exportBtn = document.getElementById('export-pdf-btn');
    if (exportBtn) {
        exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Genererer PDF...';
        exportBtn.disabled = true;
    }

    // Sørg for at data er loadet
    if (!p1.loadedScandals || !p2.loadedScandals) {
        const data1 = await SammenlignData.loadDetailedData(p1.slug);
        const data2 = await SammenlignData.loadDetailedData(p2.slug);
        p1.loadedScandals = data1.scandals || [];
        p1.loadedPromises = data1.promises || [];
        p1.loadedSupport = data1.support || [];
        p1.loadedNetworks = data1.networks || [];
        p2.loadedScandals = data2.scandals || [];
        p2.loadedPromises = data2.promises || [];
        p2.loadedSupport = data2.support || [];
        p2.loadedNetworks = data2.networks || [];
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // === HEADER ===
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, pageWidth, 24, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('Sammenligningsrapport', 15, 14);
    doc.setFontSize(12);
    doc.text(`${p1.name} vs ${p2.name}`, 15, 21);

    y = 32;

    // === NØGLETAL ===
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(13);
    doc.text('Nøgletal', 15, y);
    y += 8;

    doc.setFontSize(10);
    doc.text(`${p1.name}: ${p1.scandalCount} skandaler  •  ${p1.avgSeverity} alvorlighed  •  ${p1.brokenPromises} brudte løfter  •  ${p1.donorCount} donorer`, 15, y);
    y += 6;
    doc.text(`${p2.name}: ${p2.scandalCount} skandaler  •  ${p2.avgSeverity} alvorlighed  •  ${p2.brokenPromises} brudte løfter  •  ${p2.donorCount} donorer`, 15, y);
    y += 12;

    // === SKANDALER (top + detaljer) ===
    doc.setFontSize(13);
    doc.setTextColor(200, 16, 46);
    doc.text('Skandaler', 15, y);
    y += 7;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    function addScandalsForPolitician(pol, maxItems = 6) {
        if (!pol.loadedScandals || pol.loadedScandals.length === 0) {
            doc.text(`Ingen skandaler fundet for ${pol.name}`, 15, y);
            y += 6;
            return;
        }
        doc.setFont(undefined, 'bold');
        doc.text(`${pol.name}:`, 15, y);
        y += 6;
        doc.setFont(undefined, 'normal');

        pol.loadedScandals.slice(0, maxItems).forEach(s => {
            if (y > 255) { doc.addPage(); y = 20; }
            doc.text(`• ${s.title}`, 18, y);
            y += 5;
            if (s.shortDesc || s.longDesc) {
                const desc = (s.longDesc || s.shortDesc).substring(0, 180);
                const lines = doc.splitTextToSize(desc, pageWidth - 40);
                doc.text(lines, 20, y);
                y += lines.length * 5 + 4;
            }
        });
        y += 4;
    }

    addScandalsForPolitician(p1);
    addScandalsForPolitician(p2);

    // === BRUDTE LØFTER ===
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFontSize(13);
    doc.setTextColor(200, 16, 46);
    doc.text('Brudte valgløfter', 15, y);
    y += 7;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    function addPromisesForPolitician(pol, maxItems = 5) {
        if (!pol.loadedPromises || pol.loadedPromises.length === 0) {
            doc.text(`Ingen brudte løfter fundet for ${pol.name}`, 15, y);
            y += 6;
            return;
        }
        doc.setFont(undefined, 'bold');
        doc.text(`${pol.name}:`, 15, y);
        y += 6;
        doc.setFont(undefined, 'normal');

        pol.loadedPromises.slice(0, maxItems).forEach(pr => {
            if (y > 255) { doc.addPage(); y = 20; }
            doc.text(`• ${pr.title}`, 18, y);
            y += 5;
            if (pr.desc) {
                const lines = doc.splitTextToSize(pr.desc.substring(0, 160), pageWidth - 40);
                doc.text(lines, 20, y);
                y += lines.length * 5 + 3;
            }
        });
        y += 4;
    }

    addPromisesForPolitician(p1);
    addPromisesForPolitician(p2);

    // === FOOTER ===
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setDrawColor(30, 64, 175);
    doc.line(15, 265, pageWidth - 15, 265);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    const today = new Date().toLocaleDateString('da-DK');
    doc.text(`Genereret ${today} fra Skandale.dk`, 15, 272);
    doc.text('Denne rapport er et hjælpeværktøj – læs altid de fulde kilder på siden.', 15, 278);

    const fileName = `Sammenligning_${p1.name.replace(/ /g, '_')}_vs_${p2.name.replace(/ /g, '_')}.pdf`;
    doc.save(fileName);

    if (exportBtn) {
        exportBtn.innerHTML = '<i class="fas fa-file-pdf mr-2"></i> Eksporter til PDF';
        exportBtn.disabled = false;
    }
}

// Gør funktionen globalt tilgængelig
window.exportComparisonToPDF = exportComparisonToPDF;