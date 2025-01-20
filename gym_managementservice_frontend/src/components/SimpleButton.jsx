// src/components/SimpleButton.jsx
import React from 'react';
import styles from './SimpleButton.module.css';

function SimpleButton({ text, onClick, type = 'button', disabled = false }) {
    return (
        <button
            className={styles.button}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {text}
        </button>
    );
}

export default SimpleButton;
