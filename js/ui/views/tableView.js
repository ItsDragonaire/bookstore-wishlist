import {
  getState,
  toggleSelection
} from "../../core/state.js";

import { openModal } from "../components/modal.js";

import { createBookForm } from "../components/bookForm.js";

function createRow(book, state) {
  const selected =
    state.ui.selection.includes(
      book.id
    );

  const row =
    document.createElement("tr");

  row.dataset.bookId = book.id;

  if (selected) {
    row.classList.add(
      "is-selected"
    );
  }

  row.innerHTML = `
    <td>
      <input
        type="checkbox"
        class="selection-checkbox"
        ${
          selected
            ? "checked"
            : ""
        }
        aria-label="select book"
      />
    </td>

    <td>
      <div>
        <h3 class="book-meta-title">
          ${book.title}
        </h3>

        <p class="book-meta-author">
          ${
            book.authors?.join(
              ", "
            ) ||
            "unknown author"
          }
        </p>
      </div>
    </td>

    <td>
      ${book.publisher || "—"}
    </td>

    <td>
      ${book.status}
    </td>

    <td>
      ${book.priority}
    </td>

    <td>
      ${book.quantity}
    </td>

    <td>
      <button
        class="action-button"
        type="button"
      >
        edit
      </button>
    </td>
  `;

  row
    .querySelector(
      ".selection-checkbox"
    )
    .addEventListener(
      "change",
      () => {
        toggleSelection(
          book.id
        );
      }
    );

  row
    .querySelector(
      ".action-button"
    )
    .addEventListener(
      "click",
      () => {
        openModal({
          title: "edit book",

          description:
            "update collection details",

          content:
            createBookForm({
              mode: "edit",
              state,
              book
            })
        });
      }
    );

  return row;
}

export function renderTableView({
  container,
  books,
  state
}) {
  if (!books.length) {
    container.innerHTML = `
      <section class="empty-state">
        <h2 class="empty-state__title">
          no matching books
        </h2>

        <p class="empty-state__text">
          adjust filters or add books
        </p>
      </section>
    `;

    return;
  }

  const wrapper =
    document.createElement("div");

  wrapper.className =
    "table-view";

  wrapper.innerHTML = `
    <div class="table-scroll">
      <table class="book-table">
        <thead>
          <tr>
            <th></th>
            <th>book</th>
            <th>publisher</th>
            <th>status</th>
            <th>priority</th>
            <th>qty</th>
            <th></th>
          </tr>
        </thead>

        <tbody></tbody>
      </table>
    </div>
  `;

  const tbody =
    wrapper.querySelector(
      "tbody"
    );

  const fragment =
    document.createDocumentFragment();

  books.forEach((book) => {
    fragment.append(
      createRow(book, state)
    );
  });

  tbody.append(fragment);

  container.append(wrapper);
}
