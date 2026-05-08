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

function safeString(value) {
  return String(value || "")
    .trim();
}

function safeArray(value) {
  return Array.isArray(value)
    ? value.filter(Boolean)
    : [];
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
  try {
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
    
    const merged = merge(
      openLibrary || {},
      googleBooks || {}
    );
    
    return {
      title:
        safeString(
          merged.title
        ),
    
      subtitle:
        safeString(
          merged.subtitle
        ),
    
      authors: safeArray(
        merged.authors
      ),
    
      publisher:
        safeString(
          merged.publisher
        ),
    
      isbn10:
        safeString(
          merged.isbn10
        ),
    
      isbn13:
        safeString(
          merged.isbn13
        ),
    
      publishYear:
        safeString(
          merged.publishYear
        ),
    
      pageCount:
        Number(
          merged.pageCount
        ) || 0,
    
      language:
        safeString(
          merged.language
        ),
    
      format:
        safeString(
          merged.format
        ),
    
      series:
        safeString(
          merged.series
        ),
    
      coverUrl:
        safeString(
          merged.coverUrl
        )
    };
  } catch (error) {
    console.error(
      "metadata fetch failed",
      error
    );

  return null;
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
