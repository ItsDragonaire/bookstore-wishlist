import {
  startBarcodeScanner,
  stopBarcodeScanner
} from "../../api/barcode.js";

import { fetchBookMetadataByISBN } from "../../api/metadata.js";

import { notify } from "./notifications.js";

export function createScanner({
  onDetected
}) {
  const wrapper =
    document.createElement("section");

  wrapper.className = "form-grid";

  wrapper.innerHTML = `
    <div
      id="scanner-region"
      style="
        width: 100%;
        overflow: hidden;
        border-radius: 1rem;
      "
    ></div>

    <p class="text-muted">
      point your camera at an isbn barcode
    </p>
  `;

  startBarcodeScanner({
    elementId: "scanner-region",

    async onSuccess(code) {
      try {
        const metadata =
          await fetchBookMetadataByISBN(
            code
          );

        notify({
          title: "book detected",
          text:
            metadata.title || code
        });

        await stopBarcodeScanner();

        onDetected(metadata);
      } catch {
        notify({
          title: "metadata unavailable",
          text:
            "isbn detected but no metadata found"
        });
      }
    },

    onError() {}
  }).catch(() => {
    notify({
      title: "camera unavailable",
      text:
        "allow camera access to scan barcodes"
    });
  });

  return wrapper;
}
