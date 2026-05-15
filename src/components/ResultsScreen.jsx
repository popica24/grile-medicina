import {
  scoreSession,
  getIncorrectQuestionIds,
  getZeroOrOneIds,
} from "../scoring";
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
  const zeroOrOneIds = getZeroOrOneIds(result);

  useEffect(() => {
    setLastIncorrect(incorrectIds);
  }, []);

  const pct = Math.round(result.percentage);
  let verdict = "De relucrat";
  if (pct >= 90) verdict = "Excelent!";
  else if (pct >= 75) verdict = "Foarte bine";
  else if (pct >= 60) verdict = "Bine";
  else if (pct >= 45) verdict = "Mai e de lucru";

  const hasSimplu = result.simplu.count > 0;
  const hasMultiplu = result.multiplu.count > 0;

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

      {/* Stats generale */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Complet corecte</div>
          <div className="stat-value">
            {result.fullyCorrect} / {result.totalQuestions}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Cu erori</div>
          <div className="stat-value">{incorrectIds.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">0–1 puncte</div>
          <div
            className="stat-value"
            style={{
              color: zeroOrOneIds.length > 0 ? "var(--danger)" : "inherit",
            }}
          >
            {zeroOrOneIds.length}
          </div>
        </div>
      </div>

      {/* Defalcat simplu / multiplu */}
      {(hasSimplu || hasMultiplu) && (
        <>
          <div className="results-divider">Defalcat pe tip</div>
          <div className="stats-grid">
            {hasMultiplu && (
              <div className="stat-card">
                <div className="stat-label">Complement multiplu</div>
                <div className="stat-value">
                  {result.multiplu.score} / {result.multiplu.max}
                </div>
                <div className="stat-sub">
                  {result.multiplu.fullyCorrect} / {result.multiplu.count} grile
                  corecte ·{" "}
                  {result.multiplu.max > 0
                    ? Math.round(
                        (result.multiplu.score / result.multiplu.max) * 100,
                      )
                    : 0}
                  %
                </div>
              </div>
            )}
            {hasSimplu && (
              <div className="stat-card">
                <div className="stat-label">Complement simplu</div>
                <div className="stat-value">
                  {result.simplu.score} / {result.simplu.max}
                </div>
                <div className="stat-sub">
                  {result.simplu.fullyCorrect} / {result.simplu.count} grile
                  corecte ·{" "}
                  {result.simplu.max > 0
                    ? Math.round(
                        (result.simplu.score / result.simplu.max) * 100,
                      )
                    : 0}
                  %
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Grile complet gresite */}
      {zeroOrOneIds.length > 0 && (
        <>
          <div className="results-divider" style={{ color: "var(--danger)" }}>
            Grile complet greșite (0-1 puncte) - {zeroOrOneIds.length}
          </div>
          <div className="zero-list">
            {session.questions
              .filter((q) => zeroOrOneIds.includes(q.id))
              .map((q, i) => (
                <div key={q.id} className="zero-item">
                  <span className="zero-num">{i + 1}.</span>
                  <span className="zero-text">{q.text}</span>
                  <span
                    className={`type-badge ${q.type === "simplu" ? "simplu" : "multiplu"}`}
                    style={{ marginLeft: 8 }}
                  >
                    {q.type === "simplu" ? "simplu" : "multiplu"}
                  </span>
                </div>
              ))}
          </div>
        </>
      )}

      <div className="results-actions">
        <button className="btn btn-primary" onClick={onReviewInline}>
          Vezi răspunsurile corecte
        </button>
        {incorrectIds.length > 0 && (
          <button className="btn" onClick={onRetryIncorrect}>
            ↻ Reia grilele greșite ({incorrectIds.length})
          </button>
        )}
        <button className="btn" onClick={onRestart}>
          Sesiune nouă
        </button>
      </div>
    </>
  );
}
