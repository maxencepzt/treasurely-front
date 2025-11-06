import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import { useLogoutMutation, useLogoutSSOMutation } from '../store/slices/api';
import { logout } from '../store/slices/authSlice';

function LogoutButton() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutPost] = useLogoutMutation();
    const [logoutSSOPost] = useLogoutSSOMutation();

    const handleLogout = async () => {
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
    
    return (
        <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
        >
            Se déconnecter
        </button>
    );
}

export default LogoutButton;