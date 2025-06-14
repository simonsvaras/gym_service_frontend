import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import styles from './AnimatedButton.module.css';

export default function AnimatedButton({
                                           text,
                                           icon: Icon,
                                           onClick,
                                           type = 'button',
                                           disabled = false,
                                           className = '',
                                           ariaLabel,
                                       }) {
    return (
        <motion.button
            className={`${styles.button} ${className}`}
            onClick={onClick}
            type={type}
            disabled={disabled}
            aria-label={ariaLabel}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            {Icon && <Icon className={styles.icon} />}
            {text && <span className={styles.text}>{text}</span>}
        </motion.button>
    );
}

AnimatedButton.propTypes = {
    text:       PropTypes.string,
    icon:       PropTypes.elementType,
    onClick:    PropTypes.func.isRequired,
    type:       PropTypes.string,
    disabled:   PropTypes.bool,
    className:  PropTypes.string,
    ariaLabel:  PropTypes.string,
};
