// src/components/Tile.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Tile.css'; // Nebo Tile.module.css, viz níže

function Tile({ title, link }) {
    return (
        <Link to={link} className="tile">
            <h3>{title}</h3>
        </Link>
    );
}

export default Tile;
