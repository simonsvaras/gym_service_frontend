// src/pages/ClosurePage.jsx
import React, { useState } from 'react';
import api from '../services/api';
import PropTypes from 'prop-types';
import styles from './ClosurePage.module.css';
import TransactionHistoryTable from '../components/TransactionHistoryTable';
import EntryHistoryTable from '../components/EntryHistoryTable';
import SimpleButton from '../components/SimpleButton'; // Import SimpleButton
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Import ikon
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import {ButtonGroup} from "@mui/joy";

/**
 * Komponenta ClosurePage zajišťuje zobrazení uzávěrky gymu.
 * Umožňuje uživatelům vybrat časový rozsah a zobrazit historii vstupů a transakcí.
 *
 * @component
 * @returns {JSX.Element} Stránka uzávěrky s formulářem a tabulkami historie.
 */
function ClosurePage() {
    // Stavy pro ukládání hodnot formuláře a načtených dat
    const [start, setStart] = useState(''); // Počáteční datum a čas
    const [end, setEnd] = useState('');     // Konečné datum a čas
    const [entries, setEntries] = useState([]);           // Historie vstupů
    const [transactions, setTransactions] = useState([]); // Historie transakcí
    const [loading, setLoading] = useState(false);        // Indikátor načítání
    const [error, setError] = useState('');               // Chybová zpráva

    /**
     * Vypočítá celkový počet vstupů.
     * @type {number}
     */
    const totalEntries = entries.length;

    /**
     * Pomocná funkce pro formátování datumu do formátu 'YYYY-MM-DDTHH:MM' v místním časovém pásmu.
     *
     * @param {Date} date - Datum k formátování.
     * @returns {string} Formátované datum a čas ve formátu 'YYYY-MM-DDTHH:MM'.
     */
    const formatToLocalDatetime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    /**
     * Funkce pro načtení dat z API na základě vybraného časového rozsahu.
     * Používá Promise.all pro paralelní načítání vstupů a transakcí.
     *
     * @async
     * @function handleFetchData
     * @param {string} startDate - Počáteční datum a čas ve formátu 'YYYY-MM-DDTHH:MM'.
     * @param {string} endDate - Konečné datum a čas ve formátu 'YYYY-MM-DDTHH:MM'.
     * @returns {Promise<void>} Načte data a aktualizuje stavy.
     */
    const handleFetchData = async (startDate, endDate) => {
        // Validace vstupů
        if (!startDate || !endDate) {
            setError('Prosím zadej datum a čas OD a DO.');
            return;
        }

        // Resetování chybové zprávy a nastavení indikátoru načítání
        setError('');
        setLoading(true);

        try {
            // Paralelní načítání dat z API
            const [entriesRes, transactionsRes] = await Promise.all([
                api.get('/entry-history/range', { params: { start: startDate, end: endDate } }),
                api.get('/transaction-history/range', { params: { start: startDate, end: endDate } }),
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
     *
     * @param {string} isoString - ISO formátovaný řetězec data a času.
     * @returns {string} Formátované datum a čas ve formátu DD.MM.RRRR HH:MM.
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

    /**
     * Nastaví datumový rozsah na dnešní den a načte data.
     */
    const handleToday = () => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0);
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59);
        const formattedStart = formatToLocalDatetime(startOfToday);
        const formattedEnd = formatToLocalDatetime(endOfToday);
        setStart(formattedStart);
        setEnd(formattedEnd);
        handleFetchData(formattedStart, formattedEnd);
    };

    /**
     * Nastaví datumový rozsah na včerejší den a načte data.
     */
    const handleYesterday = () => {
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const startOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0);
        const endOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59);
        const formattedStart = formatToLocalDatetime(startOfYesterday);
        const formattedEnd = formatToLocalDatetime(endOfYesterday);
        setStart(formattedStart);
        setEnd(formattedEnd);
        handleFetchData(formattedStart, formattedEnd);
    };

    /**
     * Nastaví datumový rozsah na jeden den dopředu a načte data.
     */
    const handleNextDay = () => {
        if (!start || !end) {
            // Pokud není nastavený žádný rozsah, nastavit na dnešní den
            handleToday();
            return;
        }

        const currentEnd = new Date(end);
        const newStart = new Date(currentEnd);
        newStart.setDate(currentEnd.getDate() + 1);
        newStart.setHours(0, 0);
        const newEnd = new Date(newStart);
        newEnd.setHours(23, 59);

        const today = new Date();
        // Nastavit dnes na 23:59:59
        today.setHours(23, 59, 59, 999);

        if (newStart > today) {
            // Zamezit posunu nad dnešní den
            return;
        }

        const formattedStart = formatToLocalDatetime(newStart);
        const formattedEnd = formatToLocalDatetime(newEnd);
        setStart(formattedStart);
        setEnd(formattedEnd);
        handleFetchData(formattedStart, formattedEnd);
    };

    /**
     * Nastaví datumový rozsah na jeden den dozadu a načte data.
     */
    const handlePreviousDay = () => {
        if (!start || !end) {
            // Pokud není nastavený žádný rozsah, nastavit na včerejší den
            handleYesterday();
            return;
        }

        const currentStart = new Date(start);
        const newStart = new Date(currentStart);
        newStart.setDate(currentStart.getDate() - 1);
        newStart.setHours(0, 0);
        const newEnd = new Date(newStart);
        newEnd.setHours(23, 59);

        const formattedStart = formatToLocalDatetime(newStart);
        const formattedEnd = formatToLocalDatetime(newEnd);
        setStart(formattedStart);
        setEnd(formattedEnd);
        handleFetchData(formattedStart, formattedEnd);
    };

    /**
     * Placeholder funkce pro detailní zobrazení.
     */
    const handleDetail = () => {
        // Zatím nic nedělá
        console.log('Detailní zobrazení zatím není implementováno.');
    };

    /**
     * Zjišťuje, zda je tlačítko "Next" (→) disabled.
     *
     * @returns {boolean} true, pokud je "Next" tlačítko disabled, jinak false.
     */
    const isNextDisabled = () => {
        if (!end) return false;
        const currentEnd = new Date(end);
        const today = new Date();
        // Nastavit dnes na 23:59:59
        today.setHours(23, 59, 59, 999);
        return currentEnd >= today;
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

                {/* Tlačítka pro rychlé nastavení data */}
                <div className={styles.buttonGroup}>
                    <SimpleButton
                        text="Dnes"
                        onClick={handleToday}
                        ariaLabel="Dnešní den"
                    />
                    <ButtonGroup spacing="0.5rem">
                        <SimpleButton
                            icon={IoIosArrowBack}
                            text=""
                            onClick={handlePreviousDay}
                            ariaLabel="Předchozí den"
                        />
                        <SimpleButton
                            icon={IoIosArrowForward}
                            text=""
                            onClick={handleNextDay}
                            disabled={isNextDisabled()}
                            ariaLabel="Následující den"
                        />
                    </ButtonGroup>
                    <SimpleButton
                        text={loading ? 'Načítám...' : 'Načíst data'}
                        onClick={() => handleFetchData(start, end)}
                        disabled={loading}
                    />
                    <SimpleButton
                        text="Detailní zobrazení"
                        onClick={handleDetail}
                    />
                </div>
            </div>

            {/* Zobrazení chybové zprávy */}
            {error && <p className={styles.errorMsg}>{error}</p>}

            {/* Kontejner pro dvě tabulky vedle sebe */}
            <div className={styles.tablesRow}>
                <div className={styles.transactionTable}>
                    {/* Tabulka transakcí */}
                    <TransactionHistoryTable
                        transactions={transactions}
                        formatDate={formatDate}
                        columns={['date', 'userName', 'purchaseType', 'amount']}
                        showTotal={true} // Zobrazení součtu celkové ceny
                    />
                </div>

                <div className={styles.entryTable}>
                    {/* Tabulka vstupů */}
                    <EntryHistoryTable
                        entries={entries}
                        formatDate={formatDate}
                        columns={['date', 'userName', 'subscriptionType']}
                        showTotal={true} // Zobrazení celkového počtu vstupů
                    />
                </div>
            </div>
        </div>
    );
}

ClosurePage.propTypes = {
    // V této komponentě nejsou přímo přijímány props, ale můžete je přidat zde, pokud bude potřeba
};

export default ClosurePage;
