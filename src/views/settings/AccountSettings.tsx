import { useParams } from 'react-router';

import { BackButton } from '../../components';
import AccountForm from '../../components/settings/AccountForm.tsx';
import { useUser } from '../../contexts/user';
import { useUpdateUserMutation } from '../../store/slices/api.ts';
import type { UserUpdate } from '../../types/api.ts';
import ErrorView from '../error/Error.tsx';

/**
 * Édition des informations du compte. Le profil vient du contexte (`/api/me`, seul à porter
 * l'email, le téléphone et la date de naissance) et se rafraîchit tout seul après
 * l'enregistrement, la mutation invalidant son cache.
 */
export default function AccountSettings() {
  const { id } = useParams();
  const { user } = useUser();
  const [updateUser, { isLoading, error }] = useUpdateUserMutation();

  if (!user) return <ErrorView status={401} message="Connectez-vous pour modifier votre profil" />;
  if (Number(id) !== user.id) {
    return <ErrorView status={403} message="Accès interdit : vous ne pouvez pas modifier ce profil" />;
  }

  /** Vrai si le serveur a enregistré ; sinon l'erreur est affichée par le formulaire, champ par champ. */
  async function handleSubmit(update: UserUpdate): Promise<boolean> {
    if (!user) return false;
    try {
      await updateUser({ id: user.id, ...update }).unwrap();
      return true;
    } catch {
      return false;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-xl p-6">
        <BackButton variant="dark" />

        <h1 className="text-2xl font-bold mt-4 mb-6">Informations du compte</h1>

        <AccountForm user={user} onSubmit={handleSubmit} isSaving={isLoading} error={error} />
      </div>
    </div>
  );
}
