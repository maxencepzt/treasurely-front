import { type FormEvent, useState } from 'react';
import { Link } from 'react-router';
import { type SerializedError } from '@reduxjs/toolkit';
import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { useFocusOnViolation } from '../../hooks/useFocusOnViolation';
import type { UserUpdate } from '../../types/api';
import { parseApiError, parseViolations } from '../../utils/api';
import FieldError from './FieldError';
import { inputClasses, invalidProps, submitClasses } from './fields';
import FormFeedback from './FormFeedback';

type PasswordChange = Required<Pick<UserUpdate, 'currentPassword' | 'plainPassword'>>;

type PasswordFormProps = {
  /** Rend vrai une fois le mot de passe changé par le serveur. */
  onSubmit: (change: PasswordChange) => Promise<boolean>;
  isSaving: boolean;
  error?: FetchBaseQueryError | SerializedError;
  /** La page de paramètres, proposée une fois le mot de passe changé. */
  settingsPath: string;
};

const PASSWORD_MIN = 8;

/**
 * Changement de mot de passe : l'actuel, que le serveur exige, puis le nouveau deux fois.
 * La confirmation est contrôlée ici, tout le reste par le serveur.
 */
export default function PasswordForm({ onSubmit, isSaving, error, settingsPath }: PasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [plainPassword, setPlainPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [visible, setVisible] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const violations = parseViolations(error);
  useFocusOnViolation(error);
  const generalError = error && Object.keys(violations).length === 0 ? parseApiError(error).message : null;
  const type = visible ? 'text' : 'password';

  /** Une saisie efface le retour du dernier envoi. */
  function change(setter: (value: string) => void) {
    return (event: { target: { value: string } }) => {
      setter(event.target.value);
      setClientError(null);
      setSaved(false);
    };
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

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

  return (
    <form onSubmit={handleSubmit} method="post" aria-busy={isSaving} className="flex flex-col gap-4">
      <p className="text-base text-gray-700">Saisissez votre mot de passe actuel, puis le nouveau deux fois.</p>

      <label htmlFor="currentPassword" className="flex flex-col gap-1">
        <span className="text-sm font-medium">Mot de passe actuel</span>
        <input
          type={type}
          id="currentPassword"
          name="currentPassword"
          autoComplete="current-password"
          required
          autoFocus
          value={currentPassword}
          onChange={change(setCurrentPassword)}
          className={inputClasses}
          {...invalidProps('currentPassword', violations.currentPassword)}
        />
        <FieldError id="currentPassword" message={violations.currentPassword} />
      </label>

      <label htmlFor="plainPassword" className="flex flex-col gap-1">
        <span className="text-sm font-medium">Nouveau mot de passe</span>
        <input
          type={type}
          id="plainPassword"
          name="plainPassword"
          autoComplete="new-password"
          required
          minLength={PASSWORD_MIN}
          aria-describedby={violations.plainPassword ? 'plainPassword-hint plainPassword-error' : 'plainPassword-hint'}
          aria-invalid={violations.plainPassword ? true : undefined}
          value={plainPassword}
          onChange={change(setPlainPassword)}
          className={inputClasses}
        />
        <span id="plainPassword-hint" className="text-sm text-gray-600">{PASSWORD_MIN} caractères au moins.</span>
        <FieldError id="plainPassword" message={violations.plainPassword} />
      </label>

      <label htmlFor="confirmation" className="flex flex-col gap-1">
        <span className="text-sm font-medium">Confirmation du nouveau mot de passe</span>
        <input
          type={type}
          id="confirmation"
          name="confirmation"
          autoComplete="new-password"
          required
          value={confirmation}
          onChange={change(setConfirmation)}
          className={inputClasses}
        />
      </label>

      <label htmlFor="visible" className="flex items-center gap-3 min-h-11 text-base">
        <input
          type="checkbox"
          id="visible"
          checked={visible}
          onChange={(e) => setVisible(e.target.checked)}
          className="h-5 w-5 accent-green-700"
        />
        <span>Afficher les mots de passe</span>
      </label>

      <FormFeedback success={saved ? 'Mot de passe modifié.' : null} error={clientError ?? generalError}>
        {' '}
        <Link to={settingsPath} className="underline font-medium">Retour aux paramètres</Link>
      </FormFeedback>

      <button type="submit" disabled={isSaving} className={submitClasses}>
        {isSaving ? 'Enregistrement…' : 'Changer le mot de passe'}
      </button>
    </form>
  );
}
