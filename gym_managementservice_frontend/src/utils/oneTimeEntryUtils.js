export const STANDARD_ENTRY_ID = 1;
export const STUDENT_ENTRY_ID = 2;
export const MANUAL_ENTRY_ID = 3;

import api from '../services/api';

/**
 * Nakonec účtuje jednorázový vstup.
 * - Pro registrované uživatele posílá na '/user-one-time-entries'
 * - Pro neregistrované (userID = -1) posílá na '/user-one-time-entries/unregistered' s číslem karty
 *
 * @param {number} userID – ID uživatele nebo -1 pro neregistrované
 * @param {number} oneTimeEntryID – typ jednorázového vstupu (STANDARD_ENTRY_ID, ...)
 * @param {number} [count=1] – počet vstupů k dobití
 * @param {string|null} [cardNumber=null] – číslo karty pro neregistrované
 * @param {number} [customPrice=0] – vlastní cena (pouze pro MANUAL_ENTRY_ID)
 */
export async function chargeOneTimeEntry(
    userID,
    oneTimeEntryID,
    count = 1,
    cardNumber = null,
    customPrice = 0
) {
    const purchaseDate = new Date().toISOString().split('T')[0];

    // Dynamické URL podle typu uživatele
    const url =
        userID === -1
            ? '/user-one-time-entries/unregistered'
            : '/user-one-time-entries';

    // Sestavení payloadu
    const payload = {
        userID,
        oneTimeEntryID,
        purchaseDate,
        isUsed: false,
        // přidá customPrice pouze pokud je manuální vstup
        ...(oneTimeEntryID === MANUAL_ENTRY_ID && { customPrice }),
        // přidá cardNumber pouze pro neregistrované
        ...(userID === -1 && cardNumber != null && { cardNumber }),
    };

    // POST požadavek s parametrem count
    await api.post(url, payload, { params: { count } });
}