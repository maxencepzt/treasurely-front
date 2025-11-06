import { createContext, use } from 'react';

import type { User } from '../../types/api';

type UserContextType = {
  user: User | null;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser(): UserContextType {
  const context = use(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
