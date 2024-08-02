import { useListVals } from 'react-firebase-hooks/database';
import { useEffect, useState } from "react";
import { db } from "../../config/firebase-config";
import { ref } from 'firebase/database';
import './Posts.css';
import { useNavigate } from 'react-router-dom';

const Posts = () => {

    const [posts, setPosts] = useState([]);
    const [snapshots, loading] = useListVals(ref(db, 'posts'));
    const navigate = useNavigate();

    useEffect(() => {
        if (!snapshots) return;
        setPosts([...snapshots]);
    }, [snapshots])


    return (
        <div className='post-page'>
            <h1>Posts</h1>
            {loading && <h2>Loading...</h2>}

            <div className='post-grid'>
                <div id='post-list'>
                    {posts.length !== 0 ? (posts.map(post =>
                        <div key={post.id} className='post-box'>
                            <div>
                                <div className='title-box'>
                                    <h2>{post.title}</h2>
                                    <h4> Author: {post.author}</h4>
                                </div>
                                <div className='content-box'>
                                    <p>{post.content}</p>
                                </div>
                            </div>
                            <div>
                                <button onClick={() => navigate(`/posts/${post.id}`)}> View Details</button>
                            </div>

                        </div>)) : (<h2>No posts found</h2>)}
                </div>
                <div id='filters'>
                    <h3>Filters: </h3>
                </div>
            </div>
        </div>
    )
}

export default Posts
