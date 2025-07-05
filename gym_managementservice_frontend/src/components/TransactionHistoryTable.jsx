import React from 'react';
import PropTypes from 'prop-types';
import styles from './TransactionHistoryTable.module.css';

/**
 * Mapa definic sloupců pro TransactionHistoryTable.
 * Každý klíč odpovídá identifikátoru sloupce a obsahuje záhlaví a funkci pro renderování obsahu buňky.
 */
const COLUMN_DEFINITIONS = {
    date: {
        header: 'Datum/čas',
        /**
         * Renderuje datum a čas transakce ve formátu DD.MM.RRRR HH:MM.
         * @param {Object} tx - Objekt transakce.
         * @param {Function} formatDate - Funkce pro formátování data.
         * @returns {string} Formátované datum a čas.
         */
        render: (tx, formatDate) => formatDate(tx.transactionDate || tx.date),
    },
    userName: {
        header: 'Jméno uživatele',
        /**
         * Renderuje jméno uživatele nebo jeho ID.
         * @param {Object} tx - Objekt transakce.
         * @returns {string} Jméno uživatele nebo ID.
         */
        render: (tx) => {
            return tx.firstName && tx.lastName
                ? `${tx.firstName} ${tx.lastName}`
                : tx.userId;
        },
    },
    purchaseType: {
        header: 'Položka',
        /**
         * Renderuje typ nákupu nebo název položky.
         * @param {Object} tx - Objekt transakce.
         * @returns {string} Typ nákupu nebo název položky.
         */
        render: (tx) => tx.purchaseType || tx.itemName || '-',
    },
    amount: {
        header: 'Cena',
        /**
         * Renderuje cenu transakce ve formátu "XXX Kč".
         * @param {Object} tx - Objekt transakce.
         * @returns {string} Cena transakce.
         */
        render: (tx) => `${tx.amount} Kč`,
    },
    note: {
        header: 'Popis (poznámka)',
        /**
         * Renderuje poznámku k transakci nebo "-" pokud není k dispozici.
         * @param {Object} tx - Objekt transakce.
         * @returns {string} Poznámka k transakci.
         */
        render: (tx) => tx.note || '-',
    },
};

/**
 * Komponenta TransactionHistoryTable zobrazuje tabulku historie transakcí.
 *
 * @component
 * @param {Object} props - Vlastnosti komponenty.
 * @param {Array} props.transactions - Pole objektů transakcí.
 * @param {Function} props.formatDate - Funkce pro formátování datumu.
 * @param {Array<string>} [props.columns] - Pole identifikátorů sloupců, které se mají zobrazit.
 * @param {boolean} [props.showTotal=true] - Určuje, zda se má zobrazit součet všech transakcí.
 * @returns {JSX.Element} Tabulka s historií transakcí.
 */
function TransactionHistoryTable({
    transactions,
    formatDate,
    columns = ['date', 'userName', 'purchaseType', 'amount'],
    showTotal = true,
}) {
    /**
     * Vypočítá celkovou cenu ze všech transakcí.
     * @type {number}
     */
    const totalPrice = transactions.reduce((acc, tx) => acc + (tx.amount || 0), 0);

    return (
        <div className={styles.tableWrapper}>
            <h3>Historie transakcí</h3>
            <div className={styles.tableContainer}>
                {transactions.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            {columns.map((colKey) => (
                                <th key={colKey}>{COLUMN_DEFINITIONS[colKey].header}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.map((tx, index) => (
                            <tr key={tx.id || index}>
                                {columns.map((colKey) => (
                                    <td key={colKey}>
                                        {COLUMN_DEFINITIONS[colKey].render(tx, formatDate)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                        {/* Zobrazení zápatí pouze pokud je `showTotal` true a sloupec 'amount' je zahrnut */}
                        {showTotal && columns.includes('amount') && (
                            <tfoot>
                            <tr>
                                <td colSpan={columns.length - 1}><strong>Celkem</strong></td>
                                <td><strong>{totalPrice} Kč</strong></td>
                            </tr>
                            </tfoot>
                        )}
                    </table>
                ) : (
                    <p className={styles.noData}>Žádné transakce v tomto období.</p>
                )}
            </div>
        </div>
    );
}

TransactionHistoryTable.propTypes = {
    transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
    formatDate: PropTypes.func.isRequired,
    columns: PropTypes.arrayOf(PropTypes.string),
    showTotal: PropTypes.bool,
};


export default TransactionHistoryTable;
