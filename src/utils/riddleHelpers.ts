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
 * @returns Le code QR, ou null si ce n'est pas un QR riddle
 * @example getQRCode(riddle) => "treasurely_853769154"
 */
export function getQRCode(riddle: AnyRiddleAPI): string | null {
  if (isQRRiddle(riddle)) {
    return riddle.code;
  }
  return null;
}
