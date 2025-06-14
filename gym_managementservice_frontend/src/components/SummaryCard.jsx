// src/components/SummaryCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import styles from './SummaryCard.module.css';

/**
 * SummaryCard zobrazí stručnou metrickou kartu s ikonou, názvem a hodnotou.
 * @param {{ title: string, value: string | number, icon: React.ComponentType }} props
 */
export default function SummaryCard({ title, value, icon: Icon }) {
    return (
        <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {Icon && <Icon className={styles.icon} />}
            <div className={styles.content}>
                <h4 className={styles.title}>{title}</h4>
                <p className={styles.value}>{value}</p>
            </div>
        </motion.div>
    );
}

SummaryCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.elementType,
};

SummaryCard.defaultProps = {
    icon: null,
};
