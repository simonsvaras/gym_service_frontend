import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import PropTypes from 'prop-types';
import styles from './UserDetail.module.css';
import UserInfoBox from '../components/UserInfoBox';
import TransactionHistoryTable from '../components/TransactionHistoryTable';
import EntryHistoryTable from '../components/EntryHistoryTable';
import SimpleButton from '../components/SimpleButton';

function UserDetail() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [checkInHistory, setCheckInHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                // Paralelně načítáme data o uživateli, transakcích a vstupech
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
     */
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    };

    const hasActiveSubscription = user.activeSubscription;
    const latestSubscription = user.latestSubscription || null;
    const isExpiredSubscription = latestSubscription && new Date(latestSubscription.endDate) < new Date();

    // Poslední vstup / transakce
    const lastEntryDate = checkInHistory.length > 0
        ? formatDate(checkInHistory[checkInHistory.length - 1].entryDate)
        : 'Nenalezeno';

    const lastTransactionDate = transactions.length > 0
        ? formatDate(transactions[transactions.length - 1].transactionDate)
        : 'Nenalezeno';

    const profilePhoto = user.profilePhoto
        ? user.profilePhoto
        : null; // Když není fotka, zobrazí se placeholder

    return (
        <div className={styles.userDetailContainer}>
            <div className={styles.leftSide}>
                <UserInfoBox
                    id={parseInt(id, 10)}
                    firstname={user.firstname}
                    lastname={user.lastname}
                    email={user.email}
                    birthdate={user.birthdate}
                    profilePhoto={profilePhoto}
                    hasActiveSubscription={hasActiveSubscription}
                    latestSubscription={latestSubscription}
                    isExpiredSubscription={isExpiredSubscription}
                />

                <div className={styles.additionalInfo}>
                    <SimpleButton
                        text="Přiřadit kartu"
                        onClick={() => {}}
                    />
                    <div className={styles.infoItem}>
                        <strong>Poslední vstup:</strong> {lastEntryDate}
                    </div>
                    <div className={styles.infoItem}>
                        <strong>Poslední transakce:</strong> {lastTransactionDate}
                    </div>
                </div>
            </div>

            <div className={styles.rightSide}>
                {checkInHistory && checkInHistory.length > 0 ? (
                    <EntryHistoryTable
                        entries={checkInHistory}
                        formatDate={formatDate}
                        columns={['date']}
                        showTotal={true}
                    />
                ) : (
                    <p className={styles.noData}>Žádné záznamy o vstupech.</p>
                )}

                {transactions && transactions.length > 0 ? (
                    <TransactionHistoryTable
                        transactions={transactions}
                        formatDate={formatDate}
                        columns={['date', 'purchaseType', 'amount']}
                        showTotal={true}
                    />
                ) : (
                    <p className={styles.noData}>Žádné transakce.</p>
                )}
            </div>
        </div>
    );
}

UserDetail.propTypes = {};

export default UserDetail;
