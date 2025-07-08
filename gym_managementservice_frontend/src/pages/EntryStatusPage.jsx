
import React, { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import styles from './EntryStatusPage.module.css';
import EntryStatusMessage from '../components/EntryStatusMessage.jsx';


const MESSAGE_TIMEOUT = 8000; // how long to show the message in ms

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
        const timer = setTimeout(() => setMessage(null), MESSAGE_TIMEOUT);
        return () => clearTimeout(timer);
    }, [message]);

    return (
        <div className={styles.container}>
            <EntryStatusMessage message={message} timeout={MESSAGE_TIMEOUT} />
        </div>
    );
}

export default EntryStatusPage;
