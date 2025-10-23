import { Link } from 'react-router';
import { faPlay, faPuzzlePiece, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function HeroSection() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12 text-center max-w-7xl mx-auto">
      <div className="text-6xl lg:text-7xl mb-4">
        <FontAwesomeIcon icon={faPuzzlePiece} className="text-green-700" />
      </div>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
        Treasurely
      </h1>
      <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
        Partez à l'aventure et découvrez des trésors cachés près de chez vous !
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/signup"
          className="px-6 py-3 rounded-lg bg-green-700 text-white text-lg font-semibold hover:bg-green-800 transition-colors shadow-lg"
        >
          <FontAwesomeIcon icon={faUserPlus} className="me-2" />
          Créer un compte
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 rounded-lg bg-white text-green-700 text-lg font-semibold border-2 border-green-700 hover:bg-green-50 transition-colors"
        >
          <FontAwesomeIcon icon={faPlay} className="me-2" />
          Se connecter
        </Link>
      </div>
    </div>
  );
}

export default HeroSection;
