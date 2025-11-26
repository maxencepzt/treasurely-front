import { useNavigate, useParams } from 'react-router';

import { BackButton, LogoutButton } from "../../components";

export default function UserSettings() {
  const navigate = useNavigate();
  const { id } = useParams();

  const buttons = [
    { label: "Informations du compte", action: () => {} },
    { label: "Modifier la photo de profil", action: () => navigate(`/settings/profile/${id}/upload`) },
    { type: "logout" },
    { label: "Supprimer son compte", action: () => {}, danger: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-xl p-6">

        <BackButton variant="dark" />

        <h1 className="text-2xl font-bold mt-4 mb-6">
          Paramètres de l'utilisateur
        </h1>

        <div className="flex flex-col gap-4">

          {buttons.map((btn, i) => {
            if (btn.type === "logout") {
              return <LogoutButton key={i}/>;
            }

            return (
              <button type="button"
                key={i}
                onClick={btn.action}
                className={
                  `w-full text-left px-5 py-4 rounded-xl border-2 shadow-sm transition hover:shadow-md active:scale-[0.98]
                   ${btn.danger
                    ? "border-red-200 bg-red-50 text-red-800 hover:bg-red-100"
                    : "border-green-200 bg-white hover:bg-green-50"}`
                }
              >
                {btn.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
