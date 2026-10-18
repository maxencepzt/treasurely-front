import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { useUser } from '../contexts/user';
import { useLoginMutation, useUpdateUserMutation } from '../store/slices/api';
import { setCredentials } from '../store/slices/authSlice';
import type { UserUpdate } from '../types/api';

/**
 * Le compte que la page de paramètres modifie : celui du contexte (`/api/me`), à condition
 * qu'il soit celui de l'URL. `owner` est nul pour un visiteur ou pour le compte d'un autre.
 * `save()` rend vrai une fois la mise à jour enregistrée ; sinon `error` porte le refus.
 */
export function useAccountUpdate() {
  const { id } = useParams();
  const { user } = useUser();
  const dispatch = useDispatch();
  const [updateUser, { isLoading, error }] = useUpdateUserMutation();
  const [login] = useLoginMutation();
  const owner = user && Number(id) === user.id ? user : null;

  async function save(update: UserUpdate): Promise<boolean> {
    if (!owner) return false;
    try {
      await updateUser({ id: owner.id, ...update }).unwrap();
    } catch {
      return false;
    }
    // Le serveur révoque les refresh tokens au changement de mot de passe : la session est
    // rouverte avec le nouveau. En cas d'échec, elle s'arrêtera au prochain rafraîchissement.
    if (update.plainPassword) {
      try {
        dispatch(setCredentials(await login({ nickname: owner.nickname, password: update.plainPassword }).unwrap()));
      } catch {
        // la modification est faite, seule la reconnexion a échoué
      }
    }
    return true;
  }

  return { user, owner, save, isSaving: isLoading, error };
}
