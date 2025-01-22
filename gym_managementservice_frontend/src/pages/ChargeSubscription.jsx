// src/pages/ChargeSubscription.jsx
import React, { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import styles from './ChargeSubscription.module.css';
import SimpleButton from '../components/SimpleButton';
import SimpleModal from '../components/SimpleModal'; // Aktualizovaný import
import UserInfoBox from '../components/UserInfoBox'; // Import nové komponenty

function ChargeSubscription() {
    const userId = 1; // V reálu se může čerpat odjinud

    // -- STAVY --
    const [user, setUser] = useState(null);
    const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
    const [latestSubscription, setLatestSubscription] = useState(null); // Nový stav
    const [oneTimeCount, setOneTimeCount] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [isStudent, setIsStudent] = useState(false);
    const [subscriptionPlans, setSubscriptionPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const [allOneTimeEntries, setAllOneTimeEntries] = useState([]);
    const [selectedOneTimeEntry, setSelectedOneTimeEntry] = useState(null);
    const [oneTimeToAdd, setOneTimeToAdd] = useState(0);

    // -- MODÁL --
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null); // "subscription" | "onetimes"
    const [modalPrice, setModalPrice] = useState(0);

    // -- HELPER FUNKCE --

    // Pomocná funkce pro formátování data do "YYYY-MM-DD"
    const formatDate = (dateObj) => dateObj.toISOString().split('T')[0];

    // Zjistí aktivní předplatné
    const getActiveSubscription = (subsArray) => {
        const now = new Date();
        return subsArray.find((sub) => {
            const start = new Date(sub.startDate);
            const end = new Date(sub.endDate);
            return start <= now && now <= end && sub.isActive;
        });
    };

    // Zjistí nejnovější předplatné (podle endDate)
    const getLatestSubscription = (subsArray) => {
        if (subsArray.length === 0) return null;
        // Sortujeme kopii pole, abychom neovlivnili původní data
        const sorted = [...subsArray].sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
        return sorted[0];
    };

    // Výpočet celkové ceny jednorázových vstupů
    const totalOneTimePrice = useMemo(() => {
        if (!selectedOneTimeEntry) return 0;
        return (selectedOneTimeEntry.price || 0) * oneTimeToAdd;
    }, [selectedOneTimeEntry, oneTimeToAdd]);

    // -- NAČÍTÁNÍ DAT (jediný useEffect) --
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                setError('');

                // Naráz stáhneme:
                // 1) Uživatel
                // 2) Uživatelské subscription
                // 3) Uživatelské one-time vstupy
                // 4) Subscription plány
                // 5) Všechny definice one-time vstupů
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
                    api.get('/one-time-entries'),
                ]);

                // (A) Uživatel
                const userData = userRes.data;
                setUser(userData);

                // (B) Aktivní subscription?
                const subsArr = userSubsRes.data || [];
                const activeSub = getActiveSubscription(subsArr);
                setHasActiveSubscription(activeSub !== null);

                // (C) Nejnovější subscription
                const latestSub = getLatestSubscription(subsArr);
                setLatestSubscription(latestSub);

                // (D) Počet nevyužitých one-time vstupů
                const notUsed = (userOneTimeRes.data || []).filter((entry) => !entry.isUsed);
                setOneTimeCount(notUsed.length);

                // (E) Subscription plány
                const plans = subsPlansRes.data.map((sub) => ({
                    subscriptionID: sub.subscriptionID,
                    subscriptionType: sub.subscriptionType,
                    durationMonths: sub.durationMonths,
                    price: sub.price,
                    label: `${sub.subscriptionType} (${sub.durationMonths} měs.) - ${sub.price} Kč`
                }));
                setSubscriptionPlans(plans);

                // (F) Všechny jednorázové vstupy
                const allOneTimes = allOneTimeRes.data || [];
                setAllOneTimeEntries(allOneTimes);

                if (allOneTimes.length > 0) {
                    setSelectedOneTimeEntry(allOneTimes[0]);
                }

            } catch (err) {
                console.error(err);
                setError('Nepodařilo se načíst potřebná data.');
                toast.error('Nepodařilo se načíst potřebná data.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [userId]);

    // -- Když se změní isStudent (checkbox), vyber správnou jednorázovou položku --
    useEffect(() => {
        if (allOneTimeEntries.length > 0) {
            // Pro příklad: index 0 = základní cena, index 1 = studentská atd.
            if (isStudent && allOneTimeEntries.length > 1) {
                setSelectedOneTimeEntry(allOneTimeEntries[1]);
            } else {
                setSelectedOneTimeEntry(allOneTimeEntries[0]);
            }
        }
    }, [isStudent, allOneTimeEntries]);

    // -- Ovládání +/- pro jednorázové vstupy --
    const incrementOneTime = () => setOneTimeToAdd((prev) => prev + 1);
    const decrementOneTime = () => setOneTimeToAdd((prev) => (prev > 0 ? prev - 1 : 0));

    // -- Otevření modálního okna pro SUBSCRIPTION --
    const handleOpenSubscriptionModal = (plan) => {
        if (!plan) {
            toast.warn('Vyberte předplatné');
            return;
        }
        setSelectedPlan(plan);
        setModalPrice(plan.price || 0);
        setModalAction('subscription');
        setIsModalOpen(true);
    };

    // -- Otevření modálního okna pro jednorázové vstupy --
    const handleOpenOneTimeModal = () => {
        if (oneTimeToAdd <= 0) {
            toast.warn('Zadej kladný počet vstupů.');
            return;
        }
        setModalPrice(totalOneTimePrice);
        setModalAction('onetimes');
        setIsModalOpen(true);
    };

    // -- Potvrzení v modálu --
    const handleConfirm = async () => {
        setIsModalOpen(false);

        if (modalAction === 'subscription' && selectedPlan) {
            // --- Dobití předplatného ---
            try {
                setLoading(true);
                setError('');

                const now = new Date();
                const startDate = formatDate(now); // např. "2024-07-21"
                const end = new Date(now);
                end.setMonth(end.getMonth() + selectedPlan.durationMonths);
                const endDate = formatDate(end);

                await api.post('/user-subscriptions', {
                    userID: userId,
                    subscriptionID: selectedPlan.subscriptionID,
                    startDate,
                    endDate,
                    isActive: true
                });

                toast.success(`Předplatné dobito, cena: ${modalPrice} Kč`);
                // Možná chcete přenačíst data zde
                // fetchAllData(); // Pokud je fetchAllData definována mimo useEffect
            } catch (err) {
                console.error(err);
                setError('Chyba při dobíjení předplatného.');
                toast.error('Chyba při dobíjení předplatného.');
            } finally {
                setLoading(false);
            }

        } else if (modalAction === 'onetimes') {
            // --- Dobití jednorázových vstupů ---
            try {
                setLoading(true);
                setError('');

                const purchaseDate = formatDate(new Date());
                if (!selectedOneTimeEntry) return; // pro jistotu

                await api.post(
                    '/user-one-time-entries',
                    {
                        userID: userId,
                        oneTimeEntryID: selectedOneTimeEntry.oneTimeEntryID,
                        purchaseDate,
                        isUsed: false
                    },
                    {
                        // count param (kolikrát dokoupit)
                        params: { count: oneTimeToAdd }
                    }
                );

                toast.success(`Dobito ${oneTimeToAdd} vstupů, cena: ${modalPrice} Kč`);
                setOneTimeToAdd(0);
                // Opět by bylo vhodné přenačíst data
                // fetchAllData(); // Pokud je fetchAllData definována mimo useEffect
            } catch (err) {
                console.error(err);
                setError('Chyba při dobíjení vstupů.');
                toast.error('Chyba při dobíjení vstupů.');
            } finally {
                setLoading(false);
            }
        }
    };

    // -- Zrušení modálu --
    const handleCancel = () => setIsModalOpen(false);

    // -- RENDER --
    if (loading) {
        return (
            <div className={styles.chargeContainer}>
                <p>Načítám...</p>
            </div>
        );
    }

    return (
        <div className={styles.chargeContainer}>
            <h2>Dobití předplatného / jednorázových vstupů</h2>

            {error && <p className={styles.error}>{error}</p>}

            {!user ? (
                <p>Žádná data k zobrazení.</p>
            ) : (
                <div className={styles.mainContent}>
                    {/* Levý blok: info o uživateli - Použití nové komponenty UserInfoBox */}
                    <div className={styles.leftColumn}>
                        <UserInfoBox
                            firstname={user.firstname}
                            lastname={user.lastname}
                            email={user.email}
                            birthdate={user.birthdate}
                            profilePhoto={user.profilePhoto ? `/profile-photos/${user.profilePhoto}` : null}
                            hasActiveSubscription={hasActiveSubscription}
                            latestSubscription={latestSubscription}
                            isExpiredSubscription={latestSubscription && new Date(latestSubscription.endDate) < new Date()}
                        />

                        {/* Checkbox 'Je student?' pod UserInfoBox */}
                        <div className={styles.studentCheckboxContainer}>
                            <label className={styles.studentCheckboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={isStudent}
                                    onChange={(e) => setIsStudent(e.target.checked)}
                                    className={styles.studentCheckbox}
                                />
                                <span className={styles.slider}></span>
                            </label>
                            <span className={styles.labelText}>Je student?</span>
                        </div>
                    </div>

                    {/* Pravý blok: dobití */}
                    <div className={styles.actionsColumn}>
                        {/* A) Předplatné */}
                        <div className={styles.subscriptionSection}>
                            <h4>Předplatné</h4>
                            {subscriptionPlans.length === 0 ? (
                                <p>Žádné dostupné předplatné.</p>
                            ) : (
                                <div className={styles.subscriptionButtons}>
                                    {subscriptionPlans.map((plan) => (
                                        <SimpleButton
                                            key={plan.subscriptionID}
                                            text={plan.label}
                                            onClick={() => handleOpenSubscriptionModal(plan)}
                                            disabled={loading}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* B) Jednorázové vstupy */}
                        <div className={styles.oneTimeSection}>
                            <h4>Jednorázové vstupy</h4>

                            <div className={styles.counter}>
                                <SimpleButton
                                    text="−"
                                    onClick={decrementOneTime}
                                    disabled={oneTimeToAdd <= 0 || loading}
                                />
                                <span>{oneTimeToAdd}</span>
                                <SimpleButton
                                    text="+"
                                    onClick={incrementOneTime}
                                    disabled={loading}
                                />
                            </div>

                            {selectedOneTimeEntry && (
                                <p>Cena za vstup: {selectedOneTimeEntry.price} Kč</p>
                            )}
                            <SimpleButton
                                text="Dobít"
                                onClick={handleOpenOneTimeModal}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* MODÁL - Použití nové komponenty SimpleModal */}
            {isModalOpen && (
                <SimpleModal
                    title="Potvrzení platby"
                    message={`Celková cena: ${modalPrice} Kč`}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    confirmText="Potvrdit"
                    cancelText="Zrušit"
                    disabled={loading}
                />
            )}
        </div>
    );

}

export default ChargeSubscription;
