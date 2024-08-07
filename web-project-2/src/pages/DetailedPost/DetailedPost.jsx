import { useListVals, useObjectVal } from 'react-firebase-hooks/database';
import { useParams } from 'react-router';
import { db } from '../../config/firebase-config';
import { ref } from 'firebase/database';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/authContext';
import { deletePost, likePost, unlikePost, uploadComment } from '../../services/post.service';
import { notifyError, notifySuccess } from '../../services/notification.service';
import './DetailedPost.css';
import { useNavigate } from 'react-router-dom';
import Comment from '../../components/Base/Comment/Comment';
import { BiUpvote } from "react-icons/bi";
import { BiSolidUpvote } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import EditPost from '../../components/Base/EditPost/EditPost';

const DetailedPost = () => {

    const navigate = useNavigate();

    const { id } = useParams();
    const { userData } = useContext(AppContext);

    const [post, loading] = useObjectVal(ref(db, `posts/${id}`));
    const [currPost, setCurrPost] = useState({
        title: '',
        content: '',
    });


    const [comments, commentsLoading] = useListVals(ref(db, `posts/${id}/comments`));
    const [currComments, setCurrComments] = useState([]);

    const [comment, setComment] = useState('');

    const [data, setData] = useState({
        likedPosts: {},
        createdPosts: {},
        level: '',
    });

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    useEffect(() => {
        if (!userData) return;
        setData({
            ...userData,
            createdPosts: userData.createdPosts || {},
            likedPosts: userData.likedPosts || {}
        });
    }, [userData])

    useEffect(() => {
        if (!post) return;
        setCurrPost({ ...post });
    }, [post])

    useEffect(() => {
        if (!comments) return;
        const updatedList = comments.filter((el) => 'id' in el);
        setCurrComments([...updatedList]);
    }, [comments])


    const deleteCurrPost = async () => {
        try {
            await deletePost(userData.username, id);
            notifySuccess('Post deleted successfully!');
            navigate('/posts');
        } catch (error) {
            console.log(error.message);
            notifyError('Error deleting post!');
        }
    };

    const commentOnPost = async () => {
        try {
            await uploadComment(id, userData.username, comment);
            setComment('');
            notifySuccess('Comment added successfully!');
        } catch (error) {
            console.log(error.message);
            notifyError('Error adding comment!');
        }
    }

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
        <div id='detailed-page'>
            {loading && <h2>Loading...</h2>}
            <div id='detailed-post'>
                <div id='detailed-title-details'>
                    <div className='detailed-title'>
                        <h1>{currPost.title}</h1>
                    </div>
                    <div className='detailed-author'>
                        <h3>Author: {currPost.author}</h3>
                        <h4>Category: {currPost.category}</h4>
                        <h5>Created: {new Date (currPost.createdOn).toLocaleDateString()}</h5>
                    </div>
                </div>
                <div className='detailed-content'>
                    <p>{currPost.content}</p>
                </div>
            </div>
            <div id='detailed-interaction'>
                <div id='int-section'>
                    <div id='like-comment-section'>
                        <div id='like-section'>
                            {Object.keys(data.likedPosts).includes(id) ?
                                <button className='like-button' onClick={unlikeCurrPost} ><BiSolidUpvote /></button> :
                                <button className='like-button' onClick={likeCurrPost}><BiUpvote /></button>}
                            <p>{currPost.likes ? currPost.likes : 0}</p>
                        </div>
                        <div id='comment-button-section'>
                            <button className='comment-button'><FaRegComment /></button>
                            <p>{currPost.commentCount || 0}</p>
                        </div>
                    </div>

                    {Object.keys(data.createdPosts).includes(id) ? <button onClick={toggle} className='edit-btn'><MdEdit className='edit-btn-icon' /></button> : null}
                </div>
                <div className='comment-box'>
                    <textarea value={comment} placeholder='Write a comment...' onChange={(e) => setComment(e.target.value)} />
                    <button id='add-button' onClick={commentOnPost} >Add</button>
                </div>
            </div>
            <div className='detailed-comments'>
                <h2>Comments</h2>
                <div id='comment-section'>
                    {commentsLoading && <h3>Loading...</h3>}
                    {currComments.length !== 0 ? (currComments.map(comment => <Comment
                        key={comment.id}
                        id={comment.id}
                        postId={id}
                        author={comment.author}
                        content={comment.content} />)) : (<h3>No comments yet!</h3>)}
                </div>
            </div>

            <div id='delete-section'>
                {Object.keys(data.createdPosts).includes(id) || data.level === 'Admin' ? <button className='delete-btn' onClick={deleteCurrPost}>Delete</button> : null}
            </div>
            {(currPost.title && currPost.content) && (
                <EditPost
                    id={id}
                    title={currPost.title}
                    content={currPost.content}
                    modal={modal}
                    toggleModel={toggle} />
            )}
        </div>
    )
}

export default DetailedPost
