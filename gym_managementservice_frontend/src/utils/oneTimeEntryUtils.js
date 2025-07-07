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

    // Sestavíme tělo požadavku dynamicky
    const payload = {
        userID,
        oneTimeEntryID,
        purchaseDate,
        isUsed: false,
        // přidá customPrice pouze pokud ID je MANUAL_ENTRY_ID
        ...(oneTimeEntryID === MANUAL_ENTRY_ID && { customPrice }),
    };

    await api.post(
        '/user-one-time-entries',
        payload,
        { params: { count } }
    );
}
