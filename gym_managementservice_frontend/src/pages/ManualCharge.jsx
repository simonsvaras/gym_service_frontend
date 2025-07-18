import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './ManualCharge.module.css';

import api from '../services/api';
import useChargeSubscription from '../hooks/useChargeSubscription';
import { chargeOneTimeEntry, MANUAL_ENTRY_ID } from '../utils/oneTimeEntryUtils';

import UserInfoBox from '../components/UserInfoBox';
import SimpleButton from '../components/SimpleButton';
import UserIdentifier from '../components/UserIdentifier';

function ManualCharge() {
    const { id: urlId } = useParams();
    const [userId, setUserId] = useState(urlId || null);
    // Přidáme refresh funkci z hooku
    const {
        user,
        hasActiveSubscription,
        latestSubscription,
        oneTimeCount,
        loading,
        error,
        refreshData
    } = useChargeSubscription(userId);

    const [customEndDate, setCustomEndDate] = useState('');
    const [customPrice, setCustomPrice] = useState('');
    const [manualEntryCount, setManualEntryCount] = useState('');
    const [manualEntryPrice, setManualEntryPrice] = useState('');

    const [isSubmittingSubscription, setIsSubmittingSubscription] = useState(false);
    const [isSubmittingEntry, setIsSubmittingEntry] = useState(false);

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
        profilePhotoPath: user.profilePhoto ? `/api/users/${userId}/profilePhoto` : null,
        hasActiveSubscription,
        latestSubscription,
        isExpiredSubscription: latestSubscription && new Date(latestSubscription.endDate) < new Date(),
        oneTimeCount,
        points: user.points,
    } : null;

    const handleSubscriptionConfirm = async (e) => {
        e.preventDefault();

        if (!customEndDate) {
            toast.warn('Zadejte datum konce.');
            return;
        }
        if (customPrice === '') {
            toast.warn('Zadejte cenu předplatného.');
            return;
        }

        const priceNumber = Number(customPrice);
        if (priceNumber < 0) {
            toast.warn('Cena nemůže být záporná.');
            return;
        }

        try {
            setIsSubmittingSubscription(true);
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

            toast.success('Předplatné úspěšně dobito.');
            // Místo reloadu pouze aktualizujeme data
            refreshData();
        } catch (err) {
            console.error(err);
            toast.error('Nepodařilo se provést dobití předplatného.');
        } finally {
            setIsSubmittingSubscription(false);
        }
    };

    const handleEntryConfirm = async (e) => {
        e.preventDefault();

        if (manualEntryCount === '') {
            toast.warn('Zadejte počet manuálních vstupů.');
            return;
        }
        if (manualEntryPrice === '') {
            toast.warn('Zadejte cenu manuálního vstupu.');
            return;
        }

        const countNumber = Number(manualEntryCount);
        const priceNumber = Number(manualEntryPrice);

        if (countNumber <= 0) {
            toast.warn('Počet musí být větší než 0.');
            return;
        }
        if (priceNumber < 0) {
            toast.warn('Cena nemůže být záporná.');
            return;
        }

        try {
            setIsSubmittingEntry(true);
            await chargeOneTimeEntry(
                userId,
                MANUAL_ENTRY_ID,
                countNumber,
                null,
                priceNumber
            );

            toast.success('Vstupy úspěšně dobity.');
            // Místo reloadu obnovíme data
            refreshData();
        } catch (err) {
            console.error(err);
            toast.error('Nepodařilo se provést dobití vstupů.');
        } finally {
            setIsSubmittingEntry(false);
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
                    <form className={styles.formSection} onSubmit={handleSubscriptionConfirm}>
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
                        <SimpleButton
                            type="submit"
                            text={isSubmittingSubscription ? 'Načítám...' : 'Potvrdit'}
                            disabled={isSubmittingSubscription}
                        />
                    </form>

                    <form className={styles.formSection} onSubmit={handleEntryConfirm}>
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
                        <SimpleButton
                            type="submit"
                            text={isSubmittingEntry ? 'Načítám...' : 'Potvrdit'}
                            disabled={isSubmittingEntry}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ManualCharge;
