import React, { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import styles from './EntryStatusPage.module.css';

function EntryStatusPage() {
    const clientRef = useRef(null);

    useEffect(() => {
        const socketUrl = `${import.meta.env.VITE_BACKEND_URL.replace('http', 'ws')}/ws-entry`;
        const client = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            onConnect: () => {
                client.subscribe('/topic/entry-status', (message) => {
                    console.log(message.body);
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
        <div className={styles.container}>Loading…</div>
    );
}

export default EntryStatusPage;
