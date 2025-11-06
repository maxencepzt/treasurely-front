import FeaturesSection from '../components/landing/FeatureSection.tsx';
import FooterLanding from '../components/landing/FooterLanding.tsx';
import HeroSection from '../components/landing/HeroSection.tsx';
import MiddleCTA from '../components/landing/MiddleCTA.tsx';
import { useUser } from '../contexts/user';
import { LogoutButton } from '../components';

function Index() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">
      {(user && (<LogoutButton/>))}
      <HeroSection />
      <FeaturesSection />
      <MiddleCTA />
      <FooterLanding />
    </div>
  );
}

export default Index;
