import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/** Une tuile de statistique : l'icône décore, le titre nomme, la valeur parle. */
export default function ProfileStatCard({ title, icon, value }: { title: string; icon: IconDefinition; value: number | string }) {
  return (
    <div className="bg-white rounded-2xl px-4 py-5 shadow-sm text-center border border-gray-200">
      <FontAwesomeIcon icon={icon} className="text-2xl text-green-700 mb-2" aria-hidden="true" />
      <p className="text-2xl font-bold text-gray-900 mb-1">
        {value}
      </p>
      <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
        {title}
      </h3>
    </div>
  );
}
