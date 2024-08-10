import { useEffect, useState } from "react";
import "./Supplements.css";
import { useListVals } from "react-firebase-hooks/database";
import { ref } from "firebase/database";
import { db } from "../../config/firebase-config";
import PostLarge from "../../components/Base/Post/PostLarge";

function Supplements() {
  const [posts, setPosts] = useState([]);
  const [snapshots, loading] = useListVals(ref(db, "posts"));


  useEffect(() => {
    if (snapshots) {
      setPosts([...snapshots]);
    }
  }, [snapshots]);

  return (
    <div className="supplements-container">
      <div className="top-grid">
        <img
          src="/supplements.png"
          alt="Supplement picture"
          className="image"
        />
        <div className="text">
          <h1>Everything you need to know about Supplements</h1>
          {loading && <h2>Loading...</h2>}
          <h3>
            Here you will find information about all the top supplements on the
            market, also dosages, effects and a lot of studies. Feel free to
            Post, share and like!
          </h3>
        </div>
        <img src="/supplements2.webp" alt="Food picture" className="image" />
      </div>

      <div className="supplements-grid">
        {posts.filter((post) => post.category === "supplements").length !==
        0 ? (
          posts
            .filter((post) => post.category === "supplements")
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

export default Supplements;
