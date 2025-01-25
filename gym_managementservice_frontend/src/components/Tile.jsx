// src/components/Tile.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Tile.module.css';

function Tile({ title, link, className, color, icon, iconPosition = 'left', iconSize = '6em' }) {
    // Nastavíme inline styl s barvou pozadí
    const tileStyle = {
        backgroundColor: color || '#f7f0f0',
    };

    // Dynamické třídy pro umístění ikony
    const positionClass = styles[`icon-${iconPosition}`] || styles.iconLeft;

    // Styl pro ikonu
    const iconStyle = {
        fontSize: iconSize,
    };

    // Rozvržení obsahu na základě iconPosition
    return (
        <Link to={link} className={`${styles.tile} ${className || ''}`} style={tileStyle}>
            <div className={`${styles.content} ${positionClass}`}>
                {icon && (
                    <span className={styles.icon} style={iconStyle}>
                        {icon}
                    </span>
                )}
                <h3 className={styles.title}>{title}</h3>
            </div>
        </Link>
    );
}

export default Tile;
