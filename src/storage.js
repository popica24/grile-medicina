// Persistență simplă în localStorage pentru bookmarks și ultimul set de greșite
const BOOKMARKS_KEY = "grile_bookmarks";
const LAST_INCORRECT_KEY = "grile_last_incorrect";
const CHECKPOINT_KEY = "grile_checkpoint";

export function getBookmarks() {
  try {
    return new Set(JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

export function toggleBookmark(questionId) {
  const set = getBookmarks();
  if (set.has(questionId)) set.delete(questionId);
  else set.add(questionId);
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...set]));
  return set;
}

export function setLastIncorrect(ids) {
  localStorage.setItem(LAST_INCORRECT_KEY, JSON.stringify(ids));
}

export function getLastIncorrect() {
  try {
    return JSON.parse(localStorage.getItem(LAST_INCORRECT_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCheckpoint(session, answers, checkedSet) {
  const data = {
    session,
    answers,
    checkedSet: [...checkedSet],
    savedAt: Date.now(),
  };
  localStorage.setItem(CHECKPOINT_KEY, JSON.stringify(data));
}

export function getCheckpoint() {
  try {
    const raw = localStorage.getItem(CHECKPOINT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    data.checkedSet = new Set(data.checkedSet);
    return data;
  } catch {
    return null;
  }
}

export function clearCheckpoint() {
  localStorage.removeItem(CHECKPOINT_KEY);
}
