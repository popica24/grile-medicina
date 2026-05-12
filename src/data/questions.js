// Structura: capitole > subcapitole > grile
// type: 'multiplu' (default, 2-4 corecte) sau 'simplu' (exact 1 corect)
// correct: array cu indicii corecti (0-based)

export const chapters = [
  {
    id: "c1",
    name: "Cardiologie",
    subchapters: [
      {
        id: "c1s1",
        name: "Insuficienta cardiaca",
        questions: [
          {
            id: "q1",
            type: "multiplu",
            text: "Care dintre urmatoarele sunt cauze frecvente ale insuficientei cardiace cu fractie de ejectie redusa (HFrEF)?",
            options: [
              "Cardiopatia ischemica",
              "Hipertensiunea arteriala severa prelungita",
              "Pericardita constrictiva",
              "Cardiomiopatia dilatativa",
              "Stenoza mitrala severa",
            ],
            correct: [0, 1, 3],
            explanation:
              "HFrEF apare cel mai frecvent prin afectarea directa a miocardului: ischemie, HTA prelungita sau cardiomiopatie dilatativa. Pericardita constrictiva si stenoza mitrala dau insuficienta cardiaca cu FE pastrata (probleme de umplere).",
          },
          {
            id: "q2",
            type: "multiplu",
            text: "Despre BNP/NT-proBNP in insuficienta cardiaca sunt adevarate urmatoarele:",
            options: [
              "Sunt secretate de miocitele ventriculare ca raspuns la intinderea peretelui",
              "Valori scazute exclud cu valoare predictiva negativa mare insuficienta cardiaca",
              "Cresterea lor este specifica doar pentru insuficienta cardiaca",
              "Sunt utile pentru monitorizarea raspunsului la tratament",
              "Valorile sunt influentate de varsta si functia renala",
            ],
            correct: [0, 1, 3, 4],
            explanation:
              "BNP/NT-proBNP au sensibilitate mare dar specificitate scazuta — cresc si in fibrilatie atriala, embolie pulmonara, IRA. Valoare predictiva negativa excelenta.",
          },
          {
            id: "q3",
            type: "multiplu",
            text: "Tratamentul de prima linie in HFrEF cuprinde:",
            options: [
              "Inhibitori ai enzimei de conversie (IECA) sau ARNI",
              "Beta-blocante cardioselective",
              "Antagonisti ai receptorilor de mineralocorticoizi",
              "Digoxin de prima intentie la toti pacientii",
              "Inhibitori SGLT2",
            ],
            correct: [0, 1, 2, 4],
            explanation:
              "Cei 4 piloni terapeutici in HFrEF: ARNI/IECA, beta-blocant, MRA, SGLT2i. Digoxinul este rezervat cazurilor selectate (fibrilatie atriala cu raspuns ventricular rapid, simptome persistente).",
          },
        ],
      },
      {
        id: "c1s2",
        name: "Sindroame coronariene acute",
        questions: [
          {
            id: "q4",
            type: "multiplu",
            text: "Criterii pentru diagnosticul de STEMI:",
            options: [
              "Supradenivelare ST ≥1 mm in 2 derivatii contigue",
              "Bloc de ramura stanga nou aparut",
              "Subdenivelare ST persistenta in toate derivatiile",
              "Durere toracica taioasa ameliorata de inspir",
              "Cresterea troponinei cardiace",
            ],
            correct: [0, 1, 4],
            explanation:
              "STEMI = supradenivelare ST persistenta (≥1 mm in derivatiile membrelor, ≥2 mm in precordiale) SAU BRS nou. Subdenivelarea sugereaza NSTEMI/ischemie. Durerea pleuritica sugereaza pericardita.",
          },
          {
            id: "q5",
            type: "multiplu",
            text: "Despre angioplastia primara (PCI) in STEMI:",
            options: [
              "Ar trebui efectuata in mai putin de 120 minute de la primul contact medical",
              "Este superioara trombolizei daca poate fi efectuata in timp",
              "Tromboliza este preferata indiferent de timpul de transport",
              "Necesita dubla antiagregare plachetara ulterioara",
              "Se utilizeaza doar la pacientii sub 65 de ani",
            ],
            correct: [0, 1, 3],
            explanation:
              "PCI primar este standardul in STEMI daca timpul door-to-balloon <120 min. Daca nu, tromboliza. DAPT (aspirina + inhibitor P2Y12) este obligatorie post-PCI. Varsta nu este criteriu.",
          },
          {
            id: "q5b",
            type: "simplu",
            text: "Care este intervalul tinta door-to-balloon recomandat de ghidurile ESC pentru PCI primar in STEMI?",
            options: [
              "sub 30 de minute",
              "sub 60 de minute",
              "sub 90 de minute",
              "sub 120 de minute",
              "sub 180 de minute",
            ],
            correct: [2],
            explanation:
              "Ghidurile ESC recomanda door-to-balloon <90 min de la primul contact medical pentru centrele cu PCI; <120 min este limita maxima inclusiv pentru transfer.",
          },
        ],
      },
      {
        id: "c1s3",
        name: "Aritmii",
        questions: [
          {
            id: "q6",
            type: "multiplu",
            text: "Fibrilatia atriala se caracterizeaza prin:",
            options: [
              "Absenta undelor P pe ECG",
              "Interval R-R neregulat",
              "Risc crescut de evenimente tromboembolice",
              "Complex QRS larg in toate cazurile",
              "Frecventa ventriculara intotdeauna >150/min",
            ],
            correct: [0, 1, 2],
            explanation:
              "FA = activitate atriala haotica (fara unde P, unde f) cu transmitere ventriculara neregulata. QRS poate fi ingust (conducere normala) sau larg (aberant). Frecventa ventriculara variaza.",
          },
        ],
      },
    ],
  },
  {
    id: "c2",
    name: "Pneumologie",
    subchapters: [
      {
        id: "c2s1",
        name: "BPOC",
        questions: [
          {
            id: "q7",
            type: "multiplu",
            text: "Despre BPOC sunt adevarate:",
            options: [
              "Diagnosticul necesita spirometrie cu raport FEV1/FVC <0.7 post-bronhodilatator",
              "Fumatul este factorul de risc principal",
              "Este o boala complet reversibila",
              "Poate fi cauzata de deficit de alfa-1 antitripsina",
              "Exacerbarile cresc mortalitatea",
            ],
            correct: [0, 1, 3, 4],
            explanation:
              "BPOC este caracterizata prin obstructie de cai aeriene partial reversibila (nu complet, spre deosebire de astm). Diagnosticul este spirometric.",
          },
          {
            id: "q8",
            type: "multiplu",
            text: "Tratamentul exacerbarii BPOC include:",
            options: [
              "Bronhodilatatoare cu durata scurta de actiune",
              "Corticosteroizi sistemici",
              "Antibiotice in caz de spute purulente",
              "Beta-blocante non-selective",
              "Oxigenoterapie controlata daca SaO2 <88%",
            ],
            correct: [0, 1, 2, 4],
            explanation:
              "Beta-blocantele non-selective sunt contraindicate in BPOC. Cele cardioselective pot fi folosite cu prudenta.",
          },
        ],
      },
      {
        id: "c2s2",
        name: "Astm bronsic",
        questions: [
          {
            id: "q9",
            type: "multiplu",
            text: "Astmul bronsic se caracterizeaza prin:",
            options: [
              "Obstructie de cai aeriene reversibila",
              "Inflamatie cronica a cailor aeriene",
              "Hiperreactivitate bronsica",
              "Distrugere ireversibila a alveolelor",
              "Simptomatologie variabila in timp",
            ],
            correct: [0, 1, 2, 4],
            explanation:
              "Astmul este reversibil (spre deosebire de BPOC). Distrugerea alveolara = emfizem, nu astm.",
          },
        ],
      },
    ],
  },
  {
    id: "c3",
    name: "Gastroenterologie",
    subchapters: [
      {
        id: "c3s1",
        name: "Boala de reflux gastroesofagian",
        questions: [
          {
            id: "q10",
            type: "multiplu",
            text: "Complicatiile BRGE includ:",
            options: [
              "Esofagita eroziva",
              "Esofag Barrett",
              "Stenoza peptica",
              "Adenocarcinom esofagian",
              "Carcinom scuamos esofagian",
            ],
            correct: [0, 1, 2, 3],
            explanation:
              "BRGE creste riscul de adenocarcinom (prin Barrett), nu de carcinom scuamos (asociat cu fumat si alcool).",
          },
        ],
      },
    ],
  },
];
