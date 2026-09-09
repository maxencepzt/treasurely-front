import { faKeyboard, faListCheck, faLocationDot, faQrcode, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const types = [
  { icon: faKeyboard, title: 'Texte', text: 'Une réponse à taper. Majuscules et accents ne comptent pas.' },
  { icon: faListCheck, title: 'QCM', text: 'Une ou plusieurs bonnes réponses parmi les choix.' },
  { icon: faQrcode, title: 'QR code', text: 'Un code à scanner sur place : il faut y être.' },
  { icon: faLocationDot, title: 'GPS', text: 'Se rendre au bon endroit, à quelques mètres près.' },
];

/** Les quatre formes d'énigme du jeu, et la règle du score qui les départage. */
export default function RiddleTypes() {
  return (
    <section aria-labelledby="riddle-types-title" className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16 max-w-7xl mx-auto">
      <h2 id="riddle-types-title" className="text-3xl lg:text-4xl font-bold text-gray-900 text-center">Quatre façons de se creuser la tête</h2>
      <ul className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {types.map((type) => (
          <li key={type.title} className="flex gap-4 bg-white rounded-2xl p-5 border-2 border-green-100 shadow-sm">
            <FontAwesomeIcon icon={type.icon} className="text-2xl text-green-700 mt-1 shrink-0" aria-hidden="true" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{type.title}</h3>
              <p className="text-base text-gray-700">{type.text}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-8 flex items-start sm:items-center gap-3 max-w-3xl mx-auto bg-white rounded-2xl p-5 border-2 border-green-100 shadow-sm text-base text-gray-700">
        <FontAwesomeIcon icon={faTrophy} className="text-2xl text-yellow-500 shrink-0" aria-hidden="true" />
        <span>
          Une énigme vaut jusqu'à 1 000, 2 000 ou 3 000 points selon sa difficulté, et sa valeur baisse à mesure que
          les minutes passent. Un bon coup d'œil vaut mieux qu'une longue réflexion.
        </span>
      </p>
    </section>
  );
}
