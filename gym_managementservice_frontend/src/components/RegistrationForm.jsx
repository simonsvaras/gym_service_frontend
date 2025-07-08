import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CSSTransition } from 'react-transition-group';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import styles from './RegistrationForm.module.css';
import SimpleButton from './SimpleButton';
import api from '../services/api.js';
import UploadProfilePhoto from './UploadProfilePhoto';
import UploadUserCard from './UploadUserCard.jsx';

// JOY UI imports
import Stepper from '@mui/joy/Stepper';
import Step, { stepClasses } from '@mui/joy/Step';
import StepIndicator, { stepIndicatorClasses } from '@mui/joy/StepIndicator';
import Typography from '@mui/joy/Typography';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';

export default function RegistrationForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [step, setStep] = useState(1); // 1=data, 2=photo, 3=card, 4=done
    const [newUserId, setNewUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await api.post('/users', data);
            setNewUserId(response.data.id);
            setStep(2);
            toast.success('Registrace úspěšná!');
        } catch (error) {
            toast.error(`Chyba při registraci: ${error.response?.data?.error || 'Došlo k chybě.'}`);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Po dokončení kroku 4 přesměrujeme za 3s na hlavní stránku
    useEffect(() => {
        if (step === 4) {
            const timer = setTimeout(() => navigate('/'), 3000);
            return () => clearTimeout(timer);
        }
    }, [step, navigate]);

    return (
        <div className={styles.registrationContainer}>

            {/* Stepper */}
            <div className={styles.stepperContainer}>
                <Stepper
                    orientation="horizontal"
                    sx={{
                        '--Stepper-gap': '1.5rem',
                        '--StepIndicator-size': '2rem',
                        [`& .${stepClasses.completed}`]: {
                            '& .MuiStepIcon-root': { color: 'success.500' },
                        },
                        [`& .${stepClasses.active}`]: {
                            [`& .${stepIndicatorClasses.root}`]: {
                                border: '2px solid',
                                borderColor: 'primary.500',
                            },
                        },
                    }}
                >
                    <Step
                        completed={step > 1}
                        active={step === 1}
                        indicator={
                            step > 1
                                ? <StepIndicator variant="solid" color="success"><CheckRoundedIcon /></StepIndicator>
                                : <StepIndicator>1</StepIndicator>
                        }
                    >
                        <div>
                            <Typography level="title-sm">Krok 1</Typography>
                            Základní údaje
                        </div>
                    </Step>

                    <Step
                        completed={step > 2}
                        active={step === 2}
                        disabled={step < 2}
                        indicator={
                            step > 2
                                ? <StepIndicator variant="solid" color="success"><CheckRoundedIcon /></StepIndicator>
                                : step === 2
                                    ? <StepIndicator variant="solid" color="primary"><PhotoCameraRoundedIcon /></StepIndicator>
                                    : <StepIndicator>2</StepIndicator>
                        }
                    >
                        <div>
                            <Typography level="title-sm">Krok 2</Typography>
                            Profilová fotka
                        </div>
                    </Step>

                    <Step
                        completed={step > 3}
                        active={step === 3}
                        disabled={step < 3}
                        indicator={
                            step > 3
                                ? <StepIndicator variant="solid" color="success"><CheckRoundedIcon /></StepIndicator>
                                : step === 3
                                    ? <StepIndicator variant="solid" color="primary"><CreditCardRoundedIcon /></StepIndicator>
                                    : <StepIndicator>3</StepIndicator>
                        }
                    >
                        <div>
                            <Typography level="title-sm">Krok 3</Typography>
                            Členská karta
                        </div>
                    </Step>

                    <Step
                        active={step === 4}
                        disabled={step < 4}
                        indicator={
                            step === 4
                                ? <StepIndicator variant="solid" color="success"><CheckRoundedIcon /></StepIndicator>
                                : <StepIndicator>4</StepIndicator>
                        }
                    >
                        <div>
                            <Typography level="title-sm">Krok 4</Typography>
                            Hotovo
                        </div>
                    </Step>
                </Stepper>
            </div>

            {/* Krok 1: Formulář */}
            <CSSTransition in={step === 1} timeout={300} classNames="fade" unmountOnExit>
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
                                pattern: { value: /^\S+@\S+$/i, message: 'Neplatný formát emailu' }
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

            {/* Krok 2: Upload fotky */}
            <CSSTransition in={step === 2} timeout={300} classNames="fade" unmountOnExit>
                <div className={styles.successContainer}>
                    <h3 className={styles.message}>Registrace úspěšná!</h3>
                    <UploadProfilePhoto userId={newUserId} onSuccess={() => setStep(3)} />
                </div>
            </CSSTransition>

            {/* Krok 3: Upload karty */}
            <CSSTransition in={step === 3} timeout={300} classNames="fade" unmountOnExit>
                <div className={styles.successContainer}>
                    <h3 className={styles.message}>Karta přiřazena!</h3>
                    <UploadUserCard userId={newUserId} onSuccess={() => setStep(4)} />
                </div>
            </CSSTransition>

            {/* Krok 4: Hotovo */}
            <CSSTransition in={step === 4} timeout={300} classNames="fade" unmountOnExit>
                <div className={styles.successContainer}>
                    <h3 className={styles.message}>Hotovo! Za chvíli přesměrujeme na hlavní stránku.</h3>
                </div>
            </CSSTransition>
        </div>
    );
}
