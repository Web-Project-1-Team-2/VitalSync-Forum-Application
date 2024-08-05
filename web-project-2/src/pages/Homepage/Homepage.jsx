import './Homepage.css';
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/authContext';
import { useContext, useEffect, useState } from 'react';
import { useListVals } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { db } from '../../config/firebase-config';


function Homepage() {
    const { user } = useContext(AppContext);
    const navigate = useNavigate();
    const [posts,setPosts] = useState([]);
    const [snapshots,loading] = useListVals(ref(db, 'posts'));
    const [users, setUsers] = useState([]);
    const [snapshotsUsers,loadingUsers] = useListVals(ref(db, 'users'));

    const handleLinkClick = (e) => {
        if (!user) {
            e.preventDefault();
            navigate('/login');
        }
    };
    useEffect(() => {
        if (snapshots) {
          setPosts([...snapshots]);
        }
      }, [snapshots]);

      useEffect(() => {
        if (snapshotsUsers) {
          setUsers([...snapshotsUsers]);
        }
      }, [snapshotsUsers]);

    console.log('!');

    return (
        <div className="homepage">
            <div className='top-grid'>
            <NavLink to='/training' onClick={handleLinkClick}>
                <img src='/athlete.jpg' alt='Go to training picture' className="links" />
            </NavLink>
            <NavLink to='/nutrition' onClick={handleLinkClick}>
                <img src='/nutrition3.webp' alt='Go to nutrition picture' className="links" />
            </NavLink>
            <NavLink to='/supplements' onClick={handleLinkClick}>
                <img src='/supplements.png' alt='Go to supplements picture' className="links" />
            </NavLink>
            </div>
            <>{posts.length} {users.length}</>
            <div className="bottom-grid">
        {posts.length !== 0 ? (
          posts
            .map(post => (
              <div key={post.id} className="post-box">
                <div>
                  <div className="title-box">
                    <h2>{post.title}</h2>
                    <h4>Author: {post.author}</h4>
                  </div>
                  <div className="content-box">
                    <p>{post.content}</p>
                  </div>
                </div>
                <div id="details-btn">
                  <button onClick={() => navigate(`/posts/${post.id}`)}>
                    View Details
                  </button>
                </div>
              </div>
            ))
        ) : (
          <h2>No posts found</h2>
        )}
      </div>
        </div>
    )
}

export default Homepage
