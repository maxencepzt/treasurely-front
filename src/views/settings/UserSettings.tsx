import { useNavigate } from 'react-router';

import { LogoutButton } from "../../components";
import DeleteAccountButton from '../../components/DeleteAccountButton.tsx';
import SettingsLayout from '../../components/settings/SettingsLayout.tsx';
import type { User } from "../../types/api.ts";

export default function UserSettings({ user, isOwner }: { user: User; isOwner: boolean; }) {
  const navigate = useNavigate();

  const buttons = [
    {
      id: "account",
      label: "Informations du compte",
      action: () => navigate(`/settings/profile/${user.id}/account`)
    },
    {
      id: "password",
      label: "Changer le mot de passe",
      action: () => navigate(`/settings/profile/${user.id}/password`)
    },
    {
      id: "photo",
      label: "Modifier la photo de profil",
      action: () => navigate(`/settings/profile/${user.id}/upload`)
    },
    { id: "logout", type: "logout" },
    { id: "delete", type: "delete" },
  ];

  return (
    <SettingsLayout title="Paramètres de l'utilisateur">
      <div className="flex flex-col gap-4">
        {buttons.map((btn) => {
          if (btn.type === "logout") return <LogoutButton key={btn.id} />;
          if (btn.type === "delete") {
            return <DeleteAccountButton key={btn.id} userId={user.id} isOwner={isOwner} />;
          }

          return (
            <button
              type="button"
              key={btn.id}
              onClick={btn.action}
              className="w-full text-left px-5 py-4 rounded-xl border-2 shadow-sm transition hover:shadow-md active:scale-[0.98] border-green-200 bg-white hover:bg-green-50"
            >
              {btn.label}
            </button>
          );
        })}
      </div>
    </SettingsLayout>
  );
}
