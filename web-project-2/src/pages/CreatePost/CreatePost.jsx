import { useContext, useState } from "react"
import { createNewPost } from '../../services/post.service.js';
import { AppContext } from '../../context/authContext.js';
import { constrains, CATEGORIES } from "../../common/constrains.js";
import { notifyError, notifySuccess } from "../../services/notification.service.js";
import './CreatePost.css';

export default function CreatePost() {
    const [post, setPost] = useState({
        title: '',
        content: '',
        category: '',
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
            return notifyError(`Title must be between ${constrains.POST_TITTLE_MIN_LENGTH} and ${constrains.POST_TITTLE_MAX_LENGTH} characters!`);
        }
        if (post.content.length < constrains.POST_CONTENT_MIN_LENGTH || post.content.length > constrains.POST_CONTENT_MAX_LENGTH) {
            return notifyError(`Content must be between ${constrains.POST_CONTENT_MIN_LENGTH} and ${constrains.POST_CONTENT_MAX_LENGTH} characters!`);
        }
        if (!post.category) {
            return notifyError('Please select a category');
        }
        try {
            await createNewPost(userData.username, post.title, post.content, post.category);
            notifySuccess('Post created successfully!');
            setPost({ title: '', content: '', category: '' });
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
                <div className="category-grid">
                    <label htmlFor="category">Category: </label>
                    <select
                        value={post.category}
                        onChange={e => updatePost('category', e.target.value)}
                        name="category"
                        id="category"
                    >
                        <option value="">Select a category</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <button onClick={handleCreatePost} className="create-btn">Create</button>
        </div>
    )
}