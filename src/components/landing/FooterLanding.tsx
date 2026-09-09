import { Link } from 'react-router';
import { faArrowRight, faCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/** Le dernier appel à jouer, puis le pied de page : le nom, le code source, l'année. */
export default function FooterLanding() {
  return (
    <footer className="mt-auto bg-green-800 text-white">
      <div className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16 max-w-7xl mx-auto flex flex-col items-center gap-6 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold">Prêt à jouer ?</h2>
        <p className="text-lg text-green-50 max-w-2xl">
          Créez votre compte, rejoignez une équipe et lancez votre première chasse. Vous organisez ? L'espace
          concepteur s'ouvre avec le même compte.
        </p>
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 min-h-12 px-6 rounded-lg bg-white text-green-900 text-lg font-medium hover:bg-green-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-green-800"
        >
          Créer un compte
          <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
        </Link>
        <p className="text-base text-green-50">
          Déjà un compte ?{' '}
          <Link to="/login" className="font-medium text-white underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded">
            Se connecter
          </Link>
        </p>
      </div>
      <div className="border-t border-green-700">
        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-green-100">
          <span className="font-semibold text-white">Treasurely</span>
          <a
            href="https://github.com/maxencepzt/treasurely-front"
            className="inline-flex items-center gap-2 min-h-11 underline underline-offset-4 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
          >
            <FontAwesomeIcon icon={faCode} aria-hidden="true" />
            Code source
          </a>
          <span>© {new Date().getFullYear()} Treasurely</span>
        </div>
      </div>
    </footer>
  );
}
