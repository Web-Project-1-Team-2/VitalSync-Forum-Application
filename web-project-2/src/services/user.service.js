import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config.js';

export const getUserByUsername = (username) => {
    return get(ref(db, `users/${username}`));
};

export const createUser = (firstName, lastName, username, uid, email) => {
    return set(ref(db, `users/${username}`), { firstName, lastName, username, uid, email, createdOn: new Date().toLocaleDateString(), createdPosts: {}, postCount: 0, level: 'Rookie' });
};

export const getUserData = (uid) => {
    return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};