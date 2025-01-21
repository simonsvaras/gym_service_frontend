// src/pages/ClosurePage.jsx
import React, { useState } from 'react';
import api from '../services/api';
import styles from './ClosurePage.module.css';

function ClosurePage() {
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [entries, setEntries] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const totalPrice = transactions.reduce((acc, tx) => acc + (tx.amount || 0), 0);
    const totalEntries = entries.length;

    const handleFetchData = async () => {
        if (!start || !end) {
            setError('Prosím zadej datum a čas OD a DO.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            const [entriesRes, transactionsRes] = await Promise.all([
                api.get('/entry-history/range', { params: { start, end } }),
                api.get('/transaction-history/range', { params: { start, end } }),
            ]);

            setEntries(entriesRes.data);
            setTransactions(transactionsRes.data);
        } catch (err) {
            console.error('Chyba při načítání dat z uzávěrky:', err);
            setError('Nepodařilo se načíst data. Zkontroluj konzoli nebo kontaktuj správce.');
        } finally {
            setLoading(false);
        }
    };

    // Helper funkce pro formátování data
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Měsíce jsou indexovány od 0
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    };

    return (
        <div className={styles.closureContainer}>
            <h2>Uzávěrka</h2>

            <div className={styles.formRow}>
                <label>Od:</label>
                <input
                    type="datetime-local"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                />

                <label>Do:</label>
                <input
                    type="datetime-local"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                />

                <button onClick={handleFetchData} disabled={loading}>
                    {loading ? 'Načítám...' : 'Fetch data'}
                </button>
            </div>

            {error && <p className={styles.errorMsg}>{error}</p>}

            {/* Flex kontejner pro dvě tabulky vedle sebe */}
            <div className={styles.tablesRow}>
                {/* Tabulka transakcí */}
                <div className={styles.tableWrapper}>
                    <h3>Historie transakcí</h3>
                    {transactions.length > 0 ? (
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th>Datum/čas</th>
                                <th>Jméno uživatele</th>
                                <th>Položka</th>
                                <th>Cena</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transactions.map((tx, index) => (
                                <tr key={index}>
                                    <td>{formatDate(tx.transactionDate)}</td>
                                    <td>{tx.firstName + " " + tx.lastName || tx.userId}</td>
                                    <td>{tx.purchaseType /* nebo itemName */}</td>
                                    <td>{tx.amount} Kč</td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot>
                            <tr>
                                <td colSpan="3"><strong>Celkem</strong></td>
                                <td><strong>{totalPrice} Kč</strong></td>
                            </tr>
                            </tfoot>
                        </table>
                    ) : (
                        <p className={styles.noData}>Žádné transakce v tomto období.</p>
                    )}
                </div>

                {/* Tabulka vstupů */}
                <div className={styles.tableWrapper}>
                    <h3>Historie vstupů</h3>
                    {entries.length > 0 ? (
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th>Datum/čas</th>
                                <th>Jméno uživatele</th>
                            </tr>
                            </thead>
                            <tbody>
                            {entries.map((en, index) => (
                                <tr key={index}>
                                    <td>{formatDate(en.entryDate)}</td>
                                    <td>{en.firstName + " " + en.lastName || en.userID}</td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot>
                            <tr>
                                <td colSpan="2">
                                    <strong>Celkový počet vstupů: {totalEntries}</strong>
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                    ) : (
                        <p className={styles.noData}>Žádné vstupy v tomto období.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ClosurePage;
