import { faMapLocationDot, faPuzzlePiece, faUsers } from '@fortawesome/free-solid-svg-icons';

import FeatureCard from './FeatureCard';

function FeaturesSection() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          icon={faMapLocationDot}
          title="Explorez votre ville"
          description="Découvrez des lieux secrets et des histoires fascinantes en vous déplaçant dans votre environnement"
        />
        <FeatureCard
          icon={faPuzzlePiece}
          title="Résolvez des énigmes"
          description="Questions, QCM, défis géographiques... Testez votre sagacité avec des énigmes variées"
        />
        <FeatureCard
          icon={faUsers}
          title="Communauté créative"
          description="Participez aux chasses créées par la communauté ou créez les vôtres pour défier vos amis"
          className="md:col-span-2 lg:col-span-1"
        />
      </div>
    </div>
  );
}

export default FeaturesSection;
