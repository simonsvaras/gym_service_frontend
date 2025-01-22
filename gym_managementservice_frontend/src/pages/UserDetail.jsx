// src/pages/UserDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import styles from './UserDetail.module.css';
import UserInfoBox from '../components/UserInfoBox'; // Import nové komponenty

function UserDetail() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/users/${id}`);
                setUser(response.data);
            } catch (err) {
                console.error('Chyba při načítání uživatele:', err);
                setError('Nepodařilo se načíst detaily uživatele.');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
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

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('cs-CZ', options);
    };

    const hasActiveSubscription = user.activeSubscription; // Předpokládáme, že API vrací boolean
    const latestSubscription = user.latestSubscription || null; // Předpokládáme, že API vrací objekt nebo null
    const isExpiredSubscription = latestSubscription && new Date(latestSubscription.endDate) < new Date();

    return (
        <div className={styles.userDetailContainer}>
            {/* Levá část: foto a základní info - Použití nové komponenty UserInfoBox */}
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

            {/* Pravá část: historie vstupů a transakcí */}
            <div className={styles.rightSide}>
                <div className={styles.historySection}>
                    <h3>Historie vstupů</h3>
                    {user.checkInHistory && user.checkInHistory.length > 0 ? (
                        <ul>
                            {user.checkInHistory.map((entry, idx) => (
                                <li key={idx}>{formatDate(entry.date)}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles.noData}>Žádné záznamy o vstupech.</p>
                    )}
                </div>

                <div className={styles.historySection}>
                    <h3>Historie transakcí</h3>
                    {user.transactions && user.transactions.length > 0 ? (
                        <ul>
                            {user.transactions.map((tx) => (
                                <li key={tx.id}>
                                    {formatDate(tx.date)} – {tx.amount} Kč
                                    {tx.note ? ` (${tx.note})` : ''}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles.noData}>Žádné transakce.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserDetail;
