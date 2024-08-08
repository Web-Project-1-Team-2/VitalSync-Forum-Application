
import { ref, get, update } from 'firebase/database';
import { db } from '../config/firebase-config';
import { notifyError } from './notification.service';



export const blockUser = async (username) => {
    const userRef = ref(db, `users/${username}`);
    const snapshot = await get(userRef);
    const userData = snapshot.val();

    if (!userData) {
        notifyError('User not found');
    }

    if (userData.isBlocked) {
        await update(ref(db), { [`users/${username}/isBlocked`]: null, });
    } else {
        await update(ref(db), { [`users/${username}/isBlocked`]: true, });
    }
};
