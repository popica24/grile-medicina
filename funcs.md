# Features roadmap - Grile Medicină

## Retenție

**Spaced repetition (FSRS sau SM-2)**
Fiecare grilă are un "interval" și revine la rezolvare exact când ești pe punctul de a o uita. La final de sesiune, fiecare grilă greșită îți cere o auto-evaluare (`din nou / greu / bine / ușor`) și algoritmul programează următoarea apariție. Anki funcționează exact pe principiul ăsta - studenții la medicină îl folosesc masiv tocmai pentru asta.

**Confidence rating**
După ce bifezi, înainte de "Verifică", apare: _"Cât de sigur ești?"_ cu 3 nivele (`ghicesc / cred că da / sigur`). Calculează două lucruri distincte:

- Bifat _sigur_ dar greșit → **misconception**, de reluat prioritar
- Bifat _ghicesc_ dar nimerat → noroc, nu cunoaștere

**Active recall**
Înainte să apară variantele A–E, grila se afișează doar cu enunțul. Scrii pe scurt răspunsul tău (sau te gândești și apeși _Continuă_), apoi apar variantele. Forțează evocare din memorie, nu recunoaștere.

---

## Calibrare

**Heatmap pe subcapitole**
Grid colorat după performanță: verde 80%+, galben 60–80%, roșu sub 60%. Fiecare celulă e clickable și pornește o sesiune din subcapitolul respectiv. La rezidențiat e indispensabil - nu ai timp să recapitulezi totul, vrei să țintești.

**Distractor analysis**
Tracking nu doar al greșelilor, ci al pattern-urilor: _"În 60% din grilele de farmacologie cardiacă bifezi efectele adverse greșite."_ Necesită tag-uri pe variante (`mecanism / efect advers / contraindicație / doză`).

**Leak detection**
Dacă ai greșit o grilă despre BNP, sistemul arată: _"Ai mai greșit 3 grile despre biomarkeri cardiaci în ultima lună"_ cu link direct să le revezi.

**Curbe de progres pe capitole**
Grafic cu scorul la cardiologie pe ultimele 30 de zile - vezi că la insuficiență ai stagnat și la aritmii crești.

---

## Sesiunea în sine

**Shuffle variante A–E**
Previne memorarea pozițiilor (_"știu că răspunsul e A și D"_). Câștig disproporționat față de efortul de implementare.

**Shuffle ordine întrebări**
Aceeași logică - la a doua trecere prin Cardiologie, ordinea diferită forțează evocare reală.

**Mod examen simulat**
Condițiile rezidențiatului: 200 grile / 4 ore, fără bookmark, fără ieșire din întrebare, timer afișat doar în ultimele 30 min. Important psihologic - examenul real e altă experiență decât study mode.

**Note personale per grilă**
Icon de pix lângă bookmark - textbox în care scrii ce ai înțeles greșit, mnemonice, link la o pagină din carte. La a doua întâlnire cu grila, nota e acolo.

---

## Conținut

**Surse bibliografice per grilă**
Lângă explicație: _"Harrison ed. 21, cap. 254, p. 1820"_. Adaugă verificabilitate și credibilitate.

**Imagini / ECG / radiografii**
Suport pentru imagine în enunț sau în explicație. Multe grile de medicină au sens doar cu o imagine.

**Flagging colaborativ**
Buton _"Raportează problemă"_ - variantă ambiguă, explicație greșită, sursă învechită. Feedback acumulat, bancă îmbunătățită continuu.

---

## Motivație și obișnuință

**Streak zilnic** _(cu o zi grație/săptămână)_
Tracking al zilelor consecutive cu minim 10 grile rezolvate. Ziua de grație e crucială - fără ea, prima zi pierdută e și ultima.

**Grilă a zilei**
Un widget cu o grilă selectată din zonele slabe. Sub 60 de secunde de angajament, dar menține obișnuința.

**Goal setting săptămânal**
_"Vreau 500 grile săptămâna asta, să cresc la 75% la cardiologie."_ Progress bar, nu pedeapsă dacă nu ajungi.

**Leaderboard opt-in pe grup de studiu**
Privat, doar prieteni/colegi de an. Competiție low-key, nu globală (care devine demoralizantă).

---

## Funcționalități transversale

**PWA / mod offline**
Vite are plugin PWA gata. Merge în bibliotecă, în tren, la spital fără semnal. Sync când revine netul.

**Import/export bancă de grile (CSV/JSON)**
Adaugi sute de grile fără să atingi codul. Util și pentru profesori.

**Search global**
_"Toate grilele care menționează troponina"_ - recapitulare tematică transversală.

**Mod "doar bookmarked"**
Sesiune filtrată cu grilele marcate ca dificile, oricând.

**Istoric sesiuni**
_"Marți, Cardiologie, 23/30, 82%, 18 min."_ Trendul în timp = motivație vizibilă.

---

## Prioritizare recomandată

| #   | Feature                             | Impact | Efort |
| --- | ----------------------------------- | ------ | ----- |
| 1   | Spaced repetition (FSRS / Leitner)  | ★★★★★  | Mare  |
| 2   | Heatmap + statistici pe subcapitole | ★★★★★  | Mediu |
| 3   | Shuffle variante și întrebări       | ★★★★☆  | Mic   |
| 4   | Confidence rating                   | ★★★★☆  | Mic   |
| 5   | Surse bibliografice în explicații   | ★★★★☆  | Mic   |
