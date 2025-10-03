import { useState } from 'react';
import { Loading, LoginForm } from '../components';
import { login } from '../services/api/login.ts';

function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(username: string, password: string) {
    setIsLoading(true);

    login(username, password)
      .then((json) => {
        if (json.code && json.message) {
          setError(json.message);
          return;
        }

        console.log("Login successful:", json);
        console.log("Token:", json.token);

        setIsLoading(false);
      }).finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      {isLoading ? (<Loading/>) : (<LoginForm onSubmit={handleSubmit} error={error}/>)}
    </>
  );
}

export default Login;