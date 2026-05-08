import {
  getState,
  setTheme,
  subscribe
} from "./core/state.js";

import { initializeToolbar } from "./ui/components/toolbar.js";

import { openModal } from "./ui/components/modal.js";

import { createBookForm } from "./ui/components/bookForm.js";

import { renderTableView } from "./ui/views/tableView.js";

import { renderCardView } from "./ui/views/cardView.js";

const root = document.querySelector("#view-root");

const collectionMeta =
  document.querySelector("#collection-meta");

const addBookButton =
  document.querySelector("#add-book-button");

const themeToggle =
  document.querySelector("#theme-toggle");

function applyTheme(theme) {
  const resolvedTheme =
    theme === "system"
      ? window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches
        ? "dark"
        : "light"
      : theme;

  document.documentElement.dataset.theme =
    resolvedTheme;
}

function getFilteredBooks(state) {
  const query =
    state.ui.searchQuery.toLowerCase();

  return state.books.filter((book) => {
    const searchable = [
      book.title,
      book.subtitle,
      ...(book.authors || []),
      book.publisher,
      book.isbn10,
      book.isbn13,
      book.notes,
      book.series
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(query);
  });
}

function render(state) {
  root.innerHTML = "";

  applyTheme(state.ui.theme);

  const books = getFilteredBooks(state);

  collectionMeta.textContent =
    `${books.length} book${
      books.length === 1 ? "" : "s"
    }`;

  if (state.ui.currentView === "card") {
    renderCardView({
      container: root,
      books,
      state
    });
  } else {
    renderTableView({
      container: root,
      books,
      state
    });
  }
}

initializeToolbar();

themeToggle.addEventListener("click", () => {
  const current = getState().ui.theme;

  const next =
    current === "light"
      ? "dark"
      : current === "dark"
      ? "system"
      : "light";

  setTheme(next);
});

addBookButton.addEventListener("click", () => {
  openModal({
    title: "add book",

    description:
      "add books manually, via isbn, or barcode scan",

    content: createBookForm({
      mode: "create",
      state: getState()
    })
  });
});

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", () => {
    applyTheme(getState().ui.theme);
  });

subscribe(render);

render(getState());
