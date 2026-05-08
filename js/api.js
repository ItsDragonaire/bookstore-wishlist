const OPENLIBRARY_URL = 'https://openlibrary.org';
const GOOGLE_BOOKS_URL = 'https://www.googleapis.com/books/v1/volumes';

export async function fetchBookData({ isbn, title, author }) {
  let data = null;

  if (isbn) {
    data = await fetchOpenLibraryByISBN(isbn);
  } else {
    data = await fetchOpenLibraryByQuery(title, author);
  }

  if (!data) {
    data = await fetchGoogleBooks({ isbn, title, author });
  }

  return data;
}

async function fetchOpenLibraryByISBN(isbn) {
  try {
    const response = await fetch(
      `${OPENLIBRARY_URL}/isbn/${isbn}.json`
    );

    if (!response.ok) return null;

    const book = await response.json();

    return normalizeOpenLibrary(book, isbn);
  } catch {
    return null;
  }
}

async function fetchOpenLibraryByQuery(title, author) {
  try {
    const response = await fetch(
      `${OPENLIBRARY_URL}/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`
    );

    const data = await response.json();

    if (!data.docs?.length) return null;

    return normalizeSearchDoc(data.docs[0]);
  } catch {
    return null;
  }
}

async function fetchGoogleBooks({ isbn, title, author }) {
  try {
    const query = isbn
      ? `isbn:${isbn}`
      : `intitle:${title}+inauthor:${author}`;

    const response = await fetch(
      `${GOOGLE_BOOKS_URL}?q=${encodeURIComponent(query)}`
    );

    const data = await response.json();

    if (!data.items?.length) return null;

    const info = data.items[0].volumeInfo;

    return {
}
