import { useState } from 'react';
import { faCamera, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { BackButton } from '../../components';
import type { QRRiddle } from '../../types/api';

interface QRRiddleViewProps {
  riddle: QRRiddle;
}

export default function QRRiddleView({ riddle }: QRRiddleViewProps) {
  const [scannedCode, setScannedCode] = useState<string>('');

  const handleScan = () => {
    alert('Fonctionnalité de scan QR Code à implémenter avec une bibliothèque comme html5-qrcode');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Code scanné:', scannedCode);
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-orange-50 to-amber-100">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col">
        <div className="p-4">
          <BackButton variant="light" />
        </div>

        <div className="flex-1 px-6 pb-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faQrcode} className="text-orange-600 text-2xl" />
                <h1 className="text-2xl font-bold text-gray-900">QR Code</h1>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg">{"🔥".repeat(riddle.difficulty)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-6 border-2 border-orange-100 shadow-sm mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{riddle.title}</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{riddle.description}</p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 mb-6">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-xl">💡</span>
              <span>Instructions</span>
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Trouvez le QR Code caché à l'emplacement indiqué</li>
              <li>Scannez-le avec votre appareil photo</li>
              <li>Le code sera automatiquement validé</li>
            </ol>
          </div>

          <div className="mb-6">
            <div className="border-2 border-dashed border-orange-200 rounded-2xl p-8 text-center bg-gradient-to-br from-white to-orange-50">
              <FontAwesomeIcon icon={faQrcode} className="text-6xl text-orange-300 mb-4" />
              <button
                type="button"
                onClick={handleScan}
                className="flex items-center justify-center gap-3 mx-auto px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 active:scale-95 transition-all shadow-md"
              >
                <FontAwesomeIcon icon={faCamera} />
                <span>Scanner le QR Code</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2">
                Ou saisissez le code manuellement
              </label>
              <input
                id="code"
                type="text"
                value={scannedCode}
                onChange={(e) => setScannedCode(e.target.value)}
                placeholder="Entrez le code du QR"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={!scannedCode}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all shadow-lg ${
                !scannedCode
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95'
              }`}
            >
              Valider
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


