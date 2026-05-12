// Persistență simplă în localStorage pentru bookmarks și ultimul set de greșite
const BOOKMARKS_KEY = "grile_bookmarks";
const LAST_INCORRECT_KEY = "grile_last_incorrect";

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
