import styles from './Homepage.module.css'
import { NavLink } from 'react-router-dom'

function Homepage() {
    return (
        <div className={styles.homepage}>
        <section>
        <NavLink to='/training' >
        Go to training
        </NavLink>
        <NavLink to='/nutrition' >
        Go to nutriton
        </NavLink>
        <NavLink to='/supplements' >
        Go to supplements
        </NavLink>
        </section>
        </div>
    )
}

export default Homepage
