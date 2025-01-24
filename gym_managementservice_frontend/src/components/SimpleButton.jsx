// src/components/SimpleButton.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styles from './SimpleButton.module.css';

function SimpleButton({ text, icon: Icon, onClick, type = 'button', disabled = false, ariaLabel }) {
    return (
        <button
            className={styles.button}
            onClick={onClick}
            type={type}
            disabled={disabled}
            aria-label={ariaLabel}
        >
            {Icon && <Icon className={styles.icon} />}
            {text && <span>{text}</span>}
        </button>
    );
}

SimpleButton.propTypes = {
    text: PropTypes.string,
    icon: PropTypes.elementType,
    onClick: PropTypes.func.isRequired,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    ariaLabel: PropTypes.string,
};

export default SimpleButton;
