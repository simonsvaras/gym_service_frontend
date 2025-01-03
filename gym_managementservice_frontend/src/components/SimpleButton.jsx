// src/components/SimpleButton.jsx
import React from 'react';
import styles from './SimpleButton.module.css';

function SimpleButton({ text, onClick, type = 'button' }) {
    return (
        <button className={styles.button} onClick={onClick} type={type}>
            {text}
        </button>
    );
}

export default SimpleButton;
