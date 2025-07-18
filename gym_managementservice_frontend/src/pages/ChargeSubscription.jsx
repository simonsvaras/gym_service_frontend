/**
 * @file ChargeSubscription.jsx
 * Stránka pro dobití předplatného a jednorázových vstupů uživatele.
 */
import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './ChargeSubscription.module.css';

import api from '../services/api';
import useChargeSubscription from '../hooks/useChargeSubscription';
import { formatDate } from '../utils/dateUtils';
import { chargeOneTimeEntry } from '../utils/oneTimeEntryUtils';

import SimpleButton from '../components/SimpleButton';
import SimpleModal from '../components/SimpleModal';
import UserInfoBox from '../components/UserInfoBox';
import SubscriptionSection from '../components/SubscriptionSection';
import UserIdentifier from '../components/UserIdentifier';

function ChargeSubscription() {
    const { id } = useParams();
    // ID uživatele bude získáno z URL nebo z modálního okna
    const [userId, setUserId] = useState(id || null);

    // Custom hook, který stáhne vše potřebné
    const {
        user,
        hasActiveSubscription,
        latestSubscription,
        oneTimeCount,
        subscriptionPlans,
        allOneTimeEntries,
        loading,
        error
    } = useChargeSubscription(userId);

    // Lokální stavy
    const [isStudent, setIsStudent] = useState(false);

    // Vybraný subscription plán (pro dobití)
    const [selectedPlan, setSelectedPlan] = useState(null);

    // Vybraný typ jednorázového vstupu
    const [selectedOneTimeEntry, setSelectedOneTimeEntry] = useState(null);

    // **Defaultní** počet jednorázových vstupů na 1
    const [oneTimeToAdd, setOneTimeToAdd] = useState(1);

    // Modál
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null); // "subscription" nebo "onetimes"
    const [modalPrice, setModalPrice] = useState(0);

    // Pokud se změní `error`, zobrazíme toast chybu
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    // Při změně isStudent volíme, kterou definici jednorázového vstupu (index 0 = základ, index 1 = student apod.)
    useEffect(() => {
        if (allOneTimeEntries.length > 0) {
            if (isStudent && allOneTimeEntries.length > 1) {
                setSelectedOneTimeEntry(allOneTimeEntries[1]);
            } else {
                setSelectedOneTimeEntry(allOneTimeEntries[0]);
            }
        }
    }, [isStudent, allOneTimeEntries]);

    // Celková cena jednorázových vstupů (zobrazujeme pouze tuto, jak požadováno)
    const totalOneTimePrice = useMemo(() => {
        if (!selectedOneTimeEntry) return 0;
        return (selectedOneTimeEntry.price || 0) * oneTimeToAdd;
    }, [selectedOneTimeEntry, oneTimeToAdd]);

    // Ovládání +/- u jednorázových vstupů
    const incrementOneTime = () => setOneTimeToAdd(prev => prev + 1);
    const decrementOneTime = () => setOneTimeToAdd(prev => (prev > 1 ? prev - 1 : 1)); // Minimálně 1

    // Otevřít modál pro subscription
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

    // Otevřít modál pro jednorázové vstupy
    const handleOpenOneTimeModal = () => {
        if (oneTimeToAdd <= 0) {
            toast.warn('Zadejte kladný počet vstupů.');
            return;
        }
        setModalPrice(totalOneTimePrice);
        setModalAction('onetimes');
        setIsModalOpen(true);
    };

    // Potvrzení z modálu
    const handleConfirm = async () => {
        setIsModalOpen(false);

        // (A) Dobití subscription
        if (modalAction === 'subscription' && selectedPlan) {
            try {
                const toIsoDate = d => d.toISOString().slice(0, 10);

                const now = new Date();
                const startDate = toIsoDate(now);
                const endDateObj = new Date(now);
                endDateObj.setMonth(endDateObj.getMonth() + selectedPlan.durationMonths);
                const endDate = toIsoDate(endDateObj);

                await api.post('/user-subscriptions', {
                    userID: userId,
                    subscriptionID: selectedPlan.subscriptionID,
                    startDate,
                    endDate,
                    isActive: true
                });

                toast.success(`Předplatné dobito, cena: ${modalPrice} Kč`);
                // Případné znovu-načtení dat byste řešili vyvoláním re-fetch z hooku
            } catch (err) {
                console.error(err);
                toast.error('Chyba při dobíjení předplatného.');
            }

            // (B) Dobití jednorázových vstupů
        } else if (modalAction === 'onetimes' && selectedOneTimeEntry) {
            try {
                await chargeOneTimeEntry(
                    userId,
                    selectedOneTimeEntry.oneTimeEntryID,
                    oneTimeToAdd
                );
                toast.success(`Dobito ${oneTimeToAdd} vstupů, cena: ${modalPrice} Kč`);
                setOneTimeToAdd(1); // Vrátíme na 1
            } catch (err) {
                console.error(err);
                toast.error('Chyba při dobíjení vstupů.');
            }
        }
    };

    // Zavření modálu
    const handleCancel = () => {
        setIsModalOpen(false);
    };

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

    // Nejprve požádáme o číslo karty, dokud nemáme userId
    if (!userId) {
        return <UserIdentifier onUserFound={setUserId} />;
    }

    // Render
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

            {/* Pokud data selžou, error už je vytoastován. Můžeme ukázat fallback. */}
            {error && <p className={styles.error}>Nelze zobrazit data (chyba).</p>}

            {!user ? (
                <p>Žádná data k zobrazení.</p>
            ) : (
                <div className={styles.mainContent}>
                    {/* Levý sloupec: info o uživateli */}
                    <div className={styles.leftColumn}>
                        <UserInfoBox info={userInfo} />

                        {/* Checkbox "Je student?" */}
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

                    {/* Pravý sloupec: Dobití */}
                    <div className={styles.actionsColumn}>
                        {/* A) Dobití předplatného */}
                        <SubscriptionSection
                            subscriptionPlans={subscriptionPlans}
                            loading={loading}
                            handleOpenSubscriptionModal={handleOpenSubscriptionModal}
                        />

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

                            {/* Pouze celková cena */}
                            <p>Celková cena: {totalOneTimePrice} Kč</p>

                            <SimpleButton
                                text="Dobít"
                                onClick={handleOpenOneTimeModal}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Modální okno: potvrzení platby */}
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
