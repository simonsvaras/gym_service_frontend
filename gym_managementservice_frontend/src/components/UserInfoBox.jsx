import React from 'react';
import styles from './UserInfoBox.module.css';
import InfoBox from './InfoBox';
import { buildProfilePhotoUrl, ProfilePhotoQuality } from '../utils/photoUtils.js';

function UserInfoBox({ info }) {
    const {
        id,
        firstname,
        lastname,
        email,
        birthdate,
        profilePhotoPath,
        hasActiveSubscription,
        latestSubscription,
        isExpiredSubscription,
        oneTimeCount,
        points,
    } = info || {};
    const formatDate = (dateObj) => {
        if (!dateObj) return '-';
        return dateObj.toLocaleDateString('cs-CZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Sestavení URL pro profilovou fotku v nejvyšší kvalitě
    const profilePhotoUrl = buildProfilePhotoUrl(
        profilePhotoPath,
        ProfilePhotoQuality.HIGH
    );
    console.log(profilePhotoUrl);

    return (
        <div className={styles.userInfoBox}>
            <div className={styles.photoContainer}>
                {profilePhotoUrl ? (
                    <img
                        src={profilePhotoUrl}
                        alt={`${firstname} ${lastname}`}
                        className={styles.profilePhoto}
                        onError={(e) => {
                            // Při chybě načtení obrázku nastaví fallback obrázek
                            e.target.onerror = null;
                            e.target.src = '/src/assets/basic_avatar2.png';
                        }}
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

                <div className={styles.statsContainer}>
                    <InfoBox label="Vstupy" value={oneTimeCount ?? 0} />
                    <InfoBox label="Body" value={points ?? 0} />
                </div>
            </div>
        </div>
    );
}

export default UserInfoBox;
