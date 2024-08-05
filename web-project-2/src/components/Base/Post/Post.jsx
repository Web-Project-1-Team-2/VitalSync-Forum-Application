import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const Post = ({id, title, author, content}) => {

    const navigate = useNavigate();

    return (
        <>
            <div className='post-box'>
                <div>
                    <div className='title-box'>
                        <h2>{title}</h2>
                        <h4> Author: {author}</h4>
                    </div>
                    <div className='content-box'>
                        <p>{content}</p>
                    </div>
                </div>
                <div id='details-btn'>
                    <button onClick={() => navigate(`/posts/${id}`)}> View Details</button>
                </div>
            </div>
        </>
    )
}

Post.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    content: PropTypes.string,
};

export default Post


{/* <div key={post.id} className='post-box'>
<div>
    <div className='title-box'>
        <h2>{post.title}</h2>
        <h4> Author: {post.author}</h4>
    </div>
    <div className='content-box'>
        <p>{post.content}</p>
    </div>
</div>
<div id='details-btn'>
    <button onClick={() => navigate(`/posts/${post.id}`)}> View Details</button>
</div>
</div> */}