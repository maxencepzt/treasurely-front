import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { API_CONFIG } from '../config/api';
import { useUser } from '../contexts/user';
import type { rootState } from '../store';

/**
 * Ouvre la façade concepteur du back : le jeton est échangé contre une session Symfony
 * (`POST /sso/login`), qui redirige le navigateur vers le tableau de bord concepteur.
 */
export function useDesignerSso() {
  const token = useSelector((state: rootState) => state.auth.token);
  const { user } = useUser();

  return useCallback(async () => {
    const response = await fetch(API_CONFIG.baseUrl + '/sso/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, username: user?.nickname }),
      credentials: 'include',
    });

    if (response.redirected) {
      window.location.href = response.url;
    } else {
      console.error('SSO login failed:', await response.json());
    }
  }, [token, user?.nickname]);
}
