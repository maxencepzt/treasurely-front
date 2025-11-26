import { useNavigate } from 'react-router';

import { LogoutButton } from '../components';
import FeaturesSection from '../components/landing/FeatureSection.tsx';
import FooterLanding from '../components/landing/FooterLanding.tsx';
import HeroSection from '../components/landing/HeroSection.tsx';
import MiddleCTA from '../components/landing/MiddleCTA.tsx';
import LoginSSOButton from '../components/LoginSSOButton';
import { useUser } from '../contexts/user';

function Index() {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">
      {(user && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
          >
            Mon Tableau de Bord
          </button>
          <LogoutButton/>
          <LoginSSOButton/>
        </div>
      ))}
      <HeroSection />
      <FeaturesSection />
      <MiddleCTA />
      <FooterLanding />
    </div>
  );
}

export default Index;
