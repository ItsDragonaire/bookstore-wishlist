import { APP_CONFIG } from "../config.js";

function clean(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function normalizeLanguages(languages = []) {
  return languages
    .map((item) =>
      item?.key?.split("/")?.pop()
    )
    .filter(Boolean)
    .join(", ");
}

function normalizeSubjects(subjects = []) {
  return subjects?.[0] || "";
}

function buildCover(isbn13) {
  if (!isbn13) {
    return "";
  }

  return `https://covers.openlibrary.org/b/isbn/${isbn13}-L.jpg`;
}

export async function fetchOpenLibraryByISBN(
  isbn
) {
  const endpoint = `${APP_CONFIG.metadata.openLibraryBase}/isbn/${isbn}.json`;

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(
      "openlibrary isbn lookup failed"
    );
  }

  const book = await response.json();

  let authors = [];

  if (Array.isArray(book.authors)) {
    authors = await Promise.all(
      book.authors.map(async (author) => {
        try {
          const authorResponse = await fetch(
            `${APP_CONFIG.metadata.openLibraryBase}${author.key}.json`
          );

          if (!authorResponse.ok) {
            return "";
          }

          const authorData =
            await authorResponse.json();

          return clean(authorData.name);
        } catch {
          return "";
        }
      })
    );
  }

  return {
    source: "openlibrary",

    title: clean(book.title),

    subtitle: clean(book.subtitle),

    authors: authors.filter(Boolean),

    publisher:
      book.publishers?.[0] || "",

    isbn10:
      book.isbn_10?.[0] || "",

    isbn13:
      book.isbn_13?.[0] || isbn,

    publishYear:
      clean(book.publish_date),

    pageCount:
      Number(book.number_of_pages) || 0,

    language: normalizeLanguages(
      book.languages
    ),

    format:
      clean(book.physical_format),

    series: normalizeSubjects(
      book.subjects
    ),

    coverUrl: buildCover(
      book.isbn_13?.[0] || isbn
    )
  };
}

export async function searchOpenLibraryBooks({
  title,
  author = ""
}) {
  const query = new URLSearchParams({
    title,
    author
  });

  const endpoint =
    `${APP_CONFIG.metadata.openLibraryBase}/search.json?${query}`;

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(
      "openlibrary search failed"
    );
  }

  const data = await response.json();

  return (data.docs || [])
    .slice(0, 10)
    .map((item) => ({
      title: clean(item.title),
      authors: item.author_name || [],
      publishYear:
        item.first_publish_year?.toString() ||
        "",
      isbn13:
        item.isbn?.find(
          (value) => value.length === 13
        ) || "",
      coverUrl: item.cover_i
        ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`
        : ""
    }));
}
