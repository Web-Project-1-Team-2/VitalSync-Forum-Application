import '../Profile/Profile.css';
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { useListVals, useObjectVal } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { db } from '../../config/firebase-config';
import Post from '../../components/Base/Post/Post';
import { defaultAvatar } from '../../common/constrains';
import { AppContext } from '../../context/authContext';
import { blockUser } from '../../services/admin.service';
import { notifyError, notifySuccess } from '../../services/notification.service';

const UserProfile = () => {

    const { username } = useParams();
    const [author] = useObjectVal(ref(db, `users/${username}`));
    const [authorData, setAuthorData] = useState({
        avatar: '',
        uid: '',
        username: '',
        likedPosts: {},
        createdPosts: {},
        level: '',
        isBlocked: false,
    });

    const [posts, setPosts] = useState([]);
    const [snapshots, loading] = useListVals(ref(db, 'posts'));

    const { userData } = useContext(AppContext);

    useEffect(() => {
        if (!author) return;
        setAuthorData({
            ...author,
            avatar: author.avatar || '',
            username: author.username || '',
            uid: author.uid || '',
            createdPosts: author.createdPosts || {},
            likedPosts: author.likedPosts || {},
            isBlocked: author.isBlocked || false,
        });
    }, [author])

    useEffect(() => {
        if (!snapshots) return;
        setPosts([...snapshots]);
    }, [snapshots])


    const toggleBlock = async () => {
        try {
            await blockUser(username);

            if(authorData.isBlocked) {
                notifySuccess('User unblocked successfully');
            } else {
                notifySuccess('User blocked successfully');
            }
        } catch (error) {
            console.error(error);
            if(authorData.isBlocked) {
                notifyError('User unblocked successfully');
            } else {
                notifyError('Error blocking user');
            }
        }
    }


    return (
                <div id='profile-page'>
            <div>

            </div>
            <div id='user-information'>
                <div id='user-avatar'>
                    <img src={authorData.avatar || defaultAvatar} alt='avatar' />
                </div>
                <div id='main-information-profile'>
                    <h1>{authorData.username}</h1>
                    <h2>{authorData.firstName} {authorData.lastName}</h2>
                    <h3>{authorData.email}</h3>
                </div>
            </div>

            <div id='created-posts'>
                {loading && <h2>Loading...</h2>}
                {posts
                .filter(post => post.author === authorData.username)
                .sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn))
                .map(post =>
                    <Post
                        key={post.id}
                        id={post.id}
                        title={post.title}
                        author={post.author}
                        content={post.content}
                        likes={post.likes || 0}
                        commentCount={post.commentCount || 0}
                        creationDate={new Date(post.createdOn).toLocaleDateString()}
                        category={post.category} />)}
            </div>

            <div id='user-stats'>
                <h2>Level: {authorData.level}</h2>
                <h3>Created Posts: {Object.keys(authorData.createdPosts).length || 0}</h3>

                <div id='block-btn'>
                {(userData?.level === 'Admin' && authorData.level !== 'Admin') && (
                    authorData.isBlocked ? 
                    <button className=''onClick={() => toggleBlock(authorData.username)}>Unblock User</button> : 
                    <button onClick={() => toggleBlock(authorData.username)}>Block User</button>
                ) }
                </div>
                <h4>{authorData.isBlocked && <h3>User is blocked at the moment!</h3>  }</h4>
            </div>
        </div>
    )
}

UserProfile.propTypes = {};

export default UserProfile
