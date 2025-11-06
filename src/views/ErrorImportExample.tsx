import { useNavigate } from 'react-router';

/**
 * Component to demonstrate error handling by navigating to the error page with an error state.
 */
export default function ErrorImportExample() {
  const navigate = useNavigate();

  function showError(err: unknown) {
    navigate('/error', { state: { error: err, status: 500, message: 'Erreur serveur' } });
  }

  return <button type="button" onClick={() => showError(new Error('Test error'))}>Trigger error</button>;
}