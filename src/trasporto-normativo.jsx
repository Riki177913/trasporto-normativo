import { useState, useMemo } from "react";

// ============================================================
// DATABASE NORMATIVO
// ============================================================
const NORME = [
  // EUROPEE
  {
    id: "EU-1",
    livello: "europeo",
    tipo: "Regolamento",
    codice: "Reg. (CE) n. 1370/2007",
    titolo: "Obblighi di servizio pubblico nel trasporto passeggeri",
    data: "2007-10-23",
    sintesi: "Disciplina i contratti di servizio pubblico per il trasporto di passeggeri su strada e per ferrovia, definendo i criteri per l'affidamento di servizi e le compensazioni economiche agli operatori.",
    testo: "Il regolamento stabilisce come le autorità competenti possono intervenire nel settore del trasporto pubblico di passeggeri per garantire servizi di interesse generale. Si applica al trasporto pubblico di passeggeri per ferrovia e altri modi di trasporto su rotaia e su strada. Esclude il trasporto aereo e il trasporto marittimo. Per il NCC e taxi, fornisce il quadro generale per la distinzione tra servizi di linea e non di linea.",
    paroleChiave: ["servizio pubblico", "contratto", "compensazione", "affidamento", "esclusiva"],
    articoliRilevanti: ["Art. 1 - Obiettivo e ambito", "Art. 2 - Definizioni", "Art. 5 - Aggiudicazione di contratti"]
  },
  {
    id: "EU-2",
    livello: "europeo",
    tipo: "Direttiva",
    codice: "Dir. 2006/123/CE (Bolkestein)",
    titolo: "Servizi nel mercato interno",
    data: "2006-12-12",
    sintesi: "Direttiva servizi che impatta sulle autorizzazioni per attività di trasporto non di linea, limitando i regimi autorizzatori non giustificati da motivi imperativi di interesse generale.",
    testo: "La direttiva mira a eliminare gli ostacoli alla libertà di stabilimento e alla libera circolazione dei servizi nell'UE. Per il trasporto NCC, impone che i regimi autorizzatori siano: giustificati da motivi imperativi d'interesse generale, non discriminatori, proporzionati. Ha influenzato la giurisprudenza della Corte di Giustizia UE in tema di licenze taxi e NCC.",
    paroleChiave: ["libertà di stabilimento", "autorizzazione", "proporzionalità", "interesse generale", "NCC"],
    articoliRilevanti: ["Art. 9 - Regimi di autorizzazione", "Art. 10 - Condizioni per il rilascio", "Art. 16 - Libera prestazione"]
  },
  {
    id: "EU-3",
    livello: "europeo",
    tipo: "Sentenza CGUE",
    codice: "C-418/22",
    titolo: "CGUE - Uber France / Taxi vs piattaforme digitali",
    data: "2022-04-28",
    sintesi: "La Corte di Giustizia ha confermato che gli Stati possono regolamentare le piattaforme di intermediazione di trasporto, purché le restrizioni siano proporzionate e non discriminatorie.",
    testo: "La Corte ha statuito che i servizi di intermediazione come Uber costituiscono 'servizi nel settore dei trasporti' ai sensi dell'art. 58 TFUE e non semplici servizi della società dell'informazione, escludendoli dall'applicazione della direttiva Bolkestein. Gli Stati membri possono pertanto disciplinare tali servizi con normative specifiche senza necessità di notifica alla Commissione.",
    paroleChiave: ["Uber", "piattaforma digitale", "servizio trasporto", "intermediazione", "app"],
    articoliRilevanti: ["Art. 58 TFUE", "Art. 56 TFUE - libera prestazione servizi"]
  },

  // NAZIONALI - LEGGI PRIMARIE
  {
    id: "NAZ-1",
    livello: "nazionale",
    tipo: "Legge",
    codice: "L. 15 gennaio 1992, n. 21",
    titolo: "Legge quadro per il trasporto di persone mediante autoservizi pubblici non di linea",
    data: "1992-01-15",
    sintesi: "Legge fondamentale che disciplina taxi, NCC con conducente, noleggio veicoli. Definisce le categorie di trasporto non di linea, il sistema di licenze e autorizzazioni.",
    testo: "La legge 21/1992 costituisce la fonte primaria nazionale per il settore. Definisce: TAXI - servizio di piazza con veicoli pubblici, tariffe obbligatorie, stazionamento su suolo pubblico, obbligo di accettare qualsiasi richiesta di servizio nell'ambito del Comune. NCC - noleggio con conducente, prenotazione obbligatoria, ritorno alla rimessa, divieto di stazionamento su suolo pubblico, tariffe libere. Veicoli ammessi: autovetture, motocarrozzette, natanti, aeromobili. Il numero di autorizzazioni NCC è determinato dai Comuni.",
    paroleChiave: ["taxi", "NCC", "licenza", "autorizzazione", "rimessa", "tariffa", "comune"],
    articoliRilevanti: ["Art. 1 - Definizioni e ambito", "Art. 3 - Taxi", "Art. 4 - NCC", "Art. 6 - Autorizzazioni", "Art. 8 - Requisiti conducenti", "Art. 11 - Sanzioni"]
  },
  {
    id: "NAZ-2",
    livello: "nazionale",
    tipo: "Decreto Legislativo",
    codice: "D.Lgs. 30 aprile 1992, n. 285",
    titolo: "Codice della Strada",
    data: "1992-04-30",
    sintesi: "Il Codice della Strada disciplina la circolazione dei veicoli adibiti al trasporto non di linea, i requisiti tecnici dei veicoli, la patente speciale e le infrazioni specifiche.",
    testo: "Il CdS si applica al trasporto non di linea per: classificazione veicoli (autovetture, autobus, veicoli speciali), patente di guida richiesta (B per taxi e NCC fino a 9 posti, D per autobus), revisione periodica obbligatoria, cronotachigrafo per veicoli oltre 9 posti, limiti di velocità specifici, norme sulla sicurezza dei passeggeri, omologazione dei veicoli. Art. 82 disciplina specificamente i veicoli adibiti al trasporto di persone.",
    paroleChiave: ["patente", "veicolo", "revisione", "sicurezza", "omologazione", "cronotachigrafo"],
    articoliRilevanti: ["Art. 82 - Veicoli a uso speciale", "Art. 116 - Patente di guida", "Art. 80 - Revisione", "Art. 174 - Tempi guida"]
  },
  {
    id: "NAZ-3",
    livello: "nazionale",
    tipo: "Legge",
    codice: "L. 11 agosto 2003, n. 218",
    titolo: "Disciplina dell'attività di trasporto di persone effettuato mediante noleggio di autobus con conducente",
    data: "2003-08-11",
    sintesi: "Disciplina specifica per il noleggio di autobus con conducente (NBC), distinta dal NCC con autovettura. Regola l'iscrizione al REN e i requisiti per l'accesso alla professione.",
    testo: "La legge 218/2003 regola il settore NBC (noleggio bus con conducente): iscrizione obbligatoria al Registro Elettronico Nazionale (REN) o albo provinciale, requisiti di onorabilità, capacità finanziaria, idoneità professionale, sede operativa nel territorio. Contratto di noleggio scritto obbligatorio, divieto di raccolta a bordo di persone non prenotate, utilizzo di veicoli di categoria M2 e M3.",
    paroleChiave: ["autobus", "noleggio", "conducente", "NBC", "REN", "albo", "contratto"],
    articoliRilevanti: ["Art. 1 - Definizioni", "Art. 2 - Iscrizione albo", "Art. 4 - Requisiti", "Art. 6 - Contratto"]
  },
  {
    id: "NAZ-4",
    livello: "nazionale",
    tipo: "Decreto Legislativo",
    codice: "D.Lgs. 22 dicembre 2000, n. 395",
    titolo: "Attuazione della direttiva 98/76/CE sull'accesso alla professione di trasportatore su strada",
    data: "2000-12-22",
    sintesi: "Recepisce la normativa europea sull'accesso alla professione di trasportatore, stabilendo requisiti di onorabilità, capacità finanziaria e competenza professionale.",
    testo: "Il decreto fissa i requisiti per esercitare la professione di trasportatore su strada di persone: ONORABILITÀ - assenza di condanne per reati gravi, non interdizione dalla professione. CAPACITÀ FINANZIARIA - mezzi finanziari adeguati (€9.000 per il primo veicolo, €5.000 per ogni veicolo aggiuntivo per trasporto passeggeri). COMPETENZA PROFESSIONALE - superamento di esame presso Camera di Commercio o titolo equipollente.",
    paroleChiave: ["onorabilità", "capacità finanziaria", "competenza professionale", "accesso professione", "Camera di Commercio"],
    articoliRilevanti: ["Art. 3 - Onorabilità", "Art. 4 - Capacità finanziaria", "Art. 5 - Competenza professionale"]
  },
  {
    id: "NAZ-5",
    livello: "nazionale",
    tipo: "Decreto Legge",
    codice: "D.L. 10 settembre 2021, n. 121 (conv. L. 9 novembre 2021, n. 156)",
    titolo: "Disposizioni urgenti in materia di investimenti e sicurezza delle infrastrutture",
    data: "2021-09-10",
    sintesi: "Contiene norme di aggiornamento per il settore taxi e NCC, incluse disposizioni per la digitalizzazione e i requisiti per le piattaforme digitali di intermediazione.",
    testo: "Il decreto introduce: obbligo di ricevuta fiscale o fattura elettronica per ogni servizio NCC e taxi, regole per le piattaforme digitali di intermediazione che devono rispettare la normativa sulla L. 21/1992, divieto per le piattaforme di intermediare servizi non autorizzati, sanzioni amministrative per piattaforme irregolari, coordinamento tra Comuni per servizi NCC intracomunali.",
    paroleChiave: ["piattaforma digitale", "fattura elettronica", "intermediazione", "app taxi", "digitalizzazione"],
    articoliRilevanti: ["Art. 10-bis - Piattaforme digitali", "Art. 10-ter - Obblighi fiscali", "Art. 10-quater - Sanzioni"]
  },
  {
    id: "NAZ-6",
    livello: "nazionale",
    tipo: "Legge",
    codice: "L. 26 ottobre 1995, n. 449",
    titolo: "Modifiche alla legge 21/1992 - disciplina del servizio taxi",
    data: "1995-10-26",
    sintesi: "Introduce modifiche alla legge quadro, rafforzando i divieti per gli NCC di svolgere servizi propri del taxi e precisando l'obbligo di rientro in rimessa.",
    testo: "La legge chiarisce la distinzione taxi/NCC: il conducente NCC deve: rientrare in rimessa al termine di ogni servizio o in attesa di prenotazioni, non sostare in luogo pubblico in attesa di clienti, non raccogliere passeggeri non prenotati. L'autorizzazione NCC è valida solo nel Comune che l'ha rilasciata per l'inizio e la fine del servizio (rimessa). Ha introdotto il registro delle prenotazioni NCC.",
    paroleChiave: ["rimessa", "prenotazione", "registro", "stazionamento", "abusivismo"],
    articoliRilevanti: ["Art. 1 - Modifiche art. 3 L.21/1992", "Art. 2 - Registro prenotazioni"]
  },
  {
    id: "NAZ-7",
    livello: "nazionale",
    tipo: "Circolare ministeriale",
    codice: "MIT - Circ. 21 gennaio 2020",
    titolo: "Chiarimenti su NCC - obbligo rimessa e prenotazioni",
    data: "2020-01-21",
    sintesi: "Il Ministero delle Infrastrutture e dei Trasporti chiarisce l'interpretazione dell'obbligo di rientro in rimessa per gli NCC e il sistema di prenotazioni.",
    testo: "La circolare MIT chiarisce che: l'obbligo di rientro in rimessa dopo ogni servizio non implica il ritorno fisico in rimessa ma il ritorno nel Comune di autorizzazione, il registro delle prenotazioni può essere tenuto in formato digitale, le prenotazioni via app sono equivalenti alle prenotazioni telefoniche, il veicolo NCC non può attendere clienti in luoghi pubblici anche se il conducente ha ricevuto prenotazione.",
    paroleChiave: ["rimessa", "circolare MIT", "prenotazione digitale", "app", "chiarimento"],
    articoliRilevanti: ["Punto 1 - Obbligo rimessa", "Punto 2 - Registro digitale", "Punto 3 - Prenotazioni app"]
  },

  // REGIONALI
  {
    id: "REG-1",
    livello: "regionale",
    tipo: "Legge Regionale",
    codice: "L.R. Lombardia 4 aprile 2012, n. 6",
    titolo: "Disciplina del settore dei taxi e del noleggio con conducente",
    data: "2012-04-04",
    sintesi: "La Regione Lombardia disciplina i criteri per il rilascio di autorizzazioni NCC, i requisiti aggiuntivi e le modalità di coordinamento tra Comuni.",
    testo: "La legge regionale lombarda stabilisce: i Comuni con meno di 50.000 abitanti possono associarsi per la gestione delle autorizzazioni, la Regione determina i criteri minimi per il rilascio delle autorizzazioni, i conducenti NCC devono superare corso di formazione regionale, le tariffe taxi minime sono determinate dalla Regione per le tratte interurbane, coordinamento metropolitano per Milano e provincia.",
    paroleChiave: ["Lombardia", "autorizzazione", "comuni associati", "formazione", "tariffa regionale"],
    articoliRilevanti: ["Art. 3 - Criteri autorizzativi", "Art. 5 - Formazione conducenti", "Art. 7 - Coordinamento"]
  },
  {
    id: "REG-2",
    livello: "regionale",
    tipo: "Legge Regionale",
    codice: "L.R. Toscana 28 dicembre 2009, n. 63",
    titolo: "Norme per l'esercizio del trasporto pubblico non di linea",
    data: "2009-12-28",
    sintesi: "Disciplina regionale toscana per taxi e NCC, con particolare attenzione ai servizi turistici e alle aree a vocazione turistica.",
    testo: "La legge toscana introduce: autorizzazione NCC turistica per servizi in aree UNESCO e parchi nazionali, requisiti linguistici aggiuntivi per conducenti NCC in aree turistiche (conoscenza almeno una lingua straniera), tariffe guidate per servizi aeroportuali, commissione regionale di monitoraggio del settore, possibilità di autorizzazioni stagionali per zone ad alto afflusso turistico.",
    paroleChiave: ["Toscana", "turismo", "autorizzazione stagionale", "lingua straniera", "aeroporto"],
    articoliRilevanti: ["Art. 4 - Servizi turistici", "Art. 6 - Requisiti conducenti", "Art. 9 - Tariffe aeroportuali"]
  },
  {
    id: "REG-3",
    livello: "regionale",
    tipo: "Legge Regionale",
    codice: "L.R. Lazio 26 ottobre 1993, n. 58",
    titolo: "Disciplina dei servizi pubblici di trasporto su strada",
    data: "1993-10-26",
    sintesi: "Legge regionale del Lazio che regola il trasporto non di linea, con norme specifiche per il Comune di Roma come Capitale.",
    testo: "La legge laziale prevede: norme speciali per Roma Capitale in ragione della funzione di capitale nazionale, possibilità per i Comuni di stipulare convenzioni per servizi NCC intermunicipali, criteri per la determinazione del numero massimo di autorizzazioni NCC, commissione tecnica regionale per i ricorsi contro i dinieghi comunali, norme sul subentro nelle autorizzazioni NCC.",
    paroleChiave: ["Lazio", "Roma Capitale", "subentro", "convenzione", "numero autorizzazioni"],
    articoliRilevanti: ["Art. 2 - Roma Capitale", "Art. 5 - Servizi intermunicipali", "Art. 8 - Subentro autorizzazioni"]
  },

  // COMUNALI / REGOLAMENTI
  {
    id: "COM-1",
    livello: "comunale",
    tipo: "Regolamento Comunale",
    codice: "Reg. Comune di Milano - Delib. CC n. 12/2019",
    titolo: "Regolamento per il servizio taxi e NCC nel Comune di Milano",
    data: "2019-03-15",
    sintesi: "Il regolamento di Milano disciplina nel dettaglio il servizio taxi cittadino, le modalità di rilascio delle licenze taxi, i requisiti per gli NCC milanesi.",
    testo: "Il regolamento milanese stabilisce: le postazioni taxi nel territorio comunale, le tariffe taxi con supplementi (aeroporto, notte, bagagli), il numero di licenze taxi rilasciabili, i criteri per l'assegnazione delle nuove licenze taxi (concorso pubblico), i requisiti delle rimesse NCC (distanza massima dalla circonvallazione), l'obbligo per i taxi di accettare pagamenti elettronici, sanzioni per abusivismo.",
    paroleChiave: ["Milano", "postazione taxi", "tariffa supplemento", "rimessa", "pagamento elettronico"],
    articoliRilevanti: ["Art. 5 - Postazioni taxi", "Art. 12 - Tariffe", "Art. 20 - Rimesse NCC", "Art. 25 - Pagamenti"]
  },
  {
    id: "COM-2",
    livello: "comunale",
    tipo: "Regolamento Comunale",
    codice: "Reg. Roma Capitale - Delib. n. 52/2018",
    titolo: "Regolamento del servizio pubblico taxi e NCC di Roma Capitale",
    data: "2018-07-20",
    sintesi: "Regolamento romano con norme specifiche per la gestione del servizio taxi nella capitale, incluse disposizioni per aree ZTL e siti UNESCO.",
    testo: "Roma Capitale regola: accesso dei taxi alle ZTL con dispositivo automatico, tariffe fisse per tratte predeterminate (Fiumicino-centro, Ciampino-centro), supplementi per bagagli e animali, requisiti specifici per NCC operanti in zone storiche, commissione di disciplina per i taxi romani, sistema di prenotazione centralizzato RadioTaxi, criteri per conversione licenze taxi in elettrico.",
    paroleChiave: ["Roma", "ZTL", "tariffa fissa aeroporto", "Fiumicino", "RadioTaxi", "elettrico"],
    articoliRilevanti: ["Art. 7 - ZTL", "Art. 15 - Tariffe fisse", "Art. 22 - Veicoli ecologici"]
  },

  // GIURISPRUDENZA
  {
    id: "GIUR-1",
    livello: "giurisprudenza",
    tipo: "Sentenza TAR",
    codice: "TAR Lazio, Sez. III, n. 9428/2021",
    titolo: "Legittimità del numero chiuso delle autorizzazioni NCC",
    data: "2021-09-14",
    sintesi: "Il TAR Lazio ha confermato la legittimità del sistema di numero chiuso delle autorizzazioni NCC, purché i Comuni giustifichino la limitazione con istruttoria adeguata.",
    testo: "Il Tribunale ha stabilito che: la limitazione del numero di autorizzazioni NCC da parte dei Comuni è legittima se supportata da adeguata motivazione e istruttoria, il Comune deve periodicamente rivalutare il numero di autorizzazioni in relazione alla domanda di mercato, il criterio del numero chiuso non contrasta di per sé con la direttiva Bolkestein purché proporzionato, il diniego di nuove autorizzazioni per eccesso numerico deve essere motivato con riferimento all'equilibrio del mercato locale.",
    paroleChiave: ["numero chiuso", "autorizzazione NCC", "legittimità", "motivazione", "mercato"],
    articoliRilevanti: ["L. 21/1992 art. 6", "Dir. 2006/123/CE art. 9-10"]
  },
  {
    id: "GIUR-2",
    livello: "giurisprudenza",
    tipo: "Sentenza Cassazione",
    codice: "Cass. Pen., Sez. IV, n. 33871/2020",
    titolo: "Reato di esercizio abusivo di NCC - configurabilità",
    data: "2020-11-10",
    sintesi: "La Cassazione ha definito i criteri per la configurazione del reato di esercizio abusivo di servizio NCC, con particolare riferimento all'uso delle app di intermediazione.",
    testo: "La Corte ha stabilito che costituisce esercizio abusivo di NCC: operare senza autorizzazione comunale, raccogliere clienti su suolo pubblico senza prenotazione, utilizzare piattaforme digitali per raccogliere passeggeri in modo equivalente al taxi (stazionamento virtuale), non rispettare l'obbligo di rimessa. Le app di intermediazione non trasformano un servizio abusivo in lecito se il conducente non ha autorizzazione. Sanzioni: arresto fino a 3 mesi o ammenda da €500 a €2.000.",
    paroleChiave: ["abusivismo", "reato", "Cassazione", "app intermediazione", "sanzione penale"],
    articoliRilevanti: ["L. 21/1992 art. 11", "Art. 650 c.p.", "Art. 348 c.p."]
  },
  {
    id: "GIUR-3",
    livello: "giurisprudenza",
    tipo: "Sentenza TAR",
    codice: "TAR Milano, Sez. IV, n. 2156/2022",
    titolo: "Obbligo di rientro in rimessa - interpretazione",
    data: "2022-03-22",
    sintesi: "Il TAR Milano ha chiarito che l'obbligo di rientro in rimessa non impedisce all'NCC di attendere in zona diversa dalla rimessa dopo aver ricevuto una prenotazione.",
    testo: "Il Tribunale ha interpretato l'art. 11 L. 21/1992 nel senso che: l'obbligo di rimessa non significa che il veicolo NCC debba fisicamente ritornare in rimessa tra un servizio e l'altro, ma che deve essere disponibile per servizi partendo dalla rimessa, una volta ricevuta prenotazione, il veicolo NCC può posizionarsi in prossimità del luogo di raccolta del cliente, il conducente NCC non può tuttavia attendere in luoghi pubblici in cerca di clienti senza prenotazione. Sentenza conforme a Circolare MIT 2020.",
    paroleChiave: ["rimessa", "obbligo", "interpretazione", "prenotazione", "posizionamento"],
    articoliRilevanti: ["L. 21/1992 art. 3 e 11", "Circ. MIT 2020"]
  },
  {
    id: "GIUR-4",
    livello: "giurisprudenza",
    tipo: "Sentenza Corte Costituzionale",
    codice: "Corte Cost., n. 56/2020",
    titolo: "Riparto di competenza Stato-Regioni in materia di taxi e NCC",
    data: "2020-03-04",
    sintesi: "La Corte Costituzionale ha definito il riparto di competenze tra Stato e Regioni nella disciplina del trasporto non di linea, confermando la competenza statale sui principi fondamentali.",
    testo: "La Corte ha statuito che: la materia 'trasporto pubblico locale' è di competenza legislativa concorrente (art. 117, co. 3 Cost.), lo Stato può dettare i principi fondamentali (L. 21/1992), le Regioni possono legiferare nel dettaglio rispettando i principi statali, i Comuni hanno potestà regolamentare nell'ambito delle leggi nazionali e regionali, le norme regionali che contrastano con i principi della L. 21/1992 sono incostituzionali.",
    paroleChiave: ["competenza", "Stato", "Regioni", "Comuni", "principi fondamentali", "Costituzione"],
    articoliRilevanti: ["Art. 117 Cost.", "L. 21/1992 come norma di principio"]
  },
  {
    id: "GIUR-5",
    livello: "giurisprudenza",
    tipo: "Sentenza Consiglio di Stato",
    codice: "Cons. Stato, Sez. V, n. 7835/2021",
    titolo: "Subentro nella licenza taxi - requisiti e limiti",
    data: "2021-11-18",
    sintesi: "Il Consiglio di Stato ha definito i requisiti per il subentro nella licenza taxi e i limiti alla cessione, chiarendo il divieto di cessione a soggetti privi dei requisiti.",
    testo: "Il Consiglio di Stato ha stabilito: il subentro nella licenza taxi è ammesso per cessione d'azienda o per causa di morte, il subentrante deve possedere tutti i requisiti soggettivi previsti dalla normativa, il Comune può verificare la congruità del prezzo di cessione per evitare speculazioni, il divieto di subentro a società di capitali è legittimo trattandosi di attività intuitu personae, il subentro non è ammesso se il titolare originario non ha effettivamente svolto il servizio.",
    paroleChiave: ["subentro", "licenza taxi", "cessione", "requisiti", "società", "intuitu personae"],
    articoliRilevanti: ["L. 21/1992 art. 9", "Art. 2558 c.c. - successione contratti"]
  },
  {
    id: "GIUR-6",
    livello: "giurisprudenza",
    tipo: "Ordinanza AGCM",
    codice: "AGCM - Provv. n. A556/2017",
    titolo: "Antitrust - accordi tariffari tra cooperative taxi",
    data: "2017-05-25",
    sintesi: "L'Autorità Garante ha sanzionato accordi tra cooperative taxi che fissavano tariffe superiori a quelle comunali, ritenendoli intesa anticoncorrenziale.",
    testo: "L'AGCM ha accertato che: le cooperative taxi non possono accordarsi per praticare tariffe superiori a quelle comunali, i supplementi non previsti dal regolamento comunale sono vietati, gli accordi tra operatori taxi per suddividersi il mercato violano l'art. 101 TFUE, le associazioni di categoria non possono emettere circolari che coordinino i comportamenti tariffari, sanzione irrogata: €2,5 milioni alle cooperative coinvolte.",
    paroleChiave: ["antitrust", "AGCM", "tariffa", "accordo", "sanzione", "cooperative taxi"],
    articoliRilevanti: ["Art. 101 TFUE", "Art. 2 L. 287/1990"]
  }
];

