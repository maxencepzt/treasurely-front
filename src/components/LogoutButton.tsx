import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import { logout } from '../store/slices/authSlice';
import { useLogoutMutation } from '../store/slices/api';

function LogoutButton() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutPost] = useLogoutMutation();
    
    const handleLogout = () => {
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