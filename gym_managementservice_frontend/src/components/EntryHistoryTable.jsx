import React from 'react';
import PropTypes from 'prop-types';
import styles from './EntryHistoryTable.module.css';

/**
 * Mapa definic sloupců pro EntryHistoryTable.
 * Každý klíč odpovídá identifikátoru sloupce a obsahuje záhlaví a funkci pro renderování obsahu buňky.
 */
const COLUMN_DEFINITIONS = {
    date: {
        header: 'Datum/čas',
        /**
         * Renderuje datum a čas vstupu ve formátu DD.MM.RRRR HH:MM.
         * @param {Object} entry - Objekt vstupu.
         * @param {Function} formatDate - Funkce pro formátování data.
         * @returns {string} Formátované datum a čas.
         */
        render: (entry, formatDate) => formatDate(entry.entryDate || entry.date),
    },
    userName: {
        header: 'Jméno uživatele',
        /**
         * Renderuje jméno uživatele nebo jeho ID.
         * @param {Object} entry - Objekt vstupu.
         * @returns {string} Jméno uživatele nebo ID.
         */
        render: (entry) => {
            return entry.firstName && entry.lastName
                ? `${entry.firstName} ${entry.lastName}`
                : entry.userID;
        },
    },
    subscriptionType: {
        header: 'Předplatné',
        /**
         * Renderuje typ předplatného nebo "-" pokud není k dispozici.
         * @param {Object} entry - Objekt vstupu.
         * @returns {string} Typ předplatného.
         */
        render: (entry) => entry.subscriptionType || '-',
    },
};

/**
 * Komponenta EntryHistoryTable zobrazuje tabulku historie vstupů.
 *
 * @component
 * @param {Object} props - Vlastnosti komponenty.
 * @param {Array} props.entries - Pole objektů vstupů.
 * @param {Function} props.formatDate - Funkce pro formátování datumu.
 * @param {Array<string>} [props.columns] - Pole identifikátorů sloupců, které se mají zobrazit.
 * @param {boolean} [props.showTotal=true] - Určuje, zda se má zobrazit celkový počet vstupů v zápatí.
 * @returns {JSX.Element} Tabulka s historií vstupů.
 */
function EntryHistoryTable({ entries, formatDate, columns, showTotal }) {
    /**
     * Vypočítá celkový počet vstupů.
     * @type {number}
     */
    const totalEntries = entries.length;

    return (
        <div className={styles.tableWrapper}>
            <h3>Historie vstupů</h3>
            <div className={styles.tableContainer}>
                {entries.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            {columns.map((colKey) => (
                                <th key={colKey}>{COLUMN_DEFINITIONS[colKey].header}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {entries.map((entry, index) => (
                            <tr key={entry.id || index}>
                                {columns.map((colKey) => (
                                    <td key={colKey}>
                                        {COLUMN_DEFINITIONS[colKey].render(entry, formatDate)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                        {/* Zobrazení zápatí pouze pokud je `showTotal` true */}
                        {showTotal && (
                            <tfoot>
                            <tr>
                                <td colSpan={columns.length}>
                                    <strong>Celkový počet vstupů: {totalEntries}</strong>
                                </td>
                            </tr>
                            </tfoot>
                        )}
                    </table>
                ) : (
                    <p className={styles.noData}>Žádné vstupy v tomto období.</p>
                )}
            </div>
        </div>
    );
}

EntryHistoryTable.propTypes = {
    entries: PropTypes.arrayOf(PropTypes.object).isRequired,
    formatDate: PropTypes.func.isRequired,
    columns: PropTypes.arrayOf(PropTypes.string),
    showTotal: PropTypes.bool,
};

EntryHistoryTable.defaultProps = {
    columns: ['date', 'userName', 'subscriptionType'],
    showTotal: true,
};

export default EntryHistoryTable;
