// src/components/RegistrationForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import styles from './RegistrationForm.module.css';
import SimpleButton from './SimpleButton';
import api from "../services/api.js";

const RegistrationForm = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [message, setMessage] = useState('');

    const onSubmit = async (data) => {
        try {
            const response = await api.post('/users', data); // Použij relativní URL
            setMessage('Registrace úspěšná!');
        } catch (error) {
            setMessage('Chyba při registraci.');
            console.error('Registrace chyba:', error);
        }
    };

    return (
        <form className={styles.registrationForm} onSubmit={handleSubmit(onSubmit)}>
            <h2>Registrace</h2>

            {message && <p className={styles.message}>{message}</p>}

            <div className={styles.formGroup}>
                <label htmlFor="firstName">Jméno</label>
                <input
                    id="firstName"
                    type="text"
                    {...register('firstName', { required: 'Jméno je povinné' })}
                />
                {errors.firstName && <p className={styles.error}>{errors.firstName.message}</p>}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="lastName">Příjmení</label>
                <input
                    id="lastName"
                    type="text"
                    {...register('lastName', { required: 'Příjmení je povinné' })}
                />
                {errors.lastName && <p className={styles.error}>{errors.lastName.message}</p>}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    {...register('email', {
                        required: 'Email je povinný',
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Neplatný formát emailu'
                        }
                    })}
                />
                {errors.email && <p className={styles.error}>{errors.email.message}</p>}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="dob">Datum narození</label>
                <input
                    id="dob"
                    type="date"
                    {...register('dob', { required: 'Datum narození je povinné' })}
                />
                {errors.dob && <p className={styles.error}>{errors.dob.message}</p>}
            </div>

            <SimpleButton text="Registrovat" type="submit" />
        </form>
    );
};

export default RegistrationForm;
