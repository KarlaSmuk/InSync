import { createContext } from 'react';
import type { User } from './UserProvider';

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  loading: boolean;
  error: boolean;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);
