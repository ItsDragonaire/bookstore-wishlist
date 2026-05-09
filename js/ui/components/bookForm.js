import {
  addBook,
  deleteBook,
  updateBook
} from "../../core/state.js";

import {
  fetchBookMetadataByISBN,
  searchBookMetadata
} from "../../api/metadata.js";

import { openModal, closeModal } from "./modal.js";

import { createScanner } from "./scanner.js";

import { notify } from "./notifications.js";

function normalizeAuthors(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function populateForm(form, metadata) {
  const mapping = {
    title: metadata.title,
    subtitle: metadata.subtitle,
    authors:
      metadata.authors?.join(", "),
    publisher: metadata.publisher,
    isbn10: metadata.isbn10,
    isbn13: metadata.isbn13,
    publishYear:
      metadata.publishYear,
    pageCount:
      metadata.pageCount,
    language: metadata.language,
    format: metadata.format,
    series: metadata.series
  };

  Object.entries(mapping).forEach(
    ([key, value]) => {
      if (
        form[key] &&
        value !== undefined &&
        value !== null
      ) {
        form[key].value = value;
      }
    }
  );
}

function renderSearchResults({
  container,
  results,
  onSelect
}) {
  if (!results.length) {
    container.innerHTML = `
      <div class="empty-results">
        no matching books found
      </div>
    `;

    return;
  }

  container.innerHTML =
    results
      .map(
        (result, index) => `
          <button
            type="button"
            class="search-result"
            data-index="${index}"
          >
            <strong>
              ${result.title}
            </strong>

            <span>
              ${
                result.authors?.join(
                  ", "
                ) || "unknown author"
              }
            </span>
          </button>
        `
      )
      .join("");

  container
    .querySelectorAll(
      ".search-result"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          onSelect(
            results[
              Number(
                button.dataset
                  .index
              )
            ]
          );
        }
      );
    });
}

