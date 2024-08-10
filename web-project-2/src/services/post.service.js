import { ref, push, get, update, } from 'firebase/database';
import { db } from '../config/firebase-config';
import { notifyError, notifySuccess } from './notification.service';

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


    if (newPostCount > 4) {
        console.log(`User ${username} has become an admin!`);
        return notifySuccess(`User ${username} has become an admin!`);
    } else if (newPostCount < 5) {
        console.log(`User ${username} has become a rookie!`);
        return;
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

export const deletePost = async (username, postId) => {
    await update(ref(db), {
        [`posts/${postId}`]: null,
    });
    await updateCreatedPosts(username, postId, false);
    await updatePostCount(username, 'decrement');
    return;
}

export const uploadComment = async (postId, author, content) => {
    const postRef = ref(db, `posts/${postId}`);
    const snapshot = await get(postRef);
    const postData = snapshot.val();

    if (!postData) {
        notifyError('Comment not found');
    }

    const comment = { author, content, createdOn: new Date().toString() };
    const result = await push(ref(db, `posts/${postId}/comments`), comment);
    const id = result.key;
    await update(ref(db), { [`posts/${postId}/comments/${id}/id`]: id, });
    await update(ref(db), { [`users/${author}/comments/${id}`]: true, });

    const newCommentCount = (postData.commentCount || 0) + 1;
    await update(ref(db), { [`posts/${postId}/commentCount`]: newCommentCount, });
};

export const deleteComment = async (postId, commentId, author) => {
    const commentRef = ref(db, `posts/${postId}`);
    const snapshot = await get(commentRef);
    const postData = snapshot.val();

    if (!postData) {
        notifyError('Comment not found');
    }

    await update(ref(db), {
        [`posts/${postId}/comments/${commentId}`]: null,
        [`users/${author}/comments/${commentId}`]: null,
    });

    const newCommentCount = (postData.commentCount || 0) - 1;
    await update(ref(db), { [`posts/${postId}/commentCount`]: newCommentCount, });
}



export const likePost = async (postId, user) => {
    const postRef = ref(db, `posts/${postId}`);
    const snapshot = await get(postRef);
    const postData = snapshot.val();

    if (!postData) {
        notifyError('Post not found');
    }

    const likes = postData.likes || 0;
    const newLikes = likes + 1;

    await update(ref(db), { [`posts/${postId}/likes`]: newLikes, });
    await update(ref(db), { [`posts/${postId}/likedUsers/${user}`]: true, });
    await update(ref(db), { [`users/${user}/likedPosts/${postId}`]: true, });
}

export const unlikePost = async (postId, user) => {
    const postRef = ref(db, `posts/${postId}`);
    const snapshot = await get(postRef);
    const postData = snapshot.val();

    if (!postData) {
        notifyError('Post not found');
    }

    const likes = postData.likes || 0;
    const newLikes = likes > 0 ? likes - 1 : 0;

    await update(ref(db), { [`posts/${postId}/likes`]: newLikes, });
    await update(ref(db), { [`posts/${postId}/likedUsers/${user}`]: null, });
    await update(ref(db), { [`users/${user}/likedPosts/${postId}`]: null, });
}



export const likeComment = async (postId, commentId, user) => {
    const commentRef = ref(db, `posts/${postId}/comments/${commentId}`);
    const snapshot = await get(commentRef);
    const commentData = snapshot.val();

    if (!commentData) {
        notifyError('Comment not found');
    }

    const likes = commentData.likes || 0;
    const newLikes = likes + 1;

    await update(ref(db), { [`posts/${postId}/comments/${commentId}/likes`]: newLikes, });
    await update(ref(db), { [`posts/${postId}/comments/${commentId}/likedUsers/${user}`]: true, });
    await update(ref(db), { [`users/${user}/likedComments/${commentId}`]: true, });
}

export const unlikeComment = async (postId, commentId, user) => {
    const commentRef = ref(db, `posts/${postId}/comments/${commentId}`);
    const snapshot = await get(commentRef);
    const commentData = snapshot.val();

    if (!commentData) {
        notifyError('Comment not found');
    }

    const likes = commentData.likes || 0;
    const newLikes = likes > 0 ? likes - 1 : 0;

    await update(ref(db), { [`posts/${postId}/comments/${commentId}/likes`]: newLikes, });
    await update(ref(db), { [`posts/${postId}/comments/${commentId}/likedUsers/${user}`]: null, });
    await update(ref(db), { [`users/${user}/likedComments/${commentId}`]: null, });
}

export const editPost = async (postId, title, content) => {
    await update(ref(db), {
        [`posts/${postId}/title`]: title,
        [`posts/${postId}/content`]: content,
    });
}

export const editComment = async (postId, commentId, content) => {
    await update(ref(db), {
        [`posts/${postId}/comments/${commentId}/content`]: content,
    });
}

export const getPostAuthorAvatar = async (username, postId) => {
    const userRef = ref(db, `users/${username}`);
    const snapshot = await get(userRef);
    const userData = snapshot.val();

    if (!userData.createdPosts) {
        return null;
    }

    if (userData.createdPosts[postId]) {
        return userData.avatar;
    }
}