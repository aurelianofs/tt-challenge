import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector } from 'react-redux';

import GuestUser from './pages/guest';
import BasicUser from './pages/basic';
import ManagerUser from './pages/manager';

function App() {
  const { user } = useSelector((state) => state.user);

  return (
    <Router>
      {
        !user || !user.accessToken ?
          <GuestUser /> :
        user.role !== 'manager' ?
          <BasicUser /> :
          <ManagerUser />
      }
    </Router>
  );
}

export default App;
