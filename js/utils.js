export function generateId() {
  return crypto.randomUUID();
}

export function sanitize(value = '') {
  return String(value).trim();
}

export function detectDuplicates(books, isbn13) {
  return books.some(book => book.isbn13 === isbn13);
}

export function sortBooks(books, sortBy) {
  return [...books].sort((a, b) => {
    if (sortBy === 'priority') {
      return (b.priority || 0) - (a.priority || 0);
    }

    return String(a[sortBy] || '').localeCompare(String(b[sortBy] || ''));
  });
}
