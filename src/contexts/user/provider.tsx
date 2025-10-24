import { createContext, useContext, type ReactNode } from 'react';
import type { User } from '../../types/api';
import { useGetAuthentifiedUserQuery } from '../../store/slices/api';
import { Loading } from '../../components';

type UserContextType = {
  user: User | null;
}

const UserContext = createContext<UserContextType>({ user: null });

export function UserProvider({ children }: { children: ReactNode }) {
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

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
