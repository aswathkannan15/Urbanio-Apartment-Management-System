/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':  return { user: action.payload, isAuthenticated: true,  loading: false };
    case 'LOGOUT': return { user: null,            isAuthenticated: false, loading: false };
    case 'LOADED': return { ...state, loading: false };
    default:       return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer,
    { user: null, isAuthenticated: false, loading: true });

  // On first render — restore session from localStorage (handles page refresh)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user  = localStorage.getItem('user');
    if (token && user) dispatch({ type: 'LOGIN', payload: JSON.parse(user) });
    else               dispatch({ type: 'LOADED' });
  }, []);

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user',  JSON.stringify(data));
    dispatch({ type: 'LOGIN', payload: data });
    return data.role;   // caller uses this to redirect
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  if (state.loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
                  height:'100vh', background:'#0c0e14', color:'#7b82a8' }}>
      Loading...
    </div>
  );

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}