import { useEffect } from 'react';

import { parseViolations } from '../utils/api';

/**
 * Après un refus du serveur, place le focus sur le premier champ invalide : les champs portent
 * l'id de leur propriété, celui que les violations nomment. Ne réagit qu'à une nouvelle erreur.
 */
export function useFocusOnViolation(error: unknown) {
  useEffect(() => {
    const first = Object.keys(parseViolations(error))[0];
    if (first) document.getElementById(first)?.focus();
  }, [error]);
}
