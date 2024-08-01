import { useContext, useState } from "react"
import { createNewPost } from '../../services/post.service.js';
import { AppContext } from '../../context/authContext.js';
import { constrains } from "../../common/constrains.js";
import { notifyError, notifySuccess } from "../../services/notification.service.js";

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
        if (post.title.length < constrains.TITLE_MIN_LENGTH || post.title.length > constrains.TITLE_MAX_LENGTH) {
            return notifyError('Title too short!');
        }
        if (post.content.length < constrains.CONTENT_MIN_LENGTH || post.content.length > constrains.CONTENT_MAX_LENGTH) {
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
        <div>
            <h1>Create post</h1>
            <label htmlFor="title">Title: </label>
            <input value={post.title} onChange={e => updatePost('title', e.target.value)} type="text" name="title" id="title" /><br />
            <label htmlFor="content">Content: </label>
            <textarea value={post.content} onChange={e => updatePost('content', e.target.value)} name="content" id="content" /><br /><br />
            <button onClick={handleCreatePost}>Create</button>
        </div>
    )
}