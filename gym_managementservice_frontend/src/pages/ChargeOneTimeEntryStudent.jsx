/**
 * @file ChargeOneTimeEntryStudent.jsx
 * Page used to top up one student one-time entry. After identifying a user via
 * the {@link UserIdentifier} modal, the entry is charged and the user is
 * redirected back to the home page.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import api from '../services/api';
import { formatDate } from '../utils/dateUtils';
import UserIdentifier from '../components/UserIdentifier';

/** ID definice studentského jednorázového vstupu na backendu. */
const STUDENT_ENTRY_ID = 2;

/**
 * Renders the {@link UserIdentifier} modal and after a user is found charges a
 * single student entry and navigates back to the homepage.
 */
export default function ChargeOneTimeEntryStudent() {
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) return;

        const chargeEntry = async () => {
            try {
                const purchaseDate = new Date().toISOString().split('T')[0];
                await api.post(
                    '/user-one-time-entries',
                    {
                        userID: userId,
                        oneTimeEntryID: STUDENT_ENTRY_ID,
                        purchaseDate,
                        isUsed: false
                    },
                    { params: { count: 1 } }
                );
                toast.success('Studentský vstup úspěšně dobit.');
            } catch (err) {
                console.error(err);
                toast.error('Nepodařilo se dobít studentský vstup.');
            } finally {
                navigate('/');
            }
        };

        chargeEntry();
    }, [userId, navigate]);

    return <UserIdentifier onUserFound={setUserId} />;
}
