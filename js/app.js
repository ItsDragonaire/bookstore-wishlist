import {
  getState,
  setPrintMode,
  setTheme,
  subscribe
} from "./core/state.js";

import { initializeToolbar } from "./ui/components/toolbar.js";

import { notify } from "./ui/components/notifications.js";

import { openModal } from "./ui/components/modal.js";

import { createBookForm } from "./ui/components/bookForm.js";

import { renderTableView } from "./ui/views/tableView.js";

import { renderCardView } from "./ui/views/cardView.js";

import { renderPrintView } from "./ui/views/printView.js";

import {
  destroyDragDrop,
  initializeDragDrop
} from "./ui/interactions/dragdrop.js";

import { initializeKeyboardShortcuts } from "./ui/interactions/keyboard.js";

import { initializeSwipeActions } from "./ui/interactions/swipeActions.js";

const root =
  document.querySelector(
    "#view-root"
  );

const appShell =
  document.querySelector(
    ".app-shell"
  );

const collectionMeta =
  document.querySelector(
    "#collection-meta"
  );

const addBookButton =
  document.querySelector(
    "#add-book-button"
  );

const themeToggle =
  document.querySelector(
    "#theme-toggle"
  );

function applyTheme(theme) {
  const resolved =
    theme === "system"
      ? window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches
        ? "dark"
        : "light"
      : theme;

  document.documentElement.dataset.theme =
    resolved;
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .trim();
}

function filterBooks(
  books,
  state
) {
  const {
    searchQuery,
    filters
  } = state.ui;

  return books.filter((book) => {
    const searchable = [
      book.title,
      book.subtitle,
      ...(book.authors || []),
      book.publisher,
      book.isbn10,
      book.isbn13,
      book.notes,
      ...(book.tags || [])
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !searchQuery ||
      searchable.includes(
        normalize(searchQuery)
      );

    const matchesStatus =
      !filters.status ||
      book.status ===
        filters.status;

    const matchesPriority =
      !filters.priority ||
      book.priority ===
        filters.priority;

    const matchesPublisher =
      !filters.publisher ||
      normalize(
        book.publisher
      ).includes(
        normalize(
          filters.publisher
        )
      );

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesPublisher
    );
  });
}

function sortBooks(
  books,
  state
) {
  const {
    by,
    direction
  } = state.ui.sort;

  return [...books].sort(
    (a, b) => {
      let first = a[by];

      let second = b[by];

      if (by === "author") {
        first =
          a.authors?.[0] || "";

        second =
          b.authors?.[0] || "";
      }

      first = normalize(first);

      second = normalize(second);

      if (first < second) {
        return direction === "asc"
          ? -1
          : 1;
      }

      if (first > second) {
        return direction === "asc"
          ? 1
          : -1;
      }

      return 0;
    }
  );
}

function activatePrintMode() {
  document.body.classList.add(
    "is-printing"
  );

  appShell?.setAttribute(
    "data-printing",
    "true"
  );

  setPrintMode(true);
}

function deactivatePrintMode() {
  document.body.classList.remove(
    "is-printing"
  );

  appShell?.removeAttribute(
    "data-printing"
  );

  setPrintMode(false);
}

async function mountInteractions(
  state,
  books
) {
  if (
    state.ui.printMode
  ) {
    return;
  }

  destroyDragDrop();

  if (
    state.ui.currentView ===
    "card"
  ) {
    await initializeDragDrop({
      containerSelector:
        "#sortable-card-grid"
    });

    initializeSwipeActions({
      selector:
        ".book-card",

      books
    });

    return;
  }

  await initializeDragDrop({
    containerSelector:
      "#sortable-table-body"
  });

  initializeSwipeActions({
    selector:
      "tbody tr[data-book-id]",

    books
  });
}

async function render(state) {
  root.innerHTML = "";

  applyTheme(state.ui.theme);

  const filtered =
    filterBooks(
      state.books,
      state
    );

  const books =
    sortBooks(filtered, state);

  collectionMeta.textContent =
    `${books.length} book${
      books.length === 1
        ? ""
        : "s"
    }`;

  if (state.ui.printMode) {
    renderPrintView({
      container: root,
      books,
      state
    });

    return;
  }

  if (
    state.ui.currentView ===
    "card"
  ) {
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

  await mountInteractions(
    state,
    books
  );
}

async function registerServiceWorker() {
  if (
    !(
      "serviceWorker" in
      navigator
    )
  ) {
    return;
  }

  try {
    const registration =
      await navigator.serviceWorker.register(
        "./sw.js"
      );

    registration.addEventListener(
      "updatefound",
      () => {
        const worker =
          registration.installing;

        if (!worker) {
          return;
        }

        worker.addEventListener(
          "statechange",
          () => {
            if (
              worker.state ===
                "installed" &&
              navigator
                .serviceWorker
                .controller
            ) {
              notify({
                title:
                  "update available",

                text:
                  "refresh to use the latest version",

                type:
                  "info",

                duration: 6000
              });
            }
          }
        );
      }
    );

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      () => {
        notify({
          title:
            "app updated",

          text:
            "latest version is now active",

          type:
            "success"
        });
      }
    );
  } catch {
    notify({
      title:
        "offline mode unavailable",

      text:
        "service worker registration failed",

      type:
        "error",

      duration: 5000
    });
  }
}

initializeToolbar();

initializeKeyboardShortcuts();

registerServiceWorker();

themeToggle.addEventListener(
  "click",
  () => {
    const current =
      getState().ui.theme;

    const next =
      current === "light"
        ? "dark"
        : current === "dark"
        ? "system"
        : "light";

    setTheme(next);
  }
);

addBookButton.addEventListener(
  "click",
  () => {
    openModal({
      title: "add book",

      description:
        "add books manually, by isbn, or barcode",

      content:
        createBookForm({
          mode: "create",
          state: getState()
        })
    });
  }
);

window.addEventListener(
  "beforeprint",
  () => {
    activatePrintMode();
  }
);

window.addEventListener(
  "afterprint",
  () => {
    deactivatePrintMode();

    notify({
      title:
        "print complete",

      text:
        "returned to interactive view",

      type:
        "success"
    });
  }
);

window
  .matchMedia(
    "(prefers-color-scheme: dark)"
  )
  .addEventListener(
    "change",
    () => {
      applyTheme(
        getState().ui.theme
      );
    }
  );

subscribe(render);

render(getState());
