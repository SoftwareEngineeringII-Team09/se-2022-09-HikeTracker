import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/features/ProtectedRoute/ProtectedRoute';

import { Layout } from '@layouts';
import * as Pages from '@pages';

const App = () => {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route element={<Layout />}>
        <Route index path='/' element={<Pages.Home />} />
        <Route path='/browse' element={<Pages.BrowseHikes />} />
        <Route path='/browse/:hikeId' element={<Pages.Hike />} />
        <Route element={<ProtectedRoute requiredRole="Hiker" redirectPath='/login' />}>
          <Route path='/search' element={<Pages.SearchHuts />} />
          <Route path='/search/:hutId' element={<Pages.Hut />} />
        </Route>
        <Route element={<ProtectedRoute requiresNoLogin={true} />}>
          <Route path='/signup' element={<Pages.Registration />} />
          <Route path='/login' element={<Pages.Login />} />
          <Route path='/activate' element={<Pages.ActivateAccount />} />
        </Route>
        <Route element={<ProtectedRoute requiredRole="Local Guide" redirectPath='/login' />}>
          <Route path='/add-parking-lot' element={<Pages.LocalGuide.AddParkingLot />} />
          <Route path='/reference-points/:hikeId' element={<Pages.LocalGuide.ReferencePoints />} />
          <Route path='/hikes/add' element={<Pages.HikeForm />} />
          <Route path='/hikes' element={<Pages.HikeList />} />
          <Route path='/huts/add' element={<Pages.HutForm />} />
          <Route path='/huts' element={<Pages.HutList />} />
        </Route>
      </Route>
      <Route path='*' element={<Pages.Error />} />
    </Routes>
  );
}

export default App;
