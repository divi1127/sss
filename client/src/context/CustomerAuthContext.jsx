import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const CustomerAuthContext = createContext();

export function CustomerAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('customerToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/customer/me').then(res => {
        setUser(res.data);
      }).catch(() => {
        localStorage.removeItem('customerToken');
        setToken(null);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const register = async (name, email, phone, password) => {
    const res = await api.post('/customer/register', { name, email, phone, password });
    localStorage.setItem('customerToken', res.data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const login = async (email, password) => {
    const res = await api.post('/customer/login', { email, password });
    localStorage.setItem('customerToken', res.data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('customerToken');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <CustomerAuthContext.Provider value={{ user, token, register, login, logout, isAuthenticated, loading }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  return ctx;
}
