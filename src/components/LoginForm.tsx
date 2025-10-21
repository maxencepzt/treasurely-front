import { useState, FormEvent, useCallback } from 'react';
import { type SerializedError } from '@reduxjs/toolkit';
import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { getErrorMessage } from '../store/slices/api';

type loginFormProps = {
  onSubmit: (username: string, password: string) => void;
  error?: FetchBaseQueryError | SerializedError;
}

function LoginForm ({onSubmit, error}: loginFormProps) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    onSubmit?.(username, password);
  }, [onSubmit, username, password]);

  return (
    <form
      onSubmit={handleSubmit}
      method="post"
      className="bg-white flex flex-col p-6 sm:p-8 border border-gray-300 rounded-2xl shadow-lg gap-4"
    >
      <h1 className="text-3xl font-bold">Connexion</h1>

      {error && (<div className="text-red-600 text-sm">{getErrorMessage(error)}</div>)}

      <label htmlFor="username" className="flex flex-col gap-1">
        <span className="text-sm font-medium">Pseudo</span>
        <input
          type="text"
          id="username"
          name="username"
          autoComplete="username"
          required
          autoFocus
          placeholder="Pseudo"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
        />
      </label>

      <label htmlFor="password" className="flex flex-col gap-1">
        <span className="text-sm font-medium">Mot de passe</span>
        <input
          type="password"
          id="password"
          name="password"
          autoComplete="current-password"
          required
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
        />
      </label>

      <button
        type="submit"
        className="px-4 py-2 rounded-lg bg-green-800 text-white text-base font-medium cursor-pointer hover:bg-green-900 transition-colors"
      >
        Se connecter
      </button>
    </form>
  );
}

export default LoginForm;