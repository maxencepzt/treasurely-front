/**
 * Les classes communes aux formulaires de paramètres : 44 px de haut pour le doigt, 16 px de
 * police pour qu'iOS ne zoome pas sur le champ, bordure rouge quand le champ est invalide.
 */
export const inputClasses =
  'min-h-11 text-base px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 aria-[invalid=true]:border-red-500';

export const submitClasses =
  'min-h-12 px-4 py-2 rounded-lg bg-green-800 text-white text-base font-medium cursor-pointer hover:bg-green-900 transition-colors disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed';

/** Le bouton final d'une action destructrice, le pendant rouge de `submitClasses`. */
export const dangerSolidClasses =
  'min-h-11 px-4 py-2 rounded-lg bg-red-700 text-white text-base font-medium cursor-pointer hover:bg-red-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed';

const buttonBase =
  'inline-flex items-center gap-2 min-h-11 px-4 py-2 rounded-lg border bg-white text-base font-medium cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-within:ring-2 disabled:opacity-50 disabled:cursor-not-allowed';

/** Les boutons et rangées secondaires : même bordure et mêmes coins que les champs. */
export const secondaryClasses = `${buttonBase} border-gray-300 text-gray-900 hover:bg-gray-50 focus-visible:ring-green-700 focus-within:ring-green-700`;

/** Le bouton principal posé à côté d'un secondaire : même gabarit, bordure transparente, pour s'aligner au pixel. */
export const primaryClasses = `${buttonBase} border-transparent bg-green-800 text-white hover:bg-green-900 focus-visible:ring-green-700 focus-within:ring-green-700`;

/** Une action destructrice qui ouvre une confirmation : rouge en contour, pas en aplat. */
export const dangerClasses = `${buttonBase} border-red-300 text-red-700 hover:bg-red-50 focus-visible:ring-red-500 focus-within:ring-red-500`;

/** Les attributs qui signalent un champ invalide et le relient à son erreur (`FieldError`). */
export function invalidProps(id: string, message?: string) {
  return message ? { 'aria-invalid': true as const, 'aria-describedby': `${id}-error` } : {};
}
