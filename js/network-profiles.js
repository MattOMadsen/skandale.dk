// js/network-profiles.js - Faktuelle profiler til internationale netværk (kritisk borger-vinkel)

const NETWORK_PROFILES = {
  'Bilderberg Meetings': {
    tagline: 'Lukkede døre. Ingen referat. Ingen valgkreds.',
    what: 'Bilderberg-møderne er en årlig, invitation-only konference siden 1954 med politikere, topchefer, centralbankfolk og medieledere. Deltagelse sker under Chatham House-reglen: man må citere, men ikke afsløre hvem der sagde hvad. Officielt handler det om uformel dialog — ikke om beslutninger.',
    why: 'Når en dansk folketingspolitiker deltager, repræsenterer vedkommende ikke kun sine vælgere, men et globalt netværk, hvis dagsorden almindelige borgere hverken kan læse eller påvirke. Magten får et privat forspil; demokratiet får eftertanke.',
    footnote: 'Møderne er dokumenterede; deltagerlister lækkes ofte, men ikke officielle referater.'
  },
  'World Economic Forum (WEF)': {
    tagline: 'Davos-klubben: hvor “stakeholders” taler, og vælgerne lytter udenfor.',
    what: 'World Economic Forum er en schweizisk NGO grundlagt 1971, kendt for det årlige Davos-topmøde. Organisationen fremmer “stakeholder capitalism” og offentlig-private partnerskaber mellem virksomheder, stater og NGO’er. Den driver også programmer som Young Global Leaders og Global Shapers.',
    why: 'WEF er ikke en folkevalgt institution — men dens alumni og partnerskaber former den politiske tone i mange lande. Når danske politikere optræder som WEF-ansigter, låner de troværdighed fra et eliteforum, som de fleste danskere aldrig er inviteret ind i.',
    footnote: 'WEF er åbent om sin eksistens og mange arrangementer; indflydelsen sker ofte via netværk, ikke via Folketinget.'
  },
  'Young Global Leaders': {
    tagline: 'Karrierepipeline fra Davos til Christiansborg.',
    what: 'Young Global Leaders (YGL) er et WEF-program fra 2004, der hvert år udvælger ledere under 40 fra politik, erhverv, akademia og civilsamfund. Formålet er at “forme fremtidens ledelse” gennem netværk, mentorordninger og globale møder.',
    why: 'Det lyder harmløst — indtil man spørger: hvem bad danske vælgere om, at deres repræsentanter skulle passes i et internationalt ledelsesprogram? YGL er ikke en skandale i sig selv, men et eksempel på, hvordan eliteuddannelse kan komme før demokratisk mandat.',
    footnote: 'Alumni-lister og WEF-materiale er offentligt tilgængelige; tilknytning er frivillig, men sjældent debatteret i valgkampen.'
  },
  'Global Shapers Hub': {
    tagline: 'Den unge udgave af Davos-netværket.',
    what: 'Global Shapers er et WEF-netværk af lokale hubs for unge mellem 18 og 27, der arbejder med samfundsprojekter og deltager i WEFs økosystem. Mange hubs drives af frivillige med støtte fra lokale partnere og WEF.',
    why: 'Programmet kan gøre godt lokalt — men det binder også unge ledere tidligt til samme globale netværk, som voksne politikere senere mødes i. Gennemsigtighed handler ikke om at forbyde netværk, men om at vise, hvem der blev “shaped”, og hvornår.',
    footnote: null
  },
  'International Democrat Union (IDU)': {
    tagline: 'Højrefløjens globale koordineringskontor.',
    what: 'International Democrat Union (IDU) er en global alliance af centre-højre og konservative partier, grundlagt 1983. Medlemmer inkluderer bl.a. britiske Conservatives og tyske CDU. Organisationen koordinerer kampagner, strategi og internationale konservative linjer.',
    why: 'Partier har ret til at samarbejde internationalt — men når danske politikere er knyttet til IDU, sker koordineringen uden for dansk lovgivningsproces. Vælgerne ser partifarve; de ser sjældent den globale playbook.',
    footnote: 'IDU er registreret organisation med offentlig hjemmeside og medlemsliste.'
  },
  'European Conservatives and Reformists (ECR)': {
    tagline: 'EU-parlamentets konservative klub — med agenda uden for valgkampen.',
    what: 'ECR er en tvær-national gruppe i Europa-Parlamentet for konservative og reformkritiske partier. Gruppen samler stemmer, stiller kandidater til poster og koordinerer politiske linjer på tværs af medlemslande.',
    why: 'Gruppemedlemskab er legitimt i EU-politik — men for danske vælgere er det ofte usynligt, hvilke internationale alliancer der ligger bag de danske mandater. ECR er ikke hemmeligt; det er bare sjældent hovedemne i dansk debat.',
    footnote: null
  },
  'Conservative Political Action Conference (CPAC)': {
    tagline: 'Amerikansk kulturkamp eksporteret til Europa.',
    what: 'CPAC er en stor årlig konference for amerikanske konservative, arrangeret af American Conservative Union. I recente år er der kommet internationale udgaver — bl.a. i Europa — med talere fra højrefløjen globalt.',
    why: 'Når danske politikere optræder på CPAC, låner de platform til en amerikansk politisk kultur, som mange danske vælgere hverken har stemt på eller hørt debatteret i Folketinget. Det er ikke ulovligt — men det er heller ikke neutralt.',
    footnote: 'CPAC er offentligt arrangement med taler og mediedækning.'
  },
  'World Congress of Families': {
    tagline: 'Global koordinering af “familie-værdier” — uden dansk folkeafstemning.',
    what: 'World Congress of Families (WCF) er et internationalt netværk af organisationer og aktivister, der fremmer konservative syn på familie, køn og seksualitet. De afholder konferencer og koordinerer kampagner på tværs af kontinenter.',
    why: 'Uanset om man er enig eller uenig i synspunkterne: WCF er en ideologisk motor uden for det danske demokrati. Når politikere deltager, importerer de ikke bare meninger — de importerer en organiseret international bevægelse.',
    footnote: 'WCF og tilknyttede grupper er dokumenteret af medier og civilsamfundsorganisationer.'
  },
  'Transatlantic Policy Network (TPN)': {
    tagline: 'Atlanten som lukket korridor for politik og erhverv.',
    what: 'Transatlantic Policy Network er et forum der samler politikere, embedsmænd og erhvervsledere fra USA og Europa om transatlantisk politik, handel og sikkerhed.',
    why: 'TPN er mindre kendt end Davos — men samme logik gælder: beslutninger der påvirker danske borgere bør ikke kun forberedes i lukkede tvær-atlantiske netværk. Offentligheden får konklusionen; ikke forhandlingen.',
    footnote: null
  },
  'International Institute for Strategic Studies (IISS)': {
    tagline: 'Sikkerhedspolitikens tænketank — tæt på magten.',
    what: 'IISS er en britisk-baseret tænketank med fokus på forsvar, sikkerhed og geopolitik. Den er kendt for publikationen The Military Balance og arrangementer som Shangri-La Dialogue.',
    why: 'Tænketanke lever af adgang til ministre og generaler. Når politikere er tilknyttet IISS, får de ekspertise — men også et netværk, hvor forsvarsindustrien og staten mødes uden vælgernes nærvær.',
    footnote: 'IISS er nonprofit med åbne rapporter og events.'
  },
  'Global Citizen': {
    tagline: 'Kendis-aktivisme møder global politik.',
    what: 'Global Citizen er en bevægelse og NGO, der bruger koncerter og kampagner til at presse på for FN-mål som fattigdom og klima. De samarbejder med politikere, kunstnere og virksomheder.',
    why: 'Formålet kan være sympatisk — men når politikere optræder på Global Citizen-scenen, blander de folkevalgt magt med branding og sponsorlogik. God sagsom får ikke automatisk demokratisk legitimitet.',
    footnote: null
  },
  'European Council on Foreign Relations (ECFR)': {
    tagline: 'EU’s udenrigspolitik designes også uden for valgurnen.',
    what: 'ECFR er en paneuropæisk tænketank med kontorer i flere hovedstæder. Den analyserer udenrigs- og sikkerhedspolitik og rådgiver regeringer og institutioner.',
    why: 'Tænketanke er lovlige — men de er også døråbnere. Politikere med ECFR-tilknytning bevæger sig i kredse, hvor EU-politik ofte formes, før den når national debat.',
    footnote: 'ECFR offentliggør analyser og medlemslister for seniorroller.'
  },
  '40 under 40 European Young Leaders': {
    tagline: 'Endnu et “fremtidens ledere”-program — denne gang europæisk.',
    what: '“40 under 40 European Young Leaders” (EYL40) er et udvælgelsesprogram under Friends of Europe, der hvert år fremhæver unge ledere fra Europa inden for politik, erhverv og civilsamfund.',
    why: 'Mønsteret gentager sig: små, håndplukkede kohorter får netværk, synlighed og legitimitet — uden at danske vælgere har bedt om det. Det er ikke hemmeligt; det er bare eliteinfrastruktur.',
    footnote: null
  },
  'NATO': {
    tagline: 'Alliancen er officiel — netværket bag den er det sjældent.',
    what: 'NATO er den nordatlantiske forsvarsalliance med 32 medlemslande. Ud over militært samarbejde findes parlamentariske fora, ekspertnetværk og sikkerhedspolitiske konferencer knyttet til alliancen.',
    why: 'NATO er demokratisk forankret via regeringer og Folketinget — men de uformelle netværk omkring alliancen (konferencer, sidemøder, tænketank-partnerskaber) sker uden fuld offentlig gennemsigtighed.',
    footnote: 'Forsvarspolitik i Danmark skal godkendes politisk; NATO-tilknytning alene er ikke et demokratisk problem — manglende åbenhed om sidenetværk kan være det.'
  },
  'NATO Parliamentary Assembly': {
    tagline: 'Parlamentarikere mødes — uden dansk folkemøde.',
    what: 'NATO Parliamentary Assembly samler parlamentarikere fra medlemslande til debat om sikkerhedspolitik, besøg i NATO-strukturen og fælles resolutioner.',
    why: 'Formålet er transparens mellem allierede — ironisk nok sker meget af samarbejdet langt fra dansk offentlighed. Vælgerne hører om NATO via regeringen; sjældent om de parlamentariske sideløb.',
    footnote: null
  },
  'Nordic Council': {
    tagline: 'Norden som politisk netværk — med begrænset dansk spotlight.',
    what: 'Nordisk Råd er et samarbejdsorgan for parlamentarikere og regeringer i Norden. Det arbejder med politik på tværs af grænser — fra klima til integration.',
    why: 'Nordisk samarbejde er legitimt og ofte praktisk. Men når danske politikere bygger karriere via nordiske netværk, sker det parallelt med national politik — og vælgerne ser ikke altid, hvilke nordiske kompromiser der smides i baggrunden.',
    footnote: 'Nordisk Råd er åbent organ med offentlige møder og dokumenter.'
  },
  'European People’s Party (EPP)': {
    tagline: 'Europas største borgerlige familie — koordineret uden for Danmark.',
    what: 'EPP er den største politiske familie i Europa-Parlamentet og samler centre-højre og kristeligt-demokratiske partier, herunder flere nordiske søsterpartier.',
    why: 'Danske vælgere stemmer på et dansk parti — ikke direkte på EPP. Alligevel kan EPP-medlemskab påvirke, hvilke EU-linjer et parti finder “naturlige”. Det fortjener mere lys end et fodnot i en partibrochure.',
    footnote: null
  },
  'Alliance of Liberals and Democrats for Europe (ALDE)': {
    tagline: 'Liberalismens europæiske koordinationslag.',
    what: 'ALDE/ Renew Europe-sfæren samler liberale partier i EU med fælles gruppe i Europa-Parlamentet og koordinering af lovgivningsstrategi.',
    why: 'Liberal internationalisme er en ideologi — ikke bare “pragmatisme”. Når danske liberale politikere er knyttet til ALDE-netværk, er det en politisk valglinje, vælgerne bør kunne se og vurdere.',
    footnote: null
  },
  'European Liberal Forum': {
    tagline: 'Tanker, netværk og EU-penge bag liberale partier.',
    what: 'European Liberal Forum er et politisk institut under det liberale partifamilie i Europa. Det arrangerer seminarer, uddannelser og politiske programmer for liberale aktører.',
    why: 'Partistøttede institutter former næste generation af politikere. Offentligheden ser valgplakater; de ser sjældent, hvem der betaler seminarhotellet i Bruxelles.',
    footnote: 'ELF modtager EU-partistøtte og offentliggør årsrapporter.'
  },
  'Liberal International': {
    tagline: 'Global liberalisme siden 1947.',
    what: 'Liberal International er en verdensomspændende federation af liberale partier og organisationer. Den fremmer liberale værdier og koordinerer internationalt partisamarbejde.',
    why: 'Internationalt partisamarbejde er tilladt — men det er stadig et netværk, der kan trække nationale politikere mod globale kompromiser, vælgerne ikke har debatteret.',
    footnote: null
  },
  'Party of the European Left': {
    tagline: 'Venstrefløjens europæiske alliance.',
    what: 'Party of the European Left samler socialistiske og kommunistiske partier i Europa med fælles politiske linjer og koordinering i EU-sammenhæng.',
    why: 'Også venstrefløjen koordinerer uden for national valgkamp. Gennemsigtighed gælder alle fløje: vælgere fortjener at vide, hvilken europæisk venstrealliance der ligger bag mandatet.',
    footnote: null
  },
  'Nordic Green Left Alliance': {
    tagline: 'Nordisk venstrefløj i EU-parlamentet.',
    what: 'Nordic Green Left Alliance er en parlamentarisk gruppe i Europa-Parlamentet med nordiske og grønne venstrepartier.',
    why: 'Gruppen er åben om sin eksistens — men danske vælgere tænker ofte “dansk parti”, ikke “europæisk parlamentarisk blok”. Netværket påvirker, hvad der overhovedet kan komme på dagsordenen.',
    footnote: null
  },
  'GUE/NGL (European Parliament)': {
    tagline: 'Den radikale venstrefløj i Bruxelles.',
    what: 'GUE/NGL (The Left) er en parlamentarisk gruppe i Europa-Parlamentet for antikapitalistiske og radikale venstrepartier.',
    why: 'For radikale vælgere kan tilknytning være et plus — for andre et rødt flag. Pointen er demokratisk: internationale gruppetilhørsforhold bør ikke være skjult infrastruktur.',
    footnote: null
  },
  'European Green Party': {
    tagline: 'Grøn politik koordineret på europæisk niveau.',
    what: 'European Green Party er en føderation af grønne partier i Europa med fælles kampagner, klimapolitik og koordinering i EU.',
    why: 'Klima kræver internationalt samarbejde — men også nationalt mandat. Når politikere er bundet til europæiske grønne netværk, importerer de ikke kun politik — de importerer koalitioner.',
    footnote: null
  },
  'Global Greens': {
    tagline: 'Grøn internationalisme på verdensplan.',
    what: 'Global Greens er et verdensomspændende netværk af grønne partier og bevægelser med fælles charter og globale kongresser.',
    why: 'Global koordinering kan styrke en sag — men det flytter også en del af den politiske loyalitet væk fra den danske valgkreds og ud i et planetarisk netværk.',
    footnote: null
  },
  'Green European Foundation': {
    tagline: 'EU-finansieret grøn tænketank for partier.',
    what: 'Green European Foundation er et politisk stiftelsesnetværk for grønne partier i Europa, finansieret via EU’s ordning for europæiske politiske stiftelser.',
    why: 'EU-penge til partinetværk er lovligt — men det er stadig et system, hvor politiske linjer formes i seminarer langt fra danske byrådssale og folkemøder.',
    footnote: 'Offentliggør årsrapporter og modtagere af støtte.'
  },
  'European Defence Agency (EDA)': {
    tagline: 'EU’s forsvarsindustrielle koordinationsapparat.',
    what: 'European Defence Agency er et EU-agentur der koordinerer forsvarskapacitet, forskning og industrisamarbejde mellem medlemslande.',
    why: 'Forsvar og industri hører til de mest magtfulde netværk. Politisk tilknytning til EDA-økosystemet fortjener offentlighed — ikke fordi det er ulovligt, men fordi det binder Danmark til strukturer vælgerne sjældent debatterer.',
    footnote: null
  },
  'European Freedom Alliance': {
    tagline: 'Libertariansk og højre-liberal koordinering i Europa.',
    what: 'European Freedom Alliance er et netværk af libertarianske og klassisk-liberale organisationer og partier i Europa med fokus på marked, frihed og begrænset stat.',
    why: 'Ideologiske netværk er legitime — men de er ikke neutrale. Når danske politikere deltager, importerer de en europæisk frihedsfortælling, som ikke nødvendigvis matcher dansk velfærdsmodel.',
    footnote: null
  },
  'UN Global Compact': {
    tagline: 'FN’s erhvervsnetværk — frivillige løfter, reel indflydelse.',
    what: 'UN Global Compact er et FN-initiativ, hvor virksomheder forpligter sig til principper om menneskerettigheder, arbejdstagerrettigheder, miljø og anti-korruption.',
    why: 'Det lyder rent — men det er også et netværk, hvor politikere og CEO’er mødes under FN-brandet. Frivillige løfter erstatter ikke demokratisk regulering; de kan legitimere “soft governance”.',
    footnote: 'Deltagere offentliggøres på FN’s hjemmeside.'
  },
  'UN Sustainable Development Goals (SDGs)': {
    tagline: 'Verdensmål som politisk visitkort.',
    what: 'FN’s 17 verdensmål (SDG) er globale udviklingsmål til 2030. Mange regeringer, kommuner, NGO’er og virksomheder tilknytter sig målene via partnerskaber og kampagner.',
    why: 'Verdensmål er bredt accepterede — og derfor lette at bruge som politisk pynt uden konkret politik. Tilknytning siger lidt om handling; den siger meget om, hvilke globale narrativer en politiker vil associeres med.',
    footnote: null
  },
  'UN Human Rights Council': {
    tagline: 'Menneskerettigheder på FN’s scene — med politisk teater.',
    what: 'FN’s Menneskerettighedsråd er et intergovernmentalt organ med medlemslande, der debatterer og overvåger menneskerettigheder globalt.',
    why: 'Rådet er officielt — men også et diplomatisk netværk, hvor stater handler image frem for konsekvens. Dansk tilknytning fortjener kritisk gennemsyn, ikke automatisk applaus.',
    footnote: 'Medlemskab og afstemninger er offentlige.'
  },
  'UNICEF Danmark': {
    tagline: 'Børns sag — eller politisk goodwill?',
    what: 'UNICEF arbejder for børns rettigheder globalt. UNICEF Danmark er den nationale komité med fundraising, kampagner og ambassadører.',
    why: 'Humanitært arbejde er vigtigt — men når politikere listes ved siden af UNICEF, låner de troværdighed fra en kær organisation. Det er ikke skidt at hjælpe børn; det er relevant at spørge, om tilknytningen er dybt engagement eller kort visitkort.',
    footnote: null
  },
  'Save the Children International': {
    tagline: 'Red børnene — men vis også konflikterne.',
    what: 'Save the Children er en international børnerettighedsorganisation med nødhjælp, udvikling og politisk påvirkning i kriser og konflikter.',
    why: 'NGO-tilknytning kan være ægte engagement. Den kan også være et skjold mod kritik: “jeg arbejder med børn” afslutter ikke spørgsmålet om, hvem man ellers mødes med i internationale korridorer.',
    footnote: null
  },
  'Global Health Council': {
    tagline: 'Sundhedspolitik som globalt netværk.',
    what: 'Global Health Council er en amerikansk-baseret alliance af organisationer, der arbejder med global sundhed, udviklingshjælp og sundhedspolitik.',
    why: 'Sundhed er grænseoverskridende — men beslutninger om prioritering og penge sker i netværk, hvor industrien også sidder ved bordet. Borgere får vacciner og regninger; de får sjældent invitationen.',
    footnote: null
  },
  'World Future Council': {
    tagline: '“Fremtidens” politikere udpeget af “fremtidens” råd.',
    what: 'World Future Council er en international organisation, der fremhæver politiske løsninger på miljø, retfærdighed og fred — og udnævner “Future Policy Awards”.',
    why: 'Når politikere får priser og titler fra internationale råd, stiger deres prestige — uden at vælgerne har sagt ja. Det er soft power: anerkendelse som politisk valuta.',
    footnote: null
  },
  'International Network of Engineers and Scientists for Global Responsibility (INES)': {
    tagline: 'Forskere mod atomvåben — og for gennemsigtighed.',
    what: 'INES er et internationalt netværk af ingeniører og forskere, der arbejder for fred, nedrustning og ansvarlig anvendelse af teknologi.',
    why: 'Dette netværk er mindre “eliteklub” og mere civilsamfund — men stadig værd at kende, når politikere bruger videnskabelig tilknytning som autoritet i debatter, vælgerne ikke har fact-checket.',
    footnote: null
  },
  'Internationale liberale netværk': {
    tagline: 'Samlet betegnelse for et spredt liberalt web.',
    what: 'Dansk betegnelse for tilknytning til liberale internationale organisationer — fra partiføderationer til politiske institutter og seminarer i Europa og globalt.',
    why: 'Når data siger “internationale liberale netværk” uden præcisering, er det netop problemet: vælgerne ser en etiket; ikke hvilken dør der blev åbnet i Bruxelles, Berlin eller Davos.',
    footnote: 'Skandale.dk viser detaljer på den enkelte politikers profil, når kilderne tillader det.'
  },
  'SIRI-Kommissionen': {
    tagline: 'National kommission — ikke et globalt magtnetværk.',
    what: 'SIRI-Kommissionen var en dansk kommission, der undersøgte udfordringer i social- og integrationsområdet. Den er national forvaltning — ikke et internationalt eliteforum.',
    why: 'Den er med her, fordi den står i affiliations-data — ikke fordi den hører til samme kategori som Bilderberg. Pointen er stadig gennemsigtighed: hvad betyder tilknytningen konkret for den enkelte politiker?',
    footnote: null
  }
};

