// src/pages/HomePage.jsx
import React from 'react';
// Import stylů
import './HomePage.css';
// Import Link z routeru
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div className="homepage-container">
            <h1 className="homepage-title">Home Page</h1>
            <p className="homepage-subtitle">Vítej na úvodní stránce!</p>

            <div className="homepage-buttons">
                <Link to="/page1">
                    <button>Jdi na stránku 1</button>
                </Link>
                <Link to="/page2">
                    <button>Jdi na stránku 2</button>
                </Link>
                <Link to="/page3">
                    <button>Jdi na stránku 3</button>
                </Link>
                <Link to="/page4">
                    <button>Jdi na stránku 4</button>
                </Link>
                <Link to="/page5">
                    <button>Jdi na stránku 5</button>
                </Link>
                <Link to="/page6">
                    <button>Jdi na stránku 6</button>
                </Link>
                <Link to="/page7">
                    <button>Jdi na stránku 7</button>
                </Link>
            </div>
        </div>
    );
}

export default HomePage;
