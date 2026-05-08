export const APP_CONFIG = {
  storageKey: "bookstoreWishlist.v1",

  debounceMs: 420,

  metadata: {
    openLibraryBase:
      "https://openlibrary.org",

    googleBooksBase:
      "https://www.googleapis.com/books/v1",

    requestTimeout: 12000
  },

  barcode: {
    fps: 10,
    qrbox: 220,
    aspectRatio: 1.4
  }
};
