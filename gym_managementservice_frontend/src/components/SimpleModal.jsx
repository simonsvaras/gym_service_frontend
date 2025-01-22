// src/components/SimpleModal.jsx
import React from 'react';
import styles from './SimpleModal.module.css';
import SimpleButton from './SimpleButton';

function SimpleModal({
                         title,
                         message,
                         onConfirm,
                         onCancel,
                         confirmText = 'Potvrdit',
                         cancelText = 'Zrušit',
                         disabled = false
                     }) {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className={styles.modalButtons}>
                    <SimpleButton
                        text={confirmText}
                        onClick={onConfirm}
                        disabled={disabled}
                    />
                    <SimpleButton
                        text={cancelText}
                        onClick={onCancel}
                        disabled={disabled}
                    />
                </div>
            </div>
        </div>
    );
}

export default SimpleModal;
