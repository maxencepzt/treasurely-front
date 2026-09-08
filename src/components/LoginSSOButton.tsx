import { useDesignerSso } from '../hooks/useDesignerSso';

const defaultClasses = 'cursor-pointer px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700';

/** Ouvre l'administration du back par l'échange SSO ; `className` remplace le style par défaut. */
function LoginSSOButton({ className = defaultClasses }: { className?: string }) {
  const openDesigner = useDesignerSso();

  return (
    <button type="button" onClick={() => void openDesigner()} className={className}>
      Accéder à l'administration
    </button>
  );
}

export default LoginSSOButton;
