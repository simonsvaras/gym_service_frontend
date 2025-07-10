import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { chargeOneTimeEntry, STANDARD_ENTRY_ID } from '../utils/oneTimeEntryUtils';
import UserIdentifier from '../components/UserIdentifier';

/**
 * Komponenta pro dobíjení jednoho jednorázového vstupu.
 * Po identifikaci uživatele se odešle požadavek na backend.
 */
export default function ChargeOneTimeEntry() {
    const [userId, setUserId] = useState(null);
    const [cardNumber, setCardNumber] = useState(null);
    const navigate = useNavigate();

    /**
     * Callback pro výsledek z modalu UserIdentifier.
     * @param {{ status: string, userID: number|null, cardNumber: string }} param0
     */
    const handleResult = ({ status, userID, cardNumber }) => {
        if (status === 'ASSIGNED' && userID != null) {
            setUserId(userID);
        } else if (status === 'NOT_REGISTERED' || status === 'UNASSIGNED') {
            // Uživatel nenalezen nebo není registrovaný -> použijeme -1
            setUserId(-1);
            setCardNumber(cardNumber);
        } else {
            navigate(-1);
        }
    };

    /**
     * Efekt, který se spustí při změně userId (a případně cardNumber).
     * Zavolá správnou variantu chargeOneTimeEntry podle hodnoty userId.
     */
    useEffect(() => {
        // Čekáme, až se userId nastaví (cardNumber je potřeba jen pro userId = -1)
        if (userId === null) return;

        const chargeEntry = async () => {
            try {
                if (userId === -1) {
                    // Uživatel neregistrovaný: posíláme i cardNumber
                    await chargeOneTimeEntry(userId, STANDARD_ENTRY_ID, 1, cardNumber);
                } else {
                    // Registrovaný uživatel: standardní volání bez cardNumber
                    await chargeOneTimeEntry(userId, STANDARD_ENTRY_ID, 1);
                }
                toast.success('Jednorázový vstup úspěšně dobit.');
            } catch (err) {
                console.error(err);
                toast.error('Nepodařilo se dobít jednorázový vstup.');
            } finally {
                navigate('/');
            }
        };

        // Spustíme funkci pro dobíjení
        chargeEntry();
    }, [userId, cardNumber, navigate]);

    return <UserIdentifier onUserFound={handleResult} mode="single" />;
}
