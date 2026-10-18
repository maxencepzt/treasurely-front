import {
  faClock,
  faCookieBite,
  faDatabase,
  faEye,
  faGamepad,
  faScaleBalanced,
  faServer,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CONTACT = 'maxence.poizat@gmail.com';

const contactLink = (
  <a href={`mailto:${CONTACT}`} className="font-medium text-green-800 underline underline-offset-4">
    {CONTACT}
  </a>
);

const topics = [
  {
    icon: faUserShield,
    title: 'Qui en est responsable',
    body: (
      <p>
        Maxence Poizat, qui édite Treasurely à titre personnel et sans but commercial. Pour toute question sur vos
        données : {contactLink}.
      </p>
    ),
  },
  {
    icon: faDatabase,
    title: 'Ce qui est collecté',
    body: (
      <ul className="list-disc pl-5 space-y-1">
        <li>
          À l'inscription : pseudo, prénom, nom, e-mail, date de naissance, genre et mot de passe, enregistré sous une
          forme illisible. Le téléphone, la description et la photo sont facultatifs.
        </li>
        <li>En jouant : vos équipes, vos chasses, le nombre d'essais, les horaires, vos scores et vos temps.</li>
        <li>
          Jamais enregistrées : votre position, comparée au point d'une énigme GPS puis oubliée, et les images de la
          caméra, lues sur votre téléphone.
        </li>
      </ul>
    ),
  },
  {
    icon: faGamepad,
    title: 'Pourquoi',
    body: (
      <p>
        Pour faire fonctionner votre compte et le jeu, le service que vous demandez en vous inscrivant (article 6.1.b du
        RGPD), et pour le protéger des abus : limite des tentatives de connexion, journaux techniques (intérêt
        légitime, article 6.1.f). Ni publicité, ni mesure d'audience, ni revente.
      </p>
    ),
  },
  {
    icon: faEye,
    title: 'Qui les voit',
    body: (
      <p>
        Les autres joueurs voient votre pseudo, votre photo et vos résultats dans les classements. Si votre profil est
        public, ils voient aussi votre description, votre genre, vos statistiques et vos équipes. Les membres de vos
        équipes conceptrices voient vos prénom et nom. Votre e-mail, votre téléphone et votre date de naissance ne sont
        montrés qu'à vous et à l'administrateur.
      </p>
    ),
  },
  {
    icon: faServer,
    title: 'Où elles sont hébergées',
    body: (
      <p>
        L'application et l'API sont hébergées par Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723,
        États-Unis ; l'API tourne à Paris. La base de données est confiée à Supabase, dans sa région de Paris. Ces deux
        sociétés sont américaines : Vercel est certifiée Data Privacy Framework, Supabase s'engage par les clauses
        contractuelles types de la Commission européenne.
      </p>
    ),
  },
  {
    icon: faClock,
    title: 'Combien de temps',
    body: (
      <p>
        Tant que votre compte existe. Le supprimer, depuis vos paramètres, efface vos informations, vos participations
        et vos scores ; transférez d'abord les équipes et les chasses dont vous êtes propriétaire. Une connexion reste
        ouverte 30 jours au plus, et l'hébergeur ne garde ses journaux techniques que brièvement.
      </p>
    ),
  },
  {
    icon: faCookieBite,
    title: 'Cookies et stockage',
    body: (
      <p>
        Aucun cookie publicitaire ni de mesure d'audience, donc aucun bandeau. Seuls servent un cookie de session pour
        l'espace concepteur, votre jeton de connexion gardé dans le navigateur et le cache qui affiche la page hors
        ligne.
      </p>
    ),
  },
  {
    icon: faScaleBalanced,
    title: 'Vos droits',
    body: (
      <p>
        Accès, rectification, effacement, limitation, opposition et portabilité. Modifiez vos informations ou supprimez
        votre compte vous-même dans les paramètres ; pour le reste, écrivez à {contactLink}, réponse sous un mois. Vous
        pouvez aussi saisir la{' '}
        <a href="https://www.cnil.fr/fr/plaintes" className="font-medium text-green-800 underline underline-offset-4">
          CNIL
        </a>
        .
      </p>
    ),
  },
];

/** Ce que Treasurely fait des données de ses joueurs, au sens du RGPD : qui, quoi, pourquoi, où, combien de temps. */
export default function PrivacySection() {
  return (
    <section id="donnees" aria-labelledby="donnees-title" className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16 max-w-7xl mx-auto scroll-mt-6">
      <h2 id="donnees-title" className="text-3xl lg:text-4xl font-bold text-gray-900 text-center">Vos données</h2>
      <p className="mt-4 text-lg text-gray-700 text-center max-w-3xl mx-auto">
        Treasurely ne demande que ce qu'il faut pour jouer, ne vend rien et ne suit pas votre navigation. Mise à jour le
        18 octobre 2026.
      </p>
      <ul className="mt-8 grid gap-4 grid-cols-1 md:grid-cols-2">
        {topics.map((topic) => (
          <li key={topic.title} className="flex gap-4 bg-white rounded-2xl p-5 border-2 border-green-100 shadow-sm">
            <FontAwesomeIcon icon={topic.icon} className="text-2xl text-green-700 mt-1 shrink-0" aria-hidden="true" />
            <div className="text-base text-gray-700">
              <h3 className="text-lg font-semibold text-gray-900">{topic.title}</h3>
              {topic.body}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
