import PropTypes from 'prop-types';
import './User.css';
import { blockUser } from '../../../services/admin.service';
import { notifyError, notifySuccess } from '../../../services/notification.service';
import { useContext } from 'react';
import { AppContext } from '../../../context/authContext';
import { useNavigate } from 'react-router-dom';


const User = ({ username, email, firstName, lastName, createdOn, level, postCount, isBlocked }) => {

    const { userData } = useContext(AppContext);

    const navigate = useNavigate();

    const toggleBlock = async () => {
        try {
            await blockUser(username);

            if(isBlocked) {
                notifySuccess('User unblocked successfully');
            } else {
                notifySuccess('User blocked successfully');
            }
        } catch (error) {
            console.error(error);
            if(isBlocked) {
                notifyError('User unblocked successfully');
            } else {
                notifyError('Error blocking user');
            }
        }
    }

    return (
        <div className='user-box'>
            <div className='user-info-section'>
                <div className='user-main-info'>
                    <h2>{username}</h2>
                    <h3>Email: {email}</h3>
                    <h4>Full Name: {firstName} {lastName}</h4>
                </div>
                <p>Created on: {createdOn}</p>
            </div>
            <div className='user-stats-section'>
                <div id='user-stats-author'>
                    <p>Level: {level}</p>
                    <p>Posts: {postCount}</p>
                </div>
                <div className='view-user-profile'>
                    <button onClick={username === userData.username ? 
                        () => navigate(`/profile`) :
                        () => navigate(`/profile/${username}`)}>View Profile</button>
                </div>
                <div id='block-btn'>
                    {level === 'Rookie' && (
                        isBlocked ? <button onClick={toggleBlock}>Unblock User</button> : <button onClick={toggleBlock}>Block User</button>
                    )}
                </div>
            </div>
        </div>
    )
}

User.propTypes = {
    username: PropTypes.string,
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    createdOn: PropTypes.string,
    level: PropTypes.string,
    postCount: PropTypes.number,
    isBlocked: PropTypes.bool
};

export default User
