import { BackButton } from '../../components';
import PrivacySection from '../../components/landing/PrivacySection.tsx';

/** La section « Vos données » seule, pour y mener depuis l'inscription et le pied de page, connecté ou non. */
export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">
      <div className="px-4 sm:px-6 lg:px-8 pt-4 max-w-7xl mx-auto">
        <BackButton />
      </div>
      <PrivacySection />
    </div>
  );
}
