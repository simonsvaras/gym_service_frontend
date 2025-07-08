
import React, { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import styles from './EntryStatusPage.module.css';

function EntryStatusPage() {
    const clientRef = useRef(null);
    const [status, setStatus] = useState(null);
    const [remainingEntries, setRemainingEntries] = useState(null);
    const [expiryDate, setExpiryDate] = useState(null);

    useEffect(() => {
        const socketUrl = `${import.meta.env.VITE_BACKEND_URL}/ws-entry`;
        const client = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            onConnect: () => {
                client.subscribe('/topic/entry-status', (message) => {
                    console.log(message.body);
                    try {
                        const data = JSON.parse(message.body);
                        setStatus(data.status ?? null);
                        setRemainingEntries(data.remainingEntries ?? null);
                        setExpiryDate(data.expiryDate ?? null);
                    } catch (err) {
                        console.error('Invalid message:', err);
                    }
                });
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            clientRef.current?.deactivate();
        };
    }, []);

    return (
        <div className={styles.container}>
            {status === 'OK' && <h1>Vítejte!</h1>}
            {remainingEntries != null && <p>Zbývá Vám {remainingEntries} vstupů</p>}
            {expiryDate != null && <p>Předplatné vypršelo {expiryDate}</p>}
            {status === null && remainingEntries === null && expiryDate === null && 'Loading…'}
        </div>
    );
}

export default EntryStatusPage;
