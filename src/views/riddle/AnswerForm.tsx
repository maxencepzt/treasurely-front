import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router';
import { faCamera, faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { AnyRiddleAPI, MCQRiddleAPI, RiddleAttempt } from '../../types/api';
import QrScanner from './QrScanner';

interface AnswerFormProps {
  riddle: AnyRiddleAPI;
  disabled: boolean;
  onSubmit: (attempt: RiddleAttempt) => void;
}

const inputClasses =
  'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all';
const submitClasses =
  'w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all shadow-lg bg-green-600 text-white hover:bg-green-700 active:scale-95 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed';

/**
 * Formulaire de réponse, un par type d'énigme. Il ne juge rien : il met la proposition
 * en forme pour le serveur, seul à connaître la solution.
 */
export default function AnswerForm({ riddle, disabled, onSubmit }: AnswerFormProps) {
  switch (riddle.type) {
    case 'mcq':
      return <ChoicesForm riddle={riddle} disabled={disabled} onSubmit={onSubmit} />;
    case 'gps':
      return <PositionForm disabled={disabled} onSubmit={onSubmit} />;
    case 'qr':
      return <QrCodeForm disabled={disabled} onSubmit={onSubmit} />;
    case 'text':
      return <TextForm disabled={disabled} onSubmit={onSubmit} />;
  }
}

/** La caméra n'est accessible qu'en contexte sécurisé : https, ou localhost en développement. */
const canScanQrCodes = typeof navigator !== 'undefined' && typeof navigator.mediaDevices?.getUserMedia === 'function';

/** Préfixe commun à tous les codes QR de l'application : le joueur ne saisit que les chiffres. */
const QR_PREFIX = 'treasurely_';
const QR_DIGITS = 9;

/**
 * Les chiffres du code, quelle que soit la forme lue : le code brut, ou l'adresse de cette
 * page suivie de `?code=`, celle que l'appareil photo du téléphone ouvre directement.
 */
function digitsFrom(scanned: string): string {
  let value = scanned;
  try {
    value = new URL(scanned).searchParams.get('code') ?? scanned;
  } catch {
    // Pas une adresse : le contenu est le code lui-même
  }
  return (value.startsWith(QR_PREFIX) ? value.slice(QR_PREFIX.length) : value).replace(/\D/g, '').slice(0, QR_DIGITS);
}

function TextForm({ disabled, onSubmit }: { disabled: boolean; onSubmit: (attempt: RiddleAttempt) => void }) {
  const [proposal, setProposal] = useState('');

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ proposal: proposal.trim() });
      }}
    >
      <label htmlFor="proposal" className="block text-base font-semibold text-gray-900">
        Votre réponse
      </label>
      <input
        id="proposal"
        type="text"
        value={proposal}
        maxLength={100}
        autoComplete="off"
        placeholder="Saisissez votre réponse"
        onChange={(event) => setProposal(event.target.value)}
        className={inputClasses}
      />
      <button type="submit" disabled={disabled || proposal.trim() === ''} className={submitClasses}>
        Valider
      </button>
    </form>
  );
}

/**
 * Deux façons d'entrer le même code : le scanner, ou taper ses chiffres derrière le préfixe
 * affiché d'office. Le préfixe dit au joueur qu'il tient bien un code de l'application.
 */
