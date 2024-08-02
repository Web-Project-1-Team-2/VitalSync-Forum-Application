import { ref, push, get, update, } from 'firebase/database';
import { db } from '../config/firebase-config'


const updateCreatedPosts = async (username, postId) => {
    const currentPosts = await get(ref(db, `users/${username}/createdPosts`));
    console.log(currentPosts.val());
    await update(ref(db), { [`users/${username}/createdPosts`]: { ...currentPosts.val(), [postId]: true }, });
}

const updatePostCount = async (username) => {
    const userRef = ref(db, `users/${username}`);
    const snapshot = await get(userRef);
    const userData = snapshot.val();

    if (!userData) {
        throw new Error('User not found');
    }

    const newPostCount = (userData.postCount || 0) + 1;
    const newLevel = newPostCount >= 5 ? 'Admin' : 'Rookie';

    await update(userRef, {
        postCount: newPostCount,
        level: newLevel
    });


    if (newPostCount === 5) {
        console.log(`User ${username} has become an admin!`);
        return notifySuccess(`User ${username} has become an admin!`);
    }
};

export const createNewPost = async (author, title, content, category) => {
    const post = { author, title, content, category, createdOn: new Date().toString() };
    const result = await push(ref(db, 'posts'), post);
    const id = result.key;
    await update(ref(db), { [`posts/${id}/id`]: id, });
    await updateCreatedPosts(author, id);
    await updatePostCount(author);
};
export const getAllPosts = async (search = '') => {
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