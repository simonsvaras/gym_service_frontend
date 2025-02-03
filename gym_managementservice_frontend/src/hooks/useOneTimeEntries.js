/**
 * @file useOneTimeEntries.js
 * Custom hook pro načtení jednorázových vstupů buď pro konkrétního uživatele, nebo všech (pokud userId není uvedeno).
 */

import { useState, useEffect } from 'react';
import api from '../services/api';

export default function useOneTimeEntries(userId) {
    const [entries, setEntries] = useState([]);       // všechna stažená data
    const [oneTimeCount, setOneTimeCount] = useState(0);  // počet nevyužitých vstupů
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOneTimeEntries = async () => {
            try {
                setLoading(true);
                setError('');

                // Pokud je `userId` předáno, načteme z /user-one-time-entries/user/:id
                // Pokud ne, načteme z /one-time-entries (dle toho, jak to máš v API)
                let response;
                if (userId) {
                    response = await api.get(`/user-one-time-entries/user/${userId}`);
                } else {
                    response = await api.get('/one-time-entries');
                }

                const data = response.data || [];
                setEntries(data);

                // Spočítáme všechny položky, které mají isUsed = false
                const notUsed = data.filter(entry => !entry.isUsed);
                setOneTimeCount(notUsed.length);
            } catch (err) {
                console.error('Chyba při načítání jednorázových vstupů:', err);
                setError('Nepodařilo se načíst jednorázové vstupy');
            } finally {
                setLoading(false);
            }
        };

        fetchOneTimeEntries();
    }, [userId]);

    return {
        entries,
        oneTimeCount,
        loading,
        error
    };
}
