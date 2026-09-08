/**
 * Les classes communes aux formulaires de paramètres : 44 px de haut pour le doigt, 16 px de
 * police pour qu'iOS ne zoome pas sur le champ, bordure rouge quand le champ est invalide.
 */
export const inputClasses =
  'min-h-11 text-base px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 aria-[invalid=true]:border-red-500';

export const submitClasses =
  'min-h-12 px-4 py-2 rounded-lg bg-green-800 text-white text-base font-medium cursor-pointer hover:bg-green-900 transition-colors disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed';

/** Les attributs qui signalent un champ invalide et le relient à son erreur (`FieldError`). */
export function invalidProps(id: string, message?: string) {
  return message ? { 'aria-invalid': true as const, 'aria-describedby': `${id}-error` } : {};
}
