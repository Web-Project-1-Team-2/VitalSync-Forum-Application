import { useContext, useState } from "react"
import { createpost } from "../services/post-service.js";
import { AppContext } from "../context/authContext.js";

export default function CreatePost() {
    const [post, setpost] = useState({
        title: '',
        content: '',
    });
    const { userData } = useContext(AppContext);

    const updatePost = (key, value) => {
        setpost({
            ...post,
            [key]: value,
        });
    };

    const handleCreatePost = async () => {
        if (post.title.length < 3) {
            return alert('Title too short!');
        }
        if (post.content.length < 3) {
            return alert('Content too short!');
        }

        try {
            await createpost(userData.handle, post.title, post.content);
            setpost({ title: '', content: '' });
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