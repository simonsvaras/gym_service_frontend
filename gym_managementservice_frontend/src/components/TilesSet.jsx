// src/components/TilesSet.jsx
import React from 'react';
import Tile from './Tile';
import styles from './TilesSet.module.css';

function TilesSet() {
    return (
        <div className={styles.tilesSetContainer}>
            <Tile title="Registrovat uživatele" link="/RegisterUser" />
            <Tile title="Dobít předplatné" link="/ChargeUser" />
            <Tile title="Najít uživatele" link="/SearchUser" />
            <Tile title="Page 4" link="/page4" />
            <Tile title="Page 5" link="/page5" />
            <Tile title="Page 6" link="/page6" />
            <Tile title="Page 7" link="/page7" />
            <Tile title="Page 8" link="/page8" />
        </div>
    );
}

export default TilesSet;
