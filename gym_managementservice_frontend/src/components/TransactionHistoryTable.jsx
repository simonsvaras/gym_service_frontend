import React from 'react';
import styles from './TransactionHistoryTable.module.css';

/**
 * Komponenta TransactionHistoryTable zobrazuje tabulku historie transakcí.
 * @param {Array} transactions - Pole transakcí.
 * @param {Function} formatDate - Funkce pro formátování data.
 * @param {number} totalPrice - Celková cena ze všech transakcí.
 */
function TransactionHistoryTable({ transactions, formatDate, totalPrice }) {
    return (
        <div className={styles.tableWrapper}>
            <h3>Historie transakcí</h3>
            {transactions.length > 0 ? (
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Datum/čas</th>
                        <th>Jméno uživatele</th>
                        <th>Položka</th>
                        <th>Cena</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactions.map((tx, index) => (
                        <tr key={index}>
                            <td>{formatDate(tx.transactionDate)}</td>
                            <td>
                                {tx.firstName && tx.lastName
                                    ? `${tx.firstName} ${tx.lastName}`
                                    : tx.userId}
                            </td>
                            <td>{tx.purchaseType /* nebo tx.itemName */}</td>
                            <td>{tx.amount} Kč</td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan="3"><strong>Celkem</strong></td>
                        <td><strong>{totalPrice} Kč</strong></td>
                    </tr>
                    </tfoot>
                </table>
            ) : (
                <p className={styles.noData}>Žádné transakce v tomto období.</p>
            )}
        </div>
    );
}

export default TransactionHistoryTable;
