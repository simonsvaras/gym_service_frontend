// src/pages/AllUsers.jsx
import React from 'react';
import UserCard from '../components/UserCard';
import UserCardSkeleton from '../components/UserCardSkeleton.jsx';
import styles from './AllUsers.module.css';
import useUserDetails from '../hooks/useUserDetails';

function AllUsers() {
    const { users, loading, error } = useUserDetails();

    if (error) {
        return <p className={styles.errorText}>{error}</p>;
    }

    return (
        <div className={styles.allUsersContainer}>
            <h1 className={styles.pageTitle}>Všichni uživatelé</h1>
            {loading ? (
                <div className={styles.cardsContainer}>
                    {[...Array(6)].map((_, index) => (
                        <UserCardSkeleton key={index} />
                    ))}
                </div>
            ) : (
                <div className={styles.cardsContainer}>
                    {users.map((user) => (
                        <UserCard key={user.userID} user={user} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default AllUsers;
