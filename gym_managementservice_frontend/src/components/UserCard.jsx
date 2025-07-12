// src/components/UserCard.jsx
import React, { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styles from './UserCard.module.css';
import { getActiveSubscription } from '../utils/subscriptionUtils.js';
import { formatDate } from '../utils/dateUtils.js';
import { buildProfilePhotoUrl, ProfilePhotoQuality } from '../utils/photoUtils.js';


/**
 * Komponenta UserCard
 * Zobrazuje informace o uživateli včetně profilové fotografie, jména,
 * informací o předplatném a data posledního vstupu.
 *
 * @component
 * @param {Object} props - Vstupní vlastnosti komponenty.
 * @param {Object} props.user - Objekt obsahující informace o uživateli.
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
        lastEntryDate,
        oneTimeCount,
        points
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
    const activeSubscription = useMemo(
        () => getActiveSubscription(subscriptions),
        [subscriptions]
    );
    /**
     * Kontrola, zda je aktivní předplatné vypršelo.
     * Pokud předplatné neexistuje, vrací null.
     */
    const isExpiredSubscription = useMemo(() => {
        if (!activeSubscription) return null;
        return new Date(activeSubscription.endDate) < new Date();
    }, [activeSubscription]);

    /**
     * Sestavení URL pro načtení profilové fotografie s nižší kvalitou,
     * aby byl seznam uživatelů načítán rychleji.
     */
    const photoUrl = buildProfilePhotoUrl(profilePhotoPath, userID ,ProfilePhotoQuality.MEDIUM);

    console.log(photoUrl);

    // Ref a stav pro sledování viditelnosti karty
    const cardRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Pokud je karta viditelná (více než 10 % viditelnosti), nastavíme stav
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.1,
            }
        );
        if (cardRef.current) {
            observer.observe(cardRef.current);
        }
        return () => {
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
        };
    }, []);


    return (
        <div
            ref={cardRef}
            className={`${styles.userCard} ${isVisible ? styles.fadeIn : styles.fadeOut}`}
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
                            e.target.src = '/src/assets/error.png';
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
                            Předplatné vypršelo: <strong>{formatDate(activeSubscription.endDate)}</strong>
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

                <div className={styles.stats}>
                    <p>Vstupy: <strong>{oneTimeCount ?? '-'}</strong></p>
                    <p>Body: <strong>{points ?? '-'}</strong></p>
                </div>
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
        oneTimeCount: PropTypes.number,
        points: PropTypes.number,
    }).isRequired,
};

// Export komponenty zabalené do React.memo pro optimalizaci vykreslování
export default React.memo(UserCard);
