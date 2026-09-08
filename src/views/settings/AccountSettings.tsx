import AccountForm from '../../components/settings/AccountForm.tsx';
import SettingsLayout from '../../components/settings/SettingsLayout.tsx';
import { useAccountUpdate } from '../../hooks/useAccountUpdate.ts';
import ErrorView from '../error/Error.tsx';

/**
 * Édition des informations du compte. Le profil vient du contexte (`/api/me`, seul à porter
 * l'email, le téléphone et la date de naissance) et se rafraîchit tout seul après
 * l'enregistrement, la mutation invalidant son cache.
 */
export default function AccountSettings() {
  const { user, owner, save, isSaving, error } = useAccountUpdate();

  if (!user) return <ErrorView status={401} message="Connectez-vous pour modifier votre profil" />;
  if (!owner) return <ErrorView status={403} message="Accès interdit : vous ne pouvez pas modifier ce profil" />;

  return (
    <SettingsLayout title="Informations du compte">
      <AccountForm user={owner} onSubmit={save} isSaving={isSaving} error={error} />
    </SettingsLayout>
  );
}
