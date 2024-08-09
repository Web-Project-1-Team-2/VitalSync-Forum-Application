import PropTypes from 'prop-types';
import './UploadAvatar.css'
import { useState } from 'react';
import { deleteImage, uploadImage } from '../../../services/storage.service';
import { notifySuccess } from '../../../services/notification.service';
import { setImageUrl } from '../../../services/user.service';

const UploadAvatar = ({ avatar, uid, username, modal, toggleModel }) => {

    const [image, setImage] = useState(null);

    const uploadAndSetAvatar = async () => {
        if (!image) return;
        console.log(image);
        try {

            if(avatar !== '') {
                console.log('deleting');
                await deleteImage(username, uid);
            }
            const uploadedImage = await uploadImage(image, uid, username)
            await setImageUrl(username, uploadedImage);
            toggleModel();
            notifySuccess('Avatar uploaded successfully');
        } catch (error) {
            console.log(error);
            
        }
    }

    return (
        <>
            {modal && (
                <div className="overlay" onClick={toggleModel}>
                    <div className="edit-post" onClick={(e) => e.stopPropagation()}>
                        <h1 style={{ margin: '10px 0 10px 0' }}>Upload Avatar</h1>

                        <div className="file-upload-container">
                            <div id='upload'>
                                <label htmlFor="edit-content" className="file-label">Upload Picture:</label>
                                <input type="file" id="edit-content" className="file-input" onChange={(e) => setImage(e.target.files[0])}/>
                            </div>
                        </div>
                        <div id='buttons-grid'>
                            <div id='class-buttons'>
                                <button onClick={uploadAndSetAvatar}>Upload</button>
                                <button onClick={toggleModel}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

UploadAvatar.propTypes = {
    avatar: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    modal: PropTypes.bool.isRequired,
    toggleModel: PropTypes.func.isRequired,
};

export default UploadAvatar
