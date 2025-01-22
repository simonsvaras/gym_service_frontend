// src/components/UserInfoBox.jsx
import React from 'react';
import styles from './UserInfoBox.module.css';

function UserInfoBox({
                         firstname,
                         lastname,
                         email,
                         birthdate,
                         profilePhoto,
                         hasActiveSubscription,
                         latestSubscription,
                         isExpiredSubscription, // Nový prop pro expirované předplatné
                     }) {
    const formatDate = (dateObj) => {
        if (!dateObj) return '-';
        return dateObj.toLocaleDateString('cs-CZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className={styles.userInfoBox}>
            <div className={styles.photoContainer}>
                {profilePhoto ? (
                    <img
                        src={profilePhoto}
                        alt={`${firstname} ${lastname}`}
                        className={styles.profilePhoto}
                    />
                ) : (
                    <div className={styles.placeholderPhoto}>Bez fotky</div>
                )}
            </div>

            <div className={styles.infoContainer}>
                <h3>
                    {firstname} {lastname}
                </h3>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Datum narození:</strong> {formatDate(new Date(birthdate))}</p>
                <p><strong>Předplatné aktivní:</strong> {hasActiveSubscription ? 'Ano' : 'Ne'}</p>

                {/* Informace o platnosti předplatného */}
                {hasActiveSubscription && latestSubscription ? (
                    <p className={styles.activeDate}>
                        <strong>Platí do:</strong> {formatDate(new Date(latestSubscription.endDate))}
                    </p>
                ) : latestSubscription && isExpiredSubscription ? (
                    <p className={styles.expiredDate}>
                        <strong>Platnost předplatného vypršela dne:</strong> {formatDate(new Date(latestSubscription.endDate))}
                    </p>
                ) : (
                    <p className={styles.noSubscription}><strong>Žádné aktivní předplatné.</strong></p>
                )}
            </div>
        </div>
    );
}

export default UserInfoBox;
