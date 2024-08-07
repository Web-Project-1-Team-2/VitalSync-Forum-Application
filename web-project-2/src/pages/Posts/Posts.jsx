import { useListVals } from 'react-firebase-hooks/database';
import { useEffect, useState } from "react";
import { db } from "../../config/firebase-config";
import { ref } from 'firebase/database';
import './Posts.css';
import Post from '../../components/Base/Post/Post';

const Posts = () => {

    const [posts, setPosts] = useState([]);
    const [snapshots, loading] = useListVals(ref(db, 'posts'));

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
                        <Post
                            key={post.id}
                            id={post.id}
                            title={post.title}
                            author={post.author}
                            content={post.content}
                            likes={post.likes || 0}
                            commentCount={post.commentCount || 0}
                            creationDate={new Date(post.createdOn).toLocaleDateString()}/>)) : (<h2>No posts found</h2>)}
                </div>
                <div id='filters'>
                    <h3>Filters: </h3>
                </div>
            </div>
        </div>
    )
}

export default Posts
