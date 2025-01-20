// src/pages/UserDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

function UserDetail() {
    const { id } = useParams(); // z URL /users/:id
    const [user, setUser] = useState(null);

    useEffect(() => {
        (async () => {
            const response = await api.get(`/users/${id}`);
            setUser(response.data);
        })();
    }, [id]);

    if (!user) return <p>Načítám uživatele...</p>;

    return (
        <div style={{ textAlign: 'center', color: '#fff' }}>
            <h2>Detail uživatele</h2>
            <p>ID: {user.id}</p>
            <p>Jméno: {user.firstname}</p>
            <p>Příjmení: {user.lastname}</p>
            <p>Email: {user.email}</p>
            {/* ... další údaje ... */}
        </div>
    );
}

export default UserDetail;
