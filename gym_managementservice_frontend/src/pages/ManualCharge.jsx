import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from './ManualCharge.module.css';

import api from '../services/api';
import useChargeSubscription from '../hooks/useChargeSubscription';
import { chargeOneTimeEntry, MANUAL_ENTRY_ID } from '../utils/oneTimeEntryUtils';

import UserInfoBox from '../components/UserInfoBox';
import SimpleButton from '../components/SimpleButton';
import UserIdentifier from '../components/UserIdentifier';

function ManualCharge() {
    const [userId, setUserId] = useState(null);
    const {
        user,
        hasActiveSubscription,
        latestSubscription,
        oneTimeCount,
        loading,
        error
    } = useChargeSubscription(userId);

    const [customEndDate, setCustomEndDate] = useState('');
    const [customPrice, setCustomPrice] = useState('');
    const [manualEntryCount, setManualEntryCount] = useState('');
    const [manualEntryPrice, setManualEntryPrice] = useState('');

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    if (!userId) {
        return <UserIdentifier onUserFound={setUserId} mode="multiple" />;
    }

    const userInfo = user ? {
        id: userId,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        birthdate: user.birthdate,
        profilePhoto: user.profilePhoto ? `/profile-photos/${user.profilePhoto}` : null,
        hasActiveSubscription,
        latestSubscription,
        isExpiredSubscription: latestSubscription && new Date(latestSubscription.endDate) < new Date(),
        oneTimeCount,
        points: user.points,
    } : null;

    const handleConfirm = async () => {
        if (!customEndDate) {
            toast.warn('Zadejte datum konce.');
            return;
        }

        const priceNumber = Number(customPrice) || 0;
        const entryCountNumber = Number(manualEntryCount) || 0;
        const entryPriceNumber = Number(manualEntryPrice) || 0;

        if (priceNumber < 0) {
            toast.warn('Cena nemůže být záporná.');
            return;
        }
        if (entryPriceNumber < 0 || entryCountNumber < 0) {
            toast.warn('Počet ani cena manuálních vstupů nemůže být záporná.');
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
                customEndDate,
                customPrice: priceNumber
            });

            if (entryCountNumber > 0) {
                await chargeOneTimeEntry(
                    userId,
                    MANUAL_ENTRY_ID,
                    entryCountNumber,
                    entryPriceNumber
                );
            }

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
            <h2>Ruční dobití předplatného</h2>

            <div className={styles.columns}>
                {user && (
                    <div className={styles.infoColumn}>
                        <UserInfoBox info={userInfo} />
                    </div>
                )}

                <div className={styles.formColumn}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="endDate">Datum konce:</label>
                        <input
                            id="endDate"
                            type="date"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="price">Cena (Kč):</label>
                        <input
                            id="price"
                            type="number"
                            value={customPrice}
                            min="0"
                            step="1"
                            onChange={(e) => setCustomPrice(e.target.value)}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="manualCount">Počet manuálních vstupů:</label>
                        <input
                            id="manualCount"
                            type="number"
                            value={manualEntryCount}
                            min="0"
                            step="1"
                            onChange={(e) => setManualEntryCount(e.target.value)}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="manualPrice">Cena manuálního vstupu (Kč):</label>
                        <input
                            id="manualPrice"
                            type="number"
                            value={manualEntryPrice}
                            min="0"
                            step="1"
                            onChange={(e) => setManualEntryPrice(e.target.value)}
                        />
                    </div>
                    <SimpleButton text="Potvrdit" onClick={handleConfirm} />
                </div>
            </div>
        </div>
    );
}

export default ManualCharge;