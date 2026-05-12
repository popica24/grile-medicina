import { scoreSession, getIncorrectQuestionIds } from "../scoring";
import { setLastIncorrect } from "../storage";
import { useEffect } from "react";

export function ResultsScreen({
  session,
  answers,
  onRestart,
  onReviewInline,
  onRetryIncorrect,
}) {
  const result = scoreSession(session.questions, answers);
  const incorrectIds = getIncorrectQuestionIds(result);

  // Salvează lista greșitelor pentru "reia greșitele"
  useEffect(() => {
    setLastIncorrect(incorrectIds);
  }, []);

  const pct = Math.round(result.percentage);
  let verdict = "De relucrat";
  if (pct >= 90) verdict = "Excelent!";
  else if (pct >= 75) verdict = "Foarte bine";
  else if (pct >= 60) verdict = "Bine";
  else if (pct >= 45) verdict = "Mai e de lucru";

  return (
    <>
      <div className="session-header">
        <button className="back" onClick={onRestart}>
          ← Înapoi la setup
        </button>
        <div className="progress">Sesiune finalizată</div>
      </div>

      <div className="results-header">
        <h2>{verdict}</h2>
        <div className="score-big">
          {result.totalScore}
          <span className="max"> / {result.totalMax}</span>
        </div>
        <div className="score-percentage">
          {pct}% · {result.totalMax} puncte posibile
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Grile complet corecte</div>
          <div className="stat-value">
            {result.fullyCorrect} / {result.totalQuestions}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Grile cu erori</div>
          <div className="stat-value">{incorrectIds.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Procentaj</div>
          <div className="stat-value">{pct}%</div>
        </div>
      </div>

      <div className="results-actions">
        <button className="btn btn-primary" onClick={onReviewInline}>
          Vezi răspunsurile corecte
        </button>
        {incorrectIds.length > 0 && (
          <button className="btn" onClick={onRetryIncorrect}>
            ↻ Reia doar grilele greșite ({incorrectIds.length})
          </button>
        )}
        <button className="btn" onClick={onRestart}>
          Sesiune nouă
        </button>
      </div>
    </>
  );
}
