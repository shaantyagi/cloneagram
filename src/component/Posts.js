import { Avatar, Button, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { useEffect, useState } from 'react';
import './Component.css';
import { db } from '../database/firebase';
import firebase from 'firebase/app';
import ReactPlayer from 'react-player';

function Posts({postId, signedUser, username, caption, data, isImage}) {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    useEffect(() => {
        let unsubscribe = db.collection('posts').doc(postId).collection('comments').orderBy('timestamp', 'asc').onSnapshot(snapshot => {
          setComments(snapshot.docs.map((doc) => ({
            id: doc.id,
            comment: doc.data()
          })
          ));
        });
        
        return () => {
            unsubscribe();
        }
      }, [postId]);

      const postComment = (e) => {
        e.preventDefault();
        db.collection("posts").doc(postId).collection('comments').add({
            text: comment,
            userName: signedUser.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
      }

      const commentDelete = (id) => {
        db.collection('posts').doc(postId).collection('comments').doc(id).get().then((doc) => {
            doc.ref.delete();
          });
      }

    return (
        <div className="posts__div">
           <div className="posts__head">
                <Avatar
                    className="posts__avatar"
                    src={username}
                    alt={username}
                />
                <h4>{username}</h4>
           </div>
           {isImage ? (
               <img
               className="posts__image"
               src={data}
               alt="" />
           ) : (<ReactPlayer object-fit='contain' width='500px' controls url={data}/>)}
            {caption && (
            <div className="posts__captionContainer">
                <h4><b>{username}</b></h4>
                <h4 className="posts__caption">{caption}</h4>
            </div>
            )}
            <div className="posts__commentBox">
                {comments.map(({ id, comment }) => (
                    <div className="posts__comment">
                        <p key={id} className="posts_commentText"><strong>{comment.userName}</strong> {comment.text}</p>
                        {comment.userName===signedUser?.displayName && (
                            <IconButton aria-label="delete" color="primary" className="posts_commentDelete" onClick={() => commentDelete(id)}>
                            <DeleteIcon />
                            </IconButton>
                        )}
                    </div>
                ))}
            </div>
            {signedUser && (
            <form className="posts__commentContainer" onSubmit={postComment}>
                <input className="posts__commentInput" placeholder="Add a comment..." onChange={(event) => setComment(event.target.value)} value={comment}/>
                <Button className="posts__commentButton" disabled={!comment} onClick={postComment}>Post</Button>
            </form>
            )}
        </div>
    )
}

export default Posts;
