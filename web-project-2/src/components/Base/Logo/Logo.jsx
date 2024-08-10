import { Link } from "react-router-dom"
import './Logo.css'


function Logo() {

    

    return (
        <Link to='/'>
            <img src="/cropped-phf_logo.png" alt="" className="logo" />
        </Link>
    )
}

export default Logo
