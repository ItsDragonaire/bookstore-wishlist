import { openModal } from "../components/modal.js";

import { createBookForm } from "../components/bookForm.js";

export function renderTableView({
  container,
  books,
  state
}) {
  if (books.length === 0) {
    container.innerHTML = `
      <section class="empty-state">
        <h2 class="empty-state__title">
          no books yet
        </h2>

        <p class="empty-state__text">
          start building your long-term collection
        </p>
      </section>
    `;

    return;
  }

  const wrapper = document.createElement("div");

  wrapper.className = "table-view";

  wrapper.innerHTML = `
    <div class="table-scroll">
      <table class="book-table">
        <thead>
          <tr>
            <th>book</th>
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

  const tbody = wrapper.querySelector("tbody");

  for (const book of books) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <div>
          <h3 class="book-meta-title">
            ${book.title}
          </h3>

          <p class="book-meta-author">
            ${
              book.authors?.join(", ") ||
              "unknown author"
            }
          </p>
        </div>
      </td>

      <td>${book.status}</td>

      <td>${book.priority}</td>

      <td>${book.quantity}</td>

      <td>
        <div class="table-actions">
          <button
            class="action-button"
            type="button"
          >
            edit
          </button>
        </div>
      </td>
    `;

    row
      .querySelector(".action-button")
      .addEventListener("click", () => {
        openModal({
          title: "edit book",
          description:
            "update collection details",

          content: createBookForm({
            mode: "edit",
            state,
            book
          })
        });
      });

    tbody.append(row);
  }

  container.append(wrapper);
}
