import { Button, CircularProgress } from '@material-ui/core'
import React, { useState } from 'react';
import {db, storage } from '../database/firebase';
import firebase from 'firebase/app';
import './Component.css';

function Uploader({userName}) {
    const[caption, setCaption] = useState('');
    const[data, setData] = useState(null);
    const[progress, setProgress] = useState(0);
    const[spinner, setSpinner] = useState(false);
    const[file, setFile] = useState(false);
    
    const handleChange = (e) => {
        if(e.target.files[0]){
            if(100000 < e.target.files[0].size < 20000000){
                let allid=e.target.files[0].name?.split('.');
                let type = allid[allid.length-1];
                if(isFileUnaccepted(type)){
                    alert("File format is not accepted. Please select an image or a video")
                }
                else{
                    setData(e.target.files[0]);
                    setFile(isFileImage(type));
                }
            }   
            else
                alert("File size is too big");
        } 
    };

    const isFileImage = (type) => {
        const acceptedImageTypes = ['gif', 'jpeg', 'png', 'jpg', 'bmp', 'svg', 'webp'];
        return acceptedImageTypes.includes(type);
    }

    const isFileUnaccepted = (type) => {
        const unacceptedFileTypes = ['doc', 'pdf', '7z', 'zip', 'rpm', 'rar', 'pkg', 'gz', 'arj', 'deb', 'iso', 'bin', 'dmg', 'vcd',
        'csv', 'dat', 'xml', 'db', 'log', 'sql', 'tar', 'email', 'vcf', 'emlx', 'apk', 'bat', 'bin', 'exe', 'jar', 'wsf', 'py', 'gadget',
        'js', 'rss', 'xhtml', 'html', 'css', 'java', 'asp', 'jsp', 'c', 'swift', 'cpp', 'class'];
        return unacceptedFileTypes.includes(type);
    }

    const handleUpload = () => {
        setSpinner(true);

        const uploadProgress = storage.ref(`data/${data.name}`).put(data);
        uploadProgress.on("state_changed", 
        (snapshot) => {
            const cProgress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
            setProgress(cProgress);
        },
        (error) => {
            alert(error.message);
        },
        () => {
            storage.ref("data").child(data.name).getDownloadURL()
            .then(
                (url) => {
                    db.collection("posts").add({
                        caption: caption,
                        data: url,
                        userName: userName,
                        isImage: file,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
            );
            setCaption("");
            setData(null);
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
            <Button disabled={!data} onClick={handleUpload}>Upload</Button>
            {spinner ? 
            (<CircularProgress variant="static" value={progress} />) : 
            ("")}
        </div>
    )
}

export default Uploader;
