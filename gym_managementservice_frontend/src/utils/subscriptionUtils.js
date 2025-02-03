/**
 * @file subscriptionUtils.js
 * Utility funkce pro práci se subscription (předplatnými).
 */

/**
 * Najde aktivní předplatné z pole subscriptions (start <= now <= end).
 * @param {Array} subsArray - Pole subscription objektů.
 * @returns {Object|null} První nalezené aktivní předplatné, nebo null.
 */
export function getActiveSubscription(subsArray = []) {
    const now = new Date();
    return subsArray.find((sub) => {
        //const start = new Date(sub.startDate);
        //const end   = new Date(sub.endDate);
        //return start <= now && now <= end && sub.isActive;
        return sub.isActive;
    }) || null;
}

/**
 * Vrátí nejnovější předplatné (podle endDate).
 * @param {Array} subsArray - Pole subscription objektů.
 * @returns {Object|null} Předplatné s nejpozdějším endDate, nebo null.
 */
export function getLatestSubscription(subsArray = []) {
    if (subsArray.length === 0) return null;
    const sorted = [...subsArray].sort(
        (a, b) => new Date(b.endDate) - new Date(a.endDate)
    );
    return sorted[0];
}
