import './LoadingHeader.css'

const LoadingHeader = () => {
    return (
        <div className="header">
            <div className="navigation-logo"><h3>Insert Logo here</h3></div>
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
