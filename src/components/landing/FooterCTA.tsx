import { Link } from 'react-router';

function FooterCTA() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12 text-center bg-green-700 text-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl lg:text-3xl font-bold mb-4">
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

export default FooterCTA;
