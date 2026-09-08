import { useDesignerSso } from '../hooks/useDesignerSso';

function LoginSSOButton() {
  const openDesigner = useDesignerSso();

  return (
    <button type="button" onClick={() => void openDesigner()} className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
      Accéder à l'administration
    </button>
  );
}

export default LoginSSOButton;
