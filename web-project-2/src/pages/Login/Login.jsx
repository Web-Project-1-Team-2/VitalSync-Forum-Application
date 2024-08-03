import { useContext, useState } from "react";
import { loginUser } from "../../services/auth.service"
import { AppContext } from "../../context/authContext";
import { notifyError, notifySuccess } from "../../services/notification.service";
import { useLocation, useNavigate } from "react-router-dom";
import './Login.css';

export const Login = () => {
    const { setAppState } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState({
        email: '',
        password: ''
    })

    const updateUser = prop => e => {
        setUser({
            ...user,
            [prop]: e.target.value,
        })
    };

    const login = async () => {
        if (!user.email || user.email.includes('@') === false) {
            notifyError('Please enter a valid email')
        }

        try {
            const credential = await loginUser(user.email, user.password);
            setAppState({
                user: credential.user,
                userData: null,
            });

            console.log(credential);

            setTimeout(() => { navigate(location.state?.from.pathname ?? '/') }, 1000);
            notifySuccess('Login successful, redirecting!');
        } catch (error) {
            notifyError(error.message);
        }
    }

    return (
        <div className="login-field">
            <h1>Login</h1>
            <div className="login-grid">
                <div className="email-grid">
                    <label htmlFor="email">Email: </label>
                    <input type="email" value={user.email} name="email" id="email" onChange={updateUser('email')} /> <br /><br />
                </div>

                <div className="password-grid">
                    <label htmlFor="password">Password: </label>
                    <input type="password" value={user.password} name="password" id="password" onChange={updateUser('password')} /> <br /><br />
                </div>
            </div>
            <button className="login-btn" onClick={login}>Login</button>
            <button id="login-redirect" onClick={() => navigate('/register')}> No registration? Get one now!</button>
        </div>
    )
}

