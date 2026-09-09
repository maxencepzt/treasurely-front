import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import SettingsLayout from '../components/settings/SettingsLayout';
import SignupForm from '../components/SignupForm';
import { useUser } from '../contexts/user';
import { useLazyGetAuthentifiedUserQuery, useLoginMutation, useRegisterMutation } from '../store/slices/api';
import { setCredentials } from '../store/slices/authSlice';
import type { UserRegistration } from '../types/api';

/** L'inscription, sur le gabarit des pages de paramètres : le compte créé, la session s'ouvre dans la foulée. */
export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useUser();
  const [register, { isLoading: registering, error }] = useRegisterMutation();
  const [login, { isLoading: loggingIn }] = useLoginMutation();
  const [getMe] = useLazyGetAuthentifiedUserQuery();

  // Déjà connecté : rien à créer
  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  async function handleSubmit(registration: UserRegistration) {
    try {
      await register(registration).unwrap();
    } catch {
      return; // le formulaire affiche les violations
    }
    try {
      const session = await login({ nickname: registration.nickname, password: registration.plainPassword }).unwrap();
      dispatch(setCredentials({ token: session.token, refresh_token: session.refresh_token }));
      await getMe(null).unwrap();
      navigate('/', { replace: true });
    } catch {
      navigate('/login'); // le compte existe : la connexion manuelle prend le relais
    }
  }

  return (
    <SettingsLayout title="Créer un compte">
      <p className="text-base text-gray-700 mb-4">Quelques informations, et vous pourrez rejoindre une équipe et partir en chasse.</p>
      <SignupForm onSubmit={handleSubmit} isSaving={registering || loggingIn} error={error} />
    </SettingsLayout>
  );
}
