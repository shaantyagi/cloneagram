import './App.css';
import logo from './Images/instagram-logo.png';
import Posts from './component/Posts';

function App() {
  return (
    <div className="App">
      <div>
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="app-logo"
        />
        <Posts />
        
      </div>
    </div>
  );
}

export default App;
