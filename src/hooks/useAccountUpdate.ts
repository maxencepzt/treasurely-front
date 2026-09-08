import { useParams } from 'react-router';

import { useUser } from '../contexts/user';
import { useUpdateUserMutation } from '../store/slices/api';
import type { UserUpdate } from '../types/api';

/**
 * Le compte que la page de paramètres modifie : celui du contexte (`/api/me`), à condition
 * qu'il soit celui de l'URL. `owner` est nul pour un visiteur ou pour le compte d'un autre.
 * `save()` rend vrai une fois la mise à jour enregistrée ; sinon `error` porte le refus.
 */
export function useAccountUpdate() {
  const { id } = useParams();
  const { user } = useUser();
  const [updateUser, { isLoading, error }] = useUpdateUserMutation();
  const owner = user && Number(id) === user.id ? user : null;

  async function save(update: UserUpdate): Promise<boolean> {
    if (!owner) return false;
    try {
      await updateUser({ id: owner.id, ...update }).unwrap();
      return true;
    } catch {
      return false;
    }
  }

  return { user, owner, save, isSaving: isLoading, error };
}
