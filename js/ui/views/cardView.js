import { openModal } from "../components/modal.js";

import { createBookForm } from "../components/bookForm.js";

export function renderCardView({
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
          your future shelves begin here
        </p>
      </section>
    `;

    return;
  }

  const grid = document.createElement("div");

  grid.className = "card-grid";

  for (const book of books) {
    const card = document.createElement("article");

    card.className = "book-card";

    card.innerHTML = `
      <div class="book-card__top">
        <div>
          <h2 class="book-card__title">
            ${book.title}
          </h2>

          <p class="book-card__author">
            ${
              book.authors?.join(", ") ||
              "unknown author"
            }
          </p>
        </div>

        <div class="card-actions">
          <button
            class="action-button"
            type="button"
          >
            edit
          </button>
        </div>
      </div>

      <div class="book-card__details">
        <span class="pill">
          ${book.status}
        </span>

        <span class="pill">
          ${book.priority} priority
        </span>

        <span class="pill">
          qty ${book.quantity}
        </span>
      </div>

      ${
        book.notes
          ? `
            <p class="book-author">
              ${book.notes}
            </p>
          `
          : ""
      }
    `;

    card
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

    grid.append(card);
  }

  container.append(grid);
}
