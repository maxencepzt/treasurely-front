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