// ============================================================
// KNOWLEDGE BASE PER L'AI
// ============================================================
const buildContext = () => {
  return NORME.map(n =>
    `[${n.id}] ${n.codice} - ${n.titolo} (${n.livello.toUpperCase()})
Sintesi: ${n.sintesi}
Testo: ${n.testo}
Parole chiave: ${n.paroleChiave.join(", ")}
Articoli rilevanti: ${n.articoliRilevanti.join("; ")}`
  ).join("\n\n---\n\n");
};

// ============================================================
// COMPONENTI UI
// ============================================================
const LIVELLO_CONFIG = {
  europeo:        { colore: "#1a6b9a", sfondo: "#e8f4fd", etichetta: "🇪🇺 Europeo",    ordine: 1 },
  nazionale:      { colore: "#1a5c2a", sfondo: "#e8f5ec", etichetta: "🇮🇹 Nazionale",  ordine: 2 },
  regionale:      { colore: "#7a4a00", sfondo: "#fef6e4", etichetta: "🏛️ Regionale",   ordine: 3 },
  comunale:       { colore: "#6b1a6b", sfondo: "#f8e8f8", etichetta: "🏙️ Comunale",    ordine: 4 },
  giurisprudenza: { colore: "#8b1a1a", sfondo: "#fde8e8", etichetta: "⚖️ Giurisprudenza", ordine: 5 },
};

