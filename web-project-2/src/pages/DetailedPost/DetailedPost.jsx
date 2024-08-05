import { useListVals, useObjectVal } from 'react-firebase-hooks/database';
import { useParams } from 'react-router';
import { db } from '../../config/firebase-config';
import { ref } from 'firebase/database';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/authContext';
import { deletePost, uploadComment } from '../../services/post.service';
import { notifyError, notifySuccess } from '../../services/notification.service';
import './DetailedPost.css';
import { useNavigate } from 'react-router-dom';
import Comment from '../../components/Base/Comment/Comment';

const DetailedPost = () => {

    const navigate = useNavigate();

    const { id } = useParams();
    const { userData } = useContext(AppContext);

    const [post, loading] = useObjectVal(ref(db, `posts/${id}`));
    const [currPost, setCurrPost] = useState({});

    const [comments, commentsLoading] = useListVals(ref(db, `posts/${id}/comments`));
    console.log(`comments: ${comments}`);
    
    const [currComments, setCurrComments] = useState([]);
    console.log(currComments);

    const [comment, setComment] = useState('');
    console.log(`comment: ${comment}`);
    

    const [data, setData] = useState({
        createdPosts: {},
        level: '',
    });



    useEffect(() => {
        if (!userData) return;
        if (!userData.createdPosts) return;
        setData(userData);
    }, [userData])

    useEffect(() => {
        if (!post) return;
        setCurrPost({ ...post });
    }, [post])

    useEffect(() => {
        if (!comments) return;
        setCurrComments([...comments]);
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
                    </div>
                </div>
                <div className='detailed-content'>
                    <p>{currPost.content}</p>
                </div>
            </div>
            <div id='detailed-interaction'>
                <button>Like</button>
                <div className='comment-box'>
                    <textarea value={comment} placeholder='Write a comment...' onChange={(e) => setComment(e.target.value)} />
                    <button onClick={commentOnPost} >Add</button>
                </div>
            </div>
            <div className='detailed-comments'>
                <h2>Comments</h2>
                <div id='comment-section'>
                    {commentsLoading && <h3>Loading...</h3>}
                    {currComments.length !== 0 ? (currComments.map(comment => <Comment
                        key={comment.id}
                        id={comment.id}
                        author={comment.author}
                        content={comment.content} />)) : (<h3>No comments yet!</h3>)}
                </div>
            </div>

            {Object.keys(data.createdPosts).includes(id) || data.level === 'Admin' ? <button onClick={deleteCurrPost}>Delete</button> : null}
        </div>
    )
}

export default DetailedPost
