import PropTypes from 'prop-types';

const Comment = ({author, content}) => {
    return (
        <>
            <div className='single-comment'>
                <h3>{author}</h3>
                <p>{content}</p>
            </div>
        </>
    )
}

Comment.propTypes = {
    id: PropTypes.string,
    author: PropTypes.string,
    content: PropTypes.string,
};

export default Comment
