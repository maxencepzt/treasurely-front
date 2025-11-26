import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { useLogoutMutation, useLogoutSSOMutation } from '../store/slices/api';
import { logout } from '../store/slices/authSlice';
import { Loading } from './';

function LogoutButton() {
    const dispatch = useDispatch();
    const [logoutPost] = useLogoutMutation();
    const [logoutSSOPost] = useLogoutSSOMutation();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
      setIsLoading(true);
      try {
        // Logout SSO first
        await logoutSSOPost().unwrap().catch((error) => {
          console.error('Error during SSO logout:', error);
        });

        // Then logout from API
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          await logoutPost({ refresh_token: refreshToken }).unwrap().catch((error) => {
            console.error('Error during logout:', error);
          });
        }
      } finally {
        // Always clear local state and navigate
        dispatch(logout());
        window.location.href = "/";
      }
    };

    if (isLoading) {
        return <Loading />;
    }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="
        w-full text-left px-5 py-4 rounded-xl border-2 shadow-sm transition
        hover:shadow-md active:scale-[0.98]
        border-red-200 bg-red-50 text-red-800 hover:bg-red-100
      "
    >
      Se déconnecter
    </button>
  );
}

export default LogoutButton;