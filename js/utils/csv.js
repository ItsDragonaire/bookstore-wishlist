const DEFAULT_FIELDS = [
  {
    key: "title",
    label: "Title"
  },

  {
    key: "authors",
    label: "Authors"
  },

  {
    key: "publisher",
    label: "Publisher"
  },

  {
    key: "publishYear",
    label: "Publish Year"
  },

  {
    key: "isbn13",
    label: "ISBN13"
  },

  {
    key: "quantity",
    label: "Quantity"
  },

  {
    key: "priority",
    label: "Priority"
  },

  {
    key: "status",
    label: "Status"
  },

  {
    key: "notes",
    label: "Notes"
  }
];

function normalizeValue(
  value
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return String(value);
}

function escapeCell(value) {
  const normalized =
    normalizeValue(value)
      .replaceAll('"', '""')
      .trim();

  return `"${normalized}"`;
}

function buildHeader(fields) {
  return fields
    .map((field) =>
      escapeCell(field.label)
    )
    .join(",");
}

function buildRow(
  book,
  fields
) {
  return fields
    .map((field) =>
      escapeCell(
        book[field.key]
      )
    )
    .join(",");
}

function buildCsvContent({
  books,
  fields
}) {
  const rows = [
    buildHeader(fields),

    ...books.map((book) =>
      buildRow(
        book,
        fields
      )
    )
  ];

  return rows.join("\n");
}

function downloadFile({
  content,
  filename,
  mimeType
}) {
  let blob;
  
  try {
    blob = new Blob(
      [content],
      {
        type: mimeType
      }
    );
  } catch (error) {
    console.error(
      "csv export failed",
      error
    );
  
    throw new Error(
      "unable to generate csv export"
    );
  }

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

export function exportBooksCsv({
  books,
  fields = DEFAULT_FIELDS,
  filename = "bookstore-order.csv"
}) {
  const csv =
    buildCsvContent({
      books,
      fields
    });

  downloadFile({
    content: csv,
    filename,
    mimeType:
      "text/csv;charset=utf-8"
  });
}

export function getDefaultCsvFields() {
  return structuredClone(
    DEFAULT_FIELDS
  );
}
