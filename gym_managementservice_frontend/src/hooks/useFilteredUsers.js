import { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Custom hook pro načítání uživatelů podle zadaných filtrů.
 * Očekává objekt s volitelnými klíči:
 *  - entryStart, entryEnd (filtrace podle vstupů)
 *  - subscriptionStart, subscriptionEnd (filtrace podle předplatného)
 *
 * @param {Object} filters objekt s filtry
 * @returns {Object} { users, loading, error }
 */
export default function useFilteredUsers(filters) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchFilteredUsers = async () => {
        try {
            setLoading(true);
            setError('');
            // Sestavení parametrů dotazu
            const params = { ...filters };
            const response = await api.get('/users/detailed', { params });
            setUsers(response.data || []);
        } catch (err) {
            console.error('Error fetching filtered users:', err);
            setError('Nepodařilo se načíst filtrovaná data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFilteredUsers();
    }, [filters]);

    return { users, loading, error };
}
