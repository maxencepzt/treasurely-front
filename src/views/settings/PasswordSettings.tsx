import PasswordForm from '../../components/settings/PasswordForm.tsx';
import SettingsLayout from '../../components/settings/SettingsLayout.tsx';
import { useAccountUpdate } from '../../hooks/useAccountUpdate.ts';
import ErrorView from '../error/Error.tsx';

/** Changement de mot de passe du compte connecté, sur sa propre page pour ne rien laisser supposer. */
export default function PasswordSettings() {
  const { user, owner, save, isSaving, error } = useAccountUpdate();

  if (!user) return <ErrorView status={401} message="Connectez-vous pour changer votre mot de passe" />;
  if (!owner) return <ErrorView status={403} message="Accès interdit : vous ne pouvez pas modifier ce compte" />;

  return (
    <SettingsLayout title="Changer le mot de passe">
      <PasswordForm onSubmit={save} isSaving={isSaving} error={error} />
    </SettingsLayout>
  );
}
