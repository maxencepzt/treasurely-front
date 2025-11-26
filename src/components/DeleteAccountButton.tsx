import { useState } from "react";
import { useDispatch } from "react-redux";

import { useUserDeleteMutation } from "../store/slices/api";
import { logout } from "../store/slices/authSlice";

export default function DeleteAccountButton({ userId, isOwner }: { userId: number; isOwner: boolean }) {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  const [deleteUser, { isLoading }] = useUserDeleteMutation();

  const handleDelete = async () => {
    if (!isOwner) {
      console.error("Tentative de suppression d’un autre utilisateur");
      return;
    }

    try {
      await deleteUser({ userId }).unwrap();

      dispatch(logout());
      localStorage.clear();
      window.location.href = "/";
    } catch (err) {
      console.error("Erreur lors de la suppression du compte :", err);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => isOwner && setShowModal(true)}
        className="
          w-full text-left px-5 py-4 rounded-xl border-2 shadow-sm transition
          hover:shadow-md active:scale-[0.98]
          border-red-200 bg-red-50 text-red-800 hover:bg-red-100
        "
      >
        Supprimer son compte
      </button>

      {showModal && isOwner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-red-700">
              Confirmer la suppression
            </h2>

            <p className="text-gray-700 mb-6">
              Êtes-vous sûr de vouloir supprimer définitivement votre compte ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                {isLoading ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
