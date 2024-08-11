import { Link } from "react-router-dom"
import './Logo.css'


function Logo() {

    

    return (
        <Link to='/'>
            <img src="/Logo-Forum-Project.png" alt="" className="logo" />
        </Link>
    )
}

export default Logo
