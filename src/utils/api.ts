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

      if ("data" in error && error.data && typeof error.data === "object" && "message" in error.data) {
        const data = error.data as { message: unknown };
        message = typeof data.message === "string" ? data.message : "Server error";
      } else {
        message = "Server error";
      }
    } else if ("message" in error) {
      message = typeof error.message === "string" ? error.message : message;
    }
  }

  return { status, message };
}
