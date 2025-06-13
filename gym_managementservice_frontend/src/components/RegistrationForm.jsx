import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CSSTransition } from 'react-transition-group';
import { toast } from 'react-toastify';

import styles from './RegistrationForm.module.css';
import SimpleButton from './SimpleButton';
import api from "../services/api.js";
import UploadProfilePhoto from './UploadProfilePhoto';

const RegistrationForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [newUserId, setNewUserId] = useState(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await api.post('/users', data);
            setNewUserId(response.data.id);
            setRegistrationSuccess(true);
            toast.success('Registrace úspěšná!');
        } catch (error) {
            toast.error(`Chyba při registraci: ${error.response?.data?.error || 'Došlo k chybě při registraci.'}`);
            console.error('Chyba při registraci:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.registrationContainer}>
            {/* Registrační formulář */}
            <CSSTransition
                in={!registrationSuccess}
                timeout={300}
                classNames="fade"
                unmountOnExit
            >
                <form className={styles.registrationForm} onSubmit={handleSubmit(onSubmit)}>
                    <h2>Registrace</h2>

                    <div className={styles.formGroup}>
                        <label htmlFor="firstname">Jméno</label>
                        <input
                            id="firstname"
                            type="text"
                            placeholder="Zadejte své jméno"
                            {...register('firstname', { required: 'Jméno je povinné' })}
                        />
                        {errors.firstname && <p className={styles.error}>{errors.firstname.message}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="lastname">Příjmení</label>
                        <input
                            id="lastname"
                            type="text"
                            placeholder="Zadejte své příjmení"
                            {...register('lastname', { required: 'Příjmení je povinné' })}
                        />
                        {errors.lastname && <p className={styles.error}>{errors.lastname.message}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="např. uzivatel@domena.cz"
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

                    <SimpleButton
                        text={loading ? 'Probíhá registrace...' : 'Registrovat'}
                        type="submit"
                        disabled={loading}
                    />
                </form>
            </CSSTransition>

            {/* Úspěšná registrace + nahrání profilové fotografie */}
            <CSSTransition
                in={registrationSuccess}
                timeout={3000}
                classNames="fade"
                unmountOnExit
            >
                <div className={styles.successContainer}>
                    <h3>Registrace proběhla úspěšně!</h3>
                    <UploadProfilePhoto userId={newUserId} />
                </div>
            </CSSTransition>
        </div>
    );
};

export default RegistrationForm;
