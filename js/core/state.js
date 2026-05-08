import {
  loadState,
  saveState
} from "./storage.js";

import { emit } from "./events.js";

const state = loadState();

if (!state.ui.filters) {
  state.ui.filters = {
    status: "",
    priority: "",
    tags: "",
    publisher: ""
  };
}

if (!state.ui.sort) {
  state.ui.sort = {
    by: "createdAt",
    direction: "desc"
  };
}

if (!state.ui.selection) {
  state.ui.selection = [];
}

const listeners = new Set();

function notify() {
  const snapshot = getState();

  saveState(state);

  emit("state:updated", snapshot);

  for (const listener of listeners) {
    listener(snapshot);
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

export function addBook(bookData) {
  state.books.unshift({
    id: crypto.randomUUID(),

    createdAt: Date.now(),
    updatedAt: Date.now(),

    title:
      bookData.title || "",

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
      bookData.status ||
      "wishlist",

    tags:
      bookData.tags || [],

    notes:
      bookData.notes || ""
  });

  notify();
}

export function updateBook(
  id,
  updates
) {
  const target = state.books.find(
    (book) => book.id === id
  );

  if (!target) {
    return;
  }

  Object.assign(target, updates, {
    updatedAt: Date.now()
  });

  notify();
}

export function deleteBook(id) {
  const index =
    state.books.findIndex(
      (book) =>
        book.id === id
    );

  if (index === -1) {
    return;
  }

  state.books.splice(index, 1);

  notify();
}

export function bulkUpdateBooks(
  ids,
  updates
) {
  state.books.forEach((book) => {
    if (
      ids.includes(book.id)
    ) {
      Object.assign(
        book,
        updates,
        {
          updatedAt:
            Date.now()
        }
      );
    }
  });

  notify();
}

export function bulkDeleteBooks(
  ids
) {
  state.books =
    state.books.filter(
      (book) =>
        !ids.includes(book.id)
    );

  notify();
}

export function toggleSelection(
  id
) {
  const exists =
    state.ui.selection.includes(
      id
    );

  if (exists) {
    state.ui.selection =
      state.ui.selection.filter(
        (value) =>
          value !== id
      );
  } else {
    state.ui.selection.push(id);
  }

  notify();
}

export function clearSelection() {
  state.ui.selection = [];

  notify();
}

export function setTheme(theme) {
  state.ui.theme = theme;

  notify();
}

export function setView(view) {
  state.ui.currentView = view;

  notify();
}

export function updateFilters(
  filters = {}
) {
  state.ui.searchQuery =
    filters.searchQuery ??
    state.ui.searchQuery;

  state.ui.filters = {
    ...state.ui.filters,
    ...filters
  };

  notify();
}

export function updateSort(
  partialSort = {}
) {
  state.ui.sort = {
    ...state.ui.sort,
    ...partialSort
  };

  notify();
}
