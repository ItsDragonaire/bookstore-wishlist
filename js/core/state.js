import { loadState, saveState } from "./storage.js";

const state = loadState();

const listeners = new Set();

function emit() {
  for (const listener of listeners) {
    listener(getState());
  }
}

function persist() {
  saveState(state);

  emit();
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

export function addBook(bookData) {
  state.books.unshift({
    id: crypto.randomUUID(),

    createdAt: Date.now(),
    updatedAt: Date.now(),

    title: bookData.title || "untitled",

    subtitle:
      bookData.subtitle || "",

    authors:
      bookData.authors || [],

    publisher:
      bookData.publisher || "",

    isbn10:
      bookData.isbn10 || "",

    isbn13:
      bookData.isbn13 || "",

    publishYear:
      bookData.publishYear || "",

    pageCount:
      Number(bookData.pageCount) || 0,

    language:
      bookData.language || "",

    format:
      bookData.format || "",

    series:
      bookData.series || "",

    coverUrl:
      bookData.coverUrl || "",

    quantity:
      Number(bookData.quantity) || 1,

    priority:
      bookData.priority || "medium",

    status:
      bookData.status || "wishlist",

    notes:
      bookData.notes || ""
  });

  persist();
}

export function updateBook(id, updates) {
  const target = state.books.find(
    (book) => book.id === id
  );

  if (!target) {
    return;
  }

  Object.assign(target, updates, {
    updatedAt: Date.now()
  });

  persist();
}

export function deleteBook(id) {
  const index = state.books.findIndex(
    (book) => book.id === id
  );

  if (index === -1) {
    return;
  }

  state.books.splice(index, 1);

  persist();
}

export function updateSearch(query) {
  state.ui.searchQuery = query;

  persist();
}

export function setTheme(theme) {
  state.ui.theme = theme;

  persist();
}

export function setView(view) {
  state.ui.currentView = view;

  persist();
}
