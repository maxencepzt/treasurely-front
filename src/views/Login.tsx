import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router';

import { Loading, LoginForm } from '../components';
import { useUser } from '../contexts/user';
import { useLazyGetAuthentifiedUserQuery, useLoginMutation } from '../store/slices/api';
import { setCredentials } from '../store/slices/authSlice';

function Login() {
  const dispatch = useDispatch();
  const [loginPost, { error }] = useLoginMutation();
  const [getMe] = useLazyGetAuthentifiedUserQuery();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const navigate = useNavigate();
  const { user } = useUser();

  async function handleSubmit(username: string, password: string) {
    try {
      setIsAuthenticating(true);
      const loginResponse = await loginPost({ nickname: username, password }).unwrap();

      dispatch(setCredentials({ token: loginResponse.token, refresh_token: loginResponse.refresh_token }));

      await getMe(null).unwrap();
      setIsAuthenticating(false);
    } catch (error) {
      console.error('Failed to login:', error);
      setIsAuthenticating(false);
    }
  }

  // Si l'utilisateur est déjà connecté (et qu'on ne fait pas un nouveau login), rediriger
  useEffect(() => {
    if (user && !isAuthenticating) {
      navigate('/');
    }
  }, [user, isAuthenticating, navigate]);

  return (
    <>
      {isAuthenticating ? (<Loading/>) : (
        <div className="px-6 py-12 space-y-8 max-w-md mx-auto">
          <LoginForm onSubmit={handleSubmit} error={error}/>
          <p className="text-base text-gray-700 text-center">
            Pas encore de compte ? <Link to="/signup" className="font-medium text-green-800 underline underline-offset-4">Créer un compte</Link>
          </p>
        </div>
      )}
    </>
  );
}

export default Login;