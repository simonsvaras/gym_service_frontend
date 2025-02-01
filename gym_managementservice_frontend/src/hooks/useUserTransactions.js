/**
 * @file useUserTransactions.js
 * Custom hook pro načtení transakcí (transaction history) podle userId.
 */
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function useUserTransactions(userId) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                setError('');
                const resp = await api.get(`/transaction-history/user/${userId}`);
                setTransactions(resp.data);
            } catch (err) {
                console.error('Chyba při načítání transakcí:', err);
                setError('Nepodařilo se načíst transakce.');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchTransactions();
        }
    }, [userId]);

    return { transactions, loading, error };
}
