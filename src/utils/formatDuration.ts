/**
 * Transforme un nombre de secondes en une chaîne lisible.
 *
 * Une heure ou plus : "{h}h{mm}" avec les minutes sur deux chiffres ("2h08"), ou "{h} h" à
 * l'heure pile. Sinon "{m}mins" (minutes seulement), et "{s} s" sous la minute : une chasse ou
 * une énigme résolue en quelques secondes ne vaut pas « 0mins ».
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
    return minutes === 0 ? `${hours} h` : `${hours}h${String(minutes).padStart(2, '0')}`;
  }

  return `${minutes}mins`;
}

/**
 * Même format, depuis une durée en minutes : l'unité de `estimatedTime` côté serveur.
 */
export function formatMinutes(minutes: number): string {
  return formatDuration(minutes * 60);
}
