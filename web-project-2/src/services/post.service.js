import { ref, push, get, update, } from 'firebase/database';
import { db } from '../config/firebase-config';
import { notifySuccess } from './notification.service';

const updateCreatedPosts = async (username, postId, idValue = true) => {
    const currentPosts = await get(ref(db, `users/${username}/createdPosts`));
    console.log(currentPosts.val());
    await update(ref(db), { [`users/${username}/createdPosts`]: { ...currentPosts.val(), [postId]: idValue ? true : null }, });
}

const updatePostCount = async (username, sign = 'increment') => {
    const userRef = ref(db, `users/${username}`);
    const snapshot = await get(userRef);
    const userData = snapshot.val();

    if (!userData) {
        throw new Error('User not found');
    }

    const newPostCount = sign === 'decrement' ? (userData.postCount || 0) - 1 : (userData.postCount || 0) + 1;
    const newLevel = newPostCount >= 5 ? 'Admin' : 'Rookie';

    await update(userRef, {
        postCount: newPostCount,
        level: newLevel
    });


    if (newPostCount < 4) {
        console.log(`User ${username} has become an admin!`);
        return notifySuccess(`User ${username} has become an admin!`);
    } else if (newPostCount < 5) {
        console.log(`User ${username} has become a rookie!`);
        return notifySuccess(`User ${username} has become a rookie!`);
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

export const getPostById = async (id) => {
    const snapshot = await get(ref(db, `posts/${id}`));
    if (!snapshot.exists()) {
        throw new Error('post not found!');
    }

    return {
        ...snapshot.val(),
        ratedBy: Object.keys(snapshot.val().ratedBy ?? {}),
    };
};

export const upVotePost = (handle, postId) => {
    const updateObject = {
        [`posts/${postId}/ratedBy/${handle}`]: true,
        [`users/${handle}/ratedposts/${postId}`]: true,
    };

    return update(ref(db), updateObject);
};

export const downVotePost = (handle, postId) => {
    const updateObject = {
        [`posts/${postId}/ratedBy/${handle}`]: null,
        [`users/${handle}/ratedposts/${postId}`]: null,
    };

    return update(ref(db), updateObject);
};

export const deletePost = async (username, postId) => {
    await update(ref(db), {
        [`posts/${postId}`]: null,
    });
    await updateCreatedPosts(username, postId, false);
    await updatePostCount(username, 'decrement');
    return;
}