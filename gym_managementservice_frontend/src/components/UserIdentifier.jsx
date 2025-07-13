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
    const navigate = useNavigate();
    const wsRef = useRef(null);

    useEffect(() => {
        const wsUrl = import.meta.env.VITE_CARD_READER_WS_URL || 'ws://192.168.55.205:81/';
        const socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        socket.onopen = () => {
            console.log('WS otevřený');
            socket.send('START');
        };

        socket.onmessage = (e) => {
            console.log('UID:', e.data);
            const uid = e.data.trim();
            if (uid) {
                setCardNumber(uid);
                handleSubmit(uid);
            }
        };

        socket.onclose = () => {
            console.log('WS zavřený');
        };

        socket.onerror = (err) => {
            console.error('WS chyba', err);
            toast.error('Chyba spojení s čtečkou.');
        };

        return () => {
            socket.close();
        };
    }, []);

    const handleSubmit = async (num = cardNumber) => {
        if (!num) {
            toast.warn('Nejdříve zadejte číslo karty.');
            return;
        }

        setLoading(true);
        try {
            const response = await api.get(`/users/byCardNumber/${num}`);
            const { status, userID } = response.data;

            if (mode === 'single') {
                const validStatuses = ['ASSIGNED', 'NOT_REGISTERED', 'UNASSIGNED'];
                if (!validStatuses.includes(status) || (status === 'ASSIGNED' && userID == null)) {
                    toast.error('Neznámá odpověď serveru.');
                }

                onUserFound({ status, userID, cardNumber: num });
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
            console.error(err);
            toast.error('Chyba při hledání uživatele.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3>Přiložte kartu ke čtečce</h3>
                {loading && <p>Hledám...</p>}
                {cardNumber && <p>{cardNumber}</p>}
                <div className={styles.modalButtons}>
                    <SimpleButton
                        text="Zrušit"
                        onClick={handleCancel}
                    />
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
