/**
 * @file UserDetail.jsx
 * Stránka s detailem uživatele: zobrazuje informace, transakce a historii vstupů.
 */
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';  // Použijeme pro chybové hlášky
import PropTypes from 'prop-types';
import styles from './UserDetail.module.css';

import useUserData from '../hooks/useUserData';
import useUserTransactions from '../hooks/useUserTransactions';
import useEntryHistory from '../hooks/useEntryHistory';
import { formatDate } from '../utils/dateUtils';

import UserInfoBox from '../components/UserInfoBox';
import TransactionHistoryTable from '../components/TransactionHistoryTable';
import EntryHistoryTable from '../components/EntryHistoryTable';
import SimpleButton from '../components/SimpleButton';

function UserDetail() {
    const { id } = useParams();

    // 1) Data o uživateli
    const {
        user,
        loading: loadingUser,
        error: errorUser
    } = useUserData(id);

    // 2) Transakce
    const {
        transactions,
        loading: loadingTransactions,
        error: errorTransactions
    } = useUserTransactions(id);

    // 3) Historie vstupů
    const {
        checkInHistory,
        loading: loadingEntries,
        error: errorEntries
    } = useEntryHistory(id);

    // Sloučíme loading a error stavy do jedné proměnné
    const loading = loadingUser || loadingTransactions || loadingEntries;
    const error = errorUser || errorTransactions || errorEntries;

    // Když se objeví error, zobrazíme toastify notifikaci
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    // Pokud se načítá, ukážeme "Načítám..."
    if (loading) {
        return <p className={styles.loadingText}>Načítám uživatele...</p>;
    }

    // Pokud máme error, můžeme vrátit prázdný fragment (toast je již zobrazen)
    if (error) {
        return null;
    }

    // Pokud chybí uživatel, nic nezobrazujeme (fallback)
    if (!user) {
        return null;
    }

    // Logika ohledně subscription (mock z props user)
    const hasActiveSubscription = user.activeSubscription;
    const latestSubscription = user.latestSubscription || null;
    const isExpiredSubscription =
        latestSubscription && new Date(latestSubscription.endDate) < new Date();

    // Poslední vstup / transakce
    const lastEntryDate = (checkInHistory?.length > 0)
        ? formatDate(checkInHistory[checkInHistory.length - 1].entryDate)
        : 'Nenalezeno';

    const lastTransactionDate = (transactions?.length > 0)
        ? formatDate(transactions[transactions.length - 1].transactionDate)
        : 'Nenalezeno';

    const profilePhoto = user.profilePhoto || null;

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
                {/* Tabulka vstupů */}
                <div className={styles.entryTable}>
                    {(checkInHistory && checkInHistory.length > 0) ? (
                        <EntryHistoryTable
                            entries={checkInHistory}
                            formatDate={formatDate}
                            columns={['date']}
                            showTotal={true}
                        />
                    ) : (
                        <p className={styles.noData}>Žádné záznamy o vstupech.</p>
                    )}
                </div>

                {/* Tabulka transakcí */}
                <div className={styles.transactionTable}>
                    {(transactions && transactions.length > 0) ? (
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
        </div>
    );
}

UserDetail.propTypes = {
    // sem doplňte propTypes dle potřeby
};

export default UserDetail;
