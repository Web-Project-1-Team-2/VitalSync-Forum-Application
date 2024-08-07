import PropTypes from 'prop-types';
import { useState } from 'react';
import { notifyError, notifySuccess } from '../../../services/notification.service';
import { editComment } from '../../../services/post.service';
import './EditComment.css';


const EditComment = ({ id, postId, content, modal, toggleModel }) => {

    const [editedComment, setEditedComment] = useState({
        editedContent: content,
    })

    const editCurrComment = async () => {
        try {
            await editComment(postId, id, editedComment.editedContent);
            notifySuccess('Comment edited successfully!');
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
                    <div className="edit-comment-page" onClick={(e) => e.stopPropagation()}>
                        <h1>Edit Comment</h1>

                        <div>
                            <label htmlFor="edit-content">Content:</label>
                            <textarea name="content" id="edit-content"
                                value={editedComment.editedContent}
                                onChange={(e) => setEditedComment({ ...editedComment, editedContent: e.target.value })} />
                        </div>
                        <div id='buttons-grid'>
                            <div id='class-buttons'>
                                <button onClick={editCurrComment}>Edit</button>
                                <button onClick={toggleModel}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

EditComment.propTypes = {
    id: PropTypes.string.isRequired,
    postId: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    modal: PropTypes.bool.isRequired,
    toggleModel: PropTypes.func.isRequired,
};

export default EditComment
