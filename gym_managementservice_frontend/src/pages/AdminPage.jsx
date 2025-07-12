import React, { useState } from 'react';
import EntrySimulation from './admin/EntrySimulation';
import HookSimulation from './admin/HookSimulation';
import SimpleButton from '../components/SimpleButton';
import styles from './AdminPage.module.css';

function AdminPage() {
    const [active, setActive] = useState('');

    return (
        <div className={styles.adminContainer}>
            <div className={styles.buttonGroup}>
                <SimpleButton text="Simulace hooks" onClick={() => setActive('hooks')} />
                <SimpleButton text="Simulace vstupů" onClick={() => setActive('entry')} />
            </div>
            {active === 'hooks' && <HookSimulation />}
            {active === 'entry' && <EntrySimulation />}
        </div>
    );
}

export default AdminPage;
