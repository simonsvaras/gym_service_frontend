/**
 * @file useChargeSubscription.js
 * Custom hook pro načtení všech potřebných dat na stránku dobíjení (ChargeSubscription).
 */
import { useState, useEffect } from 'react';
import api from '../services/api';
import {
    getActiveSubscription,
    getLatestSubscription
} from '../utils/subscriptionUtils';

/**
 * Načítá:
 *   - uživatele
 *   - uživatelské subscription
 *   - jednorázové vstupy daného uživatele
 *   - subscription plány
 *   - definice one-time vstupů
 * Poté vyhodnocuje hasActiveSubscription, latestSubscription atd.
 */
export default function useChargeSubscription(userId) {
    const [user, setUser] = useState(null);
    const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
    const [latestSubscription, setLatestSubscription] = useState(null);
    const [oneTimeCount, setOneTimeCount] = useState(0); // kolik má uživatel nevyužitých one-time
    const [subscriptionPlans, setSubscriptionPlans] = useState([]);
    const [allOneTimeEntries, setAllOneTimeEntries] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                setError('');

                // Paralelně načteme 5 konců
                const [
                    userRes,
                    userSubsRes,
                    userOneTimeRes,
                    subsPlansRes,
                    allOneTimeRes
                ] = await Promise.all([
                    api.get(`/users/${userId}`),
                    api.get(`/user-subscriptions/user/${userId}`),
                    api.get(`/user-one-time-entries/user/${userId}`),
                    api.get('/subscriptions'),
                    api.get('/one-time-entries')
                ]);

                // (A) Uživatel
                const userData = userRes.data;
                setUser(userData);

                // (B) Subscription
                const subsArr = userSubsRes.data || [];
                const activeSub = getActiveSubscription(subsArr);
                setHasActiveSubscription(!!activeSub);

                const latestSub = getLatestSubscription(subsArr);
                setLatestSubscription(latestSub);

                // (C) One-time entries
                const notUsed = (userOneTimeRes.data || []).filter(entry => !entry.isUsed);
                setOneTimeCount(notUsed.length);

                // (D) Subscription plány
                const plans = (subsPlansRes.data || []).map((sub) => ({
                    subscriptionID: sub.subscriptionID,
                    subscriptionType: sub.subscriptionType,
                    durationMonths: sub.durationMonths,
                    price: sub.price,
                    label: `${sub.subscriptionType} (${sub.durationMonths} měs.) - ${sub.price} Kč`
                }));
                setSubscriptionPlans(plans);

                // (E) Definice jednorázových vstupů
                setAllOneTimeEntries(allOneTimeRes.data || []);

            } catch (err) {
                console.error(err);
                setError('Nepodařilo se načíst potřebná data pro dobíjení.');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchAllData();
        }
    }, [userId]);

    return {
        user,
        hasActiveSubscription,
        latestSubscription,
        oneTimeCount,
        subscriptionPlans,
        allOneTimeEntries,
        loading,
        error
    };
}
