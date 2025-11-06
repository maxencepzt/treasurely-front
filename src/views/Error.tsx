import { Link } from 'react-router';

interface ErrorViewProps {
  status?: number | string;
  message?: string;
  error?: unknown;
}

function formatErrorMessage(error: unknown) {
  if (!error) return 'Une erreur est survenue.';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message || 'Une erreur est survenue.';
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export default function ErrorView({ status, message, error }: ErrorViewProps) {
  const finalMessage = message || formatErrorMessage(error);

  const isDev = import.meta.env.MODE !== 'production';
  const showDebug = isDev && error instanceof Error;
  const stack = showDebug ? (error as Error)?.stack : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-sm shadow-lg rounded-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 text-4xl mb-4">
          ⚠️
        </div>

        {status && (
          <div className="text-sm text-emerald-600 font-semibold mb-2">{status}</div>
        )}

        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
          Oups — une erreur est survenue
        </h1>

        <p className="text-sm text-gray-600 mb-6 max-w-prose mx-auto">{finalMessage}</p>

        <div className="flex items-center justify-center">
          <Link
            to="/"
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition"
          >
            Retour à l'accueil
          </Link>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <div>Treasurely</div>
          <div>
            Contact:{' '}
            <a href="mailto:support@treasurely.fr" className="text-emerald-600 underline">
              support@treasurely.fr
            </a>
          </div>
        </div>

        {stack && (
          <pre className="mt-6 text-xs text-left bg-gray-50 p-3 rounded-lg overflow-auto max-h-48 text-gray-700">
            {stack}
          </pre>
        )}
      </div>
    </div>
  );
}
