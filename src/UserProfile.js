import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UserProfile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');   
    const [number, setNumber] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:7080/users/${userId}`);
                const userData = response.data;

                // Check if username and number are present
                if (userData.username && userData.number) {
                    setUser(userData);
                    setUsername(userData.username);
                    setNumber(userData.number);
                } else {
                    // Initialize empty fields if data is missing
                    setUser({ id: userData.id });
                    setUsername(''); // Empty field for new or incomplete user
                    setNumber('');   // Empty field for new or incomplete user
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = { id: userId, username, number };
            if (user && user.id) {
                // Update existing user
                await axios.put(`http://localhost:7080/users/${userId}`, userData);
                setMessage('User profile updated successfully');
            } else {
                // Create new user
                const response = await axios.post('http://localhost:7080/users', userData);
                setUser(response.data);
                setMessage('User profile created successfully');
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setMessage('User not found');
            } else {
                setMessage('Failed to update user profile');
            }
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:7080/users/${userId}`);
            // Update local state to reflect the deleted user
            setUser(null);
            setUsername('');
            setNumber('');
            setMessage('User profile deleted successfully');
        } catch (error) {
            console.error('Error deleting user profile:', error);
            setMessage('Failed to delete user profile');
        }
    };

    const handleSignOut = () => {
        navigate('/');
    };

    // // Show loading message while data is being fetched
    // if (user === null) return <div>Loading...</div>;

    return (
        <div>
            <h2>User Profile</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>UserId:</label>
                    <input
                        type="text"
                        value={userId}
                        readOnly
                    />
                </div>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                    />
                </div>
                <div>
                    <label>Number:</label>
                    <input
                        type="number"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="Enter your number"
                        required
                    />
                </div>
                <button type="submit">Save</button>
            </form>
            <button onClick={handleDelete}>Delete</button>
            {message && <p>{message}</p>}
            <button onClick={handleSignOut}>Sign Out</button>
        </div>
    );
};

export default UserProfile;