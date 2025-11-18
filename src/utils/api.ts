import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * Récupère un message d'erreur lisible à partir d'une erreur FetchBaseQueryError ou SerializedError
 * @param error
 */
export const getErrorMessage = (error?: FetchBaseQueryError | SerializedError) =>{
  if (!error) return null;

  if ('status' in error) {
    // FetchBaseQueryError
    if ('data' in error && typeof error.data === 'object' && error.data !== null) {
      const data = error.data as { message?: string };
      return data.message || `Erreur ${error.status}`;
    }
    return `Erreur ${error.status}`;
  }

  // SerializedError
  return error.message || 'Une erreur est survenue';
};

/**
 * Récupère l'ID d'une équipe à partir de son URL
 * @param url L'URL de l'équipe (ex: "/teams/1")
 * @example getIdFromUrl("/teams/1") // retourne 1
 */
export function getIdFromUrl(url: string): number {
  const matches = url.match(/(\d+)/g);
  if (!matches) throw new Error(`${url} is not a valid URL`);
  return Number(matches[matches.length - 1]);
}
