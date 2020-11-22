import { Button, CircularProgress } from '@material-ui/core'
import React, { useState } from 'react';
import {db, storage } from '../database/firebase';
import firebase from 'firebase';
import './Component.css';

function Uploader({userName}) {
    const[caption, setCaption] = useState('');
    const[image, setImage] = useState(null);
    const[progress, setProgress] = useState(0);
    const[spinner, setSpinner] = useState(false);

    const handleChange = (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        setSpinner(true);
        const uploadProgress = storage.ref(`images/${image.name}`).put(image);
        uploadProgress.on("state_changed", 
        (snapshot) => {
            const cProgress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
            setProgress(cProgress);
        },
        (error) => {
            alert(error.message);
        },
        () => {
            storage.ref("images").child(image.name).getDownloadURL()
            .then(
                (url) => {
                    db.collection("posts").add({
                        caption: caption,
                        image: url,
                        userName: userName,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
            );
            setCaption("");
            setImage(null);
            setProgress(0);    
        });
    };
    return (
        <div className="uploader__container">
            <center>
                <h2>Upload</h2>
            </center>
            <input type="text" placeholder="Enter Caption" onChange={(event) => setCaption(event.target.value)} value={caption}/>
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>Upload</Button>
            {spinner ? 
            (<CircularProgress variant="static" value={progress} />) : 
            ("")}
        </div>
    )
}

export default Uploader;
