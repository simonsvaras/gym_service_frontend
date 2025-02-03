/**
 * Custom hook pro načtení detailních údajů o všech uživatelích:
 *  - základní údaje (id, jméno, příjmení, email, fotka)
 *  - informace o předplatném (aktivní a poslední subscription)
 *  - historie vstupů
 */
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function useDetailedUsers() {
    const [users, setUsers] = useState([]);     // načtená data
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDetailedUsers = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await api.get('/users/detailed');
                const data = response.data || [];
                setUsers(data);
            } catch (err) {
                console.error('Chyba při načítání detailních údajů uživatelů:', err);
                setError('Nepodařilo se načíst detailní údaje uživatelů');
            } finally {
                setLoading(false);
            }
        };

        fetchDetailedUsers();
    }, []);

    return {
        users,
        loading,
        error
    };
}
