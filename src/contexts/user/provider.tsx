import { type ReactNode } from 'react';
import { useGetAuthentifiedUserQuery } from '../../store/slices/api';
import { Loading } from '../../components';
import { UserContext } from './';

type UserProviderProps = {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { data: user, isLoading } = useGetAuthentifiedUserQuery(null);

  if (isLoading) {
    return (<Loading/>);
  }

  return (
    <UserContext.Provider value={{ user: user ?? null }}>
      {children}
    </UserContext.Provider>
  );
}

