export class BarcodeScanner {
  constructor({
    containerId,
    onDetected,
  }) {
    this.containerId = containerId;
    this.onDetected = onDetected;
    this.scanner = null;
  }

  async start() {
    this.scanner = new Html5Qrcode(
      this.containerId
    );

    await this.scanner.start(
      { facingMode: 'environment' },

      {
        fps: 10,
        qrbox: 250,
      },

      decodedText => {
        this.onDetected(decodedText);

        this.stop();
      }
    );
  }

  async stop() {
    if (!this.scanner) return;

    await this.scanner.stop();

    await this.scanner.clear();
  }
}
