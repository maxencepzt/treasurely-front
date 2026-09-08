import { type ReactNode } from 'react';

import { BackButton } from '../';

/** Le gabarit des pages de paramètres : une colonne blanche, le bouton de retour et le titre. */
export default function SettingsLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-xl p-6">
        <BackButton variant="dark" />

        <h1 className="text-2xl font-bold mt-4 mb-6">{title}</h1>

        {children}
      </div>
    </div>
  );
}
