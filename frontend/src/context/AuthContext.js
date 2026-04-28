import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [voter, setVoter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ivote_token');
    if (token) {
      API.get('/auth/me')
        .then(res => setVoter(res.data))
        .catch(() => localStorage.removeItem('ivote_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (name, voterId) => {
    const res = await API.post('/auth/login', { name, voterId });
    localStorage.setItem('ivote_token', res.data.token);
    setVoter(res.data.voter);
    return res.data.voter;
  };

  const logout = () => {
    localStorage.removeItem('ivote_token');
    setVoter(null);
  };

  return (
    <AuthContext.Provider value={{ voter, login, logout, loading, setVoter }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
