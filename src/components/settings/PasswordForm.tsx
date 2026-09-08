import { type FormEvent, useState } from 'react';
import { type SerializedError } from '@reduxjs/toolkit';
import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';

import type { UserUpdate } from '../../types/api';
import { parseApiError, parseViolations } from '../../utils/api';
import { inputClasses, submitClasses } from './fields';

type PasswordChange = Required<Pick<UserUpdate, 'currentPassword' | 'plainPassword'>>;

type PasswordFormProps = {
  /** Rend vrai une fois le mot de passe changé par le serveur. */
  onSubmit: (change: PasswordChange) => Promise<boolean>;
  isSaving: boolean;
  error?: FetchBaseQueryError | SerializedError;
};

const PASSWORD_MIN = 8;

/**
 * Changement de mot de passe : l'actuel, que le serveur exige, puis le nouveau deux fois.
 * La confirmation est contrôlée ici, tout le reste par le serveur.
 */
export default function PasswordForm({ onSubmit, isSaving, error }: PasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [plainPassword, setPlainPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [clientError, setClientError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const violations = parseViolations(error);
  const generalError = error && Object.keys(violations).length === 0 ? parseApiError(error).message : null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setClientError(null);
    setSaved(false);

    if (plainPassword !== confirmation) {
      setClientError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    if (await onSubmit({ currentPassword, plainPassword })) {
      setSaved(true);
      setCurrentPassword('');
      setPlainPassword('');
      setConfirmation('');
    }
  }

  const fieldError = (name: string) =>
    violations[name] && <span className="text-xs text-red-600">{violations[name]}</span>;

  return (
    <form onSubmit={handleSubmit} method="post" className="flex flex-col gap-4">
      <p className="text-sm text-gray-600">Saisissez votre mot de passe actuel, puis le nouveau deux fois.</p>

      {saved && (
        <div role="status" className="px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
          Mot de passe modifié.
        </div>
      )}
      {(clientError || generalError) && (
        <div role="alert" className="text-red-600 text-sm">{clientError ?? generalError}</div>
      )}

      <label htmlFor="currentPassword" className="flex flex-col gap-1">
        <span className="text-sm font-medium">Mot de passe actuel</span>
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          autoComplete="current-password"
          required
          autoFocus
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className={inputClasses}
        />
        {fieldError('currentPassword')}
      </label>

      <label htmlFor="plainPassword" className="flex flex-col gap-1">
        <span className="text-sm font-medium">Nouveau mot de passe</span>
        <input
          type="password"
          id="plainPassword"
          name="plainPassword"
          autoComplete="new-password"
          required
          minLength={PASSWORD_MIN}
          placeholder={`${PASSWORD_MIN} caractères minimum`}
          value={plainPassword}
          onChange={(e) => setPlainPassword(e.target.value)}
          className={inputClasses}
        />
        {fieldError('plainPassword')}
      </label>

      <label htmlFor="confirmation" className="flex flex-col gap-1">
        <span className="text-sm font-medium">Confirmation</span>
        <input
          type="password"
          id="confirmation"
          name="confirmation"
          autoComplete="new-password"
          required
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          className={inputClasses}
        />
      </label>

      <button type="submit" disabled={isSaving} className={submitClasses}>
        {isSaving ? 'Enregistrement...' : 'Changer le mot de passe'}
      </button>
    </form>
  );
}
