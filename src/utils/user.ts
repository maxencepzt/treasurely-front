import type { User } from '../types/api';

export const GENDER_LABELS: Record<User['gender'], string> = {
  MAN: 'Homme',
  WOMAN: 'Femme',
  OTHER: 'Autre',
};

/**
 * La date au format de `<input type="date">`, depuis la date W3C de l'API
 * @example toDateInputValue("1990-01-01T00:00:00+00:00") // retourne "1990-01-01"
 */
export function toDateInputValue(date: string): string {
  return date.slice(0, 10);
}
