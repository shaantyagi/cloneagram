import { Avatar } from '@material-ui/core';
import React from 'react';
import './Component.css';

function Posts({username, caption, image}) {
    return (
        <div className="posts__div">
           <div className="posts__head">
           <Avatar
            className="posts__avatar"
            src=""
            alt={username}
           />
           <h4>{username}</h4>
           </div>
           <img
            className="posts__image"
            src={image}
            alt="" />

    <h4 className="posts__caption"><b>{username}</b>{" "+caption}</h4>
        </div>
    )
}

export default Posts;
