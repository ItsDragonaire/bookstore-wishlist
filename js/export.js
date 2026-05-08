export function exportCSV(books) {
  const headers = [
    'title',
    'author',
    'publisher',
    'isbn13',
    'publishYear',
    'pages',
    'format',
    'quantity',
    'priority',
    'notes'
  ];

  const rows = books.map(
