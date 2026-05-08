import {
  DEFAULT_STATE,
  validateState
} from "../core/schema.js";

function downloadFile({
  content,
  filename,
  mimeType
}) {
  const blob = new Blob(
    [content],
    {
      type: mimeType
    }
  );

  const url =
    URL.createObjectURL(blob);

  const anchor =
    document.createElement("a");

  anchor.href = url;

  anchor.download = filename;

  document.body.append(anchor);

  anchor.click();

  anchor.remove();

  URL.revokeObjectURL(url);
}

function normalizeBook(book) {
  return {
    id:
      book.id ||
      crypto.randomUUID(),

    createdAt:
      Number(book.createdAt) ||
      Date.now(),

    updatedAt:
      Number(book.updatedAt) ||
      Date.now(),

    title:
      String(
        book.title || ""
      ),

    subtitle:
      String(
        book.subtitle || ""
      ),

    authors:
      Array.isArray(
        book.authors
      )
        ? book.authors
        : [],

    publisher:
      String(
        book.publisher || ""
      ),

    isbn10:
      String(
        book.isbn10 || ""
      ),

    isbn13:
      String(
        book.isbn13 || ""
      ),

    publishYear:
      String(
        book.publishYear || ""
      ),

    pageCount:
      Number(
        book.pageCount
      ) || 0,

    language:
      String(
        book.language || ""
      ),

    format:
      String(
        book.format || ""
      ),

    series:
      String(
        book.series || ""
      ),

    coverUrl:
      String(
        book.coverUrl || ""
      ),

    quantity:
      Number(
        book.quantity
      ) || 1,

    priority:
      String(
        book.priority ||
          "medium"
      ),

    status:
      String(
        book.status ||
          "wishlist"
      ),

    tags:
      Array.isArray(book.tags)
        ? book.tags
        : [],

    notes:
      String(
        book.notes || ""
      )
  };
}

function normalizeState(
  imported
) {
  const defaults =
    structuredClone(
      DEFAULT_STATE
    );

  return {
    ...defaults,

    ...imported,

    books: Array.isArray(
      imported.books
    )
      ? imported.books.map(
          normalizeBook
        )
      : [],

    ui: {
      ...defaults.ui,
      ...(imported.ui || {})
    }
  };
}

export function exportJsonBackup(
  state
) {
  const payload = {
    exportedAt:
      new Date().toISOString(),

    schemaVersion: 1,

    data: state
  };

  downloadFile({
    content: JSON.stringify(
      payload,
      null,
      2
    ),

    filename:
      "bookstore-backup.json",

    mimeType:
      "application/json"
  });
}

export async function importJsonBackup(
  file
) {
  const text =
    await file.text();

  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(
      "invalid json file"
    );
  }

  const candidate =
    parsed?.data || parsed;
  
  if (
    !candidate ||
    typeof candidate !==
      "object"
  ) {
    throw new Error(
      "backup payload invalid"
    );
  }

  const normalized =
    normalizeState(
      candidate
    );

  try {
    return validateState(
      normalized
    );
  } catch {
    throw new Error(
      "backup structure unsupported or corrupted"
    );
  }
}
