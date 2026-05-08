import {
  addBook,
  getState,
  setTheme,
  setView,
  subscribe,
  updateSearch
} from "./core/state.js";

const root = document.querySelector("#view-root");

const searchInput =
  document.querySelector("#search-input");

const collectionMeta =
  document.querySelector("#collection-meta");

const addBookButton =
  document.querySelector("#add-book-button");

const themeToggle =
  document.querySelector("#theme-toggle");

const viewButtons = document.querySelectorAll(
  ".view-switcher__button"
);

const rowTemplate = document.querySelector(
  "#book-row-template"
);

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

function renderBooks(state) {
  root.innerHTML = "";

  const query =
    state.ui.searchQuery.toLowerCase();

  const books = state.books.filter((book) => {
    const searchable = [
      book.title,
      ...(book.authors || []),
      book.isbn10,
      book.isbn13
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(query);
  });

  collectionMeta.textContent =
    `${books.length} book${
      books.length === 1 ? "" : "s"
    }`;

  if (books.length === 0) {
    const empty = document.createElement("div");

    empty.className = "book-row";

    empty.innerHTML = `
      <div>
        <h3 class="book-title">
          no books yet
        </h3>

        <p class="book-author">
          start building your collection
        </p>
      </div>
    `;

    root.append(empty);

    return;
  }

  for (const book of books) {
    const fragment =
      rowTemplate.content.cloneNode(true);

    fragment.querySelector(".book-title").textContent =
      book.title;

    fragment.querySelector(".book-author").textContent =
      book.authors.join(", ") || "unknown author";

    fragment.querySelector(".book-status").textContent =
      book.status;

    fragment.querySelector(".book-priority").textContent =
      `${book.priority} priority`;

    root.append(fragment);
  }
}

function syncControls(state) {
  searchInput.value = state.ui.searchQuery;

  viewButtons.forEach((button) => {
    button.classList.toggle(
      "is-active",
      button.dataset.view === state.ui.currentView
    );
  });

  applyTheme(state.ui.theme);
}

function render(state) {
  syncControls(state);

  renderBooks(state);
}

searchInput.addEventListener("input", (event) => {
  updateSearch(event.target.value);
});

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

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setView(button.dataset.view);
  });
});

addBookButton.addEventListener("click", () => {
  addBook({
    title: "new book",
    authors: ["unknown author"]
  });
});

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", () => {
    applyTheme(getState().ui.theme);
  });

subscribe(render);

render(getState());
