
import React, { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { osloveni } from 'osloveni';
import styles from './EntryStatusPage.module.css';

function EntryStatusPage() {
    const clientRef = useRef(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const socketUrl = `${import.meta.env.VITE_BACKEND_URL}/ws-entry`;
        const client = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            onConnect: () => {
                client.subscribe('/topic/entry-status', (msg) => {
                    console.log(msg.body);
                    try {
                        const data = JSON.parse(msg.body);
                        setMessage(data);
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

    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => setMessage(null), 5000);
        return () => clearTimeout(timer);
    }, [message]);

    const renderContent = () => {
        if (!message) {
            return (
                <h1 className={styles.chill}>
                    MILANO<br />
                    GYM
                </h1>
            );
        }

        const name = osloveni(message.firstname || '');

        switch (message.status) {
        case 'OK_SUBSCRIPTION':
            return (
                <>
                    <h1>Vítejte {name},</h1>
                    <h2>pěkně si zacvičte</h2>
                    <p>Vaše předplatné je aktivní do: {message.expiryDate}</p>
                </>
            );
        case 'OK_ONE_TIME_ENTRY':
            return (
                <>
                    <h1>Vítejte {name},</h1>
                    <h2>pěkně si zacvičte</h2>
                    <p>Počet zbývajících vstupů: {message.remainingEntries}</p>
                </>
            );
        case 'NO_VALID_ENTRY':
            return (
                <>
                    <h1>{name},</h1>
                    <h2>Nemáte žádný dobitý vstup nebo platné předplatné,</h2>
                    <p>prosím dobijte si kartu u obsluhy</p>
                </>
            );
        default:
            return null;
        }
    };

    return <div className={styles.container}>{renderContent()}</div>;
}

export default EntryStatusPage;
