import { ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useListVals } from "react-firebase-hooks/database";
import { useNavigate } from "react-router-dom"
import { db } from "../../config/firebase-config";
import { constrains } from "../../common/constrains";

function MostCommented() {
    const navigate = useNavigate();
    const [posts,setPosts] = useState([]);
    const [snapshots, loading] = useListVals(ref(db, "posts"));

    useEffect(() => {
        if (snapshots) {
          setPosts([...snapshots]);
        }
      }, [snapshots]);

    return (
        <div className="bottom-grid">
        {posts.length !== 0 ? (
          posts
          .filter((post) => post.commentCount > constrains.MOST_COMMENTED_MIN_COMMENTS)
          .map((post) => (
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
    )
}

export default MostCommented
