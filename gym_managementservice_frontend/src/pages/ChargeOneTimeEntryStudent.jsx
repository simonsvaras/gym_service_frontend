import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { chargeOneTimeEntry, STUDENT_ENTRY_ID } from '../utils/oneTimeEntryUtils';
import UserIdentifier from '../components/UserIdentifier';

/**
 * Renders the {@link UserIdentifier} modal and after a user is found charges a
 * single student entry and navigates back to the homepage.
 */
export default function ChargeOneTimeEntryStudent() {
    const [userId, setUserId] = useState(null);
    const [cardNumber, setCardNumber] = useState(null);
    const navigate = useNavigate();

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

    useEffect(() => {
        // Čekáme, až se userId nastaví (cardNumber jen pro userId = -1)
        if (userId === null) return;

        const chargeEntry = async () => {
            try {
                if (userId === -1) {
                    // Neregistrovaný uživatel: posíláme i cardNumber
                    await chargeOneTimeEntry(userId, STUDENT_ENTRY_ID, 1, cardNumber);
                } else {
                    // Registrovaný uživatel: standardní volání
                    await chargeOneTimeEntry(userId, STUDENT_ENTRY_ID, 1);
                }
                toast.success('Studentský vstup úspěšně dobit.');
            } catch (err) {
                console.error(err);
                toast.error('Nepodařilo se dobít studentský vstup.');
            } finally {
                navigate('/');
            }
        };

        chargeEntry();
    }, [userId, cardNumber, navigate]);

    return <UserIdentifier onUserFound={handleResult} mode="single" />;
}
