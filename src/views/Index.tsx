import FeaturesSection from '../components/landing/FeatureSection.tsx';
import FooterCTA from '../components/landing/FooterCTA.tsx';
import HeroSection from '../components/landing/HeroSection.tsx';
import MiddleCTA from '../components/landing/MiddleCTA.tsx';

function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">
      <HeroSection />
      <FeaturesSection />
      <MiddleCTA />
      <FooterCTA />
    </div>
  );
}

export default Index;