const NETWORK_PROFILE_ALIASES = {
  'bilderberg meetings': 'Bilderberg Meetings',
  'bilderberg group': 'Bilderberg Meetings',
  'bilderberg-gruppen': 'Bilderberg Meetings',
  'bilderberg': 'Bilderberg Meetings',
  'world economic forum (wef)': 'World Economic Forum (WEF)',
  'world economic forum': 'World Economic Forum (WEF)',
  'wef': 'World Economic Forum (WEF)',
  'young global leaders': 'Young Global Leaders',
  'young global leader': 'Young Global Leaders',
  'ygl': 'Young Global Leaders',
  'global shapers hub': 'Global Shapers Hub',
  'global shapers': 'Global Shapers Hub',
  'international democrat union (idu)': 'International Democrat Union (IDU)',
  'idu': 'International Democrat Union (IDU)',
  'european conservatives and reformists (ecr)': 'European Conservatives and Reformists (ECR)',
  'ecr': 'European Conservatives and Reformists (ECR)',
  'conservative political action conference (cpac)': 'Conservative Political Action Conference (CPAC)',
  'cpac': 'Conservative Political Action Conference (CPAC)',
  'world congress of families': 'World Congress of Families',
  'wcf': 'World Congress of Families',
  'transatlantic policy network (tpn)': 'Transatlantic Policy Network (TPN)',
  'tpn': 'Transatlantic Policy Network (TPN)',
  'international institute for strategic studies (iiss)': 'International Institute for Strategic Studies (IISS)',
  'iiss': 'International Institute for Strategic Studies (IISS)',
  'european council on foreign relations (ecfr)': 'European Council on Foreign Relations (ECFR)',
  'ecfr': 'European Council on Foreign Relations (ECFR)',
  '40 under 40 european young leaders': '40 under 40 European Young Leaders',
  'friends of europe': '40 under 40 European Young Leaders'
};

