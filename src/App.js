import './App.css';
import Posts from './component/Posts';
import Uploader from './component/Uploader';
import React, { useEffect, useState } from 'react';
import { db, auth } from './database/firebase';
import { Button, Input, makeStyles, Modal } from '@material-ui/core';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [openSignup, setopenSignup] = useState(false);
  const [openSignin, setopenSignin] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map((doc) => ({
        id: doc.id,
        post: doc.data()
      })
      ));
    })
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((aUser) => {
      if(aUser){
        //console.log(aUser);
        setUser(aUser);
      }
      else{
        setUser(null);
      }
    })
    return() => {
      unsubscribe();
    }
  }, [user, username]);

  const signUp = (e) => {
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((aUser) => {
      return aUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));
    setopenSignup(false);
  }

  const signin = (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));
    setopenSignin(false);
  }

  return (
    <div className="App">
      <div>
        <div className="app__imageContainer">
          <img
            className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="app-logo"
          />
          <div className="app__sign">
            {user ? 
            (<Button type="button" onClick={() => auth.signOut()}>Log Out</Button>) : 
            (<div>
                <Button onClick={() => setopenSignin(true)}>Sign In</Button>
                <Button onClick={() => setopenSignup(true)}>Sign Up</Button>
              </div>
            )}
          </div>
        </div>
        <Modal
            open={openSignin}
            onClose={() => setopenSignin(false)}
          >
            <div style={modalStyle} className={classes.paper}>
              <form className="app__form" onSubmit={signin}>
                <center>
                  <h2>Sign In</h2>
                </center>
              <Input 
                placeholder="E-Mail"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}/>
              <Input 
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}/>
              <Button type="submit">OK</Button>
              </form>
            </div>
        </Modal>
        <Modal
            open={openSignup}
            onClose={() => setopenSignup(false)}
          >
            <div style={modalStyle} className={classes.paper}>
              <form className="app__form" onSubmit={signUp}>
                <center>
                  <h2>Sign Up</h2>
                </center>
              <Input 
                placeholder="E-Mail"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}/>
              <Input 
                placeholder="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}/>
              <Input 
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}/>
              <Button type="submit">OK</Button>
              </form>
            </div>
        </Modal>
        {posts.map(({ id, post }) => (
          <Posts key={id} username={post.userName} image={post.image} caption={post.caption} />
        ))}
      </div>
      {user?.displayName ? 
        (<Uploader userName={user.displayName}/>) : 
        (<center>
          <h2>Login to Upload</h2>
          </center>)}
    </div>
  );
}

export default App;
