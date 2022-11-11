import { Routes, Route, useLocation } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom'
import { useState } from "react";

import AuthContext from './context/authContext';
import * as Layouts from './layouts';
import * as Pages from './pages';

const App = () => {
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <AuthContext.Provider value={loggedIn}>
      <BrowserRouter>
        <Routes location={location} key={location.pathname}>
          <Route element={<Layouts.Visitors />}>
            <Route index path='/' element={<Pages.Home />} />
            <Route path='/signup' element={<Pages.Registration />} />
            <Route path='/login' element={<Pages.Login setLoggedIn={setLoggedIn} />} />
            <Route path='*' element={<Pages.Error />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
