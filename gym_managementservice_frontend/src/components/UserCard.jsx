import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserCard.module.css';

function UserCard({ user }) {
    // Můžeš si zkrátit do proměnných
    const {
        id,
        firstname,
        lastname,
        profilePhoto,
        activeSubscription,
        latestSubscription,
        lastEntryDate
    } = user;

    const navigate = useNavigate();

    // Funkce, která po kliknutí pošle uživatele na stránku detailu
    const handleClick = () => {
        navigate(`/users/${user.userID}`);
    };

    // Pomocná funkce pro formátování datumu
    const formatDate = (isoString) => {
        if (!isoString) return '—';
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    // Kontrola předplatného
    const hasActiveSub = activeSubscription;
    const subEndDate = latestSubscription ? formatDate(latestSubscription.endDate) : '–';
    // Datum posledního vstupu
    const lastEntry = lastEntryDate ? formatDate(lastEntryDate) : 'Žádný vstup';

    // URL pro fotku - pokud taháš přímo z backendu
    const profilePhotoUrl = profilePhoto
        ? `http://localhost:8080/api/users/${user.userID}/profilePhoto`
        : null;

    return (
        <div className={styles.userCard} onClick={handleClick}>
            <div className={styles.leftSide}>
                {profilePhoto ? (
                    <img
                        src={profilePhotoUrl}
                        alt={`${firstname} ${lastname}`}
                        className={styles.profilePhoto}
                    />
                ) : (
                    <div className={styles.profilePlaceholder}>Bez fotky</div>
                )}
            </div>

            <div className={styles.rightSide}>
                <h3 className={styles.userName}>
                    {firstname} {lastname}
                </h3>

                {/* Informace o předplatném */}
                {hasActiveSub ? (
                    <p className={styles.subscriptionInfo}>Předplatné platné do: {subEndDate}</p>
                ) : (
                    <p className={styles.subscriptionInfo}>Bez aktivního předplatného</p>
                )}

                <p className={styles.lastEntry}>
                    Poslední vstup: <strong>{lastEntry}</strong>
                </p>
            </div>
        </div>
    );
}

export default UserCard;
