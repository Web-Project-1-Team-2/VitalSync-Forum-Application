
import { ref, get, update, query, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';


export const searchUsers = async (searchTerm) => {
    const usersRef = ref(db, 'users');
    const lowerSearchTerm = searchTerm.toLowerCase();
    const snapshot = await get(usersRef);

    if (!snapshot.exists()) {
        return [];
    }

    const users = Object.entries(snapshot.val()).map(([uid, userData]) => ({
        uid,
        ...userData
    }));

    return users.filter(user =>
        user.username.toLowerCase().includes(lowerSearchTerm) ||
        user.email.toLowerCase().includes(lowerSearchTerm) ||
        (user.displayName && user.displayName.toLowerCase().includes(lowerSearchTerm))
    );
};


export const toggleUserBlock = async (userId, block) => {
    const userRef = ref(db, `users/${userId}`);
    await update(userRef, { blocked: block });
};


export const getAdminPosts = async (sortBy = 'createdOn', filterBy = null, filterValue = null) => {
    let postsRef = ref(db, 'posts');

    if (filterBy && filterValue) {
        postsRef = query(postsRef, orderByChild(filterBy), equalTo(filterValue));
    } else {
        postsRef = query(postsRef, orderByChild(sortBy));
    }

    const snapshot = await get(postsRef);

    if (!snapshot.exists()) {
        return [];
    }

    let posts = Object.entries(snapshot.val()).map(([id, post]) => ({
        id,
        ...post
    }));

    if (!filterBy || !filterValue) {
        posts.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) return -1;
            if (a[sortBy] > b[sortBy]) return 1;
            return 0;
        });
    }

    return posts;
};

export const deletePostAdmin = async (postId) => {
    const postRef = ref(db, `posts/${postId}`);
    await remove(postRef);
};