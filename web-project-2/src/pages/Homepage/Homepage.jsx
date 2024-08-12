import "./Homepage.css";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/authContext";
import { useContext, useEffect, useState } from "react";
import { useListVals } from "react-firebase-hooks/database";
import { ref } from "firebase/database";
import { db } from "../../config/firebase-config";
import Post from "../../components/Base/Post/Post";

function Homepage() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [snapshots, loading] = useListVals(ref(db, "posts"));
  const [users, setUsers] = useState([]);
  const [snapshotsUsers, loadingUsers] = useListVals(ref(db, "users"));

  const handleLinkClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate("/login");
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

  console.log("!");

  return (
    <div className="homepage">
      {loading && <h2>Loading...</h2>}
      <div className="count">
        {loadingUsers && <h2>Loading...</h2>}
        Total posts at the moment:{posts.length} Total Users at the moment:
        {users.length}
      </div>
      <div className="top-grid">
        <NavLink to="/training" onClick={handleLinkClick}>
        <div className="image-container">
          <img
            src="/athlete.jpg"
            alt="Go to training picture"
            className="links"
          />
          <div className="hover-text">Go to Training Page</div>
          </div>
        </NavLink>
        <NavLink to="/nutrition" onClick={handleLinkClick}>
        <div className="image-container">
          <img
            src="/nutrition3.webp"
            alt="Go to nutrition picture"
            className="links"
          />
          <div className="hover-text">Go to Nutrition Page</div>
          </div>
        </NavLink>
        <NavLink to="/supplements" onClick={handleLinkClick}>
        <div className="image-container">
          <img
            src="/sup.jpg"
            alt="Go to supplements picture"
            className="links"
          />
          <div className="hover-text">Go to Supplements Page</div>
          </div>
        </NavLink>      
      </div>

      <div className="bottom-grid">
        <div>
          <h2>Most Liked</h2>
          <div id="most-liked">
          {posts.length !== 0 ? (
          posts
          .sort((a,b) =>( b.likes || 0) - (a.likes || 0))
          .slice(0, Math.min(posts.length, 10))
          .map((post) => ( <Post 
            key={post.id}
            id={post.id}
            title={post.title}
            author={post.author}
            content={post.content}
            likes={post.likes || 0}
            commentCount={post.commentCount || 0}
            creationDate={new Date(post.createdOn).toLocaleDateString()}
            category={post.category}         
          />))
        ) : (
          <h2>No posts found</h2>
        )}

          </div>
        </div>

        <div>
          <h2>Most Commented</h2>
          <div id="most commented">
          {posts.length !== 0 ? (
          posts
          .sort((a,b) => (b.commentCount || 0) - (a.commentCount || 0))
          .slice(0, Math.min(posts.length, 10))
          .map((post) => (<Post
            key={post.id}
            id={post.id}
            title={post.title}
            author={post.author}
            content={post.content}
            likes={post.likes || 0}
            commentCount={post.commentCount || 0}
            creationDate={new Date(post.createdOn).toLocaleDateString()}
            category={post.category} /> ))
        ) : (
          <h2>No posts found</h2>
        )}
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Homepage;
