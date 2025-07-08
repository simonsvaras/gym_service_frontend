import React from 'react';
import { vocative } from 'czech-vocative';
import styles from './EntryStatusMessage.module.css';

function EntryStatusMessage({ message }) {
    if (!message) {
        return (
            <h1 className={styles.chill}>
                MILANO<br />
                GYM
            </h1>
        );
    }

    const rawVocative = vocative(message.firstname || '');
    const name = capitalize(rawVocative);

    let content = null;
    switch (message.status) {
    case 'OK_SUBSCRIPTION':
        content = (
            <>
                <h1>Vítejte {name},</h1>
                <h2>pěkně si zacvičte</h2>
                <p>Vaše předplatné je aktivní do: {message.expiryDate}</p>
            </>
        );
        break;
    case 'OK_ONE_TIME_ENTRY':
        content = (
            <>
                <h1>Vítejte {name},</h1>
                <h2>pěkně si zacvičte</h2>
                <p>Počet zbývajících vstupů: {message.remainingEntries}</p>
            </>
        );
        break;
    case 'NO_VALID_ENTRY':
        content = (
            <>
                <h1>{name},</h1>
                <h2>Nemáte žádný dobitý vstup nebo platné předplatné,</h2>
                <p>prosím dobijte si kartu u obsluhy</p>
            </>
        );
        break;
    default:
        content = null;
    }

    return <div className={styles.messageContainer}>{content}</div>;
}

function capitalize(s) {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export default EntryStatusMessage;
