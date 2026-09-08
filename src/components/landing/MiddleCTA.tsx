import { Link } from 'react-router';
import { faPlay, faRocket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function MiddleCTA() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center border-2 border-green-700">
        <div className="text-5xl mb-4">
          <FontAwesomeIcon icon={faRocket} className="text-green-700" />
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
          Lancez-vous dans votre première chasse !
        </h2>
        <p className="text-gray-600 mb-6 text-base lg:text-lg">
          Des chasses au trésor vous attendent près de chez vous. Connectez-vous et commencez l'aventure en moins d'une minute.
        </p>
        <Link
          to="/login"
          className="inline-block px-8 py-3 rounded-lg bg-green-700 text-white text-lg font-semibold hover:bg-green-800 transition-colors shadow-lg"
        >
          <FontAwesomeIcon icon={faPlay} className="me-2" />
          Se connecter
        </Link>
      </div>
    </div>
  );
}

export default MiddleCTA;
