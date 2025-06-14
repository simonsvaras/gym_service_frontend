import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from './ManualCharge.module.css';

import api from '../services/api';
import useChargeSubscription from '../hooks/useChargeSubscription';

import UserInfoBox from '../components/UserInfoBox';
import SimpleButton from '../components/SimpleButton';

function ManualCharge() {
    // Hardcoded user ID
    const userId = 1;

    // Load user and subscription details
    const {
        user,
        hasActiveSubscription,
        latestSubscription,
        oneTimeCount,
        loading,
        error
    } = useChargeSubscription(userId);

    const [customEndDate, setCustomEndDate] = useState('');

    // Notify about loading errors
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleConfirm = async () => {
        if (!customEndDate) {
            toast.warn('Zadejte datum konce.');
            return;
        }

        try {
            const today = new Date().toISOString().slice(0, 10);
            await api.post('/user-subscriptions', {
                userID: userId,
                subscriptionID: 6,
                startDate: today,
                endDate: customEndDate,
                isActive: true,
                customEndDate
            });
            toast.success('Předplatné úspěšně dobito.');
        } catch (err) {
            console.error(err);
            toast.error('Nepodařilo se provést dobití.');
        }
    };

    if (loading) {
        return (
            <div className={styles.chargeContainer}>
                <p>Načítám...</p>
            </div>
        );
    }

    return (
        <div className={styles.chargeContainer}>
            <h2>Ruční dobití</h2>

            {user && (
                <UserInfoBox
                    id={userId}
                    firstname={user.firstname}
                    lastname={user.lastname}
                    email={user.email}
                    birthdate={user.birthdate}
                    profilePhoto={user.profilePhoto ? `/profile-photos/${user.profilePhoto}` : null}
                    hasActiveSubscription={hasActiveSubscription}
                    latestSubscription={latestSubscription}
                    isExpiredSubscription={
                        latestSubscription && new Date(latestSubscription.endDate) < new Date()
                    }
                    oneTimeCount={oneTimeCount}
                />
            )}

            <div className={styles.actions}>
                <label>
                    Datum konce:
                    <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                    />
                </label>
                <SimpleButton text="Potvrdit" onClick={handleConfirm} />
            </div>
        </div>
    );
}

export default ManualCharge;
