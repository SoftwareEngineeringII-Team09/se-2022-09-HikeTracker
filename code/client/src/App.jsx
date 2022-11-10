import { Routes, Route, useLocation } from 'react-router-dom';

import * as Layouts from './layouts';
import * as Pages from './pages';

const App = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route element={<Layouts.Visitors />}>
        <Route index path='/' element={<Pages.Home />} />
        <Route index path='/signup' element={<Pages.Registration />} />
        <Route index path='/login' element={<Pages.Login />} />
        <Route path='*' element={<Pages.Error />} />
      </Route>
    </Routes>
  );
}

export default App;
