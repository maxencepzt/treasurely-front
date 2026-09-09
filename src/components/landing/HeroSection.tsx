import { Link } from 'react-router';
import { faArrowRight, faCheck, faLocationDot, faMap, faStopwatch, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Difficulty from '../Difficulty';
import { secondaryClasses, submitClasses } from '../settings/fields';

/** L'accroche du visiteur : la promesse, la connexion, et le jeu tel qu'il se joue. */
export default function HeroSection() {
  return (
    <header className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Sous 640 px, les deux boutons passent sous la marque plutôt que de se replier sur deux lignes */}
      <nav aria-label="Navigation visiteur" className="flex flex-wrap items-center justify-between gap-3 py-3 sm:min-h-16 sm:py-0">
        <span className="text-xl font-bold text-green-800">Treasurely</span>
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          <Link to="/login" className={`${secondaryClasses} whitespace-nowrap`}>Se connecter</Link>
          <Link to="/signup" className={`${submitClasses} inline-flex items-center min-h-11 whitespace-nowrap`}>Créer un compte</Link>
        </div>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2 lg:items-center py-10 lg:py-20">
        <div className="flex flex-col gap-6 text-center lg:text-left">
          <p className="text-sm font-semibold uppercase tracking-wide text-green-800">Chasses au trésor en équipe</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Votre ville cache des énigmes. Trouvez-les avant les autres.
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-xl mx-auto lg:mx-0">
            Treasurely transforme un quartier en terrain de jeu : des énigmes à résoudre sur place, en équipe,
            contre la montre. Plus vous êtes rapides, plus le score grimpe.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link to="/signup" className={`${submitClasses} inline-flex items-center justify-center gap-2 text-lg px-6`}>
              Créer un compte
              <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
            </Link>
            <a href="#how-it-works" className={`${secondaryClasses} justify-center`}>Comment ça marche</a>
          </div>
        </div>

        <HuntPreview />
      </div>
    </header>
  );
}

/** Un aperçu figé du jeu : la carte d'une chasse, et l'énigme en cours posée dessus. Une image pour les lecteurs d'écran. */
function HuntPreview() {
  return (
    <div
      role="img"
      aria-label="Aperçu de l'application : une chasse de huit énigmes, et une énigme en cours de résolution avec son chrono et son score"
      className="relative mx-auto w-full max-w-sm"
    >
      <div className="bg-white rounded-lg shadow-md p-4 pb-10 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Les secrets du Vieux-Port</h3>
        <p className="text-sm text-gray-600 mt-1">Huit énigmes entre les quais et la vieille ville. Ouvrez l'œil, tout est sous vos yeux.</p>
        <p className="flex items-center gap-2 text-sm text-gray-600 mt-3">
          <FontAwesomeIcon icon={faLocationDot} aria-hidden="true" />
          Marseille
        </p>
        <div className="flex items-center justify-between text-sm text-gray-700 mt-3">
          <span className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faMap} className="text-blue-600" aria-hidden="true" />
            8 énigmes
          </span>
          <span className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faStopwatch} className="text-purple-600" aria-hidden="true" />
            1 h 30
          </span>
          <Difficulty level={2} />
        </div>
      </div>

      <div className="relative bg-white rounded-lg shadow-lg p-4 border border-gray-200 -mt-6 ml-6 sm:ml-10">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-900">Énigme 3 sur 8</span>
          <span className="flex items-center gap-1.5 font-medium text-green-800 tabular-nums">
            <FontAwesomeIcon icon={faStopwatch} aria-hidden="true" />
            12:41
          </span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-gray-200">
          <div className="h-2 w-1/4 rounded-full bg-green-700" />
        </div>
        <p className="mt-4 text-base text-gray-900">Je garde l'entrée du port depuis 1660 et je porte le nom d'un saint. Qui suis-je ?</p>
        <p className="mt-3 flex items-center min-h-11 px-3 rounded-lg border border-gray-300 text-base text-gray-700">Fort Saint-Jean</p>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 font-medium text-green-800">
            <FontAwesomeIcon icon={faCheck} aria-hidden="true" />
            Bonne réponse
          </span>
          <span className="font-semibold text-gray-900 tabular-nums">+ 1 462 points</span>
        </div>
      </div>

      <div className="absolute -top-4 -right-2 sm:-right-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-800 text-white text-sm font-medium shadow-md">
        <FontAwesomeIcon icon={faUsers} aria-hidden="true" />
        Les Chercheurs d'or
      </div>
    </div>
  );
}
