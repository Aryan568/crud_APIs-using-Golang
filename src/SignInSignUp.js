import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignInSignUp = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSwitch = () => {
        setIsSignUp(!isSignUp);
        setEmail('');
        setPassword('');
        setErrorMessage('');
        setSuccessMessage('');
    };

    const validateForm = () => {
        if (email === '' || password === '') {
            setErrorMessage('Please fill in all fields');
            return false;
        }
        // Example additional validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setErrorMessage('Please enter a valid email address');
            return false;
        }
        if (password.length < 6) {
            setErrorMessage('Password must be at least 6 characters long');
            return false;
        }
        setErrorMessage('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSuccessMessage('');
        setErrorMessage('');

        try {
            if (isSignUp) {
                const response = await axios.post('http://localhost:7000/signup', { email, password });
                alert(`Signup successful! User ID: ${response.data.userId}`);
                // Switch to Sign In form after successful Sign Up
                handleSwitch();
            } else {
                const response = await axios.post('http://localhost:7000/signin', { email, password });
                const userId = response.data.userId;
                setSuccessMessage(response.data.message);
                navigate(`/userprofile/${userId}`);
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('An error occurred');
            }
        }
    };


    return (
        <div className="App">
            <div className="form-container">
                <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    {successMessage && <p className="success">{successMessage}</p>}
                    <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
                </form>
                <button className="switch-button" onClick={handleSwitch}>
                    {isSignUp ? 'Already have an account? Sign In' : 'Don\'t have an account? Sign Up'}
                </button>
            </div>
        </div>
    );
};

export default SignInSignUp;