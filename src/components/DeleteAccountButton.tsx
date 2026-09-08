import { type FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { useUserDeleteMutation } from "../store/slices/api";
import { logout } from "../store/slices/authSlice";
import type { User } from "../types/api";
import { parseApiError } from "../utils/api";
import { dangerClasses, dangerSolidClasses, inputClasses, secondaryClasses } from "./settings/fields";
import FormFeedback from "./settings/FormFeedback";

/**
 * Suppression du compte, confirmée en tapant son pseudo : le bouton final reste inactif tant
 * que la saisie ne correspond pas. La boîte se ferme par Échap et rend le focus au déclencheur.
 */
export default function DeleteAccountButton({ user, isOwner }: { user: User; isOwner: boolean }) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState('');
  const [error, setError] = useState<string | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const [deleteUser, { isLoading }] = useUserDeleteMutation();
  const confirmed = typed.trim() === user.nickname;

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  function close() {
    setOpen(false);
    setTyped('');
    setError(null);
    trigger.current?.focus();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isOwner || !confirmed) return;

    try {
      await deleteUser({ userId: user.id }).unwrap();
      dispatch(logout());
      localStorage.clear();
      window.location.href = "/";
    } catch (failure) {
      setError(parseApiError(failure).message);
    }
  }

  return (
    <>
      <button ref={trigger} type="button" onClick={() => isOwner && setOpen(true)} className={`${dangerClasses} w-full`}>
        Supprimer son compte
      </button>

      {open && isOwner && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onKeyDown={(event) => {
            if (event.key === 'Escape') close();
          }}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-sm rounded-lg shadow-xl p-6 flex flex-col gap-4"
          >
            <h2 id="delete-account-title" className="text-xl font-bold text-red-700">Supprimer votre compte ?</h2>

            <p className="text-base text-gray-700">
              Cette action est définitive : vos participations et vos scores seront perdus.
            </p>

            <label htmlFor="delete-confirmation" className="flex flex-col gap-1">
              <span className="text-sm font-medium">Tapez votre pseudo « {user.nickname} » pour confirmer</span>
              <input
                ref={input}
                type="text"
                id="delete-confirmation"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                value={typed}
                onChange={(event) => setTyped(event.target.value)}
                className={inputClasses}
              />
            </label>

            <FormFeedback error={error} />

            <div className="flex justify-end gap-3">
              <button type="button" onClick={close} className={secondaryClasses}>
                Annuler
              </button>
              <button type="submit" disabled={!confirmed || isLoading} className={dangerSolidClasses}>
                {isLoading ? 'Suppression…' : 'Supprimer mon compte'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
