import React, { useEffect, useState } from 'react';
import api from '../services/api'; // stejné API volání jako v kódu, který jsi poslal
import UserCard from '../components/UserCard';
import UserCardSkeleton from '../components/UserCardSkeleton.jsx';
import styles from './AllUsers.module.css'; // CSS module pro rozložení stránky

function AllUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await api.get('/users');
                setUsers(response.data);
            } catch (err) {
                console.error('Chyba při načítání uživatelů:', err);
                setError('Nepodařilo se načíst uživatele.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (error) {
        return <p className={styles.errorText}>{error}</p>;
    }

    return (
        <div className={styles.allUsersContainer}>
            <h1 className={styles.pageTitle}>Všichni uživatelé</h1>

            {/* Pokud se načítá, zobraz skeletony */}
            {loading ? (
                <div className={styles.cardsContainer}>
                    {/* Ukázka, jak zobrazit třeba 6 skeletonů */}
                    {[...Array(6)].map((_, index) => (
                        <UserCardSkeleton key={index} />
                    ))}
                </div>
            ) : (
                <div className={styles.cardsContainer}>
                    {/* Vykreslení všech uživatelů */}
                    {users.map((user) => (
                        <UserCard user={user} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default AllUsers;
