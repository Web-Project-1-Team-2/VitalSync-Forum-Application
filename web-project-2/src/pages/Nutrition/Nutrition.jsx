import { useEffect, useState } from 'react';
import './Nutrition.css'
import { useListVals } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { db } from '../../config/firebase-config';
import PostLarge from '../../components/Base/Post/PostLarge';

function Nutrition() {
  const [posts,setPosts] = useState([]);
  const [snapshots,loading] = useListVals(ref(db, 'posts'));
 
  
  useEffect(() => {
    if (snapshots) {
      setPosts([...snapshots]);
    }
  }, [snapshots]);

    return (
      <div className="nutrition-container">
      
      <div className="top-grid">
      <img src="/nutrition3.webp" alt="Nutrition picture" className="image" />
        <div className="text">
          <h1>Everything you need to know about Nutrition</h1>
          {loading && <h2>Loading...</h2>}
          <h3>
          Here you will find information about quick and healthy recipes, 
              a lot of information about superfoods and much more.
              Feel free to Post, share and like!
          </h3>
        </div>
        <img src="/food-health.jpg" alt="Food picture" className="image" />
      </div>

      
      <div className="nutrition-grid">
        {posts.filter(post => post.category === 'nutrition').length !== 0 ? (
          posts
            .filter(post => post.category === 'nutrition')
            .map(post => (<PostLarge
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
      
    );
  }
  
  export default Nutrition;
