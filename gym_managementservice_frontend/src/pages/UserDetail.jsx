import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import useChargeSubscription from '../hooks/useChargeSubscription';
import useUserTransactions from '../hooks/useUserTransactions';
import useEntryHistory from '../hooks/useEntryHistory';

import UserInfoBox from '../components/UserInfoBox';
import UserIdentifier from '../components/UserIdentifier';

import styles from './UserDetail.module.css';
import AnimatedButton from "../components/AnimatedButton.jsx";

export default function UserDetail() {
    const { id: urlId } = useParams();
    const [userId, setUserId] = useState(urlId || null);
    const navigate = useNavigate();

    // Data
    const {
        user,
        hasActiveSubscription,
        latestSubscription,
        oneTimeCount,
        loading: lcs,
        error: ecs
    } = useChargeSubscription(userId);
    const { transactions, loading: lt, error: et } = useUserTransactions(userId);
    const { checkInHistory, loading: le, error: ee } = useEntryHistory(userId);

    const loading = lcs || lt || le;
    const error = ecs || et || ee;
    useEffect(() => { if (error) toast.error(error); }, [error]);

    // Pokud není k dispozici userId, vyžádáme ho pomocí modálu
    if (!userId) {
        return <UserIdentifier onUserFound={setUserId} />;
    }

    if (loading) return <p>Načítám...</p>;
    if (!user) return null;

    // Poslední vstup + transakce
    const fmt = (iso) =>
        new Date(iso).toLocaleString('cs-CZ', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    const lastEntryDate = checkInHistory.length
        ? fmt(checkInHistory[checkInHistory.length - 1].entryDate)
        : 'Žádné vstupy';
    const lastTxDate = transactions.length
        ? fmt(transactions[transactions.length - 1].transactionDate)
        : 'Žádné transakce';

    // Handlery
    const handleShowHistory = () => {
        navigate(`/users/${userId}/history`);
    };
    const handleCharge       = () => { /* ... */ };
    const handleAssignCard   = () => { /* ... */ };

    return (
        <div className={styles.userDetailContainer}>
            {/* LEVÁ STRANA */}
            <div className={styles.leftSide}>
                <UserInfoBox
                    id={+userId}
                    firstname={user.firstname}
                    lastname={user.lastname}
                    email={user.email}
                    birthdate={user.birthdate}
                    profilePhoto={user.profilePhoto}
                    hasActiveSubscription={hasActiveSubscription}
                    latestSubscription={latestSubscription}
                    isExpiredSubscription={
                        latestSubscription && new Date(latestSubscription.endDate) < new Date()
                    }
                    oneTimeCount={oneTimeCount}
                />
                {/* SPODNÍ ŘÁDEK – STATISTIKY */}
                <div className={styles.statsContainer}>
                    <div className={styles.statCard}>
                        <h4>Poslední vstup</h4>
                        <p>{lastEntryDate}</p>
                    </div>
                    <div className={styles.statCard}>
                        <h4>Poslední transakce</h4>
                        <p>{lastTxDate}</p>
                    </div>
                </div>
            </div>

            <div className={styles.rightSide} >
                {/* PRAVÁ STRANA – AKCE */}
                <div className={styles.actionsContainer}>
                    <AnimatedButton
                        text="Zobrazit historii"
                        onClick={handleShowHistory}
                        ariaLabel="Zobrazit historii uživatele"
                    />
                    <AnimatedButton
                        text="Dobít"
                        onClick={handleCharge}
                        ariaLabel="Dobít předplatné"
                    />
                    <AnimatedButton
                        text="Přiřadit kartu"
                        onClick={handleAssignCard}
                        ariaLabel="Přiřadit kartu uživateli"
                    />
                    <AnimatedButton
                        text="Nahrát novou fotografii"
                        onClick={handleAssignCard}
                        ariaLabel="Nahrát uživateli novou profilovou fotku"
                    />
                </div>
            </div>


        </div>
    );
}
