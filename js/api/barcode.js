let html5QrCodeInstance = null;

async function loadScannerLibrary() {
  if (window.Html5Qrcode) {
    return;
  }

  await import(
    "https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js"
  );
}

export async function startBarcodeScanner({
  elementId,
  onSuccess,
  onError
}) {
  try {
    await loadScannerLibrary();

    html5QrCodeInstance =
      new Html5Qrcode(elementId);

    await html5QrCodeInstance.start(
      {
        facingMode: "environment"
      },

      {
        fps: 10,
        qrbox: 240
      },

      (decodedText) => {
        onSuccess(decodedText);
      },

      (errorMessage) => {
        onError?.(errorMessage);
      }
    );
  } catch (error) {
    throw new Error(
      "camera initialization failed"
    );
  }
}

export async function stopBarcodeScanner() {
  if (!html5QrCodeInstance) {
    return;
  }

  try {
    await html5QrCodeInstance.stop();

    await html5QrCodeInstance.clear();
  } finally {
    html5QrCodeInstance = null;
  }
}
