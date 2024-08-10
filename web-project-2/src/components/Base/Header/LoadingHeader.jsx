import Logo from '../Logo/Logo'
import './LoadingHeader.css'

const LoadingHeader = () => {
    return (
        <div className="header">
            <Logo className="navigation-logo"><h3></h3></Logo>
            <div className="navigation-strip">
                <div className="loading-square"></div>
                <div className="loading-square"></div>
                <div className="loading-square"></div>
                <div className="loading-square"></div>
            </div>
        </div>

    )
}

export default LoadingHeader
