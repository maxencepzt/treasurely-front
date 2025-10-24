import type { User } from '../../types/api';
import { createContext, useContext } from 'react';

type UserContextType = {
  user: User | null;
}

export const UserContext = createContext<UserContextType>({ user: null });

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
