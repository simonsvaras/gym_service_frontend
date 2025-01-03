import React from 'react';
import RegistrationForm from "../components/RegistrationForm.jsx";
import styles from './RegistreUser.module.css';

function RegisterUser() {
    return (
        <div className={styles.registerUserContainer}>
            <RegistrationForm />
        </div>
    );
}

export default RegisterUser;