import { Routes, Route, useLocation } from 'react-router-dom';

import * as Layouts from '@layouts';
import * as Pages from '@pages';

const App = (props) => {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route element={<Layouts.Visitors />}>
        <Route index path='/' element={<Pages.Home />} />
        <Route path='/signup' element={<Pages.Registration />} />
        <Route path='/login' element={<Pages.Login />} />
        <Route path='/activate' element={<Pages.ActivateAccount />} />
        <Route path='/browse' element={<Pages.BrowseHikes />} />
        <Route path='/browse/:hikeId' element={<Pages.Hike />} />
        <Route path='/add-parking-lot' element={<Pages.LocalGuide.AddParkingLot />} />
      </Route>
      <Route path='*' element={<Pages.Error />} />
    </Routes>
  );
}

export default App;
