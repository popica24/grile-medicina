import { useState, useMemo } from "react";
import { Checkbox } from "./Checkbox";
import { chapters } from "../data/questions";
import { getLastIncorrect } from "../storage";
import { useAccess, TRIAL_TOTAL, TRIAL_PER_CHAPTER } from "../hooks/useAccess";
import {
  PaywallModal,
  TrialWarningBanner,
  TrialBlockedBanner,
} from "./PaywallModal";

export function SetupScreen({ onStart }) {
  const [selected, setSelected] = useState(new Set());
  const [mode, setMode] = useState("study");
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(15);
  const [showPaywall, setShowPaywall] = useState(false);

  const {
    isActive,
    isTrial,
    used,
    remaining,
    percent,
    globalWarningLevel,
    filterAccessibleQuestions,
  } = useAccess();
  const hasLastIncorrect = getLastIncorrect().length > 0;

  function toggleSub(subId) {
    const next = new Set(selected);
    if (next.has(subId)) next.delete(subId);
    else next.add(subId);
    setSelected(next);
  }

  function toggleChapter(chapter) {
    const subIds = chapter.subchapters.map((s) => s.id);
    const allSelected = subIds.every((id) => selected.has(id));
    const next = new Set(selected);
    if (allSelected) subIds.forEach((id) => next.delete(id));
    else subIds.forEach((id) => next.add(id));
    setSelected(next);
  }

  function chapterState(chapter) {
    const subIds = chapter.subchapters.map((s) => s.id);
    const count = subIds.filter((id) => selected.has(id)).length;
    if (count === 0) return "unchecked";
    if (count === subIds.length) return "checked";
    return "partial";
  }

  const { questionCount, subCount } = useMemo(() => {
    let qc = 0,
      sc = 0;
    for (const ch of chapters)
      for (const sub of ch.subchapters)
        if (selected.has(sub.id)) {
          qc += sub.questions.length;
          sc += 1;
        }
    return { questionCount: qc, subCount: sc };
  }, [selected]);

  // Cate grile din selectie sunt efectiv accesibile in trial
  const accessibleCount = isActive
    ? questionCount
    : Math.min(questionCount, remaining);

  function handleStart() {
    if (accessibleCount === 0) {
      setShowPaywall(true);
      return;
    }
    const allQuestions = [];
    for (const ch of chapters)
      for (const sub of ch.subchapters)
        if (selected.has(sub.id)) allQuestions.push(...sub.questions);

    const accessible = filterAccessibleQuestions(allQuestions);
    onStart({
      questions: accessible,
      mode,
      timerSeconds: timerEnabled ? timerMinutes * 60 : null,
    });
  }

  function handleRetryIncorrect() {
    const ids = getLastIncorrect();
    if (!ids.length) return;
    const idSet = new Set(ids);
    const allQuestions = [];
    for (const ch of chapters)
      for (const sub of ch.subchapters)
        for (const q of sub.questions)
          if (idSet.has(q.id)) allQuestions.push(q);
    onStart({
      questions: allQuestions,
      mode,
      timerSeconds: timerEnabled ? timerMinutes * 60 : null,
      label: "Reia greșitele",
    });
  }

  return (
    <>
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}

      {/* Banner trial global */}
      {isTrial && globalWarningLevel === "blocked" && (
        <TrialBlockedBanner onUpgrade={() => setShowPaywall(true)} />
      )}
      {isTrial && globalWarningLevel !== "blocked" && (
        <TrialWarningBanner
          used={used}
          limit={TRIAL_TOTAL}
          onUpgrade={() => setShowPaywall(true)}
        />
      )}

      <div className="setup-section">
        <h2>1. Alege capitolele</h2>
        {chapters.map((ch) => {
          const totalQ = ch.subchapters.reduce(
            (s, x) => s + x.questions.length,
            0,
          );
          return (
            <div key={ch.id} className="chapter-card">
              <div
                className="chapter-header"
                onClick={() => toggleChapter(ch)}
                style={{ cursor: "pointer" }}
              >
                <Checkbox state={chapterState(ch)} />
                <span className="chapter-name">{ch.name}</span>
                <span className="chapter-count">{totalQ} grile</span>
              </div>
              <div className="subchapter-list">
                {ch.subchapters.map((sub) => (
                  <div
                    key={sub.id}
                    className="subchapter-row"
                    onClick={() => toggleSub(sub.id)}
                  >
                    <Checkbox
                      state={selected.has(sub.id) ? "checked" : "unchecked"}
                    />
                    <span>{sub.name}</span>
                    <span className="count">{sub.questions.length} grile</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="setup-section">
        <h2>2. Modul de lucru</h2>
        <div className="mode-group">
          <button
            className={`mode-btn ${mode === "study" ? "active" : ""}`}
            onClick={() => setMode("study")}
          >
            <span className="label">Study mode</span>
            <span className="desc">
              Feedback imediat după fiecare bifare · vezi explicațiile
            </span>
          </button>
          <button
            className={`mode-btn ${mode === "exam" ? "active" : ""}`}
            onClick={() => setMode("exam")}
          >
            <span className="label">Exam mode</span>
            <span className="desc">
              Fără feedback · scorul apare doar la final
            </span>
          </button>
        </div>
      </div>

      <div className="setup-section">
        <h2>3. Cronometru (opțional)</h2>
        <div className="timer-row">
          <label onClick={() => setTimerEnabled(!timerEnabled)}>
            <Checkbox state={timerEnabled ? "checked" : "unchecked"} />
            Activează timer
          </label>
          {timerEnabled && (
            <>
              <input
                type="number"
                min="1"
                max="240"
                value={timerMinutes}
                onChange={(e) =>
                  setTimerMinutes(Math.max(1, parseInt(e.target.value) || 1))
                }
              />
              <span style={{ color: "var(--text-muted)", fontSize: 14 }}>
                minute
              </span>
            </>
          )}
        </div>
      </div>

      {hasLastIncorrect && (
        <div className="setup-section">
          <h2>Antrenament țintit</h2>
          <button className="btn" onClick={handleRetryIncorrect}>
            ↻ Reia grilele greșite din ultima sesiune (
            {getLastIncorrect().length})
          </button>
        </div>
      )}

      <div className="start-bar">
        <div className="summary">
          {questionCount > 0 ? (
            <>
              <strong>{accessibleCount} grile</strong> din {subCount}{" "}
              subcapitole
              {isTrial && questionCount > accessibleCount && (
                <span className="trial-locked-count">
                  {" "}
                  · {questionCount - accessibleCount} blocate 🔒
                </span>
              )}
            </>
          ) : (
            "Selectează cel puțin un subcapitol"
          )}
        </div>
        <button
          className="btn btn-primary btn-lg"
          onClick={handleStart}
          disabled={questionCount === 0}
        >
          Începe sesiunea →
        </button>
      </div>
    </>
  );
}
