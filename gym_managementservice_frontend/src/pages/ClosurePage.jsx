import React, { useState } from 'react';
import api from '../services/api';
import styles from './ClosurePage.module.css';
import TransactionHistoryTable from '../components/TransactionHistoryTable';
import EntryHistoryTable from '../components/EntryHistoryTable';

/**
 * Komponenta ClosurePage zajišťuje zobrazení uzávěrky gymu.
 * Umožňuje uživatelům vybrat časový rozsah a zobrazit historii vstupů a transakcí.
 */
function ClosurePage() {
    // Stavy pro ukládání hodnot formuláře a načtených dat
    const [start, setStart] = useState(''); // Počáteční datum a čas
    const [end, setEnd] = useState('');     // Konečné datum a čas
    const [entries, setEntries] = useState([]);           // Historie vstupů
    const [transactions, setTransactions] = useState([]); // Historie transakcí
    const [loading, setLoading] = useState(false);        // Indikátor načítání
    const [error, setError] = useState('');               // Chybová zpráva

    // Výpočet celkové ceny ze všech transakcí
    const totalPrice = transactions.reduce((acc, tx) => acc + (tx.amount || 0), 0);

    // Výpočet celkového počtu vstupů
    const totalEntries = entries.length;

    /**
     * Funkce pro načtení dat z API na základě vybraného časového rozsahu.
     * Používá Promise.all pro paralelní načítání vstupů a transakcí.
     */
    const handleFetchData = async () => {
        // Validace vstupů
        if (!start || !end) {
            setError('Prosím zadej datum a čas OD a DO.');
            return;
        }

        // Resetování chybové zprávy a nastavení indikátoru načítání
        setError('');
        setLoading(true);

        try {
            // Paralelní načítání dat z API
            const [entriesRes, transactionsRes] = await Promise.all([
                api.get('/entry-history/range', { params: { start, end } }),
                api.get('/transaction-history/range', { params: { start, end } }),
            ]);

            // Aktualizace stavů s načtenými daty
            setEntries(entriesRes.data);
            setTransactions(transactionsRes.data);
        } catch (err) {
            // Zpracování chyb při načítání dat
            console.error('Chyba při načítání dat z uzávěrky:', err);
            setError('Nepodařilo se načíst data. Zkontroluj konzoli nebo kontaktuj správce.');
        } finally {
            // Resetování indikátoru načítání
            setLoading(false);
        }
    };

    /**
     * Pomocná funkce pro formátování ISO řetězce na čitelný formát.
     * @param {string} isoString - ISO formátovaný řetězec data a času.
     * @returns {string} - Formátované datum a čas ve formátu DD.MM.RRRR HH:MM.
     */
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

            {/* Formulář pro výběr časového rozsahu */}
            <div className={styles.formRow}>
                <label htmlFor="start">Od:</label>
                <input
                    id="start"
                    type="datetime-local"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                />

                <label htmlFor="end">Do:</label>
                <input
                    id="end"
                    type="datetime-local"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                />

                <button onClick={handleFetchData} disabled={loading}>
                    {loading ? 'Načítám...' : 'Fetch data'}
                </button>
            </div>

            {/* Zobrazení chybové zprávy */}
            {error && <p className={styles.errorMsg}>{error}</p>}

            {/* Kontejner pro dvě tabulky vedle sebe */}
            <div className={styles.tablesRow}>
                {/* Tabulka transakcí */}
                <TransactionHistoryTable
                    transactions={transactions}
                    formatDate={formatDate}
                    totalPrice={totalPrice}
                />

                {/* Tabulka vstupů */}
                <EntryHistoryTable
                    entries={entries}
                    formatDate={formatDate}
                    totalEntries={totalEntries}
                />
            </div>
        </div>
    );
}

export default ClosurePage;
