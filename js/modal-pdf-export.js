// js/modal-pdf-export.js - PDF Eksport (Forbedret version)
// Fuld version uden Kilder og uden Alvorlighed (som ønsket af bruger)
// Inkluderer: longDesc, consequences, whatShouldHaveHappened + forbedret brokenPromises
// Alle ændringer er additive. Ingen eksisterende funktionalitet er fjernet.

function exportPoliticianToPDF(politician) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // === HEADER (mere neutral) ===
    doc.setFillColor(200, 16, 46); // #C8102E
    doc.rect(0, 0, pageWidth, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("Politisk gennemsigtighedsrapport", 15, 16);
    
    y = 35;

    // === POLITIKER INFO ===
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text(politician.name, 15, y);
    y += 8;

    doc.setFontSize(12);
    doc.text(politician.party, 15, y);
    y += 6;
    doc.text(politician.role || '', 15, y);
    y += 10;

    // Bio
    doc.setFontSize(10);
    const bioLines = doc.splitTextToSize(politician.bio || '', pageWidth - 30);
    doc.text(bioLines, 15, y);
    y += bioLines.length * 5 + 10;

    // === SKANDALER (FULDT DETALJERET) ===
    if (politician.scandals && politician.scandals.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(200, 16, 46);
        doc.text("Skandaler", 15, y);
        y += 8;

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);

        politician.scandals.forEach((scandal, index) => {
            // Page break hvis nødvendigt
            if (y > 240) {
                doc.addPage();
                y = 20;
            }

            // Titel + år
            doc.setFont(undefined, 'bold');
            const year = scandal.year || scandal.date || '';
            doc.text(`${index + 1}. ${scandal.title} ${year ? '(' + year + ')' : ''}`, 15, y);
            y += 7;

            doc.setFont(undefined, 'normal');

            // longDesc / hovedbeskrivelse
            const longDesc = scandal.longDesc || scandal.description || scandal.shortDesc || '';
            if (longDesc) {
                const descLines = doc.splitTextToSize(longDesc, pageWidth - 30);
                doc.text(descLines, 15, y);
                y += descLines.length * 5 + 6;
            }

            // Konsekvenser
            if (scandal.consequences) {
                if (y > 240) { doc.addPage(); y = 20; }
                doc.setFont(undefined, 'bold');
                doc.setTextColor(16, 185, 129); // Grøn
                doc.text("Konsekvenser:", 15, y);
                y += 5;
                doc.setTextColor(0, 0, 0);
                doc.setFont(undefined, 'normal');
                const consLines = doc.splitTextToSize(scandal.consequences, pageWidth - 30);
                doc.text(consLines, 15, y);
                y += consLines.length * 5 + 6;
            }

            // Hvad burde være sket?
            if (scandal.whatShouldHaveHappened) {
                if (y > 240) { doc.addPage(); y = 20; }
                doc.setFont(undefined, 'bold');
                doc.setTextColor(234, 179, 8); // Gul
                const whatTitle = scandal.whatShouldHaveHappened.title || 'Hvad burde være sket?';
                doc.text(whatTitle + ":", 15, y);
                y += 5;
                doc.setTextColor(0, 0, 0);
                doc.setFont(undefined, 'normal');
                const whatLines = doc.splitTextToSize(scandal.whatShouldHaveHappened.content || '', pageWidth - 30);
                doc.text(whatLines, 15, y);
                y += whatLines.length * 5 + 8;
            }

            y += 4;
        });
        y += 6;
    }

    // === ØKONOMISK STØTTE ===
    if (politician.economicSupport && politician.economicSupport.length > 0) {
        if (y > 230) { doc.addPage(); y = 20; }

        doc.setFontSize(14);
        doc.setTextColor(200, 16, 46);
        doc.text("Økonomisk støtte", 15, y);
        y += 8;

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);

        politician.economicSupport.forEach(s => {
            if (y > 240) { doc.addPage(); y = 20; }
            doc.text(`• ${s.name}: ${s.amount} (${s.type})`, 15, y);
            y += 6;
        });
        y += 6;
    }

    // === BRUDTE VALGLØFTER (FORBEDRET) ===
    if (politician.brokenPromises && politician.brokenPromises.length > 0) {
        if (y > 230) { doc.addPage(); y = 20; }

        doc.setFontSize(14);
        doc.setTextColor(200, 16, 46);
        doc.text("Brudte valgløfter", 15, y);
        y += 8;

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);

        politician.brokenPromises.forEach(p => {
            if (y > 240) { doc.addPage(); y = 20; }

            let line = `• ${p.title}`;
            if (p.year) line += ` (${p.year})`;

            const titleLines = doc.splitTextToSize(line, pageWidth - 30);
            doc.text(titleLines, 15, y);
            y += titleLines.length * 5 + 3;

            if (p.description) {
                const descLines = doc.splitTextToSize(p.description, pageWidth - 30);
                doc.text(descLines, 18, y);
                y += descLines.length * 5 + 6;
            }
        });
        y += 6;
    }

    // === INTERNATIONALE NETVÆRK ===
    if (politician.affiliations && politician.affiliations.length > 0) {
        if (y > 230) { doc.addPage(); y = 20; }

        doc.setFontSize(14);
        doc.setTextColor(200, 16, 46);
        doc.text("Internationale netværk", 15, y);
        y += 8;

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);

        politician.affiliations.forEach(a => {
            if (y > 240) { doc.addPage(); y = 20; }
            const networkLine = `• ${a.name || a.organization} ${a.year ? '(' + a.year + ')' : ''}`;
            doc.text(networkLine, 15, y);
            y += 6;
        });
    }

    // === FOOTER ===
    if (y > 250) { doc.addPage(); y = 20; }

    doc.setDrawColor(200, 16, 46);
    doc.line(15, 260, pageWidth - 15, 260);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    
    const today = new Date();
    const dateStr = today.toLocaleDateString('da-DK');
    doc.text(`Genereret: ${dateStr}`, 15, 268);

    doc.setFontSize(9);
    doc.text("Denne rapport er genereret fra den officielle gennemsigtighedsside.", 15, 275);

    // Gem PDF
    const fileName = `${politician.name.replace(/ /g, '_')}_rapport.pdf`;
    doc.save(fileName);
}

// Gør funktionen globalt tilgængelig
window.exportPoliticianToPDF = exportPoliticianToPDF;