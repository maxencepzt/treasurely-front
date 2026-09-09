import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import SignupForm from '../components/SignupForm';
import { useUser } from '../contexts/user';
import { useLazyGetAuthentifiedUserQuery, useLoginMutation, useRegisterMutation } from '../store/slices/api';
import { setCredentials } from '../store/slices/authSlice';
import type { UserRegistration } from '../types/api';

/** L'inscription : le compte créé, la session s'ouvre dans la foulée et l'accueil du joueur s'affiche. */
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
    <div className="px-6 py-12 max-w-md mx-auto">
      <div className="bg-white flex flex-col p-6 sm:p-8 border border-gray-300 rounded-2xl shadow-lg gap-4">
        <h1 className="text-3xl font-bold">Créer un compte</h1>
        <p className="text-base text-gray-700">Quelques informations, et vous pourrez rejoindre une équipe et partir en chasse.</p>
        <SignupForm onSubmit={handleSubmit} isSaving={registering || loggingIn} error={error} />
      </div>
    </div>
  );
}
