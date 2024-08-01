import { useContext, useState } from "react"
import { createNewPost } from '../../services/post.service.js';
import { AppContext } from '../../context/authContext.js';
import { constrains } from "../../common/constrains.js";
import { notifyError, notifySuccess } from "../../services/notification.service.js";
import './CreatePost.css';

export default function CreatePost() {
    const [post, setPost] = useState({
        title: '',
        content: '',
    });
    const { userData } = useContext(AppContext);

    const updatePost = (key, value) => {
        setPost({
            ...post,
            [key]: value,
        });
    };

    const handleCreatePost = async () => {
        if (post.title.length < constrains.POST_TITTLE_MIN_LENGTH || post.title.length > constrains.POST_TITTLE_MAX_LENGTH) {
            return notifyError('Title too short!');
        }
        if (post.content.length < constrains.POST_CONTENT_MIN_LENGTH || post.content.length > constrains.POST_CONTENT_MAX_LENGTH) {
            return notifyError('Content too short!');
        }

        try {
            await createNewPost(userData.username, post.title, post.content);
            notifySuccess('Post created successfully!');
            setPost({ title: '', content: '' });
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="create-field">
            <h1>Create post</h1>
            <div className="create-grid">
                <div className="title-grid">
                    <label htmlFor="title">Title: </label>
                    <input value={post.title} onChange={e => updatePost('title', e.target.value)} type="text" name="title" id="title" />
                </div>

                <div className="content-grid">
                    <label htmlFor="content">Content: </label>
                    <textarea value={post.content} onChange={e => updatePost('content', e.target.value)} name="content" id="content" />
                </div>
            </div>
            <button onClick={handleCreatePost} className="create-btn">Create</button>
        </div>
    )
}