import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import { ToastContainer } from 'react-toastify';
import { ToastContainer } from "../node_modules/react-toastify/dist/react-toastify";
import { BrowserRouter } from 'react-router-dom';
import { useState } from "react";

import AuthContext from './context/authContext';
import './scss/index.scss';
// import '../node_modules/react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

const LoginContextApp = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <AuthContext.Provider value={loggedIn}>
      <BrowserRouter>
        <App setLoggedIn={setLoggedIn} />
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

root.render(
  <React.StrictMode>
    <ToastContainer newestOnTop={false} />
    <LoginContextApp />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
