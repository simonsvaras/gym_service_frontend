// src/components/SimpleButton.jsx
import React from 'react';
import styles from './SimpleButton.module.css';

function SimpleButton({ text, onClick }) {
    return (
        <button className={styles.button} onClick={onClick}>
            {text}
        </button>
    );
}

export default SimpleButton;
