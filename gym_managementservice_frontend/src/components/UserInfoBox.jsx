import React from 'react';
import styles from './UserInfoBox.module.css';

function UserInfoBox({
                         id,
                         firstname,
                         lastname,
                         email,
                         birthdate,
                         profilePhoto,
                         hasActiveSubscription,
                         latestSubscription,
                         isExpiredSubscription,
                         oneTimeCount, // Přidán nový prop
                     }) {
    const formatDate = (dateObj) => {
        if (!dateObj) return '-';
        return dateObj.toLocaleDateString('cs-CZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Sestavení URL pro profilovou fotku pomocí .env proměnné
    const profilePhotoUrl = profilePhoto
        ? `http://localhost:8080/api/users/${id}/profilePhoto`
        : null;

    return (
        <div className={styles.userInfoBox}>
            <div className={styles.photoContainer}>
                {profilePhoto ? (
                    <img
                        src={profilePhotoUrl}
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

                {/* Info o datech předplatného */}
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

                {/* Nový údaj o jednorázových vstupů */}
                <p className={styles.oneTimeCount}>
                    Počet jednorázovcýh vstupů: {oneTimeCount}
                </p>
            </div>
        </div>
    );
}

export default UserInfoBox;
