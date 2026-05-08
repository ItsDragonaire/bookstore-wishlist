import {
  addBook,
  deleteBook,
  updateBook
} from "../../core/state.js";

import { closeModal } from "./modal.js";

import { notify } from "./notifications.js";

function normalizeAuthors(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function detectDuplicate({
  title,
  isbn13,
  existingBooks,
  currentId
}) {
  return existingBooks.find((book) => {
    if (book.id === currentId) {
      return false;
    }

    if (
      isbn13 &&
      book.isbn13 &&
      isbn13 === book.isbn13
    ) {
      return true;
    }

    return (
      book.title.toLowerCase().trim() ===
      title.toLowerCase().trim()
    );
  });
}

export function createBookForm({
  mode = "create",
  book = null,
  state
}) {
  const form = document.createElement("form");

  form.className = "form-grid";

  form.innerHTML = `
    <div class="form-row">
      <div class="form-field">
        <label class="form-label" for="title">
          title
        </label>

        <input
          class="input"
          id="title"
          name="title"
          required
          value="${book?.title || ""}"
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-field">
        <label class="form-label" for="authors">
          authors
        </label>

        <input
          class="input"
          id="authors"
          name="authors"
          value="${book?.authors?.join(", ") || ""}"
        />
      </div>
    </div>

    <div class="form-row form-row--split">
      <div class="form-field">
        <label class="form-label" for="quantity">
          quantity
        </label>

        <input
          class="input"
          id="quantity"
          name="quantity"
          type="number"
          min="1"
          value="${book?.quantity || 1}"
        />
      </div>

      <div class="form-field">
        <label class="form-label" for="isbn13">
          isbn13
        </label>

        <input
          class="input"
          id="isbn13"
          name="isbn13"
          value="${book?.isbn13 || ""}"
        />
      </div>
    </div>

    <div class="form-row form-row--split">
      <div class="form-field">
        <label class="form-label" for="priority">
          priority
        </label>

        <select
          class="select"
          id="priority"
          name="priority"
        >
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
      </div>

      <div class="form-field">
        <label class="form-label" for="status">
          status
        </label>

        <select
          class="select"
          id="status"
          name="status"
        >
          <option value="wishlist">wishlist</option>
          <option value="ordered">ordered</option>
          <option value="owned">owned</option>
        </select>
      </div>
    </div>

    <div class="form-field">
      <label class="form-label" for="notes">
        notes
      </label>

      <textarea
        class="textarea"
        id="notes"
        name="notes"
      >${book?.notes || ""}</textarea>
    </div>

    <div class="form-actions">
      <div>
        ${
          mode === "edit"
            ? `
              <button
                type="button"
                class="button button--danger"
                id="delete-book"
              >
                delete
              </button>
            `
            : ""
        }
      </div>

      <div class="table-actions">
        <button
          type="button"
          class="button button--secondary"
          id="cancel-book-form"
        >
          cancel
        </button>

        <button
          type="submit"
          class="button button--primary"
        >
          ${
            mode === "edit"
              ? "save changes"
              : "add book"
          }
        </button>
      </div>
    </div>
  `;

  form.priority.value =
    book?.priority || "medium";

  form.status.value =
    book?.status || "wishlist";

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const payload = {
      title: form.title.value.trim(),
      authors: normalizeAuthors(
        form.authors.value
      ),
      quantity: Number(form.quantity.value),
      isbn13: form.isbn13.value.trim(),
      priority: form.priority.value,
      status: form.status.value,
      notes: form.notes.value.trim()
    };

    const duplicate = detectDuplicate({
      title: payload.title,
      isbn13: payload.isbn13,
      existingBooks: state.books,
      currentId: book?.id
    });

    if (duplicate) {
      notify({
        title: "possible duplicate",
        text:
          "matching title or isbn already exists"
      });
    }

    if (mode === "edit") {
      updateBook(book.id, payload);

      notify({
        title: "book updated",
        text: payload.title
      });
    } else {
      addBook(payload);

      notify({
        title: "book added",
        text: payload.title
      });
    }

    closeModal();
  });

  form
    .querySelector("#cancel-book-form")
    .addEventListener("click", closeModal);

  if (mode === "edit") {
    form
      .querySelector("#delete-book")
      .addEventListener("click", () => {
        deleteBook(book.id);

        notify({
          title: "book removed",
          text: book.title
        });

        closeModal();
      });
  }

  return form;
}
