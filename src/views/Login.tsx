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
      {isLoading ? (<Loading/>) : (<LoginForm onSubmit={handleSubmit} error={error}/>)}
    </>
  );
}

export default Login;