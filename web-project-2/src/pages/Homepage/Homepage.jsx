import './Homepage.css';
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/authContext';
import { useContext } from 'react';


function Homepage() {
    const { user } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLinkClick = (e) => {
        if (!user) {
            e.preventDefault();
            navigate('/login');
        }
    };

    return (
        <div className="homepage">
            <NavLink to='/training' onClick={handleLinkClick}>
                <img src='/athlete.jpg' alt='Go to training picture' className="links" />
            </NavLink>
            <NavLink to='/nutrition' onClick={handleLinkClick}>
                <img src='/nutrition3.webp' alt='Go to nutrition picture' className="links" />
            </NavLink>
            <NavLink to='/supplements' onClick={handleLinkClick}>
                <img src='/supplements.png' alt='Go to supplements picture' className="links" />
            </NavLink>
        </div>
    )
}

export default Homepage
