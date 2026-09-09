import FooterLanding from '../../components/landing/FooterLanding.tsx';
import HeroSection from '../../components/landing/HeroSection.tsx';
import HowItWorks from '../../components/landing/HowItWorks.tsx';
import RiddleTypes from '../../components/landing/RiddleTypes.tsx';

/** La page du visiteur : la promesse, le déroulé, les énigmes, et la connexion comme seule porte. */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">
      <HeroSection />
      <HowItWorks />
      <RiddleTypes />
      <FooterLanding />
    </div>
  );
}
