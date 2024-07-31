import { NavLink, useNavigate } from "react-router-dom"
import { logoutUser } from "../../../services/auth.service";
import { AppContext } from "../../../context/authContext";
import { useContext } from "react";


const Header = () => {

    const { user, setAppState } = useContext(AppContext);
    const navigate = useNavigate()

    const logout = async () => {
        await logoutUser();
        setAppState({user: null, userData: null});
        navigate('/');
    };

    return (
        <div>
            <NavLink to={'/'}>Home</NavLink>
            {!user ? <NavLink to={'/login'}>Login</NavLink> : <button onClick={logout}>Logout</button>}
            {!user && <NavLink to={'/register'}>Register</NavLink>}
        </div>

    )
}

export default Header
