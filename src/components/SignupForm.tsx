import { type FormEvent, useState } from 'react';
import { Link } from 'react-router';
import { type SerializedError } from '@reduxjs/toolkit';
import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { useFocusOnViolation } from '../hooks/useFocusOnViolation';
import type { User, UserRegistration } from '../types/api';
import { parseApiError, parseViolations } from '../utils/api';
import { GENDER_LABELS } from '../utils/user';
import FieldError from './settings/FieldError';
import { inputClasses, invalidProps, submitClasses } from './settings/fields';
import FormFeedback from './settings/FormFeedback';

type SignupFormProps = {
  onSubmit: (registration: UserRegistration) => Promise<void>;
  isSaving: boolean;
  error?: FetchBaseQueryError | SerializedError;
};

type Values = Omit<UserRegistration, 'gender'> & { gender: User['gender'] | '' };

const PASSWORD_MIN = 8;
const NICKNAME_MIN = 3;

const empty: Values = { nickname: '', firstname: '', lastname: '', email: '', phone: '', birthDate: '', gender: '', plainPassword: '' };

/**
 * Le formulaire d'inscription : ce que le serveur exige pour créer un compte, dans l'ordre où
 * on le demande à quelqu'un. La confirmation du mot de passe est contrôlée ici, tout le reste
 * par le serveur, qui renvoie une violation par champ.
 */
