import { useState, useCallback, useEffect, useRef } from "react";
import { QuestionCard } from "./QuestionCard";
import { useTimer, TimerDisplay } from "./Timer";
import {
  getBookmarks,
  toggleBookmark,
  saveCheckpoint,
  clearCheckpoint,
} from "../storage";
import { useAuth } from "../context/AuthContext";
import { useAccess, TRIAL_TOTAL } from "../hooks/useAccess";
import { supabase } from "../utils/supabase";
import { scoreSession } from "../scoring";
import { chapters } from "../data/questions";

const RETRY_LABEL = "Reia greșitele";

export function SessionScreen({
  session,
  answers: initialAnswers,
  checkedSet: initialChecked,
  onFinish,
  onExit,
}) {
  const { questions, mode, timerSeconds, label } = session;
  const [answers, setAnswers] = useState(initialAnswers || {});
  const [checkedSet, setCheckedSet] = useState(initialChecked || new Set());
  const [finished, setFinished] = useState(false);
  const [bookmarks, setBookmarks] = useState(getBookmarks());

  const { user, refreshProfile } = useAuth();
  const { isTrial, used } = useAccess();
  const elapsedRef = useRef(0);

  // handleExpire definit inainte de useTimer
  const handleExpire = useCallback(() => {
    if (!finished) {
      setFinished(true);
      clearCheckpoint();
      incrementTrialIfNeeded(answers);
      saveSessionToSupabase(answers);
      onFinish(answers);
    }
  }, [finished, answers, onFinish]);

  const elapsed = useTimer(timerSeconds, !finished, handleExpire);

  // Tine ref-ul sincronizat cu elapsed pentru a-l accesa in async functions
  useEffect(() => {
    elapsedRef.current = elapsed;
  }, [elapsed]);

  // Auto-save checkpoint
  useEffect(() => {
    if (!finished) saveCheckpoint(session, answers, checkedSet);
  }, [answers, checkedSet, finished]);

  async function incrementTrialIfNeeded(finalAnswers) {
    if (!isTrial || label === RETRY_LABEL) return;
    const newUsed = Math.min(TRIAL_TOTAL, used + questions.length);
    if (newUsed === used) return;
    await supabase
      .from("profiles")
      .update({ trial_questions_used: newUsed })
      .eq("id", user.id);
    refreshProfile();
  }

  async function saveSessionToSupabase(finalAnswers) {
    if (!user) return;
    const result = scoreSession(questions, finalAnswers);
    const chapterIds = [
      ...new Set(
        questions
          .map(
            (q) =>
              chapters.find((ch) =>
                ch.subchapters.some((s) =>
                  s.questions.some((x) => x.id === q.id),
                ),
              )?.id,
          )
          .filter(Boolean),
      ),
    ];
    const duration =
      timerSeconds != null
        ? timerSeconds - elapsedRef.current // countdown: scadem ce a ramas
        : elapsedRef.current; // countup: cat a durat

    await supabase.from("sessions").insert({
      user_id: user.id,
      questions_count: questions.length,
      score: result.totalScore,
      max_score: result.totalMax,
      mode,
      chapter_ids: chapterIds,
      duration_seconds: Math.max(0, duration),
    });
  }

  function toggleOption(qid, optionIndex) {
    setAnswers((prev) => {
      const current = prev[qid] || [];
      const next = current.includes(optionIndex)
        ? current.filter((i) => i !== optionIndex)
        : [...current, optionIndex];
      return { ...prev, [qid]: next };
    });
  }

  function handleCheck(qid) {
    setCheckedSet((prev) => {
      const next = new Set(prev);
      next.add(qid);
      return next;
    });
  }

  function handleBookmark(qid) {
    setBookmarks(toggleBookmark(qid));
  }

  async function handleFinish() {
    setFinished(true);
    clearCheckpoint();
    await Promise.all([
      incrementTrialIfNeeded(answers),
      saveSessionToSupabase(answers),
    ]);
    onFinish(answers);
  }

  const answeredCount = Object.values(answers).filter(
    (a) => a.length > 0,
  ).length;
  const checkedCount = checkedSet.size;

  return (
    <>
      <div className="session-header">
        <button className="back" onClick={onExit}>
          ← Renunță
        </button>
        <div className="progress">
          {label && <strong>{label} · </strong>}
          {mode === "study"
            ? `${checkedCount} / ${questions.length} verificate`
            : `${answeredCount} / ${questions.length} cu răspunsuri`}
        </div>
        {timerSeconds != null ? (
          <TimerDisplay
            seconds={elapsed}
            isCountdown={true}
            totalSeconds={timerSeconds}
          />
        ) : (
          <TimerDisplay seconds={elapsed} isCountdown={false} />
        )}
      </div>

      {questions.map((q, i) => (
        <QuestionCard
          key={q.id}
          question={q}
          index={i}
          selected={answers[q.id] || []}
          onToggle={(idx) => toggleOption(q.id, idx)}
          mode={mode}
          revealed={finished}
          checked={checkedSet.has(q.id)}
          onCheck={() => handleCheck(q.id)}
          bookmarked={bookmarks.has(q.id)}
          onToggleBookmark={() => handleBookmark(q.id)}
        />
      ))}

      {!finished && (
        <div className="start-bar">
          <div className="summary">
            <strong>
              {answeredCount} / {questions.length}
            </strong>{" "}
            grile completate
          </div>
          <button className="btn btn-primary btn-lg" onClick={handleFinish}>
            Finalizează →
          </button>
        </div>
      )}
    </>
  );
}
