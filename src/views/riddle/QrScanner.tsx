import { useEffect, useRef, useState } from 'react';

interface QrScannerProps {
  onScan: (value: string) => void;
  onClose: () => void;
}

export const canScanQrCodes = typeof BarcodeDetector !== 'undefined';

/**
 * Lit un QR code avec la caméra arrière, sans bibliothèque : l'API Barcode Detection du
 * navigateur suffit là où elle existe, et la saisie manuelle reste possible partout.
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
    const detector = new BarcodeDetector({ formats: ['qr_code'] });

    const stop = () => {
      window.clearInterval(timer);
      stream?.getTracks().forEach((track) => track.stop());
    };

    const look = async () => {
      if (done || video.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA) return;
      try {
        const [code] = await detector.detect(video);
        if (code) {
          done = true;
          stop();
          onScan(code.rawValue);
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
