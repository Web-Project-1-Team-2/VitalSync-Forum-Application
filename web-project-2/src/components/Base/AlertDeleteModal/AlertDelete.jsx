import PropTypes from 'prop-types';
import './AlertDelete.css';

const AlertDelete = ({alertModal, toggleAlert, deleteFunction}) => {
    return (
        <>
        {alertModal && (
            <div className="overlay" onClick={toggleAlert}>
                <div className="alert-delete" onClick={(e) => e.stopPropagation()}>
                    <h1>Are you sure you want to delete this post?</h1>
                    <div id='buttons-grid'>
                        <div id='class-buttons'>
                            <button id='final-delete-btn' onClick={deleteFunction}>Yes</button>
                            <button onClick={toggleAlert}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>
    )
}

AlertDelete.propTypes = {   
    alertModal: PropTypes.bool.isRequired,
    toggleAlert: PropTypes.func.isRequired,
    deleteFunction: PropTypes.func.isRequired,
};

export default AlertDelete
