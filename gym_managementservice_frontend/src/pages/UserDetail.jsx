import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import PropTypes from 'prop-types';
import styles from './UserDetail.module.css';
import UserInfoBox from '../components/UserInfoBox';
import TransactionHistoryTable from '../components/TransactionHistoryTable';
import EntryHistoryTable from '../components/EntryHistoryTable';

/**
 * Komponenta UserDetail zobrazuje detaily uživatele, včetně historie transakcí a vstupů.
 *
 * @component
 * @returns {JSX.Element} Stránka detailu uživatele s informacemi a historií.
 */
function UserDetail() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [checkInHistory, setCheckInHistory] = useState([]);
    const [loading, setLoading] = useState(true); // Nastaveno na true, dokud se všechna data nenačtou
    const [error, setError] = useState('');

    useEffect(() => {
        /**
         * Funkce pro načtení dat uživatele, transakcí a historie vstupů z API.
         *
         * @async
         * @function fetchUserData
         * @returns {Promise<void>} Načte data a aktualizuje stavy.
         */
        const fetchUserData = async () => {
            try {
                setLoading(true);
                // Paralelní načítání dat
                const [userResponse, transactionsResponse, entriesResponse] = await Promise.all([
                    api.get(`/users/${id}`),
                    api.get(`/transaction-history/user/${id}`),
                    api.get(`/entry-history/user/${id}`)
                ]);

                setUser(userResponse.data);
                setTransactions(transactionsResponse.data);
                setCheckInHistory(entriesResponse.data);
            } catch (err) {
                console.error('Chyba při načítání dat:', err);
                setError('Nepodařilo se načíst data uživatele.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id]);

    if (loading) {
        return <p className={styles.loadingText}>Načítám uživatele...</p>;
    }

    if (error) {
        return <p className={styles.errorText}>{error}</p>;
    }

    if (!user) {
        return null;
    }

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


    const hasActiveSubscription = user.activeSubscription;
    const latestSubscription = user.latestSubscription || null;
    const isExpiredSubscription = latestSubscription && new Date(latestSubscription.endDate) < new Date();

    return (
        <div className={styles.userDetailContainer}>
            {/* Levá část: foto a základní info - Použití nové komponenty UserInfoBox */}
            <div className={styles.leftSide}>
                <UserInfoBox
                    firstname={user.firstname}
                    lastname={user.lastname}
                    email={user.email}
                    birthdate={user.birthdate}
                    profilePhoto={user.profileImageUrl || null}
                    hasActiveSubscription={hasActiveSubscription}
                    latestSubscription={latestSubscription}
                    isExpiredSubscription={isExpiredSubscription}
                />
            </div>

            {/* Pravá část: historie vstupů a transakcí */}
            <div className={styles.rightSide}>
                <div className={styles.historySection}>
                    {checkInHistory && checkInHistory.length > 0 ? (
                        <EntryHistoryTable
                            entries={checkInHistory}
                            formatDate={formatDate}
                            columns={['date']}
                            showTotal={true} // Zobrazení celkového počtu vstupů
                        />
                    ) : (
                        <p className={styles.noData}>Žádné záznamy o vstupech.</p>
                    )}
                </div>

                <div className={styles.historySection}>
                    {transactions && transactions.length > 0 ? (
                        <TransactionHistoryTable
                            transactions={transactions}
                            formatDate={formatDate}
                            columns={['date', 'purchaseType', 'amount']}
                            showTotal={true} // Nezobrazujeme součet
                        />
                    ) : (
                        <p className={styles.noData}>Žádné transakce.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

UserDetail.propTypes = {
    // V této komponentě nejsou přímo přijímány props, ale můžete je přidat zde, pokud bude potřeba
};

export default UserDetail;
