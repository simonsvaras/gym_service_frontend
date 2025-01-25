// src/components/UserCardSkeleton.jsx

import React from 'react';
import styles from './UserCardSkeleton.module.css';

function UserCardSkeleton() {
    return (
        <div className={styles.skeletonCard}>
            <div className={styles.skeletonLeft} />
            <div className={styles.skeletonRight}>
                <div className={styles.skeletonLine} />
                <div className={styles.skeletonLine} />
                <div className={styles.skeletonLineShort} />
            </div>
        </div>
    );
}

export default UserCardSkeleton;
