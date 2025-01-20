// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import RegisterUser from './pages/RegisterUser';
import ChargeSubscription from './pages/ChargeSubscription';

import Header from './components/Header';

// Načteme globální modul pro layout
import styles from './App.module.css';

function App() {
    return (
        <Router>
            {/* Fixní / Sticky Header */}
            <Header />

            {/* Hlavní kontejner (pod headerem) */}
            <div className={styles.mainContainer}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/RegisterUser" element={<RegisterUser />} />
                    <Route path="/page2" element={<ChargeSubscription />} />
                    {/* ...další cesty... */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
