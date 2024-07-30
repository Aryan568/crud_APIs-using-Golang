import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInSignUp from './SignInSignUp';
import UserProfile from './UserProfile';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignInSignUp />} />
                <Route path="/userprofile/:userId" element={<UserProfile />} />
            </Routes>
        </Router>
    );
}

export default App;