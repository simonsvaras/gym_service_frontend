// src/pages/SearchUser.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import styles from './SearchUser.module.css';
import UserButton from '../components/UserButton'; // Import nové komponenty

function SearchUser() {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers(searchTerm);
    }, [searchTerm]);

    const fetchUsers = async (term) => {
        try {
            setLoading(true);
            const response = await api.get('/users', {
                params: { searchTerm: term }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Chyba při hledání uživatelů:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleUserClick = (userId) => {
        navigate(`/users/${userId}`);
    };

    return (
        <div className={styles.searchUserContainer}>
            <div className={styles.header}>
                <h2>Hledat uživatele</h2>
                <div className={styles.searchBox}>
                    <input
                        type="text"
                        placeholder="Zadej jméno..."
                        value={searchTerm}
                        onChange={handleChange}
                    />
                    {loading && <span className={styles.loader}>Načítám...</span>}
                </div>
            </div>
            <div className={styles.resultsContainer}>
                {users.length === 0 && !loading && (
                    <p>Žádní uživatelé neodpovídají hledání.</p>
                )}
                {users.map((user) => (
                    <UserButton
                        key={user.userID}
                        firstname={user.firstname}
                        lastname={user.lastname}
                        onClick={() => handleUserClick(user.userID)}
                    />
                ))}
            </div>
        </div>
    );
}

export default SearchUser;
