import PropTypes from 'prop-types';
import { useState } from 'react';
import { editPost } from '../../../services/post.service';
import { constrains } from '../../../common/constrains';
import { notifyError, notifySuccess } from '../../../services/notification.service';
import './EditPost.css';

const EditPost = ({ id, title, content, modal, toggleModel }) => {

    const [editedPost, setEditedPost] = useState({
        editedTitle: title,
        editedContent: content,
    })

    const editCurrPost = async () => {
        if (editedPost.editedTitle.length < constrains.POST_TITTLE_MIN_LENGTH || editedPost.editedTitle.length > constrains.POST_TITTLE_MAX_LENGTH) {
            return notifyError(`Title must be between ${constrains.POST_TITTLE_MIN_LENGTH} and ${constrains.POST_TITTLE_MAX_LENGTH} characters!`);
        }
        if (editedPost.editedContent.length < constrains.POST_CONTENT_MIN_LENGTH || editedPost.editedContent.length > constrains.POST_CONTENT_MAX_LENGTH) {
            return notifyError(`Content must be between ${constrains.POST_CONTENT_MIN_LENGTH} and ${constrains.POST_CONTENT_MAX_LENGTH} characters!`);
        }

        try {
            await editPost(id, editedPost.editedTitle, editedPost.editedContent);
            notifySuccess('Post edited successfully!');
            toggleModel();
        } catch (error) {
            console.log(error.message)
            notifyError('Error editing post!');
        }
    }

    return (
        <>
            {modal && (
                <div className="overlay" onClick={toggleModel}>
                    <div className="edit-post" onClick={(e) => e.stopPropagation()}>
                        <h1>Edit Post</h1>

                        <div>
                            <label htmlFor="edit-title">Title:</label>
                            <input type="text" name="title" id="edit-title"
                                value={editedPost.editedTitle}
                                onChange={(e) => setEditedPost({ ...editedPost, editedTitle: e.target.value })} />
                        </div>
                        <div>
                            <label htmlFor="edit-content">Content:</label>
                            <textarea name="content" id="edit-content"
                                value={editedPost.editedContent}
                                onChange={(e) => setEditedPost({ ...editedPost, editedContent: e.target.value })} />
                        </div>
                        <div id='buttons-grid'>
                            <div id='class-buttons'>
                                <button onClick={editCurrPost}>Edit</button>
                                <button onClick={toggleModel}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

EditPost.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    modal: PropTypes.bool.isRequired,
    toggleModel: PropTypes.func.isRequired,
};

export default EditPost
