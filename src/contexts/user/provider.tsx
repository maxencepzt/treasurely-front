import { type ReactNode, useMemo } from 'react';

import { Loading } from '../../components';
import { useGetAuthentifiedUserQuery } from '../../store/slices/api';
import { UserContext } from './';

type UserProviderProps = {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { data: user, isLoading } = useGetAuthentifiedUserQuery(null);

  // Memoize the context value so it's stable between renders
  const value = useMemo(() => ({ user: user ?? null }), [user]);

  if (isLoading) {
    return (<Loading/>);
  }

  return (
    <UserContext value={value}>
      {children}
    </UserContext>
  );
}
