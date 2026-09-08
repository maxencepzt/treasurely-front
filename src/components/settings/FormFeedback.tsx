import { type ReactNode, useEffect, useRef } from 'react';

type FormFeedbackProps = {
  success?: string | null;
  error?: string | null;
  /** Ce qui suit le message de succès, par exemple un lien de retour. */
  children?: ReactNode;
};

/**
 * Le retour d'un envoi, placé juste au-dessus du bouton pour rester sous les yeux, et qui
 * prend le focus à son apparition : lecteurs d'écran et clavier y arrivent sans chercher.
 */
export default function FormFeedback({ success, error, children }: FormFeedbackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const message = error ?? success;

  useEffect(() => {
    if (message) ref.current?.focus();
  }, [message]);

  if (!message) return null;

  if (error) {
    return (
      <div ref={ref} tabIndex={-1} role="alert" className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
        {error}
      </div>
    );
  }

  return (
    <div ref={ref} tabIndex={-1} role="status" className="px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-300">
      {success}
      {children}
    </div>
  );
}
