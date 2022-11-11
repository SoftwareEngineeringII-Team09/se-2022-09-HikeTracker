import { Routes, Route, useLocation } from 'react-router-dom';

import * as Layouts from '@layouts';
import * as Pages from '@pages';

const App = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route element={<Layouts.Visitors />}>
        <Route index path='/' element={<Pages.Home />} />
        <Route path='/browse' element={<Pages.BrowseHikes />} />
        <Route path='/browse/:hike' element={<Pages.Hike />} />
      </Route>
      <Route path='*' element={<Pages.Error />} />
    </Routes>
  );
}

export default App;
