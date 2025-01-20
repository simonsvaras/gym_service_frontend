// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Bounce, ToastContainer, Zoom} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import HomePage from './pages/HomePage';
import RegisterUser from './pages/RegisterUser';
import ChargeSubscription from './pages/ChargeSubscription';

import Header from './components/Header';
import styles from './App.module.css';
import SearchUser from "./pages/SearchUser.jsx";
import UserDetail from "./pages/UserDetail.jsx";

function App() {
    return (
        <Router>
            {/* Fixní / Sticky Header */}
            <Header />

            {/* Kontejner pro toasty */}
            <ToastContainer
                position="top-right"
                autoClose={3000}   // 3 vteřiny, uprav dle libosti
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnHover
                transition={Bounce}
                theme="dark"      // může být "light" nebo "colored"
                className={styles.toastContainer} // Přidání vlastní třídy
                toastClassName={styles.toast} // Přidání vlastní třídy pro jednotlivé toasty
            />

            {/* Hlavní kontejner (pod headerem) */}
            <div className={styles.mainContainer}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/RegisterUser" element={<RegisterUser />} />
                    <Route path="/ChargeUser" element={<ChargeSubscription />} />
                    <Route path="/searchUser" element={<SearchUser />} />
                    {/* ...další cesty... */}

                    <Route path="/users/:id" element={<UserDetail />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
