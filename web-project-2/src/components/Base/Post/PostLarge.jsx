import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { BiUpvote } from "react-icons/bi";
import { BiSolidUpvote } from "react-icons/bi";
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/authContext';
import { FaRegComment } from "react-icons/fa";
import { CgDetailsMore } from "react-icons/cg";
import { likePost, unlikePost } from '../../../services/post.service';
import { notifyError } from '../../../services/notification.service';
import { defaultAvatar } from '../../../common/constrains';
import './PostLarge.css'
import { useObjectVal } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { db } from '../../../config/firebase-config';




const PostLarge = ({ id, title, author, content, likes, commentCount, creationDate, category }) => {

    const { user, userData } = useContext(AppContext);
    const [data, setData] = useState({
        likedPosts: {},
        createdPosts: {},
    });

    const [avatar, avatarLoading] = useObjectVal(ref(db, `users/${author}/avatar`));
    const [authorAvatar, setAuthorAvatar] = useState('');

    const navigate = useNavigate();

    const displayCategory = (categ) => {
        switch (categ) {
            case 'training': return 'Training & Sport';
            case 'nutrition': return 'Nutrition';
            case 'supplements': return 'Supplements';
        }
    }

    useEffect(() => {
        if (!userData) return;
        setData({
            ...userData,
            createdPosts: userData.createdPosts || {},
            likedPosts: userData.likedPosts || {}
        });
    }, [userData])

    useEffect(() => {
        if (!avatar) return;
        setAuthorAvatar(avatar);
    }, [avatar]);

    const likeCurrPost = async () => {
        try {
            await likePost(id, userData.username);
        } catch (error) {
            console.log(error.message);
            notifyError('Error liking post!');
        }
    }

    const unlikeCurrPost = async () => {
        try {
            await unlikePost(id, userData.username);
        } catch (error) {
            console.log(error.message);
            notifyError('Error disliking post!');
        }
    }

    return (
        <>
            <div className='post-box-large'>
                <div className='author-information-avatar'>
                    <div className='post-author-avatar'>
                        {avatarLoading && <p>Loading...</p>}
                        <img src={authorAvatar || defaultAvatar} alt="avatar" onClick={author === userData.username ? 
                        () => navigate(`/profile`) :
                        () => navigate(`/profile/${author}`)}/>
                    </div>
                    <h2>{author}</h2>
                </div>
                <div className='post-info-box'>
                    <div className='title-category-section'>
                        <h2>{title}</h2>
                        <h3> Category: {displayCategory(category)}</h3>
                    </div>
                    <div className='content-section'>
                        <p>{content}</p>
                    </div>
                    <div className='interactions-section'>
                        <div className='post-interaction-buttons'>
                            <div className='like-section-post'>
                                {data.likedPosts[id] ?
                                    <button className='small-like-button' onClick={user ? unlikeCurrPost : () => navigate(`/login`)} ><BiSolidUpvote /></button> :
                                    <button className='small-like-button' onClick={user ? likeCurrPost : () => navigate(`/login`)}><BiUpvote /></button>
                                }
                                <p>{likes}</p>
                            </div>
                            <div className='post-comment-section'>
                                <button className='small-comment-button' onClick={user ? () => navigate(`/posts/${id}`) : () => navigate(`/login`)}><FaRegComment /></button>
                                <p>{commentCount}</p>
                            </div>
                        </div>

                        <p>Created: {creationDate}</p>
                    </div>
                </div>
                <div id='details-btn'>
                    <button onClick={user ? () => navigate(`/posts/${id}`) : () => navigate(`/login`)}><CgDetailsMore className='view-details-icon' /></button>
                </div>
            </div>
        </>
    )
}

PostLarge.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    content: PropTypes.string,
    likes: PropTypes.number,
    commentCount: PropTypes.number,
    creationDate: PropTypes.string,
    category: PropTypes.string
};

export default PostLarge
