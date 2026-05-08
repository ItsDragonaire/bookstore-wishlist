import {
  fetchGoogleBooksByISBN,
  searchGoogleBooks
} from "./googlebooks.js";

import {
  fetchOpenLibraryByISBN,
  searchOpenLibraryBooks
} from "./openlibrary.js";

function mergeArrays(primary, fallback) {
  return primary?.length
    ? primary
    : fallback || [];
}

function merge(primary, fallback) {
  return {
    title:
      primary.title || fallback.title || "",

    subtitle:
      primary.subtitle ||
      fallback.subtitle ||
      "",

    authors: mergeArrays(
      primary.authors,
      fallback.authors
    ),

    publisher:
      primary.publisher ||
      fallback.publisher ||
      "",

    isbn10:
      primary.isbn10 ||
      fallback.isbn10 ||
      "",

    isbn13:
      primary.isbn13 ||
      fallback.isbn13 ||
      "",

    publishYear:
      primary.publishYear ||
      fallback.publishYear ||
      "",

    pageCount:
      primary.pageCount ||
      fallback.pageCount ||
      0,

    language:
      primary.language ||
      fallback.language ||
      "",

    format:
      primary.format ||
      fallback.format ||
      "",

    series:
      primary.series ||
      fallback.series ||
      "",

    coverUrl:
      primary.coverUrl ||
      fallback.coverUrl ||
      ""
  };
}

export async function fetchBookMetadataByISBN(
  isbn
) {
  let openLibrary = null;
  let googleBooks = null;

  try {
    openLibrary =
      await fetchOpenLibraryByISBN(isbn);
  } catch {}

  try {
    googleBooks =
      await fetchGoogleBooksByISBN(isbn);
  } catch {}

  if (!openLibrary && !googleBooks) {
    throw new Error(
      "no metadata providers available"
    );
  }

  return merge(
    openLibrary || {},
    googleBooks || {}
  );
}

export async function searchBookMetadata({
  title,
  author
}) {
  try {
    const results =
      await searchOpenLibraryBooks({
        title,
        author
      });

    if (results.length) {
      return results;
    }
  } catch {}

  return searchGoogleBooks({
    title,
    author
  });
}
