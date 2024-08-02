/* eslint-disable no-undef */
import { useContext, useState } from "react";
import { AppContext } from "../../context/authContext";
import { registerUser } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "../../services/notification.service";
import { createUser, getUserByUsername } from "../../services/user.service";
import { constrains } from "../../common/constrains";
import './Register.css';


const Register = () => {
    const { setAppState } = useContext(AppContext);
    const navigate = useNavigate();

    const [user, setUser] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    })

    const updateUser = prop => e => {
        setUser({
            ...user,
            [prop]: e.target.value,
        })
    };

    const register = async () => {

        if (!user.firstName && !user.lastName && !user.email && !user.password) {
            notifyError('Please fill in all fields');
            return;
        }
        if (!user.username || user.username.length < constrains.NAMES_MIN_LENGTH || user.username.length > constrains.NAMES_MAX_LENGTH) {
            notifyError('Please enter a valid username')
            setAppState({
                ...user,
                username: '',
            })
            return;
        }
        if (!user.firstName || user.firstName.length < constrains.NAMES_MIN_LENGTH || user.firstName.length > constrains.NAMES_MAX_LENGTH) {
            notifyError('Please enter a valid firs name')
            setAppState({
                ...user,
                firstName: '',
            })
            return;
        }
        if (!user.lastName || user.lastName.length < constrains.NAMES_MIN_LENGTH || user.lastName.length > constrains.NAMES_MAX_LENGTH) {
            notifyError('Please enter a valid last name')
            setAppState({
                ...user,
                lastName: '',
            })
            return;
        }
        if (!user.email || user.email.includes('@') === false) {
            notifyError('Please enter a valid email')

            return;
        }
        if (!user.password.split('').some(char => char !== ' ' && !isNaN(char))) {
            notifyError('Password must contain at least one number');
            setAppState({
                ...user,
                password: '',
            })
            return;
        }

        const dbUser = await getUserByUsername(user.username);
        if (dbUser || dbUser.username === user.username || dbUser.email === user.email) {
            notifyError('User already exists');
            setAppState({
                username: '',
                firstName: '',
                lastName: '',
                email: '',
                password: '',
            })
            return;
        }


        try {
            const credential = await registerUser(user.email, user.password);
            await createUser(user.firstName, user.lastName, user.username, credential.user.uid, user.email);
            setAppState({
                user: credential.user,
                userData: null,
            });
            console.log(credential);

            notifySuccess('Registration successful, redirecting to home page');
            setTimeout(() => { navigate('/') }, 2000);
        } catch (error) {
            console.log(error);
            notifyError(error.message);
        }
    }

    return (
        <div className="register-field">
            <h1>Register</h1>
            <div className="registration-grid">
                <div className="username-grid">
                    <label htmlFor="username">Username: </label>
                    <input type="text" value={user.username} name="username" id="username" onChange={updateUser('username')} />
                </div>
                <div className="names-grid">
                    <div className="first-name-grid">
                        <label htmlFor="firstName">First Name: </label>
                        <input type="text" value={user.firstName} name="firstName" id="firstName" onChange={updateUser('firstName')} />
                    </div>

                    <div className="last-name-grid">
                        <label htmlFor="lastName">Last Name: </label>
                        <input type="text" value={user.lastName} name="lastName" id="lastName" onChange={updateUser('lastName')} />
                    </div>
                </div>
                <div className="email-grid">
                    <label htmlFor="email">Email: </label>
                    <input type="email" value={user.email} name="email" id="email" onChange={updateUser('email')} />
                </div>
                <div className="password-grid">
                    <label htmlFor="password">Password: </label>
                    <input type="password" value={user.password} name="password" id="password" onChange={updateUser('password')} />
                </div>
            </div>
            <button className="register-btn" onClick={register}>Register</button>
        </div>
    )
}

export default Register
