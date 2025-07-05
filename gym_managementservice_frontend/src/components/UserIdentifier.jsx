import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import api from '../services/api';
import SimpleButton from './SimpleButton';
import styles from './UserIdentifier.module.css';

function UserIdentifier({ onUserFound }) {
    const [cardNumber, setCardNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!cardNumber) {
            toast.warn('Nejdříve zadejte číslo karty.');
            return;
        }

        setLoading(true);
        try {
            const response = await api.get(`/users/byCardNumber/${cardNumber}`);
            const data = response.data;
            if (data.warning) {
                toast.warn(data.warning);
            } else if (data.userID) {
                onUserFound(data.userID);
            } else {
                toast.error('Neznámá odpověď serveru.');
            }
        } catch (err) {
            console.error(err);
            toast.error('Chyba při hledání uživatele.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3>Zadejte číslo karty</h3>
                <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Číslo karty"
                    className={styles.input}
                />
                <SimpleButton
                    text={loading ? 'Hledám...' : 'Odeslat'}
                    onClick={handleSubmit}
                    disabled={loading}
                />
            </div>
        </div>
    );
}

UserIdentifier.propTypes = {
    onUserFound: PropTypes.func.isRequired
};

export default UserIdentifier;
