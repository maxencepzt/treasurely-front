import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { AnyRiddleAPI, MCQRiddleAPI, RiddleAttempt } from '../../types/api';

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
      return (
        <ProposalForm
          label="Contenu du QR code"
          placeholder="Saisissez le code lu sur le QR code"
          disabled={disabled}
          onSubmit={onSubmit}
        />
      );
    case 'text':
      return <ProposalForm label="Votre réponse" placeholder="Saisissez votre réponse" disabled={disabled} onSubmit={onSubmit} />;
  }
}

function ProposalForm({
  label,
  placeholder,
  disabled,
  onSubmit,
}: {
  label: string;
  placeholder: string;
  disabled: boolean;
  onSubmit: (attempt: RiddleAttempt) => void;
}) {
  // Un QR code peut encoder l'adresse de cette page avec `?code=` : le code est alors prérempli.
  const [searchParams] = useSearchParams();
  const [proposal, setProposal] = useState(searchParams.get('code') ?? '');

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ proposal: proposal.trim() });
      }}
    >
      <label htmlFor="proposal" className="block text-base font-semibold text-gray-900">
        {label}
      </label>
      <input
        id="proposal"
        type="text"
        value={proposal}
        maxLength={100}
        autoComplete="off"
        placeholder={placeholder}
        onChange={(event) => setProposal(event.target.value)}
        className={inputClasses}
      />
      <button type="submit" disabled={disabled || proposal.trim() === ''} className={submitClasses}>
        Valider
      </button>
    </form>
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
