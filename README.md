#[UNDER HEAVY DEVELOPEMENT]

===

# bookstore wishlist manager

minimal bookstore wishlist and printable order management app.

designed for collectors, bookstores, readers, librarians, and bulk ordering workflows.

pure frontend.
no backend.
github pages compatible.

---

## features

### metadata autofetch

supports:

- isbn lookup
- title + author lookup

sources:

- openlibrary api
- google books api fallback

autofills:

- title
- author
- publisher
- isbn13
- publish year
- page count
- format/binding
- cover image

---

## book management

- editable table interface
- inline editing
- quantity support
- reorder books
- priority tagging
- notes field
- duplicate detection
- cover thumbnails

---

## barcode scanner

mobile-friendly isbn barcode scanning using device camera.

powered by:

```txt
html5-qrcode
