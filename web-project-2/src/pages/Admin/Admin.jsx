
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AppContext } from '../../context/authContext';
import { searchUsers, toggleUserBlock, getAdminPosts, deletePostAdmin } from '../../services/admin.service';
import { Navigate } from 'react-router-dom';

function Admin() {
    const { userData } = useContext(AppContext);
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('createdOn');
    const [filterBy, setFilterBy] = useState(null);
    const [filterValue, setFilterValue] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchPosts = useCallback(async () => {
        const fetchedPosts = await getAdminPosts(sortBy, filterBy, filterValue);
        setPosts(fetchedPosts);
    }, [sortBy, filterBy, filterValue]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);


    useEffect(() => {
        if (userData !== null) {
            setLoading(false);
        }
    }, [userData]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userData || userData.level !== 'Admin') {
        return <Navigate to="/" replace />;
    }

    const handleSearch = async () => {
        const results = await searchUsers(searchTerm);
        setUsers(results);
    };

    const handleBlockUser = async (userId, currentBlockStatus) => {
        await toggleUserBlock(userId, !currentBlockStatus);
        handleSearch();
    };

    const handleDeletePost = async (postId) => {
        await deletePostAdmin(postId);
        fetchPosts();
    };

    const handleFilterChange = (e) => {
        setFilterBy(e.target.value);
        setFilterValue('');
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>

            <div>
                <h2>User Management</h2>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users..."
                />
                <button onClick={handleSearch}>Search</button>

                <ul>
                    {users.map(user => (
                        <li key={user.uid}>
                            {user.displayName || user.username} ({user.email})
                            <button onClick={() => handleBlockUser(user.uid, user.blocked)}>
                                {user.blocked ? 'Unblock' : 'Block'}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h2>Post Management</h2>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="createdOn">Date Created</option>
                    <option value="title">Title</option>
                    <option value="author">Author</option>
                </select>
                <select value={filterBy || ''} onChange={handleFilterChange}>
                    <option value="">No Filter</option>
                    <option value="title">Title</option>
                    <option value="author">Author</option>
                </select>
                {filterBy && (
                    <input
                        type="text"
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        placeholder={`Filter by ${filterBy}...`}
                    />
                )}
                <button onClick={fetchPosts}>Apply Filter</button>
                <ul>
                    {posts.map(post => (
                        <li key={post.id}>
                            {post.title} by {post.author} ({new Date(post.createdOn).toLocaleDateString()})
                            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Admin;