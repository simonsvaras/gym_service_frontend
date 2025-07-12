import React, { useState } from 'react';
import useChargeSubscription from '../../hooks/useChargeSubscription';
import useOneTimeEntries from '../../hooks/useOneTimeEntries';
import useUserTransactions from '../../hooks/useUserTransactions';
import useEntryHistory from '../../hooks/useEntryHistory';
import useUserData from '../../hooks/useUserData';
import useFilteredUsers from '../../hooks/useFilteredUsers';
import useUserDetails from '../../hooks/useUserDetails';
import styles from './HookSimulation.module.css';

function ChargeSubscriptionHook({ userId }) {
    const data = useChargeSubscription(userId);
    return <pre className={styles.result}>{JSON.stringify(data, null, 2)}</pre>;
}

function OneTimeEntriesHook({ userId }) {
    const data = useOneTimeEntries(userId);
    return <pre className={styles.result}>{JSON.stringify(data, null, 2)}</pre>;
}

function UserTransactionsHook({ userId }) {
    const data = useUserTransactions(userId);
    return <pre className={styles.result}>{JSON.stringify(data, null, 2)}</pre>;
}

function EntryHistoryHook({ userId }) {
    const data = useEntryHistory(userId);
    return <pre className={styles.result}>{JSON.stringify(data, null, 2)}</pre>;
}

function UserDataHook({ userId }) {
    const data = useUserData(userId);
    return <pre className={styles.result}>{JSON.stringify(data, null, 2)}</pre>;
}

function FilteredUsersHook() {
    const data = useFilteredUsers({});
    return <pre className={styles.result}>{JSON.stringify(data, null, 2)}</pre>;
}

function UserDetailsHook() {
    const data = useUserDetails();
    return <pre className={styles.result}>{JSON.stringify(data, null, 2)}</pre>;
}

const hookOptions = [
    'useChargeSubscription',
    'useOneTimeEntries',
    'useUserTransactions',
    'useEntryHistory',
    'useUserData',
    'useFilteredUsers',
    'useUserDetails'
];

function HookSimulation() {
    const [selectedHook, setSelectedHook] = useState('');
    const [userId, setUserId] = useState('');
    const [runKey, setRunKey] = useState(0);

    const handleRun = () => setRunKey(k => k + 1);

    let HookComponent = null;
    if (selectedHook === 'useChargeSubscription') HookComponent = ChargeSubscriptionHook;
    else if (selectedHook === 'useOneTimeEntries') HookComponent = OneTimeEntriesHook;
    else if (selectedHook === 'useUserTransactions') HookComponent = UserTransactionsHook;
    else if (selectedHook === 'useEntryHistory') HookComponent = EntryHistoryHook;
    else if (selectedHook === 'useUserData') HookComponent = UserDataHook;
    else if (selectedHook === 'useFilteredUsers') HookComponent = FilteredUsersHook;
    else if (selectedHook === 'useUserDetails') HookComponent = UserDetailsHook;

    return (
        <div className={styles.hookSimContainer}>
            <h2>Simulace hooks</h2>
            <div className={styles.controls}>
                <select value={selectedHook} onChange={e => setSelectedHook(e.target.value)}>
                    <option value="">Vyberte hook</option>
                    {hookOptions.map(h => (
                        <option key={h} value={h}>{h}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="User ID (pokud je potřeba)"
                    value={userId}
                    onChange={e => setUserId(e.target.value)}
                />
                <button onClick={handleRun}>Provolat</button>
            </div>
            {HookComponent && <HookComponent key={runKey} userId={userId} />}
        </div>
    );
}

export default HookSimulation;
