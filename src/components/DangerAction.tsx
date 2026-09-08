import { useState } from 'react';

import { dangerClasses, dangerSolidClasses, secondaryClasses } from './settings/fields';

type DangerActionProps = {
  label: string;
  question: string;
  confirmLabel: string;
  onConfirm: () => void | Promise<void>;
  busy?: boolean;
};

/** Une action destructrice en deux temps, sur place : le bouton, puis la question et sa confirmation. */
export default function DangerAction({ label, question, confirmLabel, onConfirm, busy = false }: DangerActionProps) {
  const [asking, setAsking] = useState(false);

  if (!asking) {
    return (
      <button type="button" onClick={() => setAsking(true)} className={`${dangerClasses} w-full justify-center`}>
        {label}
      </button>
    );
  }

  return (
    <div role="group" aria-label={question} className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
      <p className="text-base text-red-800">{question}</p>
      <div className="flex gap-3">
        <button type="button" onClick={() => setAsking(false)} disabled={busy} className={`${secondaryClasses} flex-1 justify-center`}>
          Annuler
        </button>
        <button type="button" onClick={() => void onConfirm()} disabled={busy} className={`${dangerSolidClasses} flex-1`}>
          {busy ? 'Un instant…' : confirmLabel}
        </button>
      </div>
    </div>
  );
}
