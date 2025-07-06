/**
 * @file ChargeOneTimeEntry.jsx
 * Page used to top up one standard one-time entry. After the user is
 * identified using the {@link UserIdentifier} modal, a POST request is sent
 * to the backend and the user is redirected back to the home page.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import api from '../services/api';
import { formatDate } from '../utils/dateUtils';
import UserIdentifier from '../components/UserIdentifier';

/** ID definice standardního jednorázového vstupu na backendu. */
const STANDARD_ENTRY_ID = 1;

/**
 * Renders only the {@link UserIdentifier} modal. Once the user is found
 * a single standard entry is charged and the user is navigated back home.
 */
export default function ChargeOneTimeEntry() {
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) return;

        const chargeEntry = async () => {
            try {
                const purchaseDate = formatDate(new Date());
                await api.post(
                    '/user-one-time-entries',
                    {
                        userID: userId,
                        oneTimeEntryID: STANDARD_ENTRY_ID,
                        purchaseDate,
                        isUsed: false
                    },
                    { params: { count: 1 } }
                );
                toast.success('Jednorázový vstup úspěšně dobit.');
            } catch (err) {
                console.error(err);
                toast.error('Nepodařilo se dobít jednorázový vstup.');
            } finally {
                navigate('/');
            }
        };

        chargeEntry();
    }, [userId, navigate]);

    return <UserIdentifier onUserFound={setUserId} />;
}
