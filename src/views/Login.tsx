import { useEffect } from 'react';

import { Loading, LoginForm } from '../components';
import { useLoginMutation } from '../store/slices/api';

function Login() {
  const [loginPost, { data, isLoading, error }] = useLoginMutation();

  async function handleSubmit(username: string, password: string) {
    try {
      await loginPost({ nickname: username, password }).unwrap();
    } catch (error) {
      console.error('Failed to login:', error);
    }
  }

  useEffect(() => {
    if (data?.token) {
      console.log(data?.token);
      console.log(data);
    }
  }, [data]);

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