import { createContext } from 'react';
import { AuthContextType } from './App';

export const AuthContext = createContext<AuthContextType>({
	accessToken: null,
	setAccessToken: () => {},
});
