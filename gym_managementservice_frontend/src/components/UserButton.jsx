// src/components/UserButton.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styles from './UserButton.module.css';

function UserButton({ firstname, lastname, onClick }) {
    return (
        <button onClick={onClick} className={styles.userButton}>
            {firstname} {lastname}
        </button>
    );
}

UserButton.propTypes = {
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default UserButton;
