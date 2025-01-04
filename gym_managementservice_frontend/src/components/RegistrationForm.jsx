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
            setMessage(error.response.data.error);
            console.error('Registrace chyba:', error);
        }
    };

    return (
        <form className={styles.registrationForm} onSubmit={handleSubmit(onSubmit)}>
            <h2>Registrace</h2>

            {message && <p className={styles.message}>{message}</p>}

            <div className={styles.formGroup}>
                <label htmlFor="firstname">Jméno</label>
                <input
                    id="firstname"
                    type="text"
                    {...register('firstname', { required: 'Jméno je povinné' })}
                />
                {errors.firstName && <p className={styles.error}>{errors.firstName.message}</p>}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="lastname">Příjmení</label>
                <input
                    id="lastname"
                    type="text"
                    {...register('lastname', { required: 'Příjmení je povinné' })}
                />
                {errors.lastname && <p className={styles.error}>{errors.lastname.message}</p>}
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
                <label htmlFor="birthdate">Datum narození</label>
                <input
                    id="birthdate"
                    type="date"
                    {...register('birthdate', { required: 'Datum narození je povinné' })}
                />
                {errors.birthdate && <p className={styles.error}>{errors.birthdate.message}</p>}
            </div>

            <SimpleButton text="Registrovat" type="submit" />
        </form>
    );
};

export default RegistrationForm;
