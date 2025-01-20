// src/components/RegistrationForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import styles from './RegistrationForm.module.css';
import SimpleButton from './SimpleButton';
import api from "../services/api.js";

import UploadProfilePhoto from './UploadProfilePhoto';

/**
 * Komponenta představující registrační formulář pro uživatele.
 *
 * @component
 */
const RegistrationForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [newUserId, setNewUserId] = useState(null);

    /**
     * Funkce pro zpracování odeslání registračního formuláře.
     *
     * @async
     * @param {Object} data - Data z formuláře odeslaná uživatelem.
     */
    const onSubmit = async (data) => {
        try {
            const response = await api.post('/users', data); // Relativní URL pro API endpoint

            // Uložení ID nově vytvořeného uživatele
            setNewUserId(response.data.id);

            // Nastavení stavu úspěšné registrace a zobrazení úspěšného toastu
            setRegistrationSuccess(true);
            toast.success('Registrace úspěšná!');
        } catch (error) {

            // Zobrazení chybového toastu s relevantní zprávou
            toast.error(`Chyba při registraci: ${error.response?.data?.error || 'Došlo k chybě při registraci.'}`);
            console.error('Chyba při registraci:', error);
        }
    };

    // Pokud registrace proběhla úspěšně, zobrazíme komponentu pro nahrání profilové fotografie
    if (registrationSuccess) {
        return (
            <div>
                <UploadProfilePhoto userId={newUserId} />
            </div>
        );
    }

    // Jinak vykreslujeme registrační formulář
    return (
        <form className={styles.registrationForm} onSubmit={handleSubmit(onSubmit)}>
            <h2>Registrace</h2>

            <div className={styles.formGroup}>
                <label htmlFor="firstname">Jméno</label>
                <input
                    id="firstname"
                    type="text"
                    {...register('firstname', { required: 'Jméno je povinné' })}
                />
                {errors.firstname && <p className={styles.error}>{errors.firstname.message}</p>}
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
