import {
  bulkDeleteBooks,
  bulkUpdateBooks,
  clearSelection,
  getState
} from "../../core/state.js";

import { closeModal } from "./modal.js";

import { notify } from "./notifications.js";

function normalizeTags(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function createBulkEditor() {
  const state = getState();

  const selectedBooks =
    state.books.filter((book) =>
      state.ui.selection.includes(book.id)
    );

  const wrapper =
    document.createElement("form");

  wrapper.className = "form-grid";

  wrapper.innerHTML = `
    <section class="form-field">
      <label class="form-label">
        selected books
      </label>

      <div class="pill">
        ${
          selectedBooks.length
        } selected
      </div>
    </section>

    <div class="form-row form-row--split">
      <div class="form-field">
        <label class="form-label">
          bulk status
        </label>

        <select
          class="select"
          name="status"
        >
          <option value="">
            unchanged
          </option>

          <option value="wishlist">
            wishlist
          </option>

          <option value="ordered">
            ordered
          </option>

          <option value="owned">
            owned
          </option>
        </select>
      </div>

      <div class="form-field">
        <label class="form-label">
          bulk priority
        </label>

        <select
          class="select"
          name="priority"
        >
          <option value="">
            unchanged
          </option>

          <option value="low">
            low
          </option>

          <option value="medium">
            medium
          </option>

          <option value="high">
            high
          </option>
        </select>
      </div>
    </div>

    <div class="form-field">
      <label class="form-label">
        tags
      </label>

      <input
        class="input"
        name="tags"
        placeholder="fiction, philosophy, hardcover"
      />
    </div>

    <div class="form-actions">
      <button
        type="button"
        class="button button--danger"
        id="bulk-delete"
      >
        delete selected
      </button>

      <div class="table-actions">
        <button
          type="button"
          class="button button--secondary"
          id="bulk-cancel"
        >
          cancel
        </button>

        <button
          type="submit"
          class="button button--primary"
        >
          apply changes
        </button>
      </div>
    </div>
  `;

  wrapper.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const updates = {};

      if (wrapper.status.value) {
        updates.status =
          wrapper.status.value;
      }

      if (wrapper.priority.value) {
        updates.priority =
          wrapper.priority.value;
      }

      const tags = normalizeTags(
        wrapper.tags.value
      );

      if (tags.length) {
        updates.tags = tags;
      }

      bulkUpdateBooks(
        state.ui.selection,
        updates
      );

      notify({
        title:
          "bulk update applied",

        text: `${selectedBooks.length} books updated`
      });

      clearSelection();

      closeModal();
    }
  );

  wrapper
    .querySelector("#bulk-delete")
    .addEventListener(
      "click",
      () => {
        const confirmed =
          window.confirm(
            `delete ${selectedBooks.length} selected books?`
          );

        if (!confirmed) {
          return;
        }

        bulkDeleteBooks(
          state.ui.selection
        );

        notify({
          title:
            "books deleted",

          text: `${selectedBooks.length} books removed`
        });

        clearSelection();

        closeModal();
      }
    );

  wrapper
    .querySelector("#bulk-cancel")
    .addEventListener(
      "click",
      () => {
        closeModal();
      }
    );

  return wrapper;
}
