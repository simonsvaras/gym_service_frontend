import React, { useState, useMemo } from 'react';
import UserCard from '../components/UserCard';
import UserCardSkeleton from '../components/UserCardSkeleton.jsx';
import SimpleButton from '../components/SimpleButton';
import styles from './AllUsers.module.css';
import useFilteredUsers from '../hooks/useFilteredUsers';
import CustomDateRangePicker from '../components/CustomDateRangePicker';

/**
 * Komponenta AllUsers zobrazuje všechny uživatele a umožňuje jejich filtrování.
 * Uživatel může zadat datumový interval, minimální počet vstupů nebo vybrat stav předplatného.
 */
function AllUsers() {
    // Stavové proměnné pro jednotlivé filtry
    const [entryStart, setEntryStart] = useState('');
    const [entryEnd, setEntryEnd] = useState('');
    const [minEntryCount, setMinEntryCount] = useState('');
    const [subscriptionStatus, setSubscriptionStatus] = useState('');

    // Memoizace objektu filtrů, aby se jeho reference neměnila při každém renderu
    const filters = useMemo(() => ({
        entryStart: entryStart || undefined,
        entryEnd: entryEnd || undefined,
        minEntryCount: minEntryCount ? Number(minEntryCount) : undefined,
        subscriptionStatus: subscriptionStatus || undefined,
    }), [entryStart, entryEnd, minEntryCount, subscriptionStatus]);

    // Použití hooku pro načítání uživatelů dle zadaných filtrů
    const { users, loading, error } = useFilteredUsers(filters);

    /**
     * Funkce pro nastavení filtru "Dnes". Nastaví datum začátku a konce tak, aby odpovídalo aktuálnímu dni.
     */
    const applyTodayFilter = () => {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        setEntryStart(start.toISOString());
        setEntryEnd(end.toISOString());
    };

    /**
     * Funkce pro nastavení filtru "Tento týden". Nastaví datum tak, aby pokrylo aktuální týden.
     * Předpokládáme, že týden začíná v pondělí.
     */
    const applyThisWeekFilter = () => {
        const today = new Date();
        // Získáme datum prvního dne v týdnu (pondělí)
        const firstDay = new Date(today);
        const day = firstDay.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        firstDay.setDate(firstDay.getDate() + diff);
        firstDay.setHours(0, 0, 0, 0);

        // Datum posledního dne v týdnu (neděle)
        const lastDay = new Date(firstDay);
        lastDay.setDate(firstDay.getDate() + 6);
        lastDay.setHours(23, 59, 59, 999);

        setEntryStart(firstDay.toISOString());
        setEntryEnd(lastDay.toISOString());
    };

    return (
        <div className={styles.allUsersContainer}>
            <h1 className={styles.pageTitle}>Všichni uživatelé</h1>
            <div className={styles.dataContainer}>
                {/* Filtrační panel */}
                <div className={styles.filtersContainer}>
                    <h2>Filtry:</h2>
                    <div className={styles.entryFilterContainer}>
                        <CustomDateRangePicker
                            title="Vyberte časový interval"
                            entryStart={entryStart}
                            entryEnd={entryEnd}
                            setEntryStart={setEntryStart}
                            setEntryEnd={setEntryEnd}
                        />
                        <div className={styles.buttonGroup}>
                            <SimpleButton text="Dnes" onClick={applyTodayFilter}/>
                            <SimpleButton text="Tento týden" onClick={applyThisWeekFilter}/>
                        </div>
                        <div>
                            <label htmlFor="minEntryCount">Minimální počet vstupů:</label>
                            <input
                                type="number"
                                id="minEntryCount"
                                value={minEntryCount}
                                onChange={(e) => setMinEntryCount(e.target.value)}
                            />
                        </div>

                    </div>
                    <div className={styles.subscriptionFilterContainer}>
                        <div>
                            <label htmlFor="subscriptionStatus">Stav předplatného:</label>
                            <select
                                id="subscriptionStatus"
                                value={subscriptionStatus}
                                onChange={(e) => setSubscriptionStatus(e.target.value)}
                            >
                                <option value="">Všechny</option>
                                <option value="active">Platné</option>
                                <option value="inactive">Neplatné</option>
                                <option value="expiring">Končí brzy</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Výpis chybové hlášky */}
                {error && <p className={styles.errorText}>{error}</p>}

                {/* Výpis karet */}
                {loading ? (
                    <div className={styles.cardsContainer}>
                        <div className={styles.cardsContainerIntra}>
                            {[...Array(6)].map((_, index) => (
                                <UserCardSkeleton key={index} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className={styles.cardsContainer}>
                        <div className={styles.cardsContainerIntra}>
                            {users.map((user) => (
                                <UserCard key={user.userID} user={user} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AllUsers;
