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
        <Route path='/hikes' element={<Pages.BrowseHikes />} />
        <Route path='/hikes/:hikeId' element={<Pages.Hike />} />
        <Route element={<ProtectedRoute requiresLogin redirectPath='/login' />}>
          <Route path='/huts' element={<Pages.SearchHuts />} />
          <Route path='/huts/:hutId' element={<Pages.Hut />} />
          <Route path='/hikes/completed' element={<Pages.CompletedHikes />} />
        </Route>
        <Route element={<ProtectedRoute requiresNoLogin={true} />}>
          <Route path='/signup' element={<Pages.Authentication.Signup />} />
          <Route path='/login' element={<Pages.Authentication.Login />} />
          <Route path='/activate' element={<Pages.Authentication.ActivateAccount />} />
        </Route>
        <Route element={<ProtectedRoute requiredRole="Local Guide" redirectPath='/login' />}>
          <Route path='/account/hikes' element={<Pages.LocalGuide.Hikes.List />} />
          <Route path='/account/hikes/add' element={<Pages.LocalGuide.Hikes.Add />} />
          <Route path='/account/hikes/:hikeId/update/endpoints' element={<Pages.LocalGuide.Hikes.UpdateEndpoints />} />
          <Route path='/account/hikes/:hikeId/update/reference-points' element={<Pages.LocalGuide.Hikes.UpdateReferencePoints />} />
          <Route path='/account/hikes/:hikeId/update/linked-huts' element={<Pages.LocalGuide.Hikes.UpdateLinkedHuts />} />
          <Route path='/account/huts' element={<Pages.LocalGuide.Huts.List />} />
          <Route path='/account/huts/add' element={<Pages.LocalGuide.Huts.Add />} />
          <Route path='/account/parking-lots/add' element={<Pages.LocalGuide.ParkingLots.Add />} />
        </Route>
      </Route>
      <Route path='*' element={<Pages.Error />} />
    </Routes>
  );
}

export default App;
