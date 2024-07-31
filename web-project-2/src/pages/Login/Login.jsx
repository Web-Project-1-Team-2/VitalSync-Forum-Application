import { useContext, useState } from "react";
import { loginUser } from "../../services/auth.service"
import { AppContext } from "../../context/authContext";
import { notifyError, notiftySuccess } from "../../services/notification.service";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const { setAppState } = useContext(AppContext);
    const navigate = useNavigate();

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
        if(!user.email || user.email.includes('@') === false){
            notifyError('Please enter a valid email')
        }

        try {
            const response = await loginUser(user.email, user.password);
            setAppState({
                user: response.user,
                userData: null,
            });
            
            notiftySuccess('Login successful, redirecting to home page');
            setTimeout(() => { navigate('/') }, 2000);
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <div>
            <label htmlFor="email">Email: </label>
            <input type="email" value={user.email} name="email" id="email" onChange={updateUser('email')}/> <br /><br />

            <label htmlFor="password">Password: </label>
            <input type="password" value={user.password} name="password" id="password" onChange={updateUser('password')} /> <br /><br />

            <button onClick={login}>Login</button>
        </div>
    )
}

