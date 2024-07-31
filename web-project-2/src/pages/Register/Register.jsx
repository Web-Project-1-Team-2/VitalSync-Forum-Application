/* eslint-disable no-undef */
import { useContext, useState } from "react";
import { AppContext } from "../../context/authContext";
import { registerUser } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import { notiftySuccess, notifyError } from "../../services/notification.service";



const Register = () => {
    const { setAppState } = useContext(AppContext);
    const navigate = useNavigate();

    const [user, setUser] = useState({
        username: '',
        email: '',
        password: ''
    })

    const updateUser = prop => e => {
        setUser({
            ...user,
            [prop]: e.target.value,
        })
    };

    const register = async () => {

        if(!user.username && !user.email && !user.password){
            notifyError('Please fill in all fields');
            return;
        }
        if (!user.username || user.username.length < 4 || user.username.length > 32) {
            notifyError('Please enter a valid name')
            return;
        }
        if (!user.email || user.email.includes('@') === false) {
            notifyError('Please enter a valid email')
            return;
        }
        if (!user.password.split('').some(char => char !== ' ' && !isNaN(char))) {
            notifyError('Password must contain at least one number');
            return;
        }

        try {
            const response = await registerUser(user.email, user.password);
            setAppState({
                user: response.user,
                userData: null,
            });

            notiftySuccess('Registration successful, redirecting to home page');
            setTimeout(() => { navigate('/') }, 2000);
        } catch (error) {
            notifyError(error.message);
        }
    }

    return (
        <div>
            <label htmlFor="username">Username: </label>
            <input type="text" value={user.username} name="username" id="username" onChange={updateUser('username')} /> <br /><br />

            <label htmlFor="email">Email: </label>
            <input type="email" value={user.email} name="email" id="email" onChange={updateUser('email')} /> <br /><br />

            <label htmlFor="password">Password: </label>
            <input type="password" value={user.password} name="password" id="password" onChange={updateUser('password')} /> <br /><br />

            <button onClick={register}>Register</button>
        </div>

    )
}

export default Register
