import { faFlagCheckered, faMapLocationDot, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const steps = [
  {
    icon: faUsers,
    title: 'Formez votre équipe',
    text: "Créez une équipe ou rejoignez celle de vos amis avec son code. On cherche à plusieurs, on gagne ensemble.",
  },
  {
    icon: faMapLocationDot,
    title: 'Choisissez une chasse',
    text: "Parcourez les chasses ouvertes près de chez vous : un lieu, une durée, une difficulté, et c'est parti.",
  },
  {
    icon: faFlagCheckered,
    title: 'Résolvez les énigmes sur place',
    text: "Chaque énigme s'ouvre après la précédente. Le chrono tourne et le score fond : chaque seconde compte.",
  },
];

/** Le déroulé d'une partie en trois étapes, numérotées pour se lire dans l'ordre. */
export default function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16 max-w-7xl mx-auto scroll-mt-6">
      <h2 id="how-it-works-title" className="text-3xl lg:text-4xl font-bold text-gray-900 text-center">Comment ça marche</h2>
      <ol className="mt-8 grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="flex flex-col gap-3 bg-white rounded-2xl p-6 border-2 border-green-100 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-green-800 text-white font-bold shrink-0">{index + 1}</span>
              <FontAwesomeIcon icon={step.icon} className="text-2xl text-green-700" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
            <p className="text-base text-gray-700">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
