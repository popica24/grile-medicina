import { useAuth } from "../context/AuthContext";
import { chapters } from "../data/questions";

export const TRIAL_PER_CHAPTER = 5;

// Total trial disponibil = nr capitole * 5
export const TRIAL_TOTAL = chapters.length * TRIAL_PER_CHAPTER;

export function useAccess() {
  const { profile } = useAuth();

  const status = profile?.subscription_status || "trial";
  const isActive = status === "active";
  const isTrial = !isActive;

  const used = profile?.trial_questions_used || 0;
  const remaining = Math.max(0, TRIAL_TOTAL - used);
  const percent = Math.min(100, (used / TRIAL_TOTAL) * 100);

  // 'none' | 'warning' (>=80%) | 'blocked' (>=100%)
  const globalWarningLevel = isActive
    ? "none"
    : percent >= 100
      ? "blocked"
      : percent >= 80
        ? "warning"
        : "none";

  // Cate grile mai poate rezolva in total
  function canStartSession(questionCount) {
    if (isActive) return true;
    return remaining > 0;
  }

  // Filtreaza grilele la cele accesibile (primele `remaining` din sesiune)
  function filterAccessibleQuestions(questions) {
    if (isActive) return questions;
    return questions.slice(0, remaining);
  }

  return {
    status,
    isActive,
    isTrial,
    used,
    remaining,
    percent,
    globalWarningLevel,
    canStartSession,
    filterAccessibleQuestions,
    TRIAL_TOTAL,
    TRIAL_PER_CHAPTER,
  };
}
