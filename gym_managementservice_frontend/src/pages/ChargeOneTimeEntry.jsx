/**
 * @file ChargeOneTimeEntry.jsx
 * Page used to top up one standard one-time entry. After the user is
 * identified using the {@link UserIdentifier} modal, a POST request is sent
 * to the backend and the user is redirected back to the home page.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { chargeOneTimeEntry, STANDARD_ENTRY_ID } from '../utils/oneTimeEntryUtils';
import UserIdentifier from '../components/UserIdentifier';


/**
 * Renders only the {@link UserIdentifier} modal. Once the user is found
 * a single standard entry is charged and the user is navigated back home.
 */
export default function ChargeOneTimeEntry() {
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    const handleResult = ({ status, userID }) => {
        if (status === 'ASSIGNED' && userID != null) {
            setUserId(userID);
        } else if (status === 'NOT_REGISTERED' || status === 'UNASSIGNED') {
            setUserId(-1);
        } else {
            navigate(-1);
        }
    };

    useEffect(() => {
        if (!userId) return;

        const chargeEntry = async () => {
            try {
                await chargeOneTimeEntry(userId, STANDARD_ENTRY_ID, 1);
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

    return <UserIdentifier onUserFound={handleResult} mode="single" />;
}
