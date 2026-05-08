import { APP_CONFIG } from "../config.js";

function clean(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function extractIndustryIdentifiers(
  identifiers = []
) {
  const isbn10 = identifiers.find(
    (item) => item.type === "ISBN_10"
  );

  const isbn13 = identifiers.find(
    (item) => item.type === "ISBN_13"
  );

  return {
    isbn10:
      isbn10?.identifier || "",

    isbn13:
      isbn13?.identifier || ""
  };
}

function normalizeVolumeInfo(volumeInfo = {}) {
  const identifiers =
    extractIndustryIdentifiers(
      volumeInfo.industryIdentifiers
    );

  return {
    source: "googlebooks",

    title: clean(volumeInfo.title),

    subtitle: clean(volumeInfo.subtitle),

    authors: volumeInfo.authors || [],

    publisher: clean(
      volumeInfo.publisher
    ),

    isbn10: identifiers.isbn10,

    isbn13: identifiers.isbn13,

    publishYear: clean(
      volumeInfo.publishedDate
    ),

    pageCount:
      Number(volumeInfo.pageCount) || 0,

    language: clean(volumeInfo.language),

    format: clean(
      volumeInfo.printType
    ),

    series: "",

    coverUrl:
      volumeInfo.imageLinks?.thumbnail ||
      ""
  };
}

export async function fetchGoogleBooksByISBN(
  isbn
) {
  const endpoint =
    `${APP_CONFIG.metadata.googleBooksBase}/volumes?q=isbn:${isbn}`;

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(
      "google books lookup failed"
    );
  }

  const data = await response.json();

  if (!data.items?.length) {
    throw new Error(
      "google books no results"
    );
  }

  return normalizeVolumeInfo(
    data.items[0].volumeInfo
  );
}

export async function searchGoogleBooks({
  title,
  author = ""
}) {
  const query = [
    `intitle:${title}`,
    author
      ? `inauthor:${author}`
      : ""
  ]
    .filter(Boolean)
    .join("+");

  const endpoint =
    `${APP_CONFIG.metadata.googleBooksBase}/volumes?q=${query}`;

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(
      "google books search failed"
    );
  }

  const data = await response.json();

  return (data.items || [])
    .slice(0, 10)
    .map((item) =>
      normalizeVolumeInfo(item.volumeInfo)
    );
}
