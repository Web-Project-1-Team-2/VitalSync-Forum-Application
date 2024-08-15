import { useEffect, useState } from "react";
import "./Training.css";
import { useListVals } from "react-firebase-hooks/database";
import { db } from "../../config/firebase-config";
import { ref } from "firebase/database";

import PostLarge from "../../components/Base/Post/PostLarge";

function Training() {
  const [posts, setPosts] = useState([]);
  const [snapshots, loading] = useListVals(ref(db, "posts"));

  useEffect(() => {
    if (snapshots) {
      setPosts([...snapshots]);
    }
  }, [snapshots]);

  return (
    <div className="training-container">
      <div className="top-grid">
        <img src="/athlete.jpg" alt="Training" className="image" />
        <div className="text">
          <h1>Everything you need to know about Training</h1>
          {loading && <h2>Loading...</h2>}
          <h3>
            Here you will find information about training programs, different
            exercises, and topics from the top coaches in the fitness industry.
            Feel free to post, share and like!
          </h3>
        </div>
        <img src="/training2.avif" alt="Training" className="image" />
      </div>

      <div className="training-grid">
        {posts.filter((post) => post.category === "training").length !== 0 ? (
          posts
            .filter((post) => post.category === "training")
            .map((post) => (
              <PostLarge
                key={post.id}
                id={post.id}
                title={post.title}
                author={post.author}
                content={post.content}
                likes={post.likes || 0}
                commentCount={post.commentCount || 0}
                creationDate={new Date(post.createdOn).toLocaleDateString()}
                category={post.category}
              />
            ))
        ) : (
          <h2>No posts found</h2>
        )}
      </div>
    </div>
  );
}

export default Training;
