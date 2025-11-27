import { useUser } from '../contexts/user';
import Dashboard from './dashboard/Dashboard';
import LandingPage from './landing-page/LandingPage';

function Index() {
  const { user } = useUser();

  return user ? <Dashboard /> : <LandingPage />;
}

export default Index;