function normalizeProfileLookupKey(name) {
  if (!name) return '';
  return name
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\u00e6/g, 'ae')
    .replace(/\u00f8/g, 'oe')
    .replace(/\u00e5/g, 'aa')
    .trim();
}

function resolveNetworkProfileKey(displayName) {
  if (!displayName) return null;
  if (NETWORK_PROFILES[displayName]) return displayName;

  const normalized = normalizeProfileLookupKey(displayName);
  if (NETWORK_PROFILE_ALIASES[normalized]) return NETWORK_PROFILE_ALIASES[normalized];

  for (const [alias, canonical] of Object.entries(NETWORK_PROFILE_ALIASES)) {
    if (normalized.includes(alias) || alias.includes(normalized)) return canonical;
  }

  for (const key of Object.keys(NETWORK_PROFILES)) {
    const keyNorm = normalizeProfileLookupKey(key);
    if (normalized === keyNorm || normalized.includes(keyNorm) || keyNorm.includes(normalized)) {
      return key;
    }
  }

  return null;
}

function getNetworkProfile(displayName) {
  const key = resolveNetworkProfileKey(displayName);
  if (key && NETWORK_PROFILES[key]) {
    return { ...NETWORK_PROFILES[key], key, isGeneric: false };
  }

  return {
    key: null,
    isGeneric: true,
    tagline: 'Et netværk uden for valgurnen',
    what: `${displayName} er registreret som international tilknytning for mindst én dansk politiker på Skandale.dk. Vi dokumenterer navnet — fordi vælgerne sjældent får hele billedet i en valgkamp.`,
    why: 'Internationale netværk — fra NGO’er til partiføderationer og lukkede konferencer — kan forme politikersyn, kontakter og prioriteringer. Det er ikke automatisk ulovligt eller forkert. Det er bare ofte usynligt for dem, der betaler regningen: borgerne.',
    footnote: 'Kender du mere præcise kilder om dette netværk? Skandale.dk bygger på åbne data og vil gerne præcisere profilen over tid.'
  };
}

