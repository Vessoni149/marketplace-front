import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../../navBar/NavBar';
import './loginCart.css';

export const LoginCart = ({errorMessage}) => {
    const navigate = useNavigate();

    return (
        <>
        <NavBar />
        <div className="login-prompt">
            <p className="login-prompt-message">{errorMessage}</p>
            <button className="login-prompt-button" onClick={() => navigate('/login')}>Login</button>
        </div>
        </>
    );
};


