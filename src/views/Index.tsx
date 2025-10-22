import { Link } from 'react-router';
import {
  faMapLocationDot,
  faPlay,
  faPuzzlePiece,
  faRocket,
  faUserPlus,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Index() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">
            {/* Hero Section */}
            <div className="px-6 py-12 text-center">
                <div className="text-6xl mb-4">
                    <FontAwesomeIcon icon={faPuzzlePiece} className="text-green-700" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                    Treasurely
                </h1>
                <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-md mx-auto">
                    Partez à l'aventure et découvrez des trésors cachés près de chez vous !
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-4 max-w-sm mx-auto">
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

            {/* Features Section */}
            <div className="px-6 py-12 space-y-8 max-w-md mx-auto">
                <div className="bg-white rounded-2xl p-6 shadow-md">
                    <div className="text-4xl mb-3 text-center">
                        <FontAwesomeIcon icon={faMapLocationDot} className="text-green-700" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                        Explorez votre ville
                    </h3>
                    <p className="text-gray-600 text-center">
                        Découvrez des lieux secrets et des histoires fascinantes en vous déplaçant dans votre environnement
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-md">
                    <div className="text-4xl mb-3 text-center">
                        <FontAwesomeIcon icon={faPuzzlePiece} className="text-green-700" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                        Résolvez des énigmes
                    </h3>
                    <p className="text-gray-600 text-center">
                        Questions, QCM, défis géographiques... Testez votre sagacité avec des énigmes variées
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-md">
                    <div className="text-4xl mb-3 text-center">
                        <FontAwesomeIcon icon={faUsers} className="text-green-700" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                        Communauté créative
                    </h3>
                    <p className="text-gray-600 text-center">
                        Participez aux chasses créées par la communauté ou créez les vôtres pour défier vos amis
                    </p>
                </div>
            </div>

            {/* Middle CTA Section */}
            <div className="px-6 py-12 max-w-md mx-auto">
                <div className="bg-white rounded-2xl p-8 shadow-lg text-center border-2 border-green-700">
                    <div className="text-5xl mb-4">
                        <FontAwesomeIcon icon={faRocket} className="text-green-700" />
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                        Lancez-vous dans votre première chasse !
                    </h2>
                    <p className="text-gray-600 mb-6 text-base lg:text-lg">
                        Des centaines de chasses au trésor vous attendent. Créez votre compte gratuitement et commencez l'aventure en moins d'une minute.
                    </p>
                    <Link
                        to="/signup"
                        className="inline-block px-8 py-3 rounded-lg bg-green-700 text-white text-lg font-semibold hover:bg-green-800 transition-colors shadow-lg"
                    >
                        <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                        Commencer gratuitement
                    </Link>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="px-6 py-12 text-center bg-green-700 text-white">
                <h2 className="text-2xl font-bold mb-4">
                    Prêt pour l'aventure ?
                </h2>
                <p className="mb-6 text-green-50">
                    Rejoignez des milliers d'explorateurs et commencez votre première chasse au trésor dès maintenant
                </p>
                <Link
                    to="/signup"
                    className="inline-block px-8 py-3 rounded-lg bg-white text-green-700 text-lg font-semibold hover:bg-green-50 transition-colors shadow-lg"
                >
                    Commencer maintenant
                </Link>
            </div>
        </div>
    );
}

export default Index;
