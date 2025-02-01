/**
 * @file useUserData.js
 * Custom hook pro načtení jednoho uživatele podle userId.
 */
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function useUserData(userId) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await api.get(`/users/${userId}`);
                setUser(response.data);
            } catch (err) {
                console.error('Chyba při načítání uživatele:', err);
                setError('Nepodařilo se načíst data uživatele.');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUser();
        }
    }, [userId]);

    return { user, loading, error };
}
