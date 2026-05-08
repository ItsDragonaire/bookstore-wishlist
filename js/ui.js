export function renderBooks({
  books,
  tableBody,
  onDelete,
  onUpdate,
  onMove,
}) {
  tableBody.innerHTML = '';

  books.forEach((book, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>
        <img
          class="cover-thumb"
          src="${book.cover || 'assets/placeholder-cover.svg'}"
          alt="cover"
        />
      </td>

      <td>
        <input
          value="${book.title || ''}"
          data-field="title"
        />
      </td>

      <td>
        <input
          value="${book.author || ''}"
          data-field="author"
        />
      </td>

      <td>
        <input
          value="${book.publisher || ''}"
          data-field="publisher"
        />
      </td>

      <td>
        <input
          value="${book.isbn13 || ''}"
          data-field="isbn13"
        />
      </td>

      <td>
        <input
          value="${book.publishYear || ''}"
          data-field="publishYear"
        />
      </td>

      <td>
        <input
          value="${book.pages || ''}"
          data-field="pages"
        />
      </td>

      <td>
        <input
          value="${book.format || ''}"
          data-field="format"
        />
      </td>

      <td>
        <input
          type="number"
          value="${book.quantity || 1}"
          data-field="quantity"
        />
      </td>

      <td>
        <select data-field="priority">
          <option value="1">low</option>
          <option value="2">medium</option>
          <option value="3">high</option>
        </select>
      </td>

      <td>
        <textarea data-field="notes">
${book.notes || ''}
        </textarea>
      </td>

      <td>
        <div class="inline-actions">
          <button data-action="up">↑</button>

          <button data-action="down">↓</button>

          <button
            data-action="delete"
            class="ghost-btn"
          >
            delete
          </button>
        </div>
      </td>
    `;

    row.querySelectorAll('[data-field]').forEach(input => {
      input.value =
        book[input.dataset.field] || input.value;

      input.addEventListener('change', event => {
        onUpdate(
          book.id,
          input.dataset.field,
          event.target.value
        );
      });
    });

    row.querySelector(
      '[data-action="delete"]'
    ).onclick = () => {
      onDelete(book.id);
    };

    row.querySelector(
      '[data-action="up"]'
    ).onclick = () => {
      onMove(index, -1);
    };

    row.querySelector(
      '[data-action="down"]'
    ).onclick = () => {
      onMove(index, 1);
    };

    tableBody.appendChild(row);
  });
}
