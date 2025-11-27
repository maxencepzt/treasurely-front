import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useLogoutMutation, useLogoutSSOMutation } from '../store/slices/api';
import { logout } from '../store/slices/authSlice';
import { Loading } from './';

function LogoutButton() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
        navigate(0);
      }
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-2 gap-1.5 flex items-center justify-center rounded-lg bg-white/80 hover:bg-red-50 text-gray-700 hover:text-red-700 text-sm font-medium border border-gray-300 hover:border-red-400 shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
        >
            <FontAwesomeIcon icon={faRightFromBracket} className="text-xs" />
            <span>Déconnexion</span>
        </button>
    );
}

export default LogoutButton;