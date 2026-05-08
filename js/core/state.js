import { loadState, saveState } from "./storage.js";

const state = loadState();

const listeners = new Set();

function emit() {
  for (const listener of listeners) {
    listener(getState());
  }
}

export function getState() {
  return structuredClone(state);
}

export function subscribe(listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function setState(updater) {
  const nextState =
    typeof updater === "function"
      ? updater(getState())
      : updater;

  Object.assign(state, nextState);

  saveState(state);

  emit();
}

export function addBook(bookData) {
  const nextBook = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    updatedAt: Date.now(),

    title: bookData.title || "untitled",
    authors: bookData.authors || [],
    priority: bookData.priority || "medium",
    status: bookData.status || "wishlist",

    quantity: 1,
    notes: ""
  };

  state.books.unshift(nextBook);

  saveState(state);

  emit();
}

export function updateSearch(query) {
  state.ui.searchQuery = query;

  saveState(state);

  emit();
}

export function setTheme(theme) {
  state.ui.theme = theme;

  saveState(state);

  emit();
}

export function setView(view) {
  state.ui.currentView = view;

  saveState(state);

  emit();
}
