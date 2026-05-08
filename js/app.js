import { fetchBookData } from './api.js';
import { loadBooks, saveBooks } from './storage.js';
import { renderBooks } from './ui.js';
import { BarcodeScanner } from './scanner.js';
import { exportCSV, exportJSON } from './export.js';
import {
  generateId,
  sanitize,
  detectDuplicates,
  sortBooks,
} from './utils.js';

const isbnInput = document.getElementById('isbnInput');
const titleInput = document.getElementById('titleInput');
const authorInput = document.getElementById('authorInput');
const addBookBtn = document.getElementById('addBookBtn');

const tableBody = document.getElementById('bookTableBody');

const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');

const exportCsvBtn = document.getElementById('exportCsvBtn');
const exportJsonBtn = document.getElementById('exportJsonBtn');

const importJsonBtn = document.getElementById('importJsonBtn');
const jsonFileInput = document.getElementById('jsonFileInput');

const printBtn = document.getElementById('printBtn');
const themeToggle = document.getElementById('themeToggle');

const scanBtn = document.getElementById('scanBtn');
const scannerPanel = document.getElementById('scannerPanel');
const closeScannerBtn = document.getElementById('closeScannerBtn');

let books = loadBooks();

function refreshUI() {
  const query = searchInput.value.toLowerCase();

  const sorted = sortBooks(books, sortSelect.value);

  const filtered = sorted.filter(book => {
    return Object.values(book)
      .join(' ')
      .toLowerCase()
      .includes(query);
  });

  renderBooks({
    books: filtered,
    tableBody,
    onDelete: deleteBook,
    onUpdate: updateBook,
    onMove: moveBook,
  });

  saveBooks(books);
}

async function addBook() {
  const isbn = sanitize(isbnInput.value);
  const title = sanitize(titleInput.value);
  const author = sanitize(authorInput.value);

  if (!isbn && !title) {
    alert('enter isbn or title');
    return;
  }

  const data = await fetchBookData({
    isbn,
    title,
    author,
  });

  if (!data) {
    alert('book not found');
    return;
  }

  if (detectDuplicates(books, data.isbn13)) {
    alert('duplicate detected');
    return;
  }

  books.unshift({
    id: generateId(),
    ...data,
    quantity: 1,
    priority: 2,
    notes: '',
  });

  isbnInput.value = '';
  titleInput.value = '';
  authorInput.value = '';

  refreshUI();
}

function deleteBook(id) {
  books = books.filter(book => book.id !== id);
  refreshUI();
}

function updateBook(id, field, value) {
  const book = books.find(book => book.id === id);

  if (!book) return;

  book[field] = value;

  refreshUI();
}

function moveBook(index, direction) {
  const target = index + direction;

  if (target < 0 || target >= books.length) return;

  [books[index], books[target]] = [books[target], books[index]];

  refreshUI();
}

function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';

  document.documentElement.dataset.theme = saved;
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme;

  const next = current === 'dark'
    ? 'light'
    : 'dark';

  document.documentElement.dataset.theme = next;

  localStorage.setItem('theme', next);
}

const scanner = new BarcodeScanner({
  containerId: 'scannerReader',

  onDetected: async (code) => {
    isbnInput.value = code;

    scannerPanel.classList.add('hidden');

    await addBook();
  },
});

scanBtn.addEventListener('click', async () => {
  scannerPanel.classList.remove('hidden');

  await scanner.start();
});

closeScannerBtn.addEventListener('click', async () => {
  scannerPanel.classList.add('hidden');

  await scanner.stop();
});

addBookBtn.addEventListener('click', addBook);

searchInput.addEventListener('input', refreshUI);

sortSelect.addEventListener('change', refreshUI);

exportCsvBtn.addEventListener('click', () => {
  exportCSV(books);
});

exportJsonBtn.addEventListener('click', () => {
  exportJSON(books);
});

printBtn.addEventListener('click', () => {
  window.print();
});

themeToggle.addEventListener('click', toggleTheme);

importJsonBtn.addEventListener('click', () => {
  jsonFileInput.click();
});

jsonFileInput.addEventListener('change', event => {
  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    books = JSON.parse(reader.result);

    refreshUI();
  };

  reader.readAsText(file);
});

initTheme();

refreshUI();
