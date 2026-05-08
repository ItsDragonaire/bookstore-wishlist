import { toggleSelection } from "../../core/state.js";

import { openModal } from "../components/modal.js";

import { createBookForm } from "../components/bookForm.js";

function createCard(book, state) {
  const selected =
    state.ui.selection.includes(
      book.id
    );

  const card =
    document.createElement(
      "article"
    );

  card.className =
    "book-card";

  if (selected) {
    card.classList.add(
      "is-selected"
    );
  }

  card.innerHTML = `
    <div class="book-card__top">
      <div>
        <h2 class="book-card__title">
          ${book.title}
        </h2>

        <p class="book-card__author">
          ${
            book.authors?.join(
              ", "
            ) ||
            "unknown author"
          }
        </p>
      </div>

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
    </div>

    <div class="book-card__details">
      <span class="pill">
        ${book.status}
      </span>

      <span class="pill">
        ${book.priority}
      </span>

      <span class="pill">
        qty ${book.quantity}
      </span>
    </div>

    ${
      book.publisher
        ? `
        <p class="book-author">
          ${book.publisher}
        </p>
      `
        : ""
    }

    ${
      book.notes
        ? `
        <p class="book-author">
          ${book.notes}
        </p>
      `
        : ""
    }

    <div class="card-actions">
      <button
        class="action-button"
        type="button"
      >
        edit
      </button>
    </div>
  `;

  card
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

  card
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

  return card;
}

export function renderCardView({
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

  const grid =
    document.createElement(
      "div"
    );

  grid.className =
    "card-grid";

  const fragment =
    document.createDocumentFragment();

  books.forEach((book) => {
    fragment.append(
      createCard(book, state)
    );
  });

  grid.append(fragment);

  container.append(grid);
}
