const STORAGE_KEY = 'bookstoreWishlistData';

export function loadBooks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

export function saveBooks(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
