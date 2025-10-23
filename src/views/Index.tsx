import FeaturesSection from '../components/landing/FeatureSection.tsx';
import FooterLanding from '../components/landing/FooterLanding.tsx';
import HeroSection from '../components/landing/HeroSection.tsx';
import MiddleCTA from '../components/landing/MiddleCTA.tsx';

function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">
      <HeroSection />
      <FeaturesSection />
      <MiddleCTA />
      <FooterLanding />
    </div>
  );
}

export default Index;
