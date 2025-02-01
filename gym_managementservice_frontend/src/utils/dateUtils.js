/**
 * @file dateUtils.js
 * Utility funkce pro práci s datem.
 */

/**
 * Naformátuje ISO řetězec do "DD.MM.YYYY HH:mm".
 * @param {string | Date} isoString - ISO řetězec (nebo Date) k formátování.
 * @returns {string} Formátované datum.
 */
export function formatDate(isoString) {
    if (!isoString) return '';
    const date = (isoString instanceof Date) ? isoString : new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}
