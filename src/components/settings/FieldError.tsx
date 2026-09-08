/** L'erreur d'un champ, sous lui, que le champ relie par `aria-describedby="<id>-error"`. */
export default function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return <p id={`${id}-error`} className="text-sm text-red-600">{message}</p>;
}
