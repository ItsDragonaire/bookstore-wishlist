function createGroupedBooks(
  books
) {
  return books.reduce(
    (groups, book) => {
      const key =
        book.status ||
        "unclassified";

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(book);

      return groups;
    },
    {}
  );
}

function createBookRow(book) {
  const row =
    document.createElement("tr");

  row.className =
    "print-row";

  row.innerHTML = `
    <td class="print-col-cover">
      ${
        book.coverUrl
          ? `
          <img
            class="print-cover"
            src="${book.coverUrl}"
            alt=""
            loading="lazy"
          />
        `
          : ""
      }
    </td>

    <td>
      <div class="print-book-title">
        ${book.title}
      </div>

      ${
        book.subtitle
          ? `
          <div class="print-book-subtitle">
            ${book.subtitle}
          </div>
        `
          : ""
      }

      <div class="print-book-author">
        ${
          book.authors?.join(
            ", "
          ) ||
          "unknown author"
        }
      </div>
    </td>

    <td>
      ${book.publisher || "—"}
    </td>

    <td>
      ${
        book.publishYear ||
        "—"
      }
    </td>

    <td>
      ${book.quantity}
    </td>

    <td>
      ${book.priority}
    </td>

    <td class="print-notes">
      ${book.notes || ""}
    </td>
  `;

  return row;
}

function createSection(
  title,
  books
) {
  const section =
    document.createElement(
      "section"
    );

  section.className =
    "print-section";

  const table =
    document.createElement(
      "table"
    );

  table.className =
    "book-table print-table";

  table.innerHTML = `
    <thead>
      <tr>
        <th></th>
        <th>book</th>
        <th>publisher</th>
        <th>year</th>
        <th>qty</th>
        <th>priority</th>
        <th>notes</th>
      </tr>
    </thead>

    <tbody></tbody>
  `;

  const tbody =
    table.querySelector(
      "tbody"
    );

  const fragment =
    document.createDocumentFragment();

  books.forEach((book) => {
    fragment.append(
      createBookRow(book)
    );
  });

  tbody.append(fragment);

  const totalQuantity =
    books.reduce(
      (sum, book) =>
        sum + book.quantity,
      0
    );

  section.innerHTML = `
    <header class="print-section__header">
      <div>
        <h2 class="print-section__title">
          ${title}
        </h2>

        <p class="print-section__meta">
          ${books.length} books · ${totalQuantity} total quantity
        </p>
      </div>
    </header>
  `;

  section.append(table);

  return section;
}

export function renderPrintView({
  container,
  books
}) {
  container.innerHTML = "";

  if (!books.length) {
    container.innerHTML = `
      <section class="empty-state">
        <h2 class="empty-state__title">
          no books available for printing
        </h2>
  
        <p class="empty-state__text">
          add books before generating an order sheet
        </p>
      </section>
    `;
  
    return;
  }

  const wrapper =
    document.createElement(
      "section"
    );

  wrapper.className =
    "print-view";

  const summary =
    document.createElement(
      "section"
    );

  summary.className =
    "print-summary";

  summary.innerHTML = `
    <div>
      total books: ${books.length}
    </div>

    <div>
      total quantity:
      ${books.reduce(
        (sum, book) =>
          sum + book.quantity,
        0
      )}
    </div>
  `;

  wrapper.append(summary);

  const grouped =
    createGroupedBooks(
      books
    );

  Object.entries(grouped).forEach(
    ([group, entries]) => {
      wrapper.append(
        createSection(
          group,
          entries
        )
      );
    }
  );

  const footer =
    document.createElement(
      "footer"
    );

  footer.className =
    "print-footer";

  footer.textContent =
    `generated ${new Date().toLocaleDateString()} · bookstore wishlist`;

  wrapper.append(footer);

  container.append(wrapper);
}
