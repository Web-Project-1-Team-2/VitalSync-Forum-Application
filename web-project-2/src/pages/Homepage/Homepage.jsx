import styles from './Homepage.module.css'
import { NavLink,useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/authContext';
import { useContext } from 'react';


function Homepage() {
    const { user, userData, setAppState } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLinkClick = (e) => {
        if (!user) {
            e.preventDefault(); 
            navigate('/login'); 
        }
    };

    return (
        <div className={styles.homepage}>
        <section>
        
        <NavLink to='/training' onClick={handleLinkClick}>
        <img src='/athlete.jpg' alt='Go to training picture' className={styles.links} />
        </NavLink>
        <NavLink to='/nutrition' onClick={handleLinkClick}>
        <img src='/nutrition.webp' alt='Go to nutriton picture' className={styles.links} />
        </NavLink>
        <NavLink to='/supplements' onClick={handleLinkClick}>
        <img src='/supplements.png' alt='Go to supplements picture' className={styles.links} />
        </NavLink>
        
        </section>
        </div>
    )
}

export default Homepage
