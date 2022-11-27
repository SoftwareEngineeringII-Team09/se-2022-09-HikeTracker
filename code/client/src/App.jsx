import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/features/ProtectedRoute/ProtectedRoute';

import * as Layouts from '@layouts';
import * as Pages from '@pages';

const App = (props) => {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route element={<Layouts.Visitors />}>
        <Route element={<ProtectedRoute requiresNoLogin={true} />}>
          <Route path='/signup' element={<Pages.Registration />} />
          <Route path='/login' element={<Pages.Login />} />
          <Route path='/activate' element={<Pages.ActivateAccount />} />
        </Route>
        <Route index path='/' element={<Pages.Home />} />
        <Route path='/browse' element={<Pages.BrowseHikes />} />
        <Route path='/browse/:hikeId' element={<Pages.Hike />} />
        <Route path='/add-parking-lot' element={<Pages.LocalGuide.AddParkingLot />} />
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