export default function SignupForm({ onSubmit, isSaving, error }: SignupFormProps) {
  const [values, setValues] = useState<Values>(empty);
  const [confirmation, setConfirmation] = useState('');
  const [visible, setVisible] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  const violations = parseViolations(error);
  useFocusOnViolation(error);
  const generalError = clientError ?? (error && Object.keys(violations).length === 0 ? parseApiError(error).message : null);
  const today = new Date().toISOString().slice(0, 10);
  const passwordType = visible ? 'text' : 'password';

  function setValue<K extends keyof Values>(key: K, value: Values[K]) {
    setClientError(null);
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (values.plainPassword !== confirmation) {
      setClientError('Les deux mots de passe ne correspondent pas.');
      return;
    }
    if (values.gender === '') return; // `required` sur le select l'empêche déjà
    await onSubmit({ ...values, gender: values.gender });
  }

  return (
    <form onSubmit={handleSubmit} method="post" aria-busy={isSaving} className="flex flex-col gap-4">
      <label htmlFor="nickname" className="flex flex-col gap-1">
        <span className="text-sm font-medium">Pseudo</span>
        <input
          type="text"
          id="nickname"
          name="nickname"
          autoComplete="username"
          required
          autoFocus
          minLength={NICKNAME_MIN}
          maxLength={50}
          aria-describedby={violations.nickname ? 'nickname-hint nickname-error' : 'nickname-hint'}
          aria-invalid={violations.nickname ? true : undefined}
          value={values.nickname}
          onChange={(e) => setValue('nickname', e.target.value.replaceAll(' ', ''))}
          className={inputClasses}
        />
        <span id="nickname-hint" className="text-sm text-gray-600">C'est lui qui vous identifie en jeu, sans espace. Il ne pourra pas changer.</span>
        <FieldError id="nickname" message={violations.nickname} />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label htmlFor="firstname" className="flex flex-col gap-1">
          <span className="text-sm font-medium">Prénom</span>
          <input
            type="text"
            id="firstname"
            name="firstname"
            autoComplete="given-name"
            required
            maxLength={100}
            value={values.firstname}
            onChange={(e) => setValue('firstname', e.target.value)}
            className={inputClasses}
            {...invalidProps('firstname', violations.firstname)}
          />
          <FieldError id="firstname" message={violations.firstname} />
        </label>

        <label htmlFor="lastname" className="flex flex-col gap-1">
          <span className="text-sm font-medium">Nom</span>
          <input
            type="text"
            id="lastname"
            name="lastname"
            autoComplete="family-name"
            required
            maxLength={100}
            value={values.lastname}
            onChange={(e) => setValue('lastname', e.target.value)}
            className={inputClasses}
            {...invalidProps('lastname', violations.lastname)}
          />
          <FieldError id="lastname" message={violations.lastname} />
        </label>
      </div>

      <label htmlFor="email" className="flex flex-col gap-1">
        <span className="text-sm font-medium">Adresse email</span>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          required
          maxLength={50}
          value={values.email}
          onChange={(e) => setValue('email', e.target.value)}
          className={inputClasses}
          {...invalidProps('email', violations.email)}
        />
        <FieldError id="email" message={violations.email} />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label htmlFor="birthDate" className="flex flex-col gap-1">
          <span className="text-sm font-medium">Date de naissance</span>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            autoComplete="bday"
            required
            max={today}
            value={values.birthDate}
            onChange={(e) => setValue('birthDate', e.target.value)}
            className={inputClasses}
            {...invalidProps('birthDate', violations.birthDate)}
          />
          <FieldError id="birthDate" message={violations.birthDate} />
        </label>

        <label htmlFor="gender" className="flex flex-col gap-1">
          <span className="text-sm font-medium">Genre</span>
          <select
            id="gender"
            name="gender"
            required
            value={values.gender}
            onChange={(e) => setValue('gender', e.target.value as Values['gender'])}
            className={`${inputClasses} bg-white`}
            {...invalidProps('gender', violations.gender)}
          >
            <option value="" disabled>Choisir</option>
            {Object.entries(GENDER_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <FieldError id="gender" message={violations.gender} />
        </label>
      </div>

      <label htmlFor="phone" className="flex flex-col gap-1">
        <span className="text-sm font-medium">Téléphone <span className="font-normal text-gray-600">(facultatif)</span></span>
        <input
          type="tel"
          id="phone"
          name="phone"
          autoComplete="tel"
          maxLength={12}
          value={values.phone}
          onChange={(e) => setValue('phone', e.target.value)}
          className={inputClasses}
          {...invalidProps('phone', violations.phone)}
        />
        <FieldError id="phone" message={violations.phone} />
      </label>

      <label htmlFor="plainPassword" className="flex flex-col gap-1">
        <span className="text-sm font-medium">Mot de passe</span>
        <input
          type={passwordType}
          id="plainPassword"
          name="plainPassword"
          autoComplete="new-password"
          required
          minLength={PASSWORD_MIN}
          aria-describedby={violations.plainPassword ? 'plainPassword-hint plainPassword-error' : 'plainPassword-hint'}
          aria-invalid={violations.plainPassword ? true : undefined}
          value={values.plainPassword}
          onChange={(e) => setValue('plainPassword', e.target.value)}
          className={inputClasses}
        />
        <span id="plainPassword-hint" className="text-sm text-gray-600">{PASSWORD_MIN} caractères au moins.</span>
        <FieldError id="plainPassword" message={violations.plainPassword} />
      </label>

      <label htmlFor="confirmation" className="flex flex-col gap-1">
        <span className="text-sm font-medium">Confirmation du mot de passe</span>
        <input
          type={passwordType}
          id="confirmation"
          name="confirmation"
          autoComplete="new-password"
          required
          value={confirmation}
          onChange={(e) => { setConfirmation(e.target.value); setClientError(null); }}
          className={inputClasses}
        />
      </label>

      <label htmlFor="visible" className="flex items-center gap-3 min-h-11 text-base">
        <input type="checkbox" id="visible" checked={visible} onChange={(e) => setVisible(e.target.checked)} className="h-5 w-5 accent-green-700" />
        <span>Afficher les mots de passe</span>
      </label>

      <FormFeedback error={generalError} />

      <button type="submit" disabled={isSaving} className={submitClasses}>
        {isSaving ? 'Création du compte…' : 'Créer mon compte'}
      </button>

      <p className="text-base text-gray-700 text-center">
        Déjà un compte ? <Link to="/login" className="font-medium text-green-800 underline underline-offset-4">Se connecter</Link>
      </p>
    </form>
  );
}
