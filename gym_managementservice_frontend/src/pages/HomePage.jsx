// src/pages/HomePage.jsx
import React from 'react';
import './HomePage.css';
import TilesSet from "../components/TilesSet.jsx";


function HomePage() {
    return (
        <div className="homepage-container">
            <h1>Pracuj tvrdě!</h1>
            <TilesSet />
        </div>
    );
}

export default HomePage;
