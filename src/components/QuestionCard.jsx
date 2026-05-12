import { scoreQuestion } from "../scoring";

const LETTERS = ["A", "B", "C", "D", "E"];

export function QuestionCard({
  question,
  index,
  selected,
  onToggle,
  mode,
  revealed,
  checked,
  onCheck,
  bookmarked,
  onToggleBookmark,
}) {
  // Feedbackul apare cand:
  // - sesiunea s-a incheiat (revealed=true), SAU
  // - utilizatorul a apasat "Verifica" pe aceasta grila (checked=true) in study mode
  const showFeedback = revealed || (mode === "study" && checked);

  function getOptionClass(i) {
    if (!showFeedback) return "option-row";
    const isCorrect = question.correct.includes(i);
    const isSelected = selected.includes(i);
    if (isCorrect && isSelected) return "option-row correct-hit disabled";
    if (isCorrect && !isSelected) return "option-row correct-miss disabled";
    if (!isCorrect && isSelected) return "option-row wrong-pick disabled";
    return "option-row correct-pass disabled";
  }

  function getFeedbackTag(i) {
    if (!showFeedback) return null;
    const isCorrect = question.correct.includes(i);
    const isSelected = selected.includes(i);
    if (isCorrect && isSelected)
      return <span className="feedback-tag ok">corect</span>;
    if (isCorrect && !isSelected)
      return <span className="feedback-tag miss">omis</span>;
    if (!isCorrect && isSelected)
      return <span className="feedback-tag bad">greșit</span>;
    return null;
  }

  function handleClick(i) {
    if (showFeedback) return; // locked dupa ce a vazut feedback (study sau review)
    onToggle(i);
  }

  const result = showFeedback ? scoreQuestion(question, selected) : null;

  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-number">Întrebarea {index + 1}</span>
        <span
          className={`type-badge ${question.type === "simplu" ? "simplu" : "multiplu"}`}
        >
          {question.type === "simplu"
            ? "Complement simplu"
            : "Complement multiplu"}
        </span>
        <button
          className={`bookmark-btn ${bookmarked ? "active" : ""}`}
          onClick={onToggleBookmark}
          title={bookmarked ? "Elimină marcaj" : "Marchează ca dificilă"}
          aria-label="Bookmark"
        >
          {bookmarked ? "★" : "☆"}
        </button>
      </div>
      <p className="question-text">{question.text}</p>
      <div className="options-list">
        {question.options.map((opt, i) => (
          <div
            key={i}
            className={getOptionClass(i)}
            onClick={() => handleClick(i)}
          >
            <span className="option-letter">{LETTERS[i]}.</span>
            <span className="option-text">{opt}</span>
            {getFeedbackTag(i) || (
              <input
                type="checkbox"
                checked={selected.includes(i)}
                onChange={() => {}}
                style={{ pointerEvents: "none", accentColor: "#2563eb" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Butonul "Verifica" apare doar in study mode, inainte de check, daca a bifat ceva */}
      {mode === "study" && !checked && !revealed && (
        <div className="q-actions">
          <button
            className="btn btn-primary btn-sm"
            onClick={onCheck}
            disabled={selected.length === 0}
          >
            Verifică răspunsul
          </button>
          {selected.length === 0 && (
            <span className="hint">Bifează una sau mai multe variante</span>
          )}
        </div>
      )}

      {showFeedback && (
        <>
          <div className="q-score">
            Scor: {result.score} / {result.maxScore} puncte
            {result.annulled && (
              <span className="annulled-tag">
                Grilă anulată — la complement multiplu trebuie bifate 2-4
                variante
              </span>
            )}
            {result.type === "simplu" && (
              <span className="simple-tag">Complement simplu</span>
            )}
          </div>
          {question.explanation && (
            <div className="explanation">
              <strong>Explicație</strong>
              {question.explanation}
            </div>
          )}
        </>
      )}
    </div>
  );
}
