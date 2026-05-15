// COMPLEMENT MULTIPLU (default): 2-4 raspunsuri corecte
//   - <2 sau >4 bifate -> anulata (0p)
//   - altfel: 1 punct per pozitie unde decizia coincide cu realitatea
//
// COMPLEMENT SIMPLU: 1 raspuns corect, maxim 4 puncte
//   - exact varianta corecta bifata -> 4p
//   - orice altceva -> 0p

export function scoreQuestion(question, selectedIndices) {
  const type = question.type || "multiplu";
  const correctSet = new Set(question.correct);

  const positionResults = [];
  for (let i = 0; i < question.options.length; i++) {
    const isCorrect = correctSet.has(i);
    const isSelected = selectedIndices.includes(i);
    positionResults.push({
      index: i,
      isCorrect,
      isSelected,
      matched: isCorrect === isSelected,
    });
  }

  if (type === "simplu") {
    const maxScore = 4;
    const isValid =
      selectedIndices.length === 1 && correctSet.has(selectedIndices[0]);
    return {
      score: isValid ? maxScore : 0,
      maxScore,
      positionResults,
      annulled: false,
      type: "simplu",
    };
  }

  // Complement multiplu
  const maxScore = question.options.length; // 5
  if (selectedIndices.length < 2 || selectedIndices.length > 4) {
    return {
      score: 0,
      maxScore,
      positionResults,
      annulled: true,
      type: "multiplu",
    };
  }

  const score = positionResults.filter((p) => p.matched).length;
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
  let totalScore = 0,
    totalMax = 0,
    fullyCorrect = 0,
    annulledCount = 0;
  let simpluScore = 0,
    simpluMax = 0,
    simpluCount = 0,
    simpluCorrect = 0;
  let multipluScore = 0,
    multipluMax = 0,
    multipluCount = 0,
    multipluCorrect = 0;
  const perQuestion = [];

  for (const q of questions) {
    const selected = answers[q.id] || [];
    const result = scoreQuestion(q, selected);
    totalScore += result.score;
    totalMax += result.maxScore;
    if (result.score === result.maxScore) fullyCorrect += 1;
    if (result.annulled) annulledCount += 1;

    if (result.type === "simplu") {
      simpluScore += result.score;
      simpluMax += result.maxScore;
      simpluCount += 1;
      if (result.score === result.maxScore) simpluCorrect += 1;
    } else {
      multipluScore += result.score;
      multipluMax += result.maxScore;
      multipluCount += 1;
      if (result.score === result.maxScore) multipluCorrect += 1;
    }

    perQuestion.push({ questionId: q.id, ...result });
  }

  return {
    totalScore,
    totalMax,
    percentage: totalMax > 0 ? (totalScore / totalMax) * 100 : 0,
    fullyCorrect,
    annulledCount,
    totalQuestions: questions.length,
    simplu: {
      score: simpluScore,
      max: simpluMax,
      count: simpluCount,
      fullyCorrect: simpluCorrect,
    },
    multiplu: {
      score: multipluScore,
      max: multipluMax,
      count: multipluCount,
      fullyCorrect: multipluCorrect,
    },
    perQuestion,
  };
}

// Lista grilelor cu erori (pentru "reia greselile")
export function getIncorrectQuestionIds(sessionResult) {
  return sessionResult.perQuestion
    .filter((q) => q.score < q.maxScore)
    .map((q) => q.questionId);
}

// Grile complet gresite: 0 puncte sau 1 punct (din 4 sau 5)
export function getZeroOrOneIds(sessionResult) {
  return sessionResult.perQuestion
    .filter((q) => q.score <= 1)
    .map((q) => q.questionId);
}
