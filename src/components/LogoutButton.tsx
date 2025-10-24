import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import { logout } from '../store/slices/authSlice';
import { useLogoutMutation } from '../store/slices/api';
import { API_CONFIG } from '../config/api';

function LogoutButton() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutPost] = useLogoutMutation();

    const logoutSSO = () => {
      // TODO : fixer la requête
        fetch(API_CONFIG.baseUrl + '/sso/logout/api', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }).catch((error) => {
          console.error('Error during SSO logout:', error);
        });
    }
    
    const handleLogout = () => {
      logoutSSO();
      logoutPost({ refresh_token: localStorage.getItem('refresh_token') as string });
      dispatch(logout());
      navigate(0);
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