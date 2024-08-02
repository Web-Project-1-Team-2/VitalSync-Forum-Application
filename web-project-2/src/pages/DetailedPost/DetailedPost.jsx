import { useObjectVal } from 'react-firebase-hooks/database';
import { useParams } from 'react-router';
import { db } from '../../config/firebase-config';
import { ref } from 'firebase/database';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/authContext';

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
        if(!userData) return;
        if(!userData.createdPosts) return;
        setData(userData);
    }, [userData])

    useEffect(() => {
        if (!post) return;
        setCurrPost({ ...post });
    }, [post])
    
    return (
        <div>
            {loading && <h2>Loading...</h2>}
            <div id='detailed-post'>
                <div className='detailed-title'>
                    <h1>{currPost.title}</h1>
                </div>
                <div className='detailed-author'>
                    <h3>Author: {currPost.author}</h3>
                </div>
                <div className='detailed-content'>
                    <p>{currPost.content}</p>
                </div>
            </div>
            <div id='detailed-interaction'>
                <button>Like</button>
                <input type="text" name="comment" id="comment" placeholder='Write a comment...' />
                <button>Add</button>
            </div>
            <div className='detailed-comments'>
                <h2>Comments</h2>
            </div>

            {Object.keys(data.createdPosts).includes(id) || data.level === 'Admin' ? <button>Delete</button> : null}
        </div>
    )
}

export default DetailedPost
