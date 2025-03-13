import React from 'react';
import styles from './CustomDateRangePicker.module.css';

const CustomDateRangePicker = ({ title, entryStart, entryEnd, setEntryStart, setEntryEnd }) => {
    const handleStartChange = (e) => {
        const value = e.target.value;
        const date = new Date(value);
        setEntryStart(date.toISOString());
    };

    const handleEndChange = (e) => {
        const value = e.target.value;
        const date = new Date(value);
        setEntryEnd(date.toISOString());
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.inputGroup}>
                <div className={styles.inputWrapper}>
                    <label htmlFor="customStart" className={styles.label}>OD:</label>
                    <input
                        type="datetime-local"
                        id="customStart"
                        className={styles.input}
                        value={entryStart ? entryStart.substring(0, 16) : ''}
                        onChange={handleStartChange}
                    />
                </div>
                <div className={styles.inputWrapper}>
                    <label htmlFor="customEnd" className={styles.label}>DO:</label>
                    <input
                        type="datetime-local"
                        id="customEnd"
                        className={styles.input}
                        value={entryEnd ? entryEnd.substring(0, 16) : ''}
                        onChange={handleEndChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomDateRangePicker;
