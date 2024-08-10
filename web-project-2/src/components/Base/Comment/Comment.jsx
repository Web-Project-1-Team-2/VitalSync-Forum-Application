import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/authContext';
import { notifyError, notifySuccess } from '../../../services/notification.service';
import { deleteComment, likeComment, unlikeComment } from '../../../services/post.service';
import './Comment.css';
import { IoClose } from "react-icons/io5";
import { BiUpvote } from "react-icons/bi";
import { BiSolidUpvote } from "react-icons/bi";
import { useObjectVal } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { db } from '../../../config/firebase-config';
import { MdEdit } from "react-icons/md";
import EditComment from '../EditComment/EditComment';
import { defaultAvatar } from '../../../common/constrains';


const Comment = ({ id, postId, author, content }) => {

    const { userData } = useContext(AppContext);
    const [data, setData] = useState({
        likedComments: {},
        comments: {},
        level: '',
        avatar: '',
    });

    const [comment] = useObjectVal(ref(db, `posts/${postId}/comments/${id}`));
    const [currComment, setCurrComment] = useState({});

    const [avatar, avatarLoading] = useObjectVal(ref(db, `users/${author}/avatar`));
    const [authorAvatar, setAuthorAvatar] = useState('');

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    useEffect(() => {
        if (!userData) return;
        setData({
            ...userData,
            comments: userData.comments || {},
            likedComments: userData.likedComments || {}
        });
    }, [userData])

    useEffect(() => {
        if (!comment) return;
        setCurrComment({ ...comment });
    }, [comment])

    useEffect(() => {
        if (!avatar) return;
        setAuthorAvatar(avatar);
    }, [avatar]);

    const deleteCurrComment = async () => {
        try {
            await deleteComment(postId, id, author);
            notifySuccess('Comment deleted successfully!');
        } catch (error) {
            console.log(error.message);
            notifyError('Error deleting comment!');
        }
    };

    const likeCurrComment = async () => {
        try {
            await likeComment(postId, id, userData.username);
        } catch (error) {
            console.log(error.message);
            notifyError('Error liking comment!');
        }
    }

    const unlikeCurrComment = async () => {
        try {
            await unlikeComment(postId, id, userData.username);
        } catch (error) {
            console.log(error.message);
            notifyError('Error unliking comment!');
        }
    };


    return (
        <>
            <div className='single-comment'>
                <div id='comment-avatar'>
                    {avatarLoading && <div className='loading'></div>}
                    <img src={authorAvatar || defaultAvatar} alt='avatar' />
                </div>
                <div id='comment-contents'>
                    <div id='comment-author'>
                        <h3>{author}</h3>
                        <div id='comment-delete-button'>
                            {Object.keys(data.comments).includes(id) || data.level === 'Admin' ?
                                <button className='comment-delete-btn' onClick={deleteCurrComment}><IoClose id='comment-delete' /></button> : null}
                        </div>
                    </div>
                    <div id='comment-content'>
                        <p>{content}</p>
                    </div>
                    <div id='comment-interactions'>
                        <div id='like-section-interactions'>
                            {Object.keys(data.likedComments).includes(id) ?
                                <button onClick={unlikeCurrComment} id='vote-button'><BiSolidUpvote className='comment-upvote-icon' /></button> :
                                <button onClick={likeCurrComment} id='vote-button'><BiUpvote className='comment-upvote-icon' /></button>}
                            <p>{currComment.likes ? currComment.likes : 0}</p>
                        </div>

                        {Object.keys(data.comments).includes(id) ? <button onClick={toggle} className='edit-comment-btn'><MdEdit className='edit-btn-icon' /></button> : null}
                    </div>
                    {currComment.content && (
                        <EditComment
                            id={id}
                            postId={postId}
                            content={currComment.content}
                            modal={modal}
                            toggleModel={toggle} />
                    )}
                </div>
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