function QrCodeForm({ disabled, onSubmit }: { disabled: boolean; onSubmit: (attempt: RiddleAttempt) => void }) {
  const [searchParams] = useSearchParams();
  const [digits, setDigits] = useState(() => digitsFrom(searchParams.get('code') ?? ''));
  const [scanning, setScanning] = useState(false);
  const onScan = useCallback((value: string) => {
    setDigits(digitsFrom(value));
    setScanning(false);
  }, []);

  return (
    <div className="space-y-4">
      {scanning ? (
        <QrScanner onScan={onScan} onClose={() => setScanning(false)} />
      ) : (
        canScanQrCodes && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => setScanning(true)}
            className="w-full py-3 rounded-xl border-2 border-green-600 text-green-700 font-semibold hover:bg-green-50 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faCamera} className="mr-2" />
            Scanner le QR code
          </button>
        )
      )}
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit({ proposal: QR_PREFIX + digits });
        }}
      >
        <label htmlFor="qr-digits" className="block text-base font-semibold text-gray-900">
          {canScanQrCodes ? 'Ou saisissez les chiffres du code' : 'Chiffres du code'}
        </label>
        <div className="flex items-stretch rounded-xl border-2 border-gray-200 overflow-hidden focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500">
          <span className="px-3 py-3 bg-gray-100 text-gray-600 font-mono select-none" aria-hidden="true">
            {QR_PREFIX}
          </span>
          <input
            id="qr-digits"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={QR_DIGITS}
            autoComplete="off"
            placeholder="123456789"
            value={digits}
            onChange={(event) => setDigits(digitsFrom(event.target.value))}
            className="flex-1 min-w-0 px-3 py-3 font-mono focus:outline-none"
          />
        </div>
        <button type="submit" disabled={disabled || digits === ''} className={submitClasses}>
          Valider
        </button>
      </form>
    </div>
  );
}

function ChoicesForm({
  riddle,
  disabled,
  onSubmit,
}: {
  riddle: MCQRiddleAPI;
  disabled: boolean;
  onSubmit: (attempt: RiddleAttempt) => void;
}) {
  const [choices, setChoices] = useState<string[]>([]);
  const single = riddle.expectedAnswerCount === 1;

  const toggle = (choice: string) => {
    if (single) {
      setChoices([choice]);
      return;
    }
    setChoices((current) => (current.includes(choice) ? current.filter((c) => c !== choice) : [...current, choice]));
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ choices });
      }}
    >
      <p className="text-base font-semibold text-gray-900">
        {riddle.expectedAnswerCount === undefined
          ? 'Cochez la ou les bonnes réponses'
          : single
            ? 'Choisissez la bonne réponse'
            : `Cochez les ${riddle.expectedAnswerCount} bonnes réponses`}
      </p>
      <div className="space-y-3">
        {riddle.choices.map((choice) => (
          <label
            key={choice}
            className={`flex items-center p-4 rounded-xl cursor-pointer transition-all border-2 ${
              choices.includes(choice) ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-green-200'
            }`}
          >
            <input
              type={single ? 'radio' : 'checkbox'}
              name="choice"
              checked={choices.includes(choice)}
              onChange={() => toggle(choice)}
              className="w-5 h-5 accent-green-600"
            />
            <span className="ml-3 text-gray-900 font-medium">{choice}</span>
          </label>
        ))}
      </div>
      <button type="submit" disabled={disabled || choices.length === 0} className={submitClasses}>
        Valider
      </button>
    </form>
  );
}

function PositionForm({ disabled, onSubmit }: { disabled: boolean; onSubmit: (attempt: RiddleAttempt) => void }) {
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const locate = () => {
    if (!('geolocation' in navigator)) {
      setLocationError("La géolocalisation n'est pas disponible sur cet appareil.");
      return;
    }
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        onSubmit({ latitude: coords.latitude, longitude: coords.longitude });
      },
      () => {
        setLocating(false);
        setLocationError('Impossible de vous localiser. Autorisez la géolocalisation, puis réessayez.');
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-base font-semibold text-gray-900">Rendez-vous sur place, puis validez votre position.</p>
      <p className="text-sm text-gray-600">Votre position est acceptée à 50 mètres près.</p>
      {locationError && <p className="text-sm text-red-700">{locationError}</p>}
      <button type="button" disabled={disabled || locating} onClick={locate} className={submitClasses}>
        <FontAwesomeIcon icon={faLocationCrosshairs} className="mr-2" />
        {locating ? 'Localisation...' : 'Je suis sur place'}
      </button>
    </div>
  );
}
