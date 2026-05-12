# Grile Medicină - MVP

Aplicație web pentru rezolvarea de grile tip exam de medicină.

## Rulare

```bash
npm install
npm run dev
```

Apoi deschide http://localhost:5173

## Build pentru producție

```bash
npm run build
npm run preview
```

## Structura

```
src/
├── App.jsx                       # state machine (setup/session/results/review)
├── main.jsx
├── styles.css
├── scoring.js                    # logica de calcul scor
├── storage.js                    # localStorage (bookmarks, last incorrect)
├── data/
│   └── questions.js              # capitole + subcapitole + grile (mock data)
└── components/
    ├── Checkbox.jsx
    ├── SetupScreen.jsx           # selectie capitole + mod + timer
    ├── SessionScreen.jsx         # quiz-ul propriu-zis
    ├── ResultsScreen.jsx         # scor final + stats
    ├── QuestionCard.jsx
    └── Timer.jsx
```

## Funcționalități MVP

- ✅ Selecție pe capitole/subcapitole (checkbox tri-state pentru capitole)
- ✅ Toate grilele pe o pagină
- ✅ Study mode (feedback imediat după bifare) + Exam mode (scor doar la final)
- ✅ Calcul scor pe regula 1 punct/poziție (bifat corect SAU lăsat necorect = +1)
- ✅ Timer countdown opțional (cu auto-submit la 00:00, warning la 25% / 10%)
- ✅ Bookmark grile dificile (persistent în localStorage)
- ✅ Reia grilele greșite din ultima sesiune
- ✅ Ecran de review post-sesiune cu explicații

## Date demo

Sunt 3 capitole (Cardiologie, Pneumologie, Gastroenterologie) cu 10 grile total - exemple realiste cu explicații. Înlocuiește `src/data/questions.js` cu datele tale reale (format identic).

## Algoritm de scoring

Pentru fiecare poziție i din cele 5 variante:

- `s_i = 1` dacă decizia coincide cu realitatea (bifat ↔ corect)
- `s_i = 0` altfel

Scor total per întrebare = Σ s_i (maxim 5). Vezi `src/scoring.js`.
