import React from 'react';
import styles from './EntryHistoryTable.module.css';

/**
 * Komponenta EntryHistoryTable zobrazuje tabulku historie vstupů.
 * @param {Array} entries - Pole vstupů.
 * @param {Function} formatDate - Funkce pro formátování data.
 * @param {number} totalEntries - Celkový počet vstupů.
 */
function EntryHistoryTable({ entries, formatDate, totalEntries }) {
    return (
        <div className={styles.tableWrapper}>
            <h3>Historie vstupů</h3>
            {entries.length > 0 ? (
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Datum/čas</th>
                        <th>Jméno uživatele</th>
                    </tr>
                    </thead>
                    <tbody>
                    {entries.map((en, index) => (
                        <tr key={index}>
                            <td>{formatDate(en.entryDate)}</td>
                            <td>
                                {en.firstName && en.lastName
                                    ? `${en.firstName} ${en.lastName}`
                                    : en.userID}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan="2">
                            <strong>Celkový počet vstupů: {totalEntries}</strong>
                        </td>
                    </tr>
                    </tfoot>
                </table>
            ) : (
                <p className={styles.noData}>Žádné vstupy v tomto období.</p>
            )}
        </div>
    );
}

export default EntryHistoryTable;
