// Calculeaza scorul pentru o singura intrebare, conform regulamentului rezidentiat
//
// COMPLEMENT MULTIPLU (default, ~75% din grile): 2-4 raspunsuri corecte
//   - Daca bifezi <2 sau >4 raspunsuri -> grila se anuleaza (0 puncte)
//   - Altfel: 1 punct per pozitie unde decizia coincide cu realitatea
//     (bifat corect SAU nebifat corect)
//
// COMPLEMENT SIMPLU (~25% din grile): 1 singur raspuns corect
//   - Bifezi exact varianta corecta -> 5 puncte
//   - Orice altceva (0 bifate, 2+ bifate, sau 1 bifat dar gresit) -> 0 puncte
export function scoreQuestion(question, selectedIndices) {
  const type = question.type || "multiplu";
  const maxScore = question.options.length; // intotdeauna 5
  const correctSet = new Set(question.correct);
  const selectedSet = new Set(selectedIndices);

  // Construim per-pozitie pentru afisare in UI (chiar daca grila e anulata,
  // tot vrem sa aratam ce era corect)
  const positionResults = [];
  for (let i = 0; i < question.options.length; i++) {
    const isCorrect = correctSet.has(i);
    const isSelected = selectedSet.has(i);
    positionResults.push({
      index: i,
      isCorrect,
      isSelected,
      matched: isCorrect === isSelected,
    });
  }

  // --- Complement simplu ---
  if (type === "simplu") {
    // Trebuie exact 1 bifat si acela sa fie corect
    const isValid =
      selectedIndices.length === 1 && correctSet.has(selectedIndices[0]);
    return {
      score: isValid ? maxScore : 0,
      maxScore,
      positionResults,
      annulled: false, // simplu nu se "anuleaza", doar primeste 0
      type: "simplu",
    };
  }

  // --- Complement multiplu ---
  // Anulare daca <2 sau >4 bifate (DAR doar daca utilizatorul a bifat ceva;
  // 0 bifate la o grila la care nu a apucat sa raspunda = anulata oricum)
  if (selectedIndices.length < 2 || selectedIndices.length > 4) {
    return {
      score: 0,
      maxScore,
      positionResults,
      annulled: true,
      type: "multiplu",
    };
  }

  // Scoring normal pe pozitii
  let score = 0;
  for (const p of positionResults) {
    if (p.matched) score += 1;
  }

  return {
    score,
    maxScore,
    positionResults,
    annulled: false,
    type: "multiplu",
  };
}

// Scor total pentru o sesiune
export function scoreSession(questions, answers) {
  let totalScore = 0;
  let totalMax = 0;
  let fullyCorrect = 0;
  let annulledCount = 0;
  const perQuestion = [];

  for (const q of questions) {
    const selected = answers[q.id] || [];
    const result = scoreQuestion(q, selected);
    totalScore += result.score;
    totalMax += result.maxScore;
    if (result.score === result.maxScore) fullyCorrect += 1;
    if (result.annulled) annulledCount += 1;
    perQuestion.push({ questionId: q.id, ...result });
  }

  return {
    totalScore,
    totalMax,
    percentage: totalMax > 0 ? (totalScore / totalMax) * 100 : 0,
    fullyCorrect,
    annulledCount,
    totalQuestions: questions.length,
    perQuestion,
  };
}

// Lista grilelor cu erori (pentru "reia greselile")
export function getIncorrectQuestionIds(sessionResult) {
  return sessionResult.perQuestion
    .filter((q) => q.score < q.maxScore)
    .map((q) => q.questionId);
}
