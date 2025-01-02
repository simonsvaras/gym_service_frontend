// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import stránek
import HomePage from './pages/HomePage';
import PageOne from './pages/RegisterUser.jsx';
import PageTwo from './pages/ChargeSubscription.jsx';
import RegisterUser from "./pages/RegisterUser.jsx";
import ChargeSubscription from "./pages/ChargeSubscription.jsx";


function App() {
    return (
        <Router>
            <Routes>
                {/* 1) Kořenová cesta "/" -> HomePage */}
                <Route path="/" element={<HomePage />} />

                {/* 2) Další cesty -> PageOne, PageTwo, atd. */}
                <Route path="/page1" element={<RegisterUser />} />
                <Route path="/page2" element={<ChargeSubscription />} />
            </Routes>
        </Router>
    );
}

export default App;
