import { type FormEvent, useState } from 'react';
import { type SerializedError } from '@reduxjs/toolkit';
import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { useFocusOnViolation } from '../../hooks/useFocusOnViolation';
import type { User, UserUpdate } from '../../types/api';
import { parseApiError, parseViolations } from '../../utils/api';
import { GENDER_LABELS, toDateInputValue } from '../../utils/user';
import FieldError from './FieldError';
import { inputClasses, invalidProps, submitClasses } from './fields';
import FormFeedback from './FormFeedback';

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

/** Ce qui diffère du profil connu du serveur : le corps du merge-patch. */
function changesOf(values: Values, user: User): UserUpdate {
  const initial = valuesOf(user);
  const update: UserUpdate = {};
  for (const key of Object.keys(values) as (keyof Values)[]) {
    if (values[key] !== initial[key]) Object.assign(update, { [key]: values[key] });
  }

  return update;
}

/**
 * Formulaire des informations du compte. Il n'envoie que ce qui a changé (merge-patch) et
 * son bouton reste inactif tant que rien n'a changé. Le mot de passe a sa propre page ;
 * le pseudo reste en lecture seule : il identifie le jeton, le changer déconnecterait.
 */
export default function AccountForm({ user, onSubmit, isSaving, error }: AccountFormProps) {
  const [values, setValues] = useState<Values>(() => valuesOf(user));
  const [saved, setSaved] = useState(false);

  const violations = parseViolations(error);
  useFocusOnViolation(error);
  const generalError = error && Object.keys(violations).length === 0 ? parseApiError(error).message : null;
  const update = changesOf(values, user);
  const dirty = Object.keys(update).length > 0;

  function setValue<K extends keyof Values>(key: K, value: Values[K]) {
    setSaved(false);
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    // Les valeurs saisies deviennent celles du serveur : elles restent en place
    if (await onSubmit(update)) setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} method="post" aria-busy={isSaving} className="flex flex-col gap-4">
      <label htmlFor="nickname" className="flex flex-col gap-1">
        <span className="text-sm font-medium">Pseudo</span>
        <input
          type="text"
          id="nickname"
          name="nickname"
          value={user.nickname}
          readOnly
          aria-describedby="nickname-note"
          className={`${inputClasses} bg-gray-50 text-gray-700`}
        />
        <span id="nickname-note" className="text-sm text-gray-600">
          Le pseudo sert à la connexion et ne peut pas être changé ici.
        </span>
      </label>

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
          {...invalidProps('phone', violations.phone)}
        />
        <FieldError id="phone" message={violations.phone} />
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
          {...invalidProps('birthDate', violations.birthDate)}
        />
        <FieldError id="birthDate" message={violations.birthDate} />
      </label>

      <label htmlFor="gender" className="flex flex-col gap-1">
        <span className="text-sm font-medium">Genre</span>
        <select
          id="gender"
          name="gender"
          value={values.gender}
          onChange={(e) => setValue('gender', e.target.value as User['gender'])}
          className={`${inputClasses} bg-white`}
          {...invalidProps('gender', violations.gender)}
        >
          {Object.entries(GENDER_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <FieldError id="gender" message={violations.gender} />
      </label>

      <label htmlFor="public" className="flex items-center gap-3 min-h-11 text-base">
        <input
          type="checkbox"
          id="public"
          name="public"
          checked={values.public}
          onChange={(e) => setValue('public', e.target.checked)}
          className="h-5 w-5 accent-green-700"
        />
        <span className="flex flex-col">
          <span className="font-medium">Profil public</span>
          <span className="text-sm text-gray-600">Visible par les autres joueurs</span>
        </span>
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
          aria-invalid={violations.description ? true : undefined}
          aria-describedby={violations.description ? 'description-count description-error' : 'description-count'}
        />
        <span id="description-count" className="text-sm text-gray-600 self-end">
          {values.description.length}/{DESCRIPTION_MAX} caractères
        </span>
        <FieldError id="description" message={violations.description} />
      </label>

      <FormFeedback success={saved ? 'Profil enregistré.' : null} error={generalError} />

      <button type="submit" disabled={isSaving || !dirty} className={submitClasses}>
        {isSaving ? 'Enregistrement…' : 'Enregistrer'}
      </button>
    </form>
  );
}
