import React, {useState} from "react";
import axios from "axios";

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:5000/register', { username, password });
        alert('User registered successfully');
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            alert('Error: ' + error.response.data.message);
        } else {
            alert('An unexpected error occurred. Please try again later.');
            console.error('Error details:', error); // Log the full error for debugging
        }
    }
};

    return (
    <form onSubmit={handleSubmit}>
        <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder='Username'
        required
        />

        <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        />

        <button type="submit" className='btn btn-primary'>Register</button>
    </form>
);
};



export default Register;