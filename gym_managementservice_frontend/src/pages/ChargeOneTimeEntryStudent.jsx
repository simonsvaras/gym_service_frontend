/**
 * @file ChargeOneTimeEntryStudent.jsx
 * Page used to top up one student one-time entry. After identifying a user via
 * the {@link UserIdentifier} modal, the entry is charged and the user is
 * redirected back to the home page.
 */

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
    const navigate = useNavigate();

    const handleResult = ({ status, userID }) => {
        if (status === 'ASSIGNED' && userID != null) {
            setUserId(userID);
        } else {
            navigate(-1);
        }
    };

    useEffect(() => {
        if (!userId) return;

        const chargeEntry = async () => {
            try {
                await chargeOneTimeEntry(userId, STUDENT_ENTRY_ID, 1);
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

    return <UserIdentifier onUserFound={handleResult} mode="single" />;
}
