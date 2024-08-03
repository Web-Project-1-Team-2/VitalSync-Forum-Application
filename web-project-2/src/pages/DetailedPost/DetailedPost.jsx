import { useObjectVal } from 'react-firebase-hooks/database';
import { useParams } from 'react-router';
import { db } from '../../config/firebase-config';
import { ref } from 'firebase/database';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/authContext';
import { deletePost } from '../../services/post.service';
import { notifyError, notifySuccess } from '../../services/notification.service';
import './DetailedPost.css';

const DetailedPost = () => {

    const { id } = useParams();
    const [post, loading] = useObjectVal(ref(db, `posts/${id}`));
    const [currPost, setCurrPost] = useState({});
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

    useEffect(() => {
        if (!post) return;
        setCurrPost({ ...post });
    }, [post])

    const deleteCurrPost = async () => {
        try {
            await deletePost(userData.username, id);
            notifySuccess('Post deleted successfully!');
        } catch (error) {
            console.log(error.message);
            notifyError('Error deleting post!');
        }
    };

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
                    <textarea placeholder='Write a comment...' />
                    <button>Add</button>
                </div>
            </div>
            <div className='detailed-comments'>
                <h2>Comments</h2>
                <div id='comment-section'>

                </div>
            </div>

            {Object.keys(data.createdPosts).includes(id) || data.level === 'Admin' ? <button onClick={deleteCurrPost}>Delete</button> : null}
        </div>
    )
}

export default DetailedPost
