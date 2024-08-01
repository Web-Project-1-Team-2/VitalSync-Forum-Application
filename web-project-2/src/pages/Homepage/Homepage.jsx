import styles from './Homepage.module.css'
import { NavLink } from 'react-router-dom'


function Homepage() {
    return (
        <div className={styles.homepage}>
        <section>
        <NavLink to='/training' >
        <img src='/athlete.jpg' alt='Go to training picture' className={styles.links} />
        </NavLink>
        <NavLink to='/nutrition' >
        <img src='/nutrition.webp' alt='Go to nutriton picture' className={styles.links} />
        </NavLink>
        <NavLink to='/supplements' >
        <img src='/supplements.png' alt='Go to supplements picture' className={styles.links} />
        </NavLink>
        </section>
        </div>
    )
}

export default Homepage
