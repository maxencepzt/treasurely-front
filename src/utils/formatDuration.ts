/**
 * Transforme un nombre de secondes en une chaîne lisible.
 *
 * Si la durée est d'une heure ou plus, le format sera "{h}h{m}" (heures et minutes).
 * Sinon, le format sera "{m}mins" (minutes seulement), et "{s} s" sous la minute :
 * une chasse ou une énigme résolue en quelques secondes ne vaut pas « 0mins ».
 *
 * @param seconds - La durée en secondes
 *  * @returns Une chaîne de caractère formatée selon les règles ci-dessus
 */
export default function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)} s`;
  }

  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours >= 1) {
    return `${hours}h${minutes}`;
  }

  return `${minutes}mins`;
}

/**
 * Même format, depuis une durée en minutes : l'unité de `estimatedTime` côté serveur.
 */
export function formatMinutes(minutes: number): string {
  return formatDuration(minutes * 60);
}
