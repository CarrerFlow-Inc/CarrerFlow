import { useContext } from 'react';
import { AuthContext } from '../context/auth-context-definition';

export const useAuth = () => useContext(AuthContext);
