import {faAngleLeft, faLock} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function TreasureHuntPrivate() {
  return (
    <div className="min-h-screen flex justify-center">
      {/* Conteneur téléphone avec bordures */}
      <div className="w-full max-w-md bg-white min-h-screen">
        <button type="button" className="mt-4 ml-2 cursor-pointer" title="Revenir en arrière" onClick={() => window.history.back()}>
          <FontAwesomeIcon icon={faAngleLeft} className="text-3xl" />
        </button>
        {/* Zone centrée pour le cadenas et le message */}
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] gap-4">
          <FontAwesomeIcon icon={faLock} className="text-gray-800 text-6xl" />
          <p className="text-gray-600 text-xl font-medium">Cette chasse est privée</p>
        </div>
      </div>
    </div>
  );
}
