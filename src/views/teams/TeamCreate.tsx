import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';

import FieldError from '../../components/settings/FieldError';
import { inputClasses, invalidProps, submitClasses } from '../../components/settings/fields';
import FormFeedback from '../../components/settings/FormFeedback';
import SettingsLayout from '../../components/settings/SettingsLayout';
import { useUser } from '../../contexts/user';
import { useFocusOnViolation } from '../../hooks/useFocusOnViolation';
import { useCreatePlayerTeamMutation } from '../../store/slices/api';
import { parseApiError, parseViolations } from '../../utils/api';
import ErrorView from '../error/Error';

const DESCRIPTION_MAX = 500;

/** Créer une équipe de joueurs : un nom, une description ; le code arrive avec l'équipe. */
export default function TeamCreate() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [create, { isLoading, error }] = useCreatePlayerTeamMutation();
  const violations = parseViolations(error);
  useFocusOnViolation(error);
  const generalError = error && Object.keys(violations).length === 0 ? parseApiError(error).message : null;

  if (!user) {
    return <ErrorView status={401} message="Connectez-vous pour créer une équipe" />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      const team = await create({ name: name.trim(), description: description.trim() || undefined }).unwrap();
      navigate(`/teams/${team.id}`);
    } catch {
      // L'erreur est affichée dans le formulaire
    }
  }

  return (
    <SettingsLayout title="Créer une équipe de joueurs">
      <form onSubmit={handleSubmit} aria-busy={isLoading} className="flex flex-col gap-4">
        <p className="text-base text-gray-700">
          Vous en serez le créateur. Un code de jointure vous sera donné pour inviter vos coéquipiers.
        </p>

        <label htmlFor="name" className="flex flex-col gap-1">
          <span className="text-sm font-medium">Nom de l'équipe</span>
          <input
            type="text"
            id="name"
            name="name"
            autoComplete="off"
            required
            maxLength={100}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClasses}
            {...invalidProps('name', violations.name)}
          />
          <FieldError id="name" message={violations.name} />
        </label>

        <label htmlFor="description" className="flex flex-col gap-1">
          <span className="text-sm font-medium">Description</span>
          <textarea
            id="description"
            name="description"
            rows={3}
            maxLength={DESCRIPTION_MAX}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={inputClasses}
            aria-invalid={violations.description ? true : undefined}
            aria-describedby={violations.description ? 'description-count description-error' : 'description-count'}
          />
          <span id="description-count" className="text-sm text-gray-600 self-end">
            {description.length}/{DESCRIPTION_MAX} caractères
          </span>
          <FieldError id="description" message={violations.description} />
        </label>

        <FormFeedback error={generalError} />

        <button type="submit" disabled={isLoading || name.trim() === ''} className={submitClasses}>
          {isLoading ? 'Création…' : "Créer l'équipe"}
        </button>
      </form>
    </SettingsLayout>
  );
}
