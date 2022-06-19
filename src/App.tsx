import './App.css';
import React from 'react';
import logo from './assets/survey_logo.svg';
import user_icon from './assets/user_icon.svg';

import Respond from './components/Respond';
// import Mine from './components/Mine';

import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Create from './components/Create';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {/* <p>
            Do your surveys for free!
          </p> */}
          <div className="App-header-right">
            <Link className='link' to="/respond/15">Respond</Link>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
            <Link to="/mine">My Surveys</Link>
            <Link to="/create">Create Survey</Link>
            <img src={user_icon} className="user-icon" alt="user-icon" />
          </div>
        </header>
        <div className="container">
          <Routes>
            {/* TODO add all routes placeholders */}
            <Route path="/respond/:id" element={<Respond />} />
            <Route path="/create" element={<Create />} />
            {/* <Route path="/mine" element={<Mine />} /> */}
          </Routes>
          <div className="footer">
            This App was created with react and typescript! Copyright &copy; 2022
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
