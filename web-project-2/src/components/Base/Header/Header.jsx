import { NavLink, useNavigate } from "react-router-dom"
import { logoutUser } from "../../../services/auth.service";
import { AppContext } from "../../../context/authContext";
import { useContext } from "react";
import './Header.css';


const Header = () => {

    const { user, setAppState } = useContext(AppContext);
    const navigate = useNavigate()

    const logout = async () => {
        await logoutUser();
        setAppState({user: null, userData: null});
        navigate('/');
    };

    return (
        <div className="header">
            <NavLink to={'/'} className={"nav-link"}>Home</NavLink>
            {!user ? <NavLink to={'/login'} className={"nav-link"}>Login</NavLink> : <button onClick={logout} className={"nav-link"}>Logout</button>}
            {!user && <NavLink to={'/register'} className={"nav-link"}>Register</NavLink>}
        </div>

    )
}

export default Header
