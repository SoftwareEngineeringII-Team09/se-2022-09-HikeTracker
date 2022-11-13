import { Routes, Route, useLocation } from 'react-router-dom';

import * as Layouts from './layouts';
import * as Pages from './pages';

const App = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route element={<Layouts.Visitors />}>
        <Route index path='/' element={<Pages.Home />} />
      </Route>
      <Route element={<Layouts.Guides />}>
        <Route path='/hikes' element={<Pages.HikeList />} />
        <Route path='/hikes/add' element={<Pages.HikeForm />} />
        <Route path='/huts' element={<Pages.HutList />} />
        <Route path='/huts/add' element={<Pages.HutForm />} />
      </Route>
      <Route path='*' element={<Pages.Error />} />
    </Routes>
  );
}

export default App;
