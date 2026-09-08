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

/**
 * Parse une erreur d'API pour en extraire le status et le message
 * @param error L'erreur à parser
 * @example parseApiError(error) // retourne { status: 404, message: "Not Found" }
 */
export function parseApiError(error: unknown): { status: number, message: string } {
  let status = 500;
  let message = "An error occurred";

  if (error && typeof error === "object") {
    if ("status" in error) {
      status = typeof error.status === "number" ? error.status : 500;

      // Les contrôleurs maison répondent `message`, API Platform répond `detail` (RFC 7807).
      const data = "data" in error && error.data && typeof error.data === "object" ? (error.data as { message?: unknown; detail?: unknown }) : {};
      const text = [data.message, data.detail].find((value) => typeof value === "string");
      message = typeof text === "string" ? text : "Server error";
    } else if ("message" in error) {
      message = typeof error.message === "string" ? error.message : message;
    }
  }

  return { status, message };
}

/**
 * Les erreurs de validation d'API Platform (422), par champ
 * @example parseViolations(error) // retourne { email: "Cette adresse email n'est pas valide." }
 */
export function parseViolations(error: unknown): Record<string, string> {
  const violations: Record<string, string> = {};
  if (!error || typeof error !== "object" || !("data" in error) || !error.data || typeof error.data !== "object") {
    return violations;
  }

  const list = (error.data as { violations?: unknown }).violations;
  for (const violation of Array.isArray(list) ? list : []) {
    const { propertyPath, message } = violation as { propertyPath?: unknown; message?: unknown };
    if (typeof propertyPath === "string" && typeof message === "string" && !(propertyPath in violations)) {
      violations[propertyPath] = message;
    }
  }

  return violations;
}
