import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { API_CONFIG } from '../config/api';
import { useUser } from '../contexts/user';
import type { rootState } from '../store';

function LoginSSOButton() {
  const token = useSelector((state: rootState) => state.auth.token);
  const { user } = useUser();

  const redirectToBackend = useCallback(async () => {
    const response = await fetch(API_CONFIG.baseUrl + '/sso/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, username:  user?.nickname }),
      credentials: 'include',
    });

    if (response.redirected) {
      window.location.href = response.url;
    } else {
      const data = await response.json();
      console.error('SSO login failed:', data);
    }
  }, [token, user?.nickname]);

  return (
    <button type="button" onClick={redirectToBackend} className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
      Accéder à l'administration
    </button>
  );
}

export default LoginSSOButton;
