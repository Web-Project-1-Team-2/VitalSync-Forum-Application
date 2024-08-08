import { useEffect, useState } from 'react';
import { useListVals } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { db } from '../../config/firebase-config';
import User from '../../components/Base/User/User';
import './Admin.css';
import Post from '../../components/Base/Post/Post.jsx'

const Admin = () => {

    const [snapshotsPosts, loading] = useListVals(ref(db, 'posts'));
    const [posts, setPosts] = useState([]);

    const [snapshotsUsers, loadingUsers] = useListVals(ref(db, 'users'));
    const [users, setUsers] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        if (!snapshotsPosts) return;
        setPosts([...snapshotsPosts]);
    }, [snapshotsPosts])

    useEffect(() => {
        if (!snapshotsUsers) return;
        setUsers([...snapshotsUsers]);
    }, [snapshotsUsers])


    return (
        <div id='admin-page'>
            <h1>Admin Dashboard</h1>

            <div id='dashboard-grid'>
                <div id='user-management'>
                    <h2>User Management</h2>
                    <div id='user-search'>
                        <label htmlFor="search-user" />
                        <input
                            type="text"
                            id='search-user'
                            value={searchTerm}
                            placeholder='Search users...'
                            onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>

                    <div id='user-list'>
                        {loadingUsers && <h2>Loading...</h2>}
                        {users.length !== 0 ? (
                            users
                            .filter(user => {
                                if(user.username.toLowerCase().includes(searchTerm.toLowerCase())) return user;
                                if(user.email.toLowerCase().includes(searchTerm.toLowerCase())) return user;
                                if(user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) return user;
                                if(user.lastName.toLowerCase().includes(searchTerm.toLowerCase())) return user;
                            })
                            .map(user => (
                                <User
                                    key={user.uid}
                                    username={user.username}
                                    email={user.email}
                                    firstName={user.firstName}
                                    lastName={user.lastName}
                                    createdOn={user.createdOn}
                                    postCount={user.postCount}
                                    level={user.level}
                                    isBlocked={user.isBlocked || null }/>
                            ))
                        ) : (<h2> No users found</h2>)}
                    </div>
                </div>
                        
                <div id='post-management'>
                    <h2>Post Management</h2>
                    {loading && <h2>Loading...</h2>}
                    {posts.length !== 0 ? (
                        posts
                        .filter(post => post.author.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(post => <Post
                            key={post.id}
                            id={post.id}
                            title={post.title}
                            author={post.author}
                            content={post.content}
                            likes={post.likes || 0}
                            commentCount={post.commentCount || 0}
                            creationDate={new Date(post.createdOn).toLocaleDateString()}
                            category={post.category} />)
                    ) : (<h2>No posts found</h2>)}
                </div>
            </div>
        </div>
    )
}

Admin.propTypes = {};

export default Admin
