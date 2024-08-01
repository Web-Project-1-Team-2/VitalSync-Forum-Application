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
            <div className="navigation-logo"><h3>Insert Logo here</h3></div>
            <div className="navigation-strip">
                <NavLink to={'/'} className={"nav-link"}>Home</NavLink>
                {user && <NavLink to={'/create'} className={"nav-link"}>Create</NavLink>}
                {!user ? <NavLink to={'/login'} className={"nav-link"}>Login</NavLink> : <button onClick={logout} className={"logout-btn"}>Logout</button>}
                {!user && <NavLink to={'/register'} className={"nav-link"}>Register</NavLink>}
            </div>
        </div>

    )
}

export default Header
