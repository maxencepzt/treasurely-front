import { type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type FeatureCardProps = {
  icon: IconDefinition;
  title: string;
  description: string;
  className?: string;
};

function FeatureCard({ icon, title, description, className = '' }: FeatureCardProps) {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-md ${className}`}>
      <div className="text-4xl mb-3 text-center">
        <FontAwesomeIcon icon={icon} className="text-green-700" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
        {title}
      </h3>
      <p className="text-gray-600 text-center">
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;
