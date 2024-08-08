import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './Post.css';
import { BiUpvote } from "react-icons/bi";
import { BiSolidUpvote } from "react-icons/bi";
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/authContext';
import { FaRegComment } from "react-icons/fa";
import { likePost, unlikePost } from '../../../services/post.service';
import { notifyError } from '../../../services/notification.service';




const Post = ({ id, title, author, content, likes, commentCount, creationDate, category }) => {

    const { userData } = useContext(AppContext);
    const [data, setData] = useState({
        likedPosts: {},
        createdPosts: {},
    });


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

    const navigate = useNavigate();

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
            <div className='post-box'>
                <div className='post-content-section'>
                    <div className='title-box'>
                        <div id='title-category-box'>
                            <h2>{title}</h2>
                            <h3> Category: {displayCategory(category)}</h3>
                        </div>

                        <h4> Author: {author}</h4>
                    </div>
                    <div className='content-box'>
                        <p>{content}</p>
                    </div>
                    <div className='post-interaction-info'>
                        <div id='interaction-buttons-section'>
                            <div id='small-like-section'>
                                {Object.keys(data.likedPosts).includes(id) ?
                                    <button className='small-like-button' onClick={unlikeCurrPost} ><BiSolidUpvote /></button> :
                                    <button className='small-like-button' onClick={likeCurrPost}><BiUpvote /></button>
                                }
                                <p>{likes}</p>
                            </div>
                            <div id='small-comment-section'>
                                <button className='small-comment-button' onClick={() => navigate(`/posts/${id}`)}><FaRegComment /></button>
                                <p>{commentCount}</p>
                            </div>
                        </div>

                        <p>Created: {creationDate}</p>
                    </div>
                </div>
                <div id='details-btn'>
                    <button onClick={() => navigate(`/posts/${id}`)}> View Details</button>
                </div>
            </div>
        </>
    )
}

Post.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    content: PropTypes.string,
    likes: PropTypes.number,
    commentCount: PropTypes.number,
    creationDate: PropTypes.string,
    category: PropTypes.string
};

export default Post


{/* <div key={post.id} className='post-box'>
<div>
    <div className='title-box'>
        <h2>{post.title}</h2>
        <h4> Author: {post.author}</h4>
    </div>
    <div className='content-box'>
        <p>{post.content}</p>
    </div>
</div>
<div id='details-btn'>
    <button onClick={() => navigate(`/posts/${post.id}`)}> View Details</button>
</div>
</div> */}