import {
  clearSelection,
  deleteBook,
  getState
} from "../../core/state.js";

import { openModal } from "../components/modal.js";

import { createBookForm } from "../components/bookForm.js";

import { createBulkEditor } from "../components/bulkEditor.js";

function isTypingTarget(target) {
  if (!target) {
    return false;
  }

  const tag =
    target.tagName?.toLowerCase();

  return (
    target.isContentEditable ||
    tag === "input" ||
    tag === "textarea" ||
    tag === "select"
  );
}

function openAddBookModal() {
  openModal({
    title: "add book",

    description:
      "add books manually, by isbn, or barcode",

    content: createBookForm({
      mode: "create",
      state: getState()
    })
  });
}

function openBulkModal() {
  const state = getState();

  if (!state.ui.selection.length) {
    return;
  }

  openModal({
    title: "bulk edit",

    description:
      "update multiple books at once",

    content:
      createBulkEditor()
  });
}

function focusSearch() {
  const search =
    document.querySelector(
      "#advanced-search"
    );

  if (!search) {
    return;
  }

  search.focus();
  search.select();
}

function deleteSelection() {
  const state = getState();

  if (!state.ui.selection.length) {
    return;
  }

  const confirmed =
    window.confirm(
      `delete ${state.ui.selection.length} selected books?`
    );

  if (!confirmed) {
    return;
  }

  state.ui.selection.forEach(
    (id) => {
      deleteBook(id);
    }
  );

  clearSelection();
}

function exportBackup() {
  const state = getState();

  const blob = new Blob(
    [
      JSON.stringify(
        state,
        null,
        2
      )
    ],
    {
      type: "application/json"
    }
  );

  const url =
    URL.createObjectURL(blob);

  const anchor =
    document.createElement("a");

  anchor.href = url;

  anchor.download =
    "bookstore-wishlist-backup.json";

  document.body.append(anchor);

  anchor.click();

  anchor.remove();

  URL.revokeObjectURL(url);
}

function printView() {
  window.print();
}

export function initializeKeyboardShortcuts() {
  window.addEventListener(
    "keydown",
    (event) => {
      if (
        isTypingTarget(
          document.activeElement
        ) &&
        event.key !== "Escape"
      ) {
        return;
      }

      const key =
        event.key.toLowerCase();

      const modifier =
        event.metaKey ||
        event.ctrlKey;

      if (
        modifier &&
        key === "s"
      ) {
        event.preventDefault();

        exportBackup();

        return;
      }

      if (
        modifier &&
        key === "a"
      ) {
        return;
      }

      switch (key) {
        case "/":
          event.preventDefault();

          focusSearch();

          break;

        case "n":
          event.preventDefault();

          openAddBookModal();

          break;

        case "b":
          event.preventDefault();

          openBulkModal();

          break;

        case "p":
          event.preventDefault();

          printView();

          break;

        case "delete":
        case "backspace":
          event.preventDefault();

          deleteSelection();

          break;

        default:
          break;
      }
    }
  );
}
