import { Routes, Route, useLocation } from 'react-router-dom';
import * as Layouts from './layouts';
import * as Pages from './pages';

const App = (props) => {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route element={<Layouts.Visitors />}>
        <Route index path='/' element={<Pages.Home />} />
        <Route path='/signup' element={<Pages.Registration />} />
        <Route path='/login' element={<Pages.Login setLoggedIn={props.setLoggedIn} />} />
      </Route>
      <Route path='*' element={<Pages.Error />} />
    </Routes>
  );
}

export default App;
