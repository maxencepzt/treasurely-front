import { faFire } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MAX = 3;

/**
 * La difficulté d'une chasse ou d'une énigme, de 1 à 3 flammes : une image nommée pour les
 * lecteurs d'écran, les flammes éteintes restent visibles en gris pour donner l'échelle.
 */
export default function Difficulty({ level, className = '' }: { level: number; className?: string }) {
  const label = `Difficulté ${level} sur ${MAX}`;

  return (
    <span role="img" aria-label={label} title={label} className={`inline-flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: MAX }, (_, index) => (
        <FontAwesomeIcon
          key={index}
          icon={faFire}
          className={index < level ? 'text-orange-500' : 'text-gray-300'}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}
