import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/authContext';
import { notifyError, notifySuccess } from '../../../services/notification.service';
import { deleteComment } from '../../../services/post.service';


const Comment = ({ id, postId, author, content }) => {

    const { userData } = useContext(AppContext);
    
    const [data, setData] = useState({
        createdPosts: {},
        level: '',
    });


    useEffect(() => {
        if (!userData) return;
        if (!userData.createdPosts) return;
        setData(userData);
    }, [userData])

    const deleteCurrPost = async () => {
        try {
            await deleteComment(postId, id, author);
            notifySuccess('Comment deleted successfully!');
        } catch (error) {
            console.log(error.message);
            notifyError('Error deleting comment!');
        }
    };


    return (
        <>
            <div className='single-comment'>
                <div id='comment-author'>
                    <h3>{author}</h3>
                </div>
                <div id='comment-content'>
                    <p>{content}</p>
                </div>

                {Object.keys(data.createdPosts).includes(id) || data.level === 'Admin' ? <button onClick={deleteCurrPost}>Delete</button> : null}
            </div>
        </>
    )
}

Comment.propTypes = {
    id: PropTypes.string,
    postId: PropTypes.string,
    author: PropTypes.string,
    content: PropTypes.string,
};

export default Comment
