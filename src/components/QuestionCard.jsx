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
  const showFeedback = revealed || (mode === "study" && checked);
  const isMultiplu = (question.type || "multiplu") === "multiplu";

  function getOptionClass(i) {
    if (!showFeedback) return "option-row";
    const isCorrect = question.correct.includes(i);
    const isSelected = selected.includes(i);
    if (isCorrect && isSelected) return "option-row correct-hit disabled";
    if (isCorrect && !isSelected) return "option-row correct-miss disabled"; // omis - fundal distinct
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
    if (showFeedback) return;
    onToggle(i);
  }

  const result = showFeedback ? scoreQuestion(question, selected) : null;

  // Hint live pentru complement multiplu inainte de submit
  const showMultipluHint =
    isMultiplu && !showFeedback && mode === "study" && !checked;
  const bifateCount = selected.length;
  const hintColor =
    bifateCount === 0
      ? "hint-neutral"
      : bifateCount === 1
        ? "hint-warn"
        : bifateCount <= 4
          ? "hint-ok"
          : "hint-warn";

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
        >
          {bookmarked ? "★" : "☆"}
        </button>
      </div>

      <p className="question-text">{question.text}</p>

      {showMultipluHint && (
        <div className={`multiplu-hint ${hintColor}`}>
          {bifateCount === 0 &&
            "Bifează între 2 și 4 variante - altfel primești 0 puncte"}
          {bifateCount === 1 &&
            `1 variantă bifată - mai bifează cel puțin una (altfel 0 puncte)`}
          {bifateCount >= 2 &&
            bifateCount <= 4 &&
            `${bifateCount} variante bifate ✓`}
          {bifateCount === 5 &&
            "5 variante bifate - prea multe, vei primi 0 puncte"}
        </div>
      )}

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

      {mode === "study" && !checked && !revealed && (
        <div className="q-actions">
          <button
            className="btn btn-primary btn-sm"
            onClick={onCheck}
            disabled={
              selected.length === 0 ||
              (isMultiplu && (selected.length < 2 || selected.length > 4))
            }
          >
            Verifică răspunsul
          </button>
          {isMultiplu && selected.length === 1 && (
            <span className="hint hint-warn-text">
              Mai bifează cel puțin o variantă
            </span>
          )}
          {isMultiplu && selected.length === 5 && (
            <span className="hint hint-warn-text">
              Deselectează cel puțin o variantă
            </span>
          )}
        </div>
      )}

      {showFeedback && (
        <>
          <div className="q-score">
            Scor: {result.score} / {result.maxScore} puncte
            {result.annulled && (
              <span className="annulled-tag">
                Grilă anulată - la complement multiplu trebuie bifate 2-4
                variante
              </span>
            )}
          </div>
          {question.page && <div className="page-ref">📖 {question.page}</div>}
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
