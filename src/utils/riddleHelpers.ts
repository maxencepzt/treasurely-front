import type { AnyRiddleAPI, GPSRiddleAPI, MCQRiddleAPI, QRRiddle, TextRiddleAPI } from '../types/api';

/**
 * Type guard pour vérifier si un riddle est de type MCQ (Multiple Choice Question)
 * @param riddle - L'énigme à vérifier
 * @returns true si le riddle contient des choix et des réponses
 * @example isMCQRiddle(riddle) => true
 */
export function isMCQRiddle(riddle: AnyRiddleAPI): riddle is MCQRiddleAPI {
  return 'choices' in riddle && 'answers' in riddle;
}

/**
 * Type guard pour vérifier si un riddle est de type GPS
 * @param riddle - L'énigme à vérifier
 * @returns true si le riddle contient des coordonnées GPS
 * @example isGPSRiddle(riddle) => true
 */
export function isGPSRiddle(riddle: AnyRiddleAPI): riddle is GPSRiddleAPI {
  return 'latitude' in riddle && 'longitude' in riddle;
}

/**
 * Type guard pour vérifier si un riddle est de type QR Code
 * @param riddle - L'énigme à vérifier
 * @returns true si le riddle contient un code QR
 * @example isQRRiddle(riddle) => true
 */
export function isQRRiddle(riddle: AnyRiddleAPI): riddle is QRRiddle {
  return 'code' in riddle;
}

/**
 * Type guard pour vérifier si un riddle est de type Text
 * @param riddle - L'énigme à vérifier
 * @returns true si le riddle contient une réponse textuelle simple
 * @example isTextRiddle(riddle) => true
 */
export function isTextRiddle(riddle: AnyRiddleAPI): riddle is TextRiddleAPI {
  return 'answer' in riddle && !('choices' in riddle);
}

/**
 * Récupère le type de riddle sous forme de string
 * @param riddle - L'énigme à identifier
 * @returns Le type de riddle ("MCQ" | "GPS" | "QR" | "TEXT" | "UNKNOWN")
 * @example getRiddleType(riddle) => "MCQ"
 */
export function getRiddleType(riddle: AnyRiddleAPI): 'MCQ' | 'GPS' | 'QR' | 'TEXT' | 'UNKNOWN' {
  if (isMCQRiddle(riddle)) return 'MCQ';
  if (isGPSRiddle(riddle)) return 'GPS';
  if (isQRRiddle(riddle)) return 'QR';
  if (isTextRiddle(riddle)) return 'TEXT';
  return 'UNKNOWN';
}

/**
 * Récupère le nombre de réponses possibles pour un riddle MCQ
 * @param riddle - L'énigme MCQ
 * @returns Le nombre de réponses, ou null si ce n'est pas un MCQ
 * @example getMCQAnswerCount(riddle) => 2
 */
export function getMCQAnswerCount(riddle: AnyRiddleAPI): number | null {
  if (isMCQRiddle(riddle)) {
    return riddle.answers.length;
  }
  return null;
}

/**
 * Récupère le nombre de choix pour un riddle MCQ
 * @param riddle - L'énigme MCQ
 * @returns Le nombre de choix, ou null si ce n'est pas un MCQ
 * @example getMCQChoiceCount(riddle) => 4
 */
export function getMCQChoiceCount(riddle: AnyRiddleAPI): number | null {
  if (isMCQRiddle(riddle)) {
    return riddle.choices.length;
  }
  return null;
}

/**
 * Récupère les coordonnées GPS d'un riddle
 * @param riddle - L'énigme GPS
 * @returns Un objet contenant lat/lng, ou null si ce n'est pas un GPS riddle
 * @example getGPSCoordinates(riddle) => { latitude: 48.8566, longitude: 2.3522 }
 */
export function getGPSCoordinates(riddle: AnyRiddleAPI): { latitude: number; longitude: number } | null {
  if (isGPSRiddle(riddle)) {
    return {
      latitude: riddle.latitude,
      longitude: riddle.longitude
    };
  }
  return null;
}

/**
 * Récupère le code QR d'un riddle
 * @param riddle - L'énigme QR
 */
export function getQRCode(riddle: AnyRiddleAPI): string | null {
  if (isQRRiddle(riddle)) {
    return riddle.code;
  }
  return null;
}

/**
 * Désérialise une chaîne PHP sérialisée en tableau
 * @param serialized - La chaîne sérialisée PHP (ex: a:2:{i:0;s:9:"réponse1";i:1;s:9:"réponse3";})
 * @returns Un tableau de strings
 */
export function unserializePhpArray(serialized: string | string[]): string[] {
  // Si c'est déjà un tableau, le retourner tel quel
  if (Array.isArray(serialized)) {
    return serialized;
  }

  // Si ce n'est pas une chaîne sérialisée PHP, retourner un tableau avec la valeur
  if (!serialized.startsWith('a:')) {
    return [serialized];
  }

  const values: string[] = [];
  // Pattern pour extraire les valeurs de type string: s:LENGTH:"VALUE"
  const stringPattern = /s:\d+:"([^"]*)"/g;
  let match;

  while ((match = stringPattern.exec(serialized)) !== null) {
    values.push(match[1]);
  }

  return values;
}

/**
 * Valide une réponse pour une énigme de type texte
 * @param riddle - L'énigme texte
 * @param userAnswer - La réponse de l'utilisateur
 * @returns true si la réponse est correcte (case-insensitive)
 */
export function validateTextAnswer(riddle: TextRiddleAPI, userAnswer: string): boolean {
  return riddle.answer.toLowerCase().trim() === userAnswer.toLowerCase().trim();
}

/**
 * Valide une réponse pour une énigme de type MCQ
 * @param riddle - L'énigme MCQ
 * @param userAnswers - Les réponses sélectionnées par l'utilisateur
 * @returns true si toutes les réponses correctes sont sélectionnées et seulement elles
 */
export function validateMCQAnswer(riddle: MCQRiddleAPI, userAnswers: string[]): boolean {
  // Désérialiser les réponses correctes si elles sont au format PHP
  const correctAnswers = unserializePhpArray(riddle.answers);

  if (userAnswers.length !== correctAnswers.length) {
    return false;
  }

  const sortedUserAnswers = [...userAnswers].sort();
  const sortedCorrectAnswers = [...correctAnswers].sort();

  return sortedUserAnswers.every((answer, index) => answer === sortedCorrectAnswers[index]);
}

/**
 * Valide une réponse pour une énigme de type QR
 * @param riddle - L'énigme QR
 * @param userCode - Le code scanné/saisi par l'utilisateur
 * @returns true si le code correspond
 */
export function validateQRAnswer(riddle: QRRiddle, userCode: string): boolean {
  return riddle.code.trim() === userCode.trim();
}

/**
 * Valide une réponse pour n'importe quel type d'énigme
 * @param riddle - L'énigme
 * @param userAnswer - La réponse de l'utilisateur (string pour text/qr, string[] pour MCQ)
 * @returns true si la réponse est correcte
 */
export function validateRiddleAnswer(riddle: AnyRiddleAPI, userAnswer: string | string[]): boolean {
  if (isTextRiddle(riddle) && typeof userAnswer === 'string') {
    return validateTextAnswer(riddle, userAnswer);
  }

  if (isMCQRiddle(riddle) && Array.isArray(userAnswer)) {
    return validateMCQAnswer(riddle, userAnswer);
  }

  if (isQRRiddle(riddle) && typeof userAnswer === 'string') {
    return validateQRAnswer(riddle, userAnswer);
  }

  return false;
}
