/**
 * API Barcode Detection, absente des types du DOM. Détectée à l'exécution : les navigateurs
 * qui ne l'ont pas gardent la saisie manuelle du code.
 * @see https://developer.mozilla.org/docs/Web/API/BarcodeDetector
 */
interface DetectedBarcode {
  rawValue: string;
  format: string;
}

declare class BarcodeDetector {
  constructor(options?: { formats: string[] });
  static getSupportedFormats(): Promise<string[]>;
  detect(source: ImageBitmapSource): Promise<DetectedBarcode[]>;
}
