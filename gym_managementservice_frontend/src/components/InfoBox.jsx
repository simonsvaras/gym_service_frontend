import React from 'react';
import PropTypes from 'prop-types';
import styles from './InfoBox.module.css';

function InfoBox({ label, value }) {
    return (
        <div className={styles.infoBox}>
            <span className={styles.value}>{value}</span>
            <span className={styles.label}>{label}</span>
        </div>
    );
}

InfoBox.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default InfoBox;
