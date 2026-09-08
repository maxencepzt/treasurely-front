import { Link } from 'react-router';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { LogoutButton } from "../../components";
import DeleteAccountButton from '../../components/DeleteAccountButton.tsx';
import ProfilePictureEditor from '../../components/settings/ProfilePictureEditor.tsx';
import SettingsLayout from '../../components/settings/SettingsLayout.tsx';
import type { User } from "../../types/api.ts";

const rowClasses =
  'w-full flex items-center gap-3 px-5 py-4 rounded-xl border-2 shadow-sm transition hover:shadow-md active:scale-[0.98] border-green-200 bg-white hover:bg-green-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700';

/** La page Paramètres : la photo modifiable sur place, les pages du profil en liens décrits, puis la session et le compte. */
export default function UserSettings({ user, isOwner }: { user: User; isOwner: boolean; }) {
  const base = `/settings/profile/${user.id}`;
  const pages = [
    { to: `${base}/account`, label: 'Informations du compte', hint: 'Prénom, nom, email, téléphone, description' },
    { to: `${base}/password`, label: 'Changer le mot de passe', hint: 'Le mot de passe actuel, puis le nouveau' },
  ];

  return (
    <SettingsLayout title="Paramètres de l'utilisateur">
      <ProfilePictureEditor user={user} />

      <section aria-labelledby="settings-profile" className="flex flex-col gap-3 mt-8">
        <h2 id="settings-profile" className="text-sm font-semibold uppercase tracking-wide text-gray-600">Profil</h2>
        {pages.map((page) => (
          <Link key={page.to} to={page.to} className={`${rowClasses} justify-between`}>
            <span className="flex flex-col text-left">
              <span className="text-base font-medium text-gray-900">{page.label}</span>
              <span className="text-sm text-gray-600">{page.hint}</span>
            </span>
            <FontAwesomeIcon icon={faChevronRight} className="text-gray-400 shrink-0" aria-hidden="true" />
          </Link>
        ))}
      </section>

      <section aria-labelledby="settings-session" className="flex flex-col gap-3 mt-8">
        <h2 id="settings-session" className="text-sm font-semibold uppercase tracking-wide text-gray-600">Session et compte</h2>
        <LogoutButton className={`${rowClasses} text-base font-medium text-gray-900`} />
        <DeleteAccountButton userId={user.id} isOwner={isOwner} />
      </section>
    </SettingsLayout>
  );
}