export function createBookForm({
  mode = "create",
  state,
  book = null
}) {
  const form = document.createElement("form");

  form.className = "form-grid";

  form.innerHTML = `
    <div class="lookup-section">

      <div class="table-actions">
        <button
          type="button"
          class="button button--secondary"
          id="scan-button"
        >
          scan isbn
        </button>
    
        <button
          type="button"
          class="button button--secondary"
          id="fetch-button"
        >
          fetch isbn metadata
        </button>
      </div>
    
      <div class="form-row form-row--split">
        <div class="form-field">
          <label class="form-label">
            search title
          </label>
    
          <input
            class="input"
            id="title-search"
            placeholder="book title"
          />
        </div>
    
        <div class="form-field">
          <label class="form-label">
            search author
          </label>
    
          <input
            class="input"
            id="author-search"
            placeholder="author name"
          />
        </div>
      </div>
    
      <button
        type="button"
        class="button button--secondary"
        id="search-button"
      >
        search by title + author
      </button>
    
      <section
        class="search-results"
        id="search-results"
      ></section>
    
    </div>

    <div class="form-row form-row--split">
      <div class="form-field">
        <label class="form-label">
          isbn13
        </label>

        <input
          class="input"
          name="isbn13"
          value="${book?.isbn13 || ""}"
        />
      </div>

      <div class="form-field">
        <label class="form-label">
          isbn10
        </label>

        <input
          class="input"
          name="isbn10"
          value="${book?.isbn10 || ""}"
        />
      </div>
    </div>

    <div class="form-field">
      <label class="form-label">
        title
      </label>

      <input
        class="input"
        name="title"
        required
        value="${book?.title || ""}"
      />
    </div>

    <div class="form-field">
      <label class="form-label">
        subtitle
      </label>

      <input
        class="input"
        name="subtitle"
        value="${book?.subtitle || ""}"
      />
    </div>

    <div class="form-field">
      <label class="form-label">
        authors
      </label>

      <input
        class="input"
        name="authors"
        value="${
          book?.authors?.join(", ") || ""
        }"
      />
    </div>

    <div class="form-row form-row--split">
      <div class="form-field">
        <label class="form-label">
          publisher
        </label>

        <input
          class="input"
          name="publisher"
          value="${book?.publisher || ""}"
        />
      </div>

      <div class="form-field">
        <label class="form-label">
          publish year
        </label>

        <input
          class="input"
          name="publishYear"
          value="${
            book?.publishYear || ""
          }"
        />
      </div>
    </div>

    <div class="form-row form-row--split">
      <div class="form-field">
        <label class="form-label">
          pages
        </label>

        <input
          class="input"
          type="number"
          name="pageCount"
          value="${
            book?.pageCount || ""
          }"
        />
      </div>

      <div class="form-field">
        <label class="form-label">
          quantity
        </label>

        <input
          class="input"
          type="number"
          min="1"
          name="quantity"
          value="${
            book?.quantity || 1
          }"
        />
      </div>
    </div>

    <div class="form-row form-row--split">
      <div class="form-field">
        <label class="form-label">
          language
        </label>

        <input
          class="input"
          name="language"
          value="${
            book?.language || ""
          }"
        />
      </div>

      <div class="form-field">
        <label class="form-label">
          format
        </label>

        <input
          class="input"
          name="format"
          value="${book?.format || ""}"
        />
      </div>
    </div>

    <div class="form-field">
      <label class="form-label">
        series
      </label>

      <input
        class="input"
        name="series"
        value="${book?.series || ""}"
      />
    </div>

    <div class="form-row form-row--split">
      <div class="form-field">
        <label class="form-label">
          priority
        </label>

        <select
          class="select"
          name="priority"
        >
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
      </div>

      <div class="form-field">
        <label class="form-label">
          status
        </label>

        <select
          class="select"
          name="status"
        >
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
    </div>

    <div class="form-field">
      <label class="form-label">
        notes
      </label>

      <textarea
        class="textarea"
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
              id="delete-button"
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
          id="cancel-button"
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

  form
    .querySelector("#scan-button")
    .addEventListener("click", () => {
      openModal({
        title: "scan isbn",

        description:
          "scan barcode using your device camera",

        content: createScanner({
          onDetected(metadata) {
            populateForm(form, metadata);

            closeModal();

            notify({
              title:
                "metadata autofilled",
              text:
                metadata.title ||
                "book detected"
            });
          }
        })
      });
    });

  form
    .querySelector("#fetch-button")
    .addEventListener(
      "click",
      async () => {
        const isbn =
          form.isbn13.value.trim() ||
          form.isbn10.value.trim();

        if (!isbn) {
          notify({
            title: "isbn required",
            text:
              "enter isbn before fetching"
          });

          return;
        }

        const submitButton =
          form.querySelector(
            '[type="submit"]'
          );
        
        form.classList.add(
          "is-loading"
        );
        
        submitButton.disabled =
          true;

        try {
          const metadata =
            await fetchBookMetadataByISBN(
              isbn
            );

          populateForm(form, metadata);

          notify({
            title:
              "metadata loaded",
            text:
              metadata.title ||
              "book found"
          });
        } catch {
          notify({
            title:
              "metadata unavailable",
            text:
              "no matching book found"
          });
        } finally {
            form.classList.remove(
              "is-loading"
            );
          
            submitButton.disabled =
              false;
          }
      }
    );

  form
  .querySelector("#search-button")
  .addEventListener(
    "click",
    async () => {
      const title =
        form
          .querySelector(
            "#title-search"
          )
          .value.trim();

      const author =
        form
          .querySelector(
            "#author-search"
          )
          .value.trim();

      if (
        !title &&
        !author
      ) {
        notify({
          title:
            "search required",

          text:
            "enter a title or author"
        });

        return;
      }

      const resultsContainer =
        form.querySelector(
          "#search-results"
        );

      resultsContainer.innerHTML =
        `
          <div class="search-loading">
            searching books…
          </div>
        `;

      try {
        const results =
          await searchBookMetadata({
            title,
            author
          });

        renderSearchResults({
          container:
            resultsContainer,

          results,

          onSelect(
            metadata
          ) {
            populateForm(
              form,
              metadata
            );

            resultsContainer.innerHTML =
              "";

            notify({
              title:
                "metadata loaded",

              text:
                metadata.title
            });
          }
        });
      } catch {
        resultsContainer.innerHTML =
          `
            <div class="empty-results">
              unable to search books
            </div>
          `;
      }
    }
  );

  form.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const title =
        form.title.value;
      
      const isbn13 =
        form.isbn13.value.trim();
      
      const normalizedTitle =
        title
          .trim()
          .toLowerCase();
      
      const duplicate =
        state.books.find(
          (existing) => {
            if (
              mode === "edit" &&
              existing.id === book?.id
            ) {
              return false;
            }
      
            const sameTitle =
              existing.title
                ?.trim()
                ?.toLowerCase() ===
              normalizedTitle;
      
            const sameIsbn =
              isbn13 &&
              existing.isbn13 ===
                isbn13;
      
            return (
              sameTitle ||
              sameIsbn
            );
          }
        );
      
      if (duplicate) {
        notify({
          title:
            "duplicate detected",
      
          text:
            "matching title or isbn already exists"
        });
      
        return;
      }

      const payload = {
        title: title.trim(),

        subtitle:
          form.subtitle.value.trim(),

        authors: normalizeAuthors(
          form.authors.value
        ),

        publisher:
          form.publisher.value.trim(),

        isbn10:
          form.isbn10.value.trim(),

        isbn13:
          form.isbn13.value.trim(),

        publishYear:
          form.publishYear.value.trim(),

        pageCount: Number(
          form.pageCount.value
        ),

        language:
          form.language.value.trim(),

        format:
          form.format.value.trim(),

        series:
          form.series.value.trim(),

        quantity: Number(
          form.quantity.value
        ),

        priority:
          form.priority.value,

        status:
          form.status.value,

        notes:
          form.notes.value.trim()
      };

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
    }
  );

  form
    .querySelector("#cancel-button")
    .addEventListener(
      "click",
      closeModal
    );

  if (mode === "edit") {
    form
      .querySelector("#delete-button")
      .addEventListener(
        "click",
        () => {
          deleteBook(book.id);

          notify({
            title: "book removed",
            text: book.title
          });

          closeModal();
        }
      );
  }

  return form;
}
