export const STANDARD_ENTRY_ID = 1;
export const STUDENT_ENTRY_ID = 2;
export const MANUAL_ENTRY_ID = 3;

import api from '../services/api';
export async function chargeOneTimeEntry(
    userID,
    oneTimeEntryID,
    count = 1,
    customPrice = 0
) {
    const purchaseDate = new Date().toISOString().split('T')[0];
    await api.post(
        '/user-one-time-entries',
        {
            userID,
            oneTimeEntryID,
            purchaseDate,
            isUsed: false,
            customPrice
        },
        { params: { count } }
    );
}
