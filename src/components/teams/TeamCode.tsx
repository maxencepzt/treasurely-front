import { useState } from 'react';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useTeamCodeQuery } from '../../store/slices/api';
import { inputClasses, secondaryClasses } from '../settings/fields';

/** Le code de jointure, pour les membres : à partager, avec un bouton pour le copier. */
export default function TeamCode({ teamId }: { teamId: number }) {
  const { data, isLoading } = useTeamCodeQuery({ id: teamId });
  const [copied, setCopied] = useState(false);

  if (isLoading || !data) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(data?.code ?? '');
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="team-code" className="flex flex-col gap-1">
        <span className="text-sm font-medium">Code de jointure à partager</span>
        <span className="flex gap-2">
          <input id="team-code" type="text" value={data.code} readOnly className={`${inputClasses} flex-1 font-mono bg-gray-50`} />
          <button type="button" onClick={() => void copy()} className={secondaryClasses} aria-label="Copier le code">
            <FontAwesomeIcon icon={faCopy} aria-hidden="true" />
          </button>
        </span>
      </label>
      <p role="status" className="text-sm text-gray-600">
        {copied ? 'Code copié.' : 'Quiconque le saisit rejoint l\'équipe aussitôt.'}
      </p>
    </div>
  );
}
