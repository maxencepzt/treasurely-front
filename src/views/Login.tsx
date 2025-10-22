import { useEffect } from 'react';

import { Loading, LoginForm } from '../components';
import { useLoginMutation } from '../store/slices/api';
import { setCredentials } from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

function Login() {
  const dispatch = useDispatch();
  const [loginPost, { data, isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();

  async function handleSubmit(username: string, password: string) {
    try {
      await loginPost({ nickname: username, password }).unwrap();
    } catch (error) {
      console.error('Failed to login:', error);
    }
  }

  useEffect(() => {
    if (data?.token && data?.refresh_token) {
      dispatch(setCredentials({ token: data.token, refresh_token: data.refresh_token }));

      navigate('/');
    }
  }, [data, dispatch]);

  return (
    <>
      {isLoading ? (<Loading/>) : (
        <div className="px-6 py-12 space-y-8 max-w-md mx-auto">
          <LoginForm onSubmit={handleSubmit} error={error}/>
        </div>
      )}
    </>
  );
}

export default Login;