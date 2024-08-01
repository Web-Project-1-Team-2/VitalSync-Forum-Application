import { ref, push, get, update, } from 'firebase/database';
import { db } from '../config/firebase-config'

export const createpost = async (author, title, content) => {
    const post = { author, title, content, createdOn: new Date().toString() };
    const result = await push(ref(db, 'posts'), post);
    const id = result.key;
    await update(ref(db), {
        [`posts/${id}/id`]: id,
    });
};

export const getAllposts = async (search = '') => {
    const snapshot = await get(ref(db, 'posts'));
    if (!snapshot.exists()) return [];

    const posts = Object.values(snapshot.val());

    if (search) {
        return posts.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    }

    return posts;
};

export const getpostById = async (id) => {
    const snapshot = await get(ref(db, `posts/${id}`));
    if (!snapshot.exists()) {
        throw new Error('post not found!');
    }

    return {
        ...snapshot.val(),
        ratedBy: Object.keys(snapshot.val().ratedBy ?? {}),
    };
};

export const upvotePost = (handle, postId) => {
    const updateObject = {
        [`posts/${postId}/ratedBy/${handle}`]: true,
        [`users/${handle}/ratedposts/${postId}`]: true,
    };

    return update(ref(db), updateObject);
};

export const downotePost = (handle, postId) => {
    const updateObject = {
        [`posts/${postId}/ratedBy/${handle}`]: null,
        [`users/${handle}/ratedposts/${postId}`]: null,
    };

    return update(ref(db), updateObject);
};