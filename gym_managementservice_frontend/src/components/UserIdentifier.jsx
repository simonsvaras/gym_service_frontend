import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import api from '../services/api';
import SimpleButton from './SimpleButton';
import styles from './UserIdentifier.module.css';

function UserIdentifier({ onUserFound, mode = 'multiple' }) {
    const [cardNumber, setCardNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const wsRef = useRef(null);
    const loadingRef = useRef(false);
    const navigate = useNavigate();

    // Keep loadingRef in sync so onmessage handler can read latest value
    useEffect(() => {
        loadingRef.current = loading;
    }, [loading]);

    useEffect(() => {
        const wsUrl = import.meta.env.VITE_CARD_READER_WS_URL || 'ws://192.168.55.205:81/';
        const socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        socket.onopen = () => {
            console.log('WebSocket opened');
            socket.send('START');
        };

        socket.onmessage = async (e) => {
            if (loadingRef.current) return;             // ignore if a request is in flight
            const uid = e.data?.trim();
            if (!uid) return;

            setCardNumber(uid);
            setLoading(true);
            try {
                const cardNum = parseInt(uid, 10);
                if (Number.isNaN(cardNum)) throw new Error('Invalid card number');

                const response = await api.get(`/users/byCardNumber/${cardNum}`);
                const { status, userID } = response.data;

                if (mode === 'single') {
                    const valid = ['ASSIGNED', 'NOT_REGISTERED', 'UNASSIGNED'];
                    if (!valid.includes(status) || (status === 'ASSIGNED' && userID == null)) {
                        toast.error('Neznámá odpověď serveru.');
                    } else {
                        onUserFound({ status, userID, cardNumber: uid });
                    }
                } else {
                    switch (status) {
                        case 'NOT_REGISTERED':
                            toast.warn('Karta ještě nebyla nikdy použita.');
                            break;
                        case 'UNASSIGNED':
                            toast.warn('Tato karta není přiřazena žádnému uživateli.');
                            break;
                        case 'ASSIGNED':
                            if (userID != null) {
                                onUserFound(userID);
                            } else {
                                toast.error('Neočekávaná odpověď: chybí ID uživatele.');
                            }
                            break;
                        default:
                            toast.error('Neznámá odpověď serveru.');
                    }
                }
            } catch (err) {
                console.error('Error fetching user:', err);
                toast.error('Chyba při hledání uživatele.');
            } finally {
                setLoading(false);
            }
        };

        socket.onerror = (err) => {
            console.error('WebSocket error', err);
            toast.error('Chyba WebSocket připojení.');
        };

        socket.onclose = () => {
            console.log('WebSocket closed');
        };

        return () => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send('STOP');
            }
            wsRef.current?.close();
        };
    }, [mode, onUserFound]);

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3>Přiložte kartu ke čtečce</h3>
                {loading && <p>Hledám…</p>}
                {!loading && cardNumber && <p>UID: {cardNumber}</p>}
                <div className={styles.modalButtons}>
                    <SimpleButton text="Zrušit" onClick={handleCancel} />
                </div>
            </div>
        </div>
    );
}

UserIdentifier.propTypes = {
    onUserFound: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(['multiple', 'single']),
};

export default UserIdentifier;
