// src/components/Header.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import SimpleButton from './SimpleButton';
import styles from './Header.module.css';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    // Nezobrazujeme nic, pokud jsme na domovské stránce
    if (location.pathname === '/') {
        return null;
    }

    // Funkce tlačítek
    const handleBack = () => navigate(-1);
    const handleHome = () => navigate('/');

    return (
        <div className={styles.headerContainer}>
                <div className={styles.buttons}>
                <SimpleButton
                    text="Zpět"
                    onClick={handleBack}
                />
                <SimpleButton
                    text="Domů"
                    onClick={handleHome}
                />
            </div>
        </div>
    );
}

export default Header;
