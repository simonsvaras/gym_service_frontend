import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import styles from './AdminPage.module.css';

function AdminPage() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [cardNumber, setCardNumber] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const resp = await api.get('/users');
                setUsers(resp.data || []);
            } catch (err) {
                console.error(err);
                toast.error('Nepodařilo se načíst uživatele.');
            }
        };
        fetchUsers();
    }, []);

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser) {
            toast.warn('Vyberte uživatele.');
            return;
        }
        try {
            const resp = await api.get(`entry-validation/validateEntryByUserID/${selectedUser}`);
            toast.success(resp.data?.message || 'Vstup povolen.');
        } catch (err) {
            const msg = err.response?.data?.message || 'Vstup odepřen.';
            toast.error(msg);
        }
    };

    const handleCardSubmit = async (e) => {
        e.preventDefault();
        if (!cardNumber) {
            toast.warn('Zadejte číslo karty.');
            return;
        }
        try {
            const resp = await api.get(`entry-validation/validateEntryByCardNumber/${cardNumber}`);
            toast.success(resp.data?.message || 'Vstup povolen.');
        } catch (err) {
            const msg = err.response?.data?.message || 'Vstup odepřen.';
            toast.error(msg);
        }
    };

    return (
        <div className={styles.adminPageContainer}>
            <h2>Simulace vstupu do posilovny</h2>
            <div className={styles.modulesContainer}>
                <form className={styles.module} onSubmit={handleUserSubmit}>
                    <h3>Vstup podle uživatele</h3>
                    <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                    >
                        <option value="">Vyberte uživatele</option>
                        {users.map((u) => (
                            <option key={u.userID} value={u.userID}>
                                {u.firstname} {u.lastname}
                            </option>
                        ))}
                    </select>
                    <button type="submit">Vstoupit</button>
                </form>

                <form className={styles.module} onSubmit={handleCardSubmit}>
                    <h3>Vstup podle čísla karty</h3>
                    <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Číslo karty"
                    />
                    <button type="submit">Vstoupit</button>
                </form>
            </div>
        </div>
    );
}

export default AdminPage;
