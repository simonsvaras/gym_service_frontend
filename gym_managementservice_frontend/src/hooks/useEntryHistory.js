/**
 * @file useEntryHistory.js
 * Custom hook pro načtení záznamů o vstupech (entry history) podle userId.
 */
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function useEntryHistory(userId) {
    const [checkInHistory, setCheckInHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                setLoading(true);
                setError('');
                const resp = await api.get(`/entry-history/user/${userId}`);
                setCheckInHistory(resp.data);
            } catch (err) {
                console.error('Chyba při načítání záznamů o vstupech:', err);
                setError('Nepodařilo se načíst záznamy o vstupech.');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchEntries();
        }
    }, [userId]);

    return { checkInHistory, loading, error };
}
