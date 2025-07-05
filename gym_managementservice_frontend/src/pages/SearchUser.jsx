import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import styles from './SearchUser.module.css';
import UserButton from '../components/UserButton';
import SimpleButton from '../components/SimpleButton';
import { FaUsers, FaSearch } from 'react-icons/fa';

function SearchUser() {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visibleUsers, setVisibleUsers] = useState(5);

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
            setVisibleUsers(7); // Resetovat počet viditelných uživatelů při novém vyhledávání
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

    const showAllUsers = () => {
        navigate('/users/allUsers');
    };

    const findByCard = () => {
        navigate('/users/');
    };

    return (
        <div className={styles.mainContent}>
            <div className={styles.header}>
                <h2>Najít uživatele</h2>
            </div>

            <div className={styles.searchUserContainer}>
                <div className={styles.leftSide}>
                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="Zadej jméno..."
                            value={searchTerm}
                            onChange={handleChange}
                        />
                        <span className={styles.searchIcon}>
                            <FaSearch />
                        </span>
                        {loading && (
                            <span className={styles.loader}>Načítám...</span>
                        )}
                    </div>
                    <div className={styles.resultsContainer}>
                        {users.length === 0 && !loading && (
                            <p>Žádní uživatelé neodpovídají hledání.</p>
                        )}
                        {users.slice(0, 4).map((user) => (
                            <UserButton
                                key={user.userID}
                                firstname={user.firstname}
                                lastname={user.lastname}
                                onClick={() => handleUserClick(user.userID)}
                            />
                        ))}
                        {visibleUsers < users.length && (
                            <p className={styles.moreUsers}>
                                Zobrazeno pouze prvních {4} uživatelů.
                            </p>
                        )}
                    </div>
                </div>

                <div className={styles.rightSide}>
                    <SimpleButton
                        text="Zobrazit všechny uživatele"
                        icon={FaUsers}
                        onClick={showAllUsers}
                        ariaLabel="Zobrazit všechny uživatele"
                    />
                    <SimpleButton
                        text="Najít podle karty"
                        icon={FaSearch}
                        onClick={findByCard}
                        ariaLabel="Najít uživatele podle karty"
                    />
                </div>
            </div>
        </div>
    );
}

export default SearchUser;
