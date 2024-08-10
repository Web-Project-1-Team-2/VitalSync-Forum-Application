import { useListVals } from 'react-firebase-hooks/database';
import { useEffect, useState } from "react";
import { db } from "../../config/firebase-config";
import { ref } from 'firebase/database';
import './Posts.css';
import PostLarge from '../../components/Base/Post/PostLarge';


const Posts = () => {

    const [posts, setPosts] = useState([]);
    const [snapshots, loading] = useListVals(ref(db, 'posts'));

    const [searchTerm, setSearchTerm] = useState('');

    const [sortFilter, setSortFilter] = useState('');

    const [categoryFilter, setCategoryFilter] = useState({
        trainingAndSport: false,
        nutrition: false,
        supplements: false
    });

    useEffect(() => {
    if (!snapshots) return;
    
    setPosts([...snapshots]);
}, [snapshots])


    return (
        <div className='post-page'>
            <h1>Posts</h1>
            {loading && <h2>Loading...</h2>}

            <div className='post-grid'>
                <div id='post-list'>
                    {posts.length !== 0 ? (
                        posts
                            .filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()))
                            .sort((a, b) => {
                                if (sortFilter === 'createdOn') {
                                    return new Date(b[sortFilter]) - new Date(a[sortFilter]);
                                } else {
                                    return (b[sortFilter] || 0) - (a[sortFilter] || 0);
                                }
                            })
                            .filter(post => {
                                if (categoryFilter.trainingAndSport && post.category === 'training') {
                                    return true;
                                } else if (categoryFilter.nutrition && post.category === 'nutrition') {
                                    return true;
                                } else if (categoryFilter.supplements && post.category === 'supplements') {
                                    return true;
                                } else if (!categoryFilter.trainingAndSport && !categoryFilter.nutrition && !categoryFilter.supplements) {
                                    return true;
                                }
                            })
                            .map(post =>
                                <PostLarge
                                    key={post.id}
                                    id={post.id}
                                    title={post.title}
                                    author={post.author}
                                    content={post.content}
                                    likes={post.likes || 0}
                                    commentCount={post.commentCount || 0}
                                    creationDate={new Date(post.createdOn).toLocaleDateString()}
                                    category={post.category} />)

                    ) : (<h2>No posts found</h2>)}
                </div>

                <div id='filters'>
                    <h2>Filters</h2>
                    <div id='filter-grid'>
                        <div className='filter-search'>
                            <label htmlFor='search'>Search:</label>
                            <input type='text' id='search' onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className='filter-sort'>
                            <label htmlFor="filterOptions">Sort By: </label>
                            <select id="filterOptions" name="filterOptions" onChange={(e) => setSortFilter(e.target.value)}>
                                <option value="">All Posts</option>
                                <option value="likes">Most Liked</option>
                                <option value="commentCount">Most Commented</option>
                                <option value="createdOn">Recently Created</option>
                            </select>
                        </div>
                        <div className='filter-checkbox'>
                            <label htmlFor='filterOptions'>Category:</label>
                            <div id='filter-checkboxes'>
                                <div>
                                    <input
                                        type='checkbox'
                                        id='training-and-sport'
                                        name='training-and-sport'
                                        checked={categoryFilter.trainingAndSport}
                                        onChange={(e) => setCategoryFilter({ ...categoryFilter, trainingAndSport: e.target.checked })} />
                                    <label htmlFor='training-and-sport'>Training and Sport</label>
                                </div>
                                <div>
                                    <input
                                        type='checkbox'
                                        id='nutrition'
                                        name='nutrition'
                                        checked={categoryFilter.nutrition}
                                        onChange={(e) => setCategoryFilter({ ...categoryFilter, nutrition: e.target.checked })} />
                                    <label htmlFor='nutrition'>Nutrition</label>
                                </div>
                                <div>
                                    <input
                                        type='checkbox'
                                        id='supplements'
                                        name='supplements'
                                        checked={categoryFilter.supplements}
                                        onChange={(e) => setCategoryFilter({ ...categoryFilter, supplements: e.target.checked })} />
                                    <label htmlFor='supplements'>Supplements</label>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Posts