function renderNetworkProfileSection(displayName) {
  const profile = getNetworkProfile(displayName);
  const borderClass = profile.isGeneric
    ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60'
    : 'border-amber-200 dark:border-amber-800/50 bg-amber-50/80 dark:bg-amber-950/25';

  const taglineClass = profile.isGeneric
    ? 'text-slate-800 dark:text-slate-200'
    : 'text-amber-900 dark:text-amber-200';

  let html = `
    <section class="mb-8 p-5 rounded-2xl border ${borderClass}">
      <div class="flex items-start gap-3 mb-3">
        <div class="w-9 h-9 rounded-xl bg-[#C8102E]/10 flex items-center justify-center shrink-0 mt-0.5">
          <i class="fa-solid fa-circle-info text-[#C8102E] text-sm"></i>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Om netværket</p>
          <p class="text-sm font-semibold ${taglineClass}">${profile.tagline}</p>
        </div>
      </div>
      <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">${profile.what}</p>
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-l-2 border-[#C8102E]/40 pl-3">${profile.why}</p>
  `;

  if (profile.footnote) {
    html += `
      <p class="text-xs text-slate-500 dark:text-slate-500 mt-4 italic">${profile.footnote}</p>
    `;
  }

  html += `</section>`;
  return html;
}

window.getNetworkProfile = getNetworkProfile;
window.renderNetworkProfileSection = renderNetworkProfileSection;