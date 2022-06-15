import React, { useState } from "react";
import Constants from "./utitlties/Constants";
import PostCreateForm from './components/PostCreateForm'
import PostUpdateForm from "./components/PostUpdateForm";

export default function App() {

  const [posts, setPosts] = useState([]);

  const [showingCreateNewPostForm, setShowingCreateNewPostForm] = useState(false);
  const [postCurrentlyUpdated, setPostCurrentlyUpdated] = useState(null);

  function getPosts() {
    const url = Constants.API_URL_GET_ALL_POSTS;

    fetch(url, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(postsFromServer => {
        setPosts(postsFromServer);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  }

  function deletePost(postId) {
    const url = `${Constants.API_URL_DELETE_POST_BY_ID}/${postId}`;
    console.log(url);

    fetch(url, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(responseFromServer => {
        console.log(responseFromServer);
        onPostDeleted(postId);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  }

  return (
    <div className="container">
      <div className="row min-vh-100">
        <div className="col d-flex flex-column justify-content-center align-items-center">

          {(showingCreateNewPostForm === false && postCurrentlyUpdated === null) && (
            <div>
              <h1>.NET Core React.js CRUD</h1>

              <div className="mt-5">
                <button onClick={getPosts} className="btn btn-primary btn-lg w-100">Get Posts from server</button>
                <button onClick={() => { setShowingCreateNewPostForm(true) }} className="btn btn-success btn-lg w-100 mt-4">Create New Post</button>
              </div>
            </div>
          )}

          {(posts.length > 0 && showingCreateNewPostForm === false && postCurrentlyUpdated === null) && renderPostsTable()}

          {showingCreateNewPostForm && <PostCreateForm onPostCreated={onPostCreated} />}
          {postCurrentlyUpdated !== null && <PostUpdateForm post={postCurrentlyUpdated} onPostUpdated={onPostUpdated} />}
        </div>
      </div>
    </div>
  );

  function renderPostsTable() {
    return (
      <div className="table-responsive mt-5">
        <table className="table table-bordered border-dark">
          <thead>
            <tr>
              <th scope="col">PostId (PK)</th>
              <th scope="col">Title</th>
              <th scope="col">Content</th>
              <th scope="col">CRUD Operations</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.postId}>
                <th scope="row">{post.postId}</th>
                <td>{post.title}</td>
                <td>{post.content}</td>
                <td>
                  <button className="btn btn-outline-primary btn-lg mx-3 my-3" onClick={() => { setPostCurrentlyUpdated(post) }}>Update</button>
                  <button className="btn btn-danger btn-lg" onClick={() => { if (window.confirm(`Are you sure you want to delete the post titled "${post.title}?"`)) deletePost(post.postId) }}>Delete</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={() => setPosts([])} className="btn btn-dark">Empty React posts array</button>
      </div>
    );
  }

  function onPostCreated(createdPost) {
    setShowingCreateNewPostForm(false);

    if (createdPost === null) {
      return;
    }

    alert(`Post successfully created. After clicking OK, your new post titled "${createdPost.title}" will show in the table below.`);

    getPosts();
  }

  function onPostUpdated(updatedPost) {
    setPostCurrentlyUpdated(null);

    if (updatedPost === null) {
      return;
    }

    let postsCopy = [...posts];

    const index = postsCopy.findIndex((postsCopyPost, currentIndex) => {
      if (postsCopyPost.postId === updatedPost.postId) {
        return true;
      }
    });

    if (index !== -1) {
      postsCopy[index] = updatedPost;
    }

    setPosts(postsCopy);

    alert(`Post succcessfully updated. "${updatedPost.title}"`);
  }

  function onPostDeleted(deletedPostPostId) {
    let postsCopy = [...posts];

    const index = postsCopy.findIndex((postsCopyPost, currentIndex) => {
      if (postsCopyPost.postId === deletedPostPostId) {
        return true;
      }
    });

    if (index !== -1) {
      postsCopy.splice(index, 1)
    }

    setPosts(postsCopy);

    alert('Post successfully deleted.');
  }
}


