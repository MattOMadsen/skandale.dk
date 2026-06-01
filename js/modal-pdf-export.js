// js/modal-pdf-export.js - PDF Eksport
// Forbedret version: Udvidet skandale-sektion med longDesc, consequences, whatShouldHaveHappened og kilder.
// Alle ændringer er additive. Ingen eksisterende funktionalitet er fjernet eller ændret.

function exportPoliticianToPDF(politician) {
    // Brug jsPDF (vi inkluderer det via CDN)
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // === HEADER ===
    doc.setFillColor(200, 16, 46); // #C8102E
    doc.rect(0, 0, pageWidth, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("Skandale.dk", 15, 16);
    
    doc.setFontSize(12);
    doc.text("Politisk gennemsigtighedsrapport", pageWidth - 15, 16, { align: 'right' });

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
    y += bioLines.length * 5 + 8;

    // === SKANDALER (FORBEDRET) ===
    if (politician.scandals && politician.scandals.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(200, 16, 46);
        doc.text("Skandaler", 15, y);
        y += 8;

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);

        politician.scandals.forEach((scandal, index) => {
            if (y > 240) {
                doc.addPage();
                y = 20;
            }

            // Titel + år
            doc.setFont(undefined, 'bold');
            doc.text(`${index + 1}. ${scandal.title} (${scandal.year || scandal.date || ''})`, 15, y);
            y += 6;

            doc.setFont(undefined, 'normal');

            // Lang beskrivelse (forbedring)
            const longDesc = scandal.longDesc || scandal.description || scandal.shortDesc || '';
            if (longDesc) {
                const descLines = doc.splitTextToSize(longDesc, pageWidth - 30);
                doc.text(descLines, 15, y);
                y += descLines.length * 5 + 4;
            }

            // Konsekvenser (forbedring)
            if (scandal.consequences) {
                if (y > 240) { doc.addPage(); y = 20; }
                doc.setFont(undefined, 'bold');
                doc.setTextColor(16, 185, 129); // emerald-500
                doc.text("Konsekvenser:", 15, y);
                y += 5;
                doc.setTextColor(0, 0, 0);
                doc.setFont(undefined, 'normal');
                const consLines = doc.splitTextToSize(scandal.consequences, pageWidth - 30);
                doc.text(consLines, 15, y);
                y += consLines.length * 5 + 4;
            }

            // Hvad burde være sket? (forbedring)
            if (scandal.whatShouldHaveHappened) {
                if (y > 240) { doc.addPage(); y = 20; }
                doc.setFont(undefined, 'bold');
                doc.setTextColor(234, 179, 8); // amber-500
                const whatTitle = scandal.whatShouldHaveHappened.title || 'Hvad burde være sket?';
                doc.text(whatTitle + ":", 15, y);
                y += 5;
                doc.setTextColor(0, 0, 0);
                doc.setFont(undefined, 'normal');
                const whatLines = doc.splitTextToSize(scandal.whatShouldHaveHappened.content || '', pageWidth - 30);
                doc.text(whatLines, 15, y);
                y += whatLines.length * 5 + 4;
            }

            // Kilder / Media Links (forbedring)
            let mediaLinks = scandal.mediaLinks;
            if (!mediaLinks && scandal.sources) {
                if (Array.isArray(scandal.sources)) {
                    mediaLinks = scandal.sources.map((url, i) => ({ name: `Kilde ${i+1}`, url }));
                } else if (typeof scandal.sources === 'string') {
                    mediaLinks = [{ name: 'Kilde', url: scandal.sources }];
                }
            }
            if (!mediaLinks && scandal.source && scandal.source.url) {
                mediaLinks = [{ name: scandal.source.text || 'Kilde', url: scandal.source.url }];
            }

            if (mediaLinks && mediaLinks.length > 0) {
                if (y > 240) { doc.addPage(); y = 20; }
                doc.setFont(undefined, 'bold');
                doc.text("Kilder:", 15, y);
                y += 5;
                doc.setFont(undefined, 'normal');
                mediaLinks.forEach(link => {
                    if (y > 240) { doc.addPage(); y = 20; }
                    doc.text(`• ${link.name}`, 15, y);
                    y += 5;
                });
                y += 2;
            }

            y += 4; // ekstra spacing mellem skandaler
        });
        y += 6;
    }

    // === ØKONOMISK STØTTE (uændret) ===
    if (politician.economicSupport && politician.economicSupport.length > 0) {
        if (y > 230) { doc.addPage(); y = 20; }

        doc.setFontSize(14);
        doc.setTextColor(200, 16, 46);
        doc.text("Økonomisk støtte", 15, y);
        y += 8;

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);

        politician.economicSupport.forEach(s => {
            doc.text(`• ${s.name}: ${s.amount} (${s.type})`, 15, y);
            y += 6;
        });
        y += 6;
    }

    // === BRUDTE VALGLØFTER (uændret) ===
    if (politician.brokenPromises && politician.brokenPromises.length > 0) {
        if (y > 230) { doc.addPage(); y = 20; }

        doc.setFontSize(14);
        doc.setTextColor(200, 16, 46);
        doc.text("Brudte valgløfter", 15, y);
        y += 8;

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);

        politician.brokenPromises.forEach(p => {
            const titleLines = doc.splitTextToSize(`• ${p.title}`, pageWidth - 30);
            doc.text(titleLines, 15, y);
            y += titleLines.length * 5 + 2;
        });
        y += 6;
    }

    // === INTERNATIONALE NETVÆRK (uændret) ===
    if (politician.affiliations && politician.affiliations.length > 0) {
        if (y > 230) { doc.addPage(); y = 20; }

        doc.setFontSize(14);
        doc.setTextColor(200, 16, 46);
        doc.text("Internationale netværk", 15, y);
        y += 8;

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);

        politician.affiliations.forEach(a => {
            doc.text(`• ${a.name} (${a.organization || ''} - ${a.year || ''})`, 15, y);
            y += 6;
        });
    }

    // === FOOTER MED LINK (uændret) ===
    doc.setDrawColor(200, 16, 46);
    doc.line(15, 260, pageWidth - 15, 260);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Denne rapport er genereret fra Skandale.dk", 15, 268);

    // Fed tekst + link
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text("Se alle skandaler, økonomisk støtte, internationale netværk og brudte valgløfter på:", 15, 275);
    
    doc.setTextColor(200, 16, 46);
    doc.textWithLink("https://mattomadsen.github.io/skandale.dk/", 15, 282, {
        url: "https://mattomadsen.github.io/skandale.dk/"
    });

    // Gem PDF
    const fileName = `${politician.name.replace(/ /g, '_')}_Skandale.dk.pdf`;
    doc.save(fileName);
}