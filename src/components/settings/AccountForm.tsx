import { type FormEvent, useState } from 'react';
import { type SerializedError } from '@reduxjs/toolkit';
import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';

import type { User, UserUpdate } from '../../types/api';
import { parseApiError, parseViolations } from '../../utils/api';
import { GENDER_LABELS, toDateInputValue } from '../../utils/user';
import { inputClasses, submitClasses } from './fields';

type AccountFormProps = {
  user: User;
  /** Rend vrai une fois la mise à jour enregistrée par le serveur. */
  onSubmit: (update: UserUpdate) => Promise<boolean>;
  isSaving: boolean;
  error?: FetchBaseQueryError | SerializedError;
};

type Values = Required<Omit<UserUpdate, 'plainPassword' | 'currentPassword'>>;

const DESCRIPTION_MAX = 150;

/** Les champs éditables, tels que le serveur les connaît. */
function valuesOf(user: User): Values {
  return {
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phone: user.phone,
    birthDate: toDateInputValue(user.birthDate),
    gender: user.gender,
    public: user.public,
    description: user.description ?? '',
  };
}

/**
 * Formulaire des informations du compte. Il n'envoie que ce qui a changé (merge-patch).
 * Le mot de passe a sa propre page ; le pseudo reste en lecture seule : il identifie le
 * jeton, le changer déconnecterait.
 */
export default function AccountForm({ user, onSubmit, isSaving, error }: AccountFormProps) {
  const [values, setValues] = useState<Values>(() => valuesOf(user));
  const [clientError, setClientError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const violations = parseViolations(error);
  const generalError = error && Object.keys(violations).length === 0 ? parseApiError(error).message : null;

  function setValue<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setClientError(null);
    setSaved(false);

    const initial = valuesOf(user);
    const update: UserUpdate = {};
    for (const key of Object.keys(values) as (keyof Values)[]) {
      if (values[key] !== initial[key]) Object.assign(update, { [key]: values[key] });
    }

    if (Object.keys(update).length === 0) {
      setClientError('Aucune modification à enregistrer.');
      return;
    }

    // Les valeurs saisies sont désormais celles du serveur : elles restent en place
    if (await onSubmit(update)) setSaved(true);
  }

  const fieldError = (name: string) =>
    violations[name] && <span className="text-xs text-red-600">{violations[name]}</span>;

  return (
    <form onSubmit={handleSubmit} method="post" className="flex flex-col gap-4">
      {saved && (
        <div role="status" className="px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
          Profil enregistré.
        </div>
      )}
      {(clientError || generalError) && (
        <div role="alert" className="text-red-600 text-sm">{clientError ?? generalError}</div>
      )}

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">Pseudo</span>
        <input type="text" value={user.nickname} readOnly disabled className={`${inputClasses} bg-gray-100 text-gray-500`} />
        <span className="text-xs text-gray-500">Le pseudo sert à la connexion et ne peut pas être changé ici.</span>
      </div>

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
        />
        {fieldError('firstname')}
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
        />
        {fieldError('lastname')}
      </label>

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
        />
        {fieldError('email')}
      </label>

      <label htmlFor="phone" className="flex flex-col gap-1">
        <span className="text-sm font-medium">Téléphone</span>
        <input
          type="tel"
          id="phone"
          name="phone"
          autoComplete="tel"
          maxLength={12}
          value={values.phone}
          onChange={(e) => setValue('phone', e.target.value)}
          className={inputClasses}
        />
        {fieldError('phone')}
      </label>

      <label htmlFor="birthDate" className="flex flex-col gap-1">
        <span className="text-sm font-medium">Date de naissance</span>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          autoComplete="bday"
          required
          max={toDateInputValue(new Date().toISOString())}
          value={values.birthDate}
          onChange={(e) => setValue('birthDate', e.target.value)}
          className={inputClasses}
        />
        {fieldError('birthDate')}
      </label>

      <label htmlFor="gender" className="flex flex-col gap-1">
        <span className="text-sm font-medium">Genre</span>
        <select
          id="gender"
          name="gender"
          value={values.gender}
          onChange={(e) => setValue('gender', e.target.value as User['gender'])}
          className={`${inputClasses} bg-white`}
        >
          {Object.entries(GENDER_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        {fieldError('gender')}
      </label>

      <label htmlFor="public" className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          id="public"
          name="public"
          checked={values.public}
          onChange={(e) => setValue('public', e.target.checked)}
          className="h-4 w-4 accent-green-700"
        />
        <span className="font-medium">Profil public</span>
        <span className="text-gray-500">(visible par les autres joueurs)</span>
      </label>

      <label htmlFor="description" className="flex flex-col gap-1">
        <span className="text-sm font-medium">Description</span>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={DESCRIPTION_MAX}
          value={values.description}
          onChange={(e) => setValue('description', e.target.value)}
          className={inputClasses}
        />
        <span className="text-xs text-gray-500 self-end">{values.description.length}/{DESCRIPTION_MAX}</span>
        {fieldError('description')}
      </label>

      <button
        type="submit"
        disabled={isSaving}
        className={submitClasses}
      >
        {isSaving ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </form>
  );
}
