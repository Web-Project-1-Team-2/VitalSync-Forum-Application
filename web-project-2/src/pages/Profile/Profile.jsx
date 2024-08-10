import './Profile.css';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/authContext';
import { useListVals } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { db } from '../../config/firebase-config';
import Post from '../../components/Base/Post/Post';
import UploadAvatar from '../../components/Base/UploadAvatar/UploadAvatar';
import { defaultAvatar } from '../../common/constrains';
import { FaPlus } from "react-icons/fa";


const Profile = () => {

    const { userData } = useContext(AppContext);
    const [data, setData] = useState({
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

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    useEffect(() => {
        if (!userData) return;
        setData({
            ...userData,
            avatar: userData.avatar || '',
            username: userData.username || '',
            uid: userData.uid || '',
            createdPosts: userData.createdPosts || {},
            likedPosts: userData.likedPosts || {},
            isBlocked: userData.isBlocked || false,
        });
    }, [userData])
    
    useEffect(() => {
        if (!snapshots) return;
        setPosts([...snapshots]);
    }, [snapshots])



    return (
        <div id='profile-page'>
            <div>

            </div>
            <div id='user-information'>
                <div id='user-avatar'>
                    <img src={data.avatar || defaultAvatar} alt='avatar' />
                    <div id='add-avatar' onClick={() => setModal(!modal)}> 
                        <FaPlus id='plus-upload'/>
                    </div>
                </div>
                <div id='main-information-profile'>
                    <h1>{data.username}</h1>
                    <h2>{data.firstName} {data.lastName}</h2>
                    <h3>{data.email}</h3>
                </div>
            </div>

            <div id='created-posts'>
                {loading && <h2>Loading...</h2>}
                {posts
                .filter(post => post.author === data.username)
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
                <h2>Level: {data.level}</h2>
                <h3>Created Posts: {Object.keys(data.createdPosts).length || 0}</h3>

                <h3>{data.isBlocked && <h3>You are blocked. Contact an admin!</h3>  }</h3>
            </div>

            <UploadAvatar 
            avatar={data.avatar} 
            username={data.username} 
            uid={data.uid}
            modal={modal} 
            toggleModel={toggle}/>
        </div>
    )
}

export default Profile
