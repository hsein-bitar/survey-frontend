import './App.css';
import React, { useEffect, useState } from 'react';
import logo from './assets/survey_logo.svg';
import user_icon from './assets/user_icon.svg';

import Respond from './components/Respond';
import Create from './components/Create';
import Login from './components/Login';
import Register from './components/Register';
import Mine from './components/Mine';
import {
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";
import Results from './components/Results';

function App() {
  let [userToken, setUserToken] = useState('');
  let location = useLocation().pathname.slice(1);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {/* <p>
            Do your surveys for free!
          </p> */}
        <div className="App-header-right">
          {/* TODO make this respond path dunamic with a small input */}
          {!userToken && <Link className={`${location === 'register' ? 'active' : ''}`} to="/register">Register</Link>}
          {!userToken && <Link className={`${location === 'login' ? 'active' : ''}`} to="/login">Login</Link>}
          {userToken && <Link className={`${location === 'respond' ? 'active' : ''}`} to="/respond/15">Respond</Link>}
          {userToken && <Link className={`${location === 'create' ? 'active' : ''}`} to="/create">Create Survey</Link>}
          {userToken && <Link className={`${location === 'mine' ? 'active' : ''}`} to="/mine">My Surveys</Link>}
          <img src={user_icon} className={`user-icon ${userToken ? 'user-active' : ''}`} alt="user-icon" />
        </div>
      </header>
      <div className="container">
        <Routes>
          {<Route path="/login" element={<Login userToken={userToken} setUserToken={setUserToken} />} />}
          {<Route path="/register" element={<Register userToken={userToken} setUserToken={setUserToken} />} />}
          {<Route path="/respond/:id" element={<Respond userToken={userToken} />} />}
          {<Route path="/create" element={<Create userToken={userToken} />} />}
          {<Route path="/mine" element={<Mine userToken={userToken} />} />}
          {<Route path="/results/:id" element={<Results userToken={userToken} />} />}
        </Routes>
        <div className="footer">
          This App was created with react and typescript! Copyright &copy; 2022
        </div>
      </div>
    </div >
  );
}

export default App;
