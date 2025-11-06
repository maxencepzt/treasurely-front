import { type ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { rootState } from '../store';
import { useRefreshTokenMutation } from '../store/slices/api';
import { setCredentials } from '../store/slices/authSlice';
import { Loading } from './index.ts';

export const TokenRefresh = ({ children }: {children: ReactNode}) => {
    const [refreshToken] = useRefreshTokenMutation();
    const dispatch = useDispatch();
    const token = useSelector((state: rootState) => state.auth.token);
    const [isRefreshing, setIsRefreshing] = useState(true);

    useEffect(() => {
        const refresh = async () => {
            const storedRefreshToken = localStorage.getItem('refresh_token');

            if (storedRefreshToken && !token) {
                try {
                    const result = await refreshToken({ refresh_token: storedRefreshToken }).unwrap();
                    dispatch(setCredentials(result));
                } catch (error) {
                    console.error(error);
                }
            }
            setIsRefreshing(false);
        };

        refresh();
    }, [refreshToken, dispatch, token]);

    if (isRefreshing) {
        return <Loading/>;
    }

    return <>{children}</>;
};
