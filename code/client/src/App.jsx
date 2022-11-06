import { Routes, Route, useLocation } from 'react-router-dom';

import * as Pages from './pages';

import { BaseLayout } from './layouts';

const App = () => {
  const location = useLocation();


  return (
    <Routes location={location} key={location.pathname}>
      <Route element={<BaseLayout />}>
        <Route index path='/' element={<Pages.Home />} />
        <Route path='*' element={<Pages.Error />} />
      </Route>
    </Routes>
  );
}

export default App;
