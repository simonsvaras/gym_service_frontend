import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from './ManualCharge.module.css';

import api from '../services/api';
import useChargeSubscription from '../hooks/useChargeSubscription';
import { chargeOneTimeEntry, MANUAL_ENTRY_ID } from '../utils/oneTimeEntryUtils';

import UserInfoBox from '../components/UserInfoBox';
import SimpleButton from '../components/SimpleButton';

function ManualCharge() {
    const userId = 1;
    const {
        user,
        hasActiveSubscription,
        latestSubscription,
        oneTimeCount,
        loading,
        error
    } = useChargeSubscription(userId);

    const [customEndDate, setCustomEndDate] = useState('');
    const [customPrice, setCustomPrice] = useState(0);
    const [manualEntryCount, setManualEntryCount] = useState(0);
    const [manualEntryPrice, setManualEntryPrice] = useState(0);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    const handleConfirm = async () => {
        if (!customEndDate) {
            toast.warn('Zadejte datum konce.');
            return;
        }
        if (customPrice < 0) {
            toast.warn('Cena nemůže být záporná.');
            return;
        }
        if (manualEntryPrice < 0 || manualEntryCount < 0) {
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
                customPrice
            });

            if (manualEntryCount > 0) {
                await chargeOneTimeEntry(
                    userId,
                    MANUAL_ENTRY_ID,
                    manualEntryCount,
                    manualEntryPrice
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
                            onChange={(e) => setCustomPrice(Number(e.target.value))}
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
                            onChange={(e) => setManualEntryCount(Number(e.target.value))}
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
                            onChange={(e) => setManualEntryPrice(Number(e.target.value))}
                        />
                    </div>
                    <SimpleButton text="Potvrdit" onClick={handleConfirm} />
                </div>
            </div>
        </div>
    );
}

export default ManualCharge;