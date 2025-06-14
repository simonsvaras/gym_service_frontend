// src/pages/ShowHistoryPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SummaryCard from '../components/SummaryCard';
import EntryHistoryTable from '../components/EntryHistoryTable';
import TransactionHistoryTable from '../components/TransactionHistoryTable';
import CustomDateRangePicker from '../components/CustomDateRangePicker';
import SimpleButton from '../components/SimpleButton';
import { FaDoorOpen, FaMoneyBillWave } from 'react-icons/fa';
import styles from './ShowUserHistoryPage.module.css';
import api from '../services/api';

export default function ShowHistoryPage() {
    const { id } = useParams();
    const [filterType, setFilterType] = useState('all'); // 'all' | 'today' | 'week' | 'month' | 'range'
    const [rangeStart, setRangeStart] = useState('');
    const [rangeEnd, setRangeEnd] = useState('');
    const [entries, setEntries] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    // statické první/poslední datum z původní celkové historie
    const [firstEntryDateStatic, setFirstEntryDateStatic] = useState(null);
    const [lastEntryDateStatic, setLastEntryDateStatic] = useState(null);

    // formátovač
    const fmt = (iso) =>
        new Date(iso).toLocaleString('cs-CZ', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

    // vypočte ISO rozsahy pro rychlé filtry
    const computeRange = (type) => {
        const now = new Date();
        let start, end;
        switch (type) {
            case 'today':
                start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                end   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                break;
            case 'week': {
                const day = now.getDay() || 7; // neděle jako 7
                const monday = new Date(now);
                monday.setDate(now.getDate() - day + 1);
                monday.setHours(0,0,0,0);
                start = monday;
                end = new Date(monday);
                end.setDate(monday.getDate() + 6);
                end.setHours(23,59,59,999);
                break;
            }
            case 'month':
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                end   = new Date(now.getFullYear(), now.getMonth()+1, 0, 23,59,59);
                break;
            case 'all':
                return { startIso: '', endIso: '' };
            default:
                return { startIso: rangeStart, endIso: rangeEnd };
        }
        return {
            startIso: start.toISOString().slice(0,16),
            endIso:   end.toISOString().slice(0,16)
        };
    };

    // fetch dat pro daný uživatel + rozsah
    const fetchData = async (type, startIso, endIso) => {
        setLoading(true);
        try {
            let eRes, tRes;
            if (type === 'all') {
                eRes = await api.get(`/entry-history/user/${id}`);
                tRes = await api.get(`/transaction-history/user/${id}`);

                // uložíme první a poslední vstup jednou
                if (!firstEntryDateStatic && eRes.data.length > 0) {
                    setFirstEntryDateStatic(fmt(eRes.data[0].entryDate || eRes.data[0].date));
                    const last = eRes.data[eRes.data.length - 1];
                    setLastEntryDateStatic(fmt(last.entryDate || last.date));
                }
            } else {
                eRes = await api.get('/entry-history/range', {
                    params: { userId: id, start: startIso, end: endIso }
                });
                tRes = await api.get('/transaction-history/range', {
                    params: { userId: id, start: startIso, end: endIso }
                });
            }
            setEntries(eRes.data);
            setTransactions(tRes.data);
        } finally {
            setLoading(false);
        }
    };

    // handler rychlých filtrů
    const handleFilter = async (type) => {
        setFilterType(type);
        const { startIso, endIso } = computeRange(type);
        setRangeStart(startIso);
        setRangeEnd(endIso);
        await fetchData(type, startIso, endIso);
    };

    // handler vlastního rozsahu
    const handleRangeFetch = async () => {
        setFilterType('range');
        await fetchData('range', rangeStart, rangeEnd);
    };

    // načíst při mountu
    useEffect(() => {
        handleFilter('all');
    }, [id]);

    // spočítaná suma transakcí
    const totalAmount = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const totalEntries = entries.length;

    // statické první/poslední
    const firstEntryDate = firstEntryDateStatic || '-';
    const lastEntryDate  = lastEntryDateStatic  || '-';

    return (
        <div className={styles.container}>
            <h2>Detailní historie uživatele #{id}</h2>

            <div className={styles.quickFilters}>
                {['today','week','month','all'].map((key) => {
                    const labels = {
                        today: 'Dnes',
                        week:  'Tento týden',
                        month: 'Tento měsíc',
                        all:   'Celkově'
                    };
                    return (
                        <SimpleButton
                            key={key}
                            text={labels[key]}
                            onClick={() => handleFilter(key)}
                            className={filterType === key ? styles.active : ''}
                        />
                    );
                })}
            </div>

            <div className={styles.filter}>
                <CustomDateRangePicker
                    title="Vlastní období"
                    entryStart={rangeStart}
                    entryEnd={rangeEnd}
                    setEntryStart={setRangeStart}
                    setEntryEnd={setRangeEnd}
                />
                <SimpleButton
                    text={loading ? 'Načítám…' : 'Načíst'}
                    onClick={handleRangeFetch}
                    disabled={loading}
                    className={styles.btnFetch}
                />
            </div>

            <div className={styles.summary}>
                <SummaryCard
                    title="Celkem vstupů"
                    value={totalEntries}
                    icon={FaDoorOpen}
                />
                <SummaryCard
                    title="Celková částka"
                    value={totalAmount}
                    icon={FaMoneyBillWave}
                />
                <SummaryCard
                    title="Poslední vstup"
                    value={firstEntryDate}
                />
                <SummaryCard
                    title="První vstup"
                    value={lastEntryDate}
                />
            </div>

            <div className={styles.tables}>
                <div className={styles.tableWrapper}>
                    <EntryHistoryTable entries={entries} formatDate={fmt} />
                </div>
                <div className={styles.tableWrapper}>
                    <TransactionHistoryTable
                        transactions={transactions}
                        formatDate={fmt}
                    />
                </div>
            </div>
        </div>
    );
}
