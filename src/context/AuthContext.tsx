import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

interface User {
    id: number | string;
    username?: string;
    name?: string;
    email?: string;
    role: 'user' | 'admin' | 'student';
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    isStudent: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isAdmin: false,
    isStudent: false,
    login: () => { },
    logout: () => { }
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    // Verify the token against the server instead of blindly trusting
                    // whatever role/id is sitting in localStorage.
                    const me = await api.get('/auth/me');
                    // Student rows come back with avatar_url (DB column name); normalize
                    // to `avatar` so <img src={user.avatar}> doesn't break after a refresh.
                    if (me.avatar_url && !me.avatar) me.avatar = me.avatar_url;
                    setUser(me);
                    localStorage.setItem('user', JSON.stringify(me));
                } catch (e) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = (userData: User, token: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const isAdmin = user?.role === 'admin';
    const isStudent = user?.role === 'student';

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin, isStudent, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
