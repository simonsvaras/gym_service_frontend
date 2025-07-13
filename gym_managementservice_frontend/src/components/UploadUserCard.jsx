import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import api from '../services/api.js';
import SimpleButton from './SimpleButton.jsx';
import styles from './UploadUserCard.module.css';

function UploadUserCard({ userId, onSuccess, showCancel = false, onCancel }) {
    const [cardNumber, setCardNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const wsRef = useRef(null);
    const loadingRef = useRef(false);

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

        socket.onmessage = (e) => {
            if (loadingRef.current) return;
            const uid = e.data?.trim();
            if (!uid) return;
            setCardNumber(uid);
            handleAssign(uid);
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
    }, [userId]);

    const handleAssign = async (number = cardNumber) => {
        if (!number) {
            toast.warning('Nejdříve přilož kartu.');
            return;
        }

        setLoading(true);
        try {
            await api.post(`/users/${userId}/assignCard`, { cardNumber: number });
            toast.success('Karta úspěšně přiřazena!');
            setCardNumber('');
            onSuccess();
        } catch (error) {
            toast.error('Nepodařilo se přiřadit kartu: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.uploadCardContainer}>
            <h3>Přilož členskou kartu ke čtečce</h3>
            <p className={styles.cardNumber}>
                {cardNumber ? `Načteno číslo karty: ${cardNumber}` : 'Čekám na kartu...'}
            </p>
            {showCancel && (
                <SimpleButton text="Zrušit" onClick={onCancel} type="button" />
            )}
        </div>
    );
}

UploadUserCard.propTypes = {
    userId: PropTypes.number.isRequired,
    onSuccess: PropTypes.func.isRequired,
    showCancel: PropTypes.bool,
    onCancel: PropTypes.func,
};

export default UploadUserCard;
