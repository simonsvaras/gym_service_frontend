// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Bounce, ToastContainer, Zoom} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import HomePage from './pages/HomePage';
import RegisterUser from './pages/RegisterUser';
import ChargeSubscription from './pages/ChargeSubscription';
import ManualCharge from './pages/ManualCharge';
import ChargeOneTimeEntry from './pages/ChargeOneTimeEntry';
import ChargeOneTimeEntryStudent from './pages/ChargeOneTimeEntryStudent';
import AdminPage from './pages/AdminPage';

import Header from './components/Header';
import styles from './App.module.css';
import SearchUser from "./pages/SearchUser.jsx";
import UserDetail from "./pages/UserDetail.jsx";
import ClosurePage from "./pages/ClosurePage.jsx";
import AllUsers from "./pages/AllUsers.jsx";
import ShowHistoryPage from "./pages/ShowUserHistoryPage.jsx";

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
                    <Route path="/closure" element={<ClosurePage />} />
                    <Route path="/users/allUsers" element={<AllUsers />} />
                    <Route path="/manualCharge" element={<ManualCharge />} />
                    <Route path="/admin" element={<AdminPage />} />
                    {/* ...další cesty... */}

                    <Route path="/page6" element={<ManualCharge />} />
                    <Route path="/page7" element={<ChargeOneTimeEntry />} />
                    <Route path="/page5" element={<ChargeOneTimeEntryStudent />} />

                    <Route path="/users/:id" element={<UserDetail />} />
                    <Route path="/users/" element={<UserDetail />} />
                    <Route path="/users/:id/history" element={<ShowHistoryPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