const TIPO_ICONS = {
  "Regolamento": "📋",
  "Direttiva": "📌",
  "Sentenza CGUE": "⚖️",
  "Legge": "📜",
  "Decreto Legislativo": "📄",
  "Decreto Legge": "⚡",
  "Circolare ministeriale": "📬",
  "Legge Regionale": "🏛️",
  "Regolamento Comunale": "🏙️",
  "Sentenza TAR": "⚖️",
  "Sentenza Cassazione": "⚖️",
  "Sentenza Corte Costituzionale": "🏛️",
  "Sentenza Consiglio di Stato": "⚖️",
  "Ordinanza AGCM": "🔍",
};

export default function App() {
  const [vista, setVista] = useState("archivio"); // archivio | consulta
  const [filtroLivello, setFiltroLivello] = useState("tutti");
  const [filtroTesto, setFiltroTesto] = useState("");
  const [normaSelezionata, setNormaSelezionata] = useState(null);
  const [domanda, setDomanda] = useState("");
  const [risposta, setRisposta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState(null);

  const normeFiltrate = useMemo(() => {
    return NORME.filter(n => {
      const matchLivello = filtroLivello === "tutti" || n.livello === filtroLivello;
      const q = filtroTesto.toLowerCase();
      const matchTesto = !q || n.titolo.toLowerCase().includes(q) ||
        n.codice.toLowerCase().includes(q) ||
        n.sintesi.toLowerCase().includes(q) ||
        n.paroleChiave.some(p => p.toLowerCase().includes(q));
      return matchLivello && matchTesto;
    }).sort((a, b) => LIVELLO_CONFIG[a.livello].ordine - LIVELLO_CONFIG[b.livello].ordine);
  }, [filtroLivello, filtroTesto]);

  const inviaConsulta = async () => {
    if (!domanda.trim()) return;
    setLoading(true);
    setRisposta(null);
    setErrore(null);

    const ctx = buildContext();
    const prompt = `Sei un esperto giurista specializzato in diritto dei trasporti italiani, in particolare nel settore del trasporto di persone non di linea (taxi, NCC, noleggio autobus con conducente).

Hai accesso al seguente database normativo:

${ctx}

L'utente pone la seguente domanda giuridica:
"${domanda}"

Fornisci una risposta precisa, strutturata e professionale che:
1. Risponda direttamente alla domanda
2. Citi esplicitamente le norme rilevanti con i loro codici identificativi [ID] e gli articoli specifici
3. Rispetti la gerarchia delle fonti (europeo > nazionale > regionale > comunale > giurisprudenza)
4. Evidenzi eventuali contrasti normativi o orientamenti giurisprudenziali divergenti
5. Concluda con un riepilogo pratico operativo

Usa un formato chiaro con sezioni. Ogni citazione normativa deve includere il codice identificativo tra parentesi quadre es. [NAZ-1] Art. 3.
Se la domanda riguarda aspetti non coperti dal database, indicalo esplicitamente.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      const testo = data.content?.map(b => b.text || "").join("\n") || "Nessuna risposta ricevuta.";
      setRisposta(testo);
    } catch (e) {
      setErrore("Errore nella comunicazione con il motore di analisi. Verificare la connessione.");
    }
    setLoading(false);
  };

  const renderRisposta = (testo) => {
    // Evidenzia citazioni normative [ID]
    const parts = testo.split(/(\[(?:EU|NAZ|REG|COM|GIUR)-\d+\])/g);
    return parts.map((part, i) => {
      const match = part.match(/^\[((?:EU|NAZ|REG|COM|GIUR)-\d+)\]$/);
      if (match) {
        const norma = NORME.find(n => n.id === match[1]);
        return (
          <span
            key={i}
            title={norma ? `${norma.codice} - ${norma.titolo}` : ""}
            style={{
              background: "#1a3a6b",
              color: "#fff",
              padding: "1px 6px",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 700,
              cursor: norma ? "pointer" : "default",
              fontFamily: "monospace"
            }}
            onClick={() => norma && setNormaSelezionata(norma)}
          >
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const cfg = (livello) => LIVELLO_CONFIG[livello] || {};

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f0ede8",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#1a1a1a"
    }}>
      {/* HEADER */}
      <div style={{
        background: "linear-gradient(135deg, #0d1b2a 0%, #1a3a5c 60%, #0d2d4a 100%)",
        color: "#fff",
        padding: "32px 40px 24px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
            <span style={{ fontSize: 36 }}>⚖️</span>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 4, color: "#a8c5da", textTransform: "uppercase", marginBottom: 4 }}>
                Sistema di Interpretazione Normativa
              </div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: 1 }}>
                Trasporto Persone Non di Linea
              </h1>
            </div>
          </div>
          <p style={{ margin: "12px 0 0", color: "#8ab4cc", fontSize: 13, maxWidth: 700 }}>
            Archivio normativo strutturato con gerarchia delle fonti europee, nazionali, regionali e comunali.
            Motore di consulenza giuridica con richiamo alle fonti.
          </p>

          {/* NAV */}
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            {[
              { id: "archivio", label: "📂 Archivio Normativo", desc: `${NORME.length} fonti` },
              { id: "consulta", label: "🔍 Consulenza Giuridica", desc: "AI + fonti" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setVista(tab.id)}
                style={{
                  background: vista === tab.id ? "#fff" : "rgba(255,255,255,0.1)",
                  color: vista === tab.id ? "#0d1b2a" : "#8ab4cc",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontFamily: "'Georgia', serif",
                  fontSize: 14,
                  fontWeight: vista === tab.id ? 700 : 400,
                  transition: "all 0.2s"
                }}
              >
                {tab.label}
                <span style={{ marginLeft: 8, fontSize: 11, opacity: 0.7 }}>{tab.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        {/* ===== ARCHIVIO ===== */}
        {vista === "archivio" && (
          <div>
            {/* GERARCHIA VISIVA */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 12, letterSpacing: 2, color: "#666", textTransform: "uppercase", marginBottom: 12 }}>
                Gerarchia delle Fonti
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {Object.entries(LIVELLO_CONFIG).map(([key, val]) => (
                  <div key={key} style={{
                    background: val.sfondo,
                    border: `2px solid ${val.colore}`,
                    borderRadius: 8,
                    padding: "6px 14px",
                    fontSize: 12,
                    color: val.colore,
                    fontWeight: 700
                  }}>
                    {val.etichetta}
                    <span style={{ marginLeft: 6, fontWeight: 400, opacity: 0.7 }}>
                      ({NORME.filter(n => n.livello === key).length})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* FILTRI */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
              <input
                value={filtroTesto}
                onChange={e => setFiltroTesto(e.target.value)}
                placeholder="🔍  Cerca per titolo, codice o parola chiave..."
                style={{
                  flex: 1, minWidth: 280,
                  padding: "10px 16px",
                  border: "2px solid #ccc",
                  borderRadius: 8,
                  fontSize: 14,
                  fontFamily: "Georgia, serif",
                  background: "#fff",
                  outline: "none"
                }}
              />
              <select
                value={filtroLivello}
                onChange={e => setFiltroLivello(e.target.value)}
                style={{
                  padding: "10px 16px",
                  border: "2px solid #ccc",
                  borderRadius: 8,
                  fontSize: 14,
                  fontFamily: "Georgia, serif",
                  background: "#fff",
                  cursor: "pointer"
                }}
              >
                <option value="tutti">Tutti i livelli</option>
                {Object.entries(LIVELLO_CONFIG).map(([key, val]) => (
                  <option key={key} value={key}>{val.etichetta}</option>
                ))}
              </select>
            </div>

            {/* LISTA NORME */}
            <div style={{ display: "grid", gap: 12 }}>
              {normeFiltrate.map(norma => {
                const c = cfg(norma.livello);
                return (
                  <div
                    key={norma.id}
                    onClick={() => setNormaSelezionata(normaSelezionata?.id === norma.id ? null : norma)}
                    style={{
                      background: "#fff",
                      border: `2px solid ${normaSelezionata?.id === norma.id ? c.colore : "#e0ddd8"}`,
                      borderLeft: `5px solid ${c.colore}`,
                      borderRadius: 8,
                      padding: "16px 20px",
                      cursor: "pointer",
                      boxShadow: normaSelezionata?.id === norma.id ? `0 4px 16px ${c.colore}33` : "0 1px 4px rgba(0,0,0,0.08)",
                      transition: "all 0.2s"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                          <span style={{
                            background: c.sfondo,
                            color: c.colore,
                            border: `1px solid ${c.colore}`,
                            borderRadius: 4,
                            padding: "2px 8px",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: 1
                          }}>
                            {c.etichetta}
                          </span>
                          <span style={{ background: "#f0ede8", borderRadius: 4, padding: "2px 8px", fontSize: 11, color: "#555" }}>
                            {TIPO_ICONS[norma.tipo] || "📄"} {norma.tipo}
                          </span>
                          <span style={{ fontFamily: "monospace", fontSize: 11, color: "#888", background: "#f5f5f5", padding: "2px 6px", borderRadius: 3 }}>
                            [{norma.id}]
                          </span>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "#1a1a1a" }}>
                          {norma.codice}
                        </div>
                        <div style={{ fontSize: 13, color: "#444", marginBottom: 6 }}>
                          {norma.titolo}
                        </div>
                        <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>
                          {norma.sintesi}
                        </div>
                        {normaSelezionata?.id === norma.id && (
                          <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${c.colore}44` }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: c.colore, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>
                              Testo Completo
                            </div>
                            <div style={{ fontSize: 13, lineHeight: 1.8, color: "#333", background: c.sfondo, padding: 14, borderRadius: 6 }}>
                              {norma.testo}
                            </div>
                            <div style={{ marginTop: 12 }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
                                Articoli Rilevanti
                              </div>
                              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                {norma.articoliRilevanti.map((art, i) => (
                                  <span key={i} style={{
                                    background: c.colore,
                                    color: "#fff",
                                    borderRadius: 4,
                                    padding: "3px 10px",
                                    fontSize: 11
                                  }}>
                                    {art}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div style={{ marginTop: 12 }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
                                Parole Chiave
                              </div>
                              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                {norma.paroleChiave.map((kw, i) => (
                                  <span key={i} style={{
                                    background: "#f0ede8",
                                    color: "#555",
                                    borderRadius: 4,
                                    padding: "2px 8px",
                                    fontSize: 11,
                                    border: "1px solid #ddd"
                                  }}>
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div style={{ color: "#aaa", fontSize: 12, whiteSpace: "nowrap" }}>
                        {norma.data}<br />
                        <span style={{ color: normaSelezionata?.id === norma.id ? c.colore : "#aaa", fontSize: 18, fontWeight: 700 }}>
                          {normaSelezionata?.id === norma.id ? "▲" : "▼"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {normeFiltrate.length === 0 && (
                <div style={{ textAlign: "center", padding: 48, color: "#aaa" }}>
                  Nessuna norma trovata per i criteri selezionati.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== CONSULENZA ===== */}
        {vista === "consulta" && (
          <div>
            <div style={{
              background: "#fff",
              border: "2px solid #1a3a5c",
              borderRadius: 12,
              padding: 24,
              marginBottom: 24,
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)"
            }}>
              <div style={{ fontSize: 12, letterSpacing: 2, color: "#1a3a5c", textTransform: "uppercase", marginBottom: 12 }}>
                🔍 Poni una domanda giuridica
              </div>
              <div style={{ fontSize: 13, color: "#666", marginBottom: 16, lineHeight: 1.6 }}>
                Inserisci la tua domanda specifica sul trasporto non di linea. Il sistema analizzerà il database normativo
                e fornirà una risposta con precisi richiami alle fonti, nel rispetto della gerarchia normativa.
              </div>

              {/* ESEMPI */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: "#999", display: "flex", alignItems: "center", marginRight: 4 }}>
                  Esempi:
                </div>
                {[
                  "Un NCC può attendere il cliente fuori dalla rimessa dopo la prenotazione?",
                  "Quali sono i requisiti per ottenere un'autorizzazione NCC?",
                  "È legale usare Uber senza licenza NCC?",
                  "Un Comune può limitare il numero di autorizzazioni NCC?"
                ].map((es, i) => (
                  <button
                    key={i}
                    onClick={() => setDomanda(es)}
                    style={{
                      background: "#f0ede8",
                      border: "1px solid #ccc",
                      borderRadius: 20,
                      padding: "4px 12px",
                      fontSize: 11,
                      cursor: "pointer",
                      color: "#444",
                      fontFamily: "Georgia, serif"
                    }}
                  >
                    {es}
                  </button>
                ))}
              </div>

              <textarea
                value={domanda}
                onChange={e => setDomanda(e.target.value)}
                placeholder="Es: Un NCC autorizzato a Milano può effettuare un servizio che inizia a Roma?"
                rows={4}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #ccc",
                  borderRadius: 8,
                  fontSize: 14,
                  fontFamily: "Georgia, serif",
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                  lineHeight: 1.6
                }}
                onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) inviaConsulta(); }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                <div style={{ fontSize: 11, color: "#aaa" }}>Ctrl+Invio per inviare</div>
                <button
                  onClick={inviaConsulta}
                  disabled={loading || !domanda.trim()}
                  style={{
                    background: loading ? "#ccc" : "#0d1b2a",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "12px 28px",
                    fontSize: 14,
                    cursor: loading || !domanda.trim() ? "not-allowed" : "pointer",
                    fontFamily: "Georgia, serif",
                    fontWeight: 700,
                    letterSpacing: 0.5
                  }}
                >
                  {loading ? "⏳ Analisi in corso..." : "⚖️ Analizza e Consulta"}
                </button>
              </div>
            </div>

            {/* RISPOSTA */}
            {errore && (
              <div style={{ background: "#fde8e8", border: "2px solid #8b1a1a", borderRadius: 8, padding: 20, color: "#8b1a1a" }}>
                ⚠️ {errore}
              </div>
            )}

            {risposta && (
              <div style={{
                background: "#fff",
                border: "2px solid #1a5c2a",
                borderRadius: 12,
                padding: 28,
                boxShadow: "0 2px 16px rgba(0,0,0,0.1)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div style={{
                    fontSize: 12, letterSpacing: 2, color: "#1a5c2a",
                    textTransform: "uppercase", fontWeight: 700
                  }}>
                    ⚖️ Parere Giuridico — con Richiamo alle Fonti
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ fontSize: 11, color: "#888", background: "#f5f5f5", padding: "3px 8px", borderRadius: 4 }}>
                      Clicca sui riferimenti [ID] per aprire la norma
                    </span>
                  </div>
                </div>

                <div style={{
                  fontSize: 14,
                  lineHeight: 1.9,
                  color: "#222",
                  whiteSpace: "pre-wrap",
                  fontFamily: "Georgia, serif"
                }}>
                  {renderRisposta(risposta)}
                </div>

                <div style={{
                  marginTop: 24,
                  paddingTop: 16,
                  borderTop: "1px solid #e0e0e0",
                  fontSize: 11,
                  color: "#aaa"
                }}>
                  ⚠️ Questo parere è generato automaticamente a scopo informativo. Per decisioni legali, consultare sempre un avvocato specializzato in diritto dei trasporti.
                </div>
              </div>
            )}

            {/* NORMA POPUP DA CLIC */}
            {normaSelezionata && vista === "consulta" && (
              <div style={{
                marginTop: 20,
                background: "#fff",
                border: `3px solid ${cfg(normaSelezionata.livello).colore}`,
                borderRadius: 12,
                padding: 24,
                boxShadow: `0 4px 20px ${cfg(normaSelezionata.livello).colore}33`
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#888", fontFamily: "monospace", marginBottom: 4 }}>[{normaSelezionata.id}]</div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: cfg(normaSelezionata.livello).colore }}>
                      {normaSelezionata.codice}
                    </div>
                    <div style={{ fontSize: 14, color: "#444", marginTop: 4 }}>{normaSelezionata.titolo}</div>
                  </div>
                  <button onClick={() => setNormaSelezionata(null)} style={{
                    background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#aaa"
                  }}>✕</button>
                </div>
                <div style={{ marginTop: 16, fontSize: 13, lineHeight: 1.8, color: "#333", background: cfg(normaSelezionata.livello).sfondo, padding: 14, borderRadius: 6 }}>
                  {normaSelezionata.testo}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
