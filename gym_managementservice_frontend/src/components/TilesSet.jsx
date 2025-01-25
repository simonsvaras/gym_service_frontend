// src/components/TilesSet.jsx
import React from 'react';
import Tile from './Tile';
import styles from './TilesSet.module.css';
import {FaHourglassEnd, FaRegIdCard} from "react-icons/fa";
import {IoBatteryCharging} from "react-icons/io5";
import {MdPersonSearch} from "react-icons/md";
import {GiEntryDoor} from "react-icons/gi";
import {PiStudentFill} from "react-icons/pi";

function TilesSet() {
    return (
        <div className={styles.tilesSetContainer}>
            <Tile
                title="Registrovat uživatele"
                link="/RegisterUser"
                className={styles.tile1}
                icon={<FaRegIdCard />}
                iconPosition="top"
                iconSize="6em"
            />
            <Tile
                title="Dobít předplatné"
                link="/ChargeUser"
                className={styles.tile2}
                icon={<IoBatteryCharging />}
                iconPosition="top"
            />
            <Tile
                title="Najít uživatele"
                link="/SearchUser"
                className={styles.tile3}
                icon={<MdPersonSearch />}
                iconPosition="top"
                iconSize="5em"
            />
                <Tile
                    title="Jednorázový vstup"
                    link="/page7"
                    className={styles.tile4}
                    icon={<GiEntryDoor />}
                    iconPosition="top"
                />
            <Tile
                title=""
                link="/page5"
                className={styles.tile5}
                icon={<PiStudentFill />}
                iconPosition="top"
                iconSize="3em"
            />
            <Tile
                title="Dobít ručně"
                link="/page6"
                className={styles.tile6}
            />

                <Tile
                    title="Uzávěrka"
                    link="/closure"
                    className={styles.tile7}
                    icon={<FaHourglassEnd />}
                    iconPosition="top"
                    iconSize="5em"
                />

        </div>
    );
}

export default TilesSet;
