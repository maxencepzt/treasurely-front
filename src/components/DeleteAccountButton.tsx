import { useState } from "react";
import { useDispatch } from "react-redux";

import { useUserDeleteMutation } from "../store/slices/api";
import { logout } from "../store/slices/authSlice";

export default function DeleteAccountButton({ userId }: { userId: number }) {
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();

  const [deleteUser, { isLoading }] = useUserDeleteMutation();

  const handleDelete = async () => {
    try {
      await deleteUser({ userId, password: "" }).unwrap(); // mot de passe inutile maintenant

      // Clear session
      dispatch(logout());
      localStorage.clear();

      // Redirect home
      window.location.href = "/";
    } catch (err) {
      console.error("Erreur lors de la suppression du compte :", err);
      // tu peux ajouter un toast ou message d'erreur ici
    }
  };

  return (
    <>
      {/* BOUTON dans la liste */}
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="
          w-full text-left px-5 py-4 rounded-xl border-2 shadow-sm transition
          hover:shadow-md active:scale-[0.98]
          border-red-200 bg-red-50 text-red-800 hover:bg-red-100
        "
      >
        Supprimer son compte
      </button>

      {/* MODAL de confirmation simple */}
      {showModal && (
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
                className="
                  px-4 py-2 rounded-lg
                  bg-red-600 text-white hover:bg-red-700
                "
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
