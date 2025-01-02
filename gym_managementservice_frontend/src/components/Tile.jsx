// src/components/Tile.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Tile.module.css';

function Tile({ title, link }) {
    return (
        <Link to={link} className={styles.tile}>
            <h3>{title}</h3>
        </Link>
    );
}

export default Tile;
