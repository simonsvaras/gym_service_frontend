// src/components/UserCard.jsx
import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styles from './UserCard.module.css';
import { getActiveSubscription } from '../utils/subscriptionUtils.js';
import { formatDate } from '../utils/dateUtils.js';

// Základní URL získaná z environmentální proměnné (Vite) nebo fallback hodnota.
const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Komponenta UserCard
 * Zobrazuje informace o uživateli včetně profilové fotografie, jména,
 * informací o předplatném a data posledního vstupu.
 *
 * @component
 * @param {Object} props - Vstupní vlastnosti komponenty.
 * @param {Object} props.user - Objekt obsahující informace o uživateli.
 * @param {string|number} props.user.userID - Unikátní identifikátor uživatele.
 * @param {string} props.user.firstname - Křestní jméno uživatele.
 * @param {string} props.user.lastname - Příjmení uživatele.
 * @param {string} [props.user.profilePhotoPath] - Cesta k profilové fotce uživatele.
 * @param {Array} [props.user.subscriptions] - Seznam předplatných uživatele.
 * @param {string} [props.user.lastEntryDate] - Datum posledního vstupu uživatele.
 * @returns {JSX.Element} Vykreslená komponenta uživatelské karty.
 */
function UserCard({ user }) {
    // Destrukturalizace vlastností uživatele
    const {
        userID,
        firstname,
        lastname,
        profilePhotoPath,
        subscriptions = [],
        lastEntryDate
    } = user;

    const navigate = useNavigate();

    /**
     * Handler pro přesměrování na detail uživatele.
     */
    const handleClick = useCallback(() => {
        navigate(`/users/${userID}`);
    }, [navigate, userID]);

    /**
     * Memoizace aktivního předplatného získaného pomocí pomocné funkce.
     */
    const activeSubscription = useMemo(() => getActiveSubscription(subscriptions), [subscriptions]);

    /**
     * Kontrola, zda je aktivní předplatné vypršelo.
     * Pokud předplatné neexistuje, vrací null.
     */
    const isExpiredSubscription = useMemo(() => {
        if (!activeSubscription) return null;
        return new Date(activeSubscription.endDate) < new Date();
    }, [activeSubscription]);

    /**
     * Sestavení URL pro načtení profilové fotografie.
     */
    const photoUrl = profilePhotoPath ? `${BASE_API_URL}${profilePhotoPath}` : null;

    return (
        <div
            className={styles.userCard}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleClick();
                }
            }}
        >
            <div className={styles.leftSide}>
                {photoUrl ? (
                    <img
                        src={photoUrl}
                        alt={`${firstname} ${lastname}`}
                        className={styles.profilePhoto}
                        onError={(e) => {
                            // Při chybě načtení obrázku nastaví fallback obrázek
                            e.target.onerror = null;
                            e.target.src = '/default-profile.png';
                        }}
                    />
                ) : (
                    <div className={styles.profilePlaceholder}>Bez fotky</div>
                )}
            </div>

            <div className={styles.rightSide}>
                <h3 className={styles.userName}>
                    {firstname} {lastname}
                </h3>

                {/* Zobrazení informací o předplatném */}
                {activeSubscription ? (
                    !isExpiredSubscription ? (
                        <p className={styles.subscriptionInfo}>
                            Předplatné platné do: <strong>{formatDate(activeSubscription.endDate)}</strong>
                        </p>
                    ) : (
                        <p className={styles.expiredDate}>
                            Předplatné vypršelo dne: <strong>{formatDate(activeSubscription.endDate)}</strong>
                        </p>
                    )
                ) : (
                    <p className={styles.noSubscription}>
                        <strong>Žádné aktivní předplatné.</strong>
                    </p>
                )}

                {/* Zobrazení data posledního vstupu */}
                <p className={styles.lastEntry}>
                    Poslední vstup: <strong>{lastEntryDate ? formatDate(lastEntryDate) : 'Žádný vstup'}</strong>
                </p>
            </div>
        </div>
    );
}

// Definice očekávaných typů props pro UserCard
UserCard.propTypes = {
    user: PropTypes.shape({
        userID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        firstname: PropTypes.string.isRequired,
        lastname: PropTypes.string.isRequired,
        profilePhotoPath: PropTypes.string,
        subscriptions: PropTypes.array,
        lastEntryDate: PropTypes.string,
    }).isRequired,
};

// Export komponenty zabalené do React.memo pro optimalizaci vykreslování
export default React.memo(UserCard);
