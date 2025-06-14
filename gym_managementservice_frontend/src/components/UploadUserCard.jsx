import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import api from '../services/api.js';
import SimpleButton from './SimpleButton.jsx';
import styles from './UploadUserCard.module.css';

function UploadUserCard({ userId }) {
    const [cardNumber, setCardNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAssign = async () => {
        if (!cardNumber) {
            toast.warning('Nejdříve zadejte číslo karty.');
            return;
        }

        setLoading(true);
        try {
            await api.post(`/users/${userId}/assignCard`, { cardNumber });
            toast.success('Karta úspěšně přiřazena!');
            setCardNumber('');
        } catch (error) {
            toast.error('Nepodařilo se přiřadit kartu: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.uploadCardContainer}>
            <h3>Přiřaď svou členskou kartu</h3>
            <div className={styles.formGroup}>
                <label htmlFor="cardNumber">Číslo karty</label>
                <input
                    id="cardNumber"
                    type="text"
                    placeholder="Naskenuj nebo zadej číslo"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                />
            </div>
            <SimpleButton
                text={loading ? 'Ukládám...' : 'Přiřadit'}
                onClick={handleAssign}
                disabled={loading}
            />
        </div>
    );
}

UploadUserCard.propTypes = {
    userId: PropTypes.number.isRequired
};

export default UploadUserCard;
