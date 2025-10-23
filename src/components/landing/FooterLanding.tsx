import { Link } from 'react-router';

function FooterLanding() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12 text-center bg-green-700 text-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl lg:text-3xl font-bold mb-4">
          Prêt pour l'aventure ?
        </h2>
        <p className="mb-6 text-green-50">
          Rejoignez des milliers d'explorateurs et commencez votre première chasse au trésor dès maintenant
        </p>
        <div className="mt-8 border-t border-green-600 pt-6">
          <p className="text-lg font-semibold">Treasurely</p>
          <p className="text-sm text-green-200">
            Contact: <Link to="mailto:contact@treasurely.com">contact@treasurely.com</Link>
          </p>
          <p className="text-sm text-green-200">© {new Date().getFullYear()} Treasurely. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
}

export default FooterLanding;
