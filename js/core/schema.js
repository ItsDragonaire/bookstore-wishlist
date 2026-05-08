export const STORAGE_KEY = "bookstoreWishlist.v1";

export const SCHEMA_VERSION = 1;

export const DEFAULT_STATE = Object.freeze({
  version: SCHEMA_VERSION,

  books: [],

  ui: {
    theme: "system",
    currentView: "table",
    searchQuery: ""
  }
});

const VALID_STATUSES = new Set([
  "wishlist",
  "ordered",
  "owned"
]);

const VALID_PRIORITIES = new Set([
  "low",
  "medium",
  "high"
]);

function sanitizeBook(book = {}) {
  return {
    id:
      typeof book.id === "string"
        ? book.id
        : crypto.randomUUID(),

    createdAt:
      Number.isFinite(book.createdAt)
        ? book.createdAt
        : Date.now(),

    updatedAt:
      Number.isFinite(book.updatedAt)
        ? book.updatedAt
        : Date.now(),

    title:
      typeof book.title === "string"
        ? book.title.trim()
        : "",

    subtitle:
      typeof book.subtitle === "string"
        ? book.subtitle.trim()
        : "",

    authors:
      Array.isArray(book.authors)
        ? book.authors.filter(Boolean)
        : [],

    publisher:
      typeof book.publisher === "string"
        ? book.publisher.trim()
        : "",

    isbn10:
      typeof book.isbn10 === "string"
        ? book.isbn10.trim()
        : "",

    isbn13:
      typeof book.isbn13 === "string"
        ? book.isbn13.trim()
        : "",

    publishYear:
      typeof book.publishYear === "string"
        ? book.publishYear.trim()
        : "",

    quantity:
      Number.isFinite(book.quantity)
        ? Math.max(1, book.quantity)
        : 1,

    priority:
      VALID_PRIORITIES.has(book.priority)
        ? book.priority
        : "medium",

    status:
      VALID_STATUSES.has(book.status)
        ? book.status
        : "wishlist",

    notes:
      typeof book.notes === "string"
        ? book.notes.trim()
        : ""
  };
}

export function validateState(candidate) {
  if (!candidate || typeof candidate !== "object") {
    return structuredClone(DEFAULT_STATE);
  }

  const books = Array.isArray(candidate.books)
    ? candidate.books.map(sanitizeBook)
    : [];

  return {
    version: SCHEMA_VERSION,

    books,

    ui: {
      theme:
        candidate.ui?.theme === "dark" ||
        candidate.ui?.theme === "light" ||
        candidate.ui?.theme === "system"
          ? candidate.ui.theme
          : "system",

      currentView:
        candidate.ui?.currentView === "card"
          ? "card"
          : "table",

      searchQuery:
        typeof candidate.ui?.searchQuery === "string"
          ? candidate.ui.searchQuery
          : ""
    }
  };
}
