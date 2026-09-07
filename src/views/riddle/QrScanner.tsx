import { useEffect, useRef, useState } from 'react';

interface QrScannerProps {
  onScan: (value: string) => void;
  onClose: () => void;
}

type Detect = (video: HTMLVideoElement) => Promise<string | null>;

/**
 * L'API Barcode Detection du navigateur quand elle existe (Android, iOS), un décodeur
 * JavaScript sinon : le scan est proposé partout où la caméra l'est.
 */
async function createDetector(): Promise<Detect> {
  if (typeof BarcodeDetector !== 'undefined') {
    const detector = new BarcodeDetector({ formats: ['qr_code'] });
    return async (video) => (await detector.detect(video))[0]?.rawValue ?? null;
  }
  const { default: jsQR } = await import('jsqr');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { willReadFrequently: true });
  return async (video) => {
    if (!context) return null;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    const image = context.getImageData(0, 0, canvas.width, canvas.height);
    return jsQR(image.data, image.width, image.height, { inversionAttempts: 'dontInvert' })?.data ?? null;
  };
}

/**
 * Lit un QR code avec la caméra arrière et remet son contenu brut à l'appelant.
 */
export default function QrScanner({ onScan, onClose }: QrScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let stream: MediaStream | null = null;
    let timer: number | undefined;
    let done = false;
    const detector = createDetector();

    const stop = () => {
      done = true;
      window.clearInterval(timer);
      stream?.getTracks().forEach((track) => track.stop());
    };

    const look = async () => {
      if (done || video.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA) return;
      try {
        const value = await (await detector)(video);
        if (value && !done) {
          stop();
          onScan(value);
        }
      } catch {
        // Une image non exploitable : la suivante fera l'affaire
      }
    };

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((media) => {
        stream = media;
        video.srcObject = media;
        return video.play();
      })
      .then(() => {
        timer = window.setInterval(() => void look(), 300);
      })
      .catch(() => setError("Impossible d'ouvrir la caméra. Autorisez son accès, ou saisissez le code."));

    return stop;
  }, [onScan]);

  return (
    <div className="space-y-3">
      <video ref={videoRef} muted playsInline className="w-full rounded-xl bg-black aspect-square object-cover" />
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button type="button" onClick={onClose} className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-gray-300">
        Fermer la caméra
      </button>
    </div>
  );
}
