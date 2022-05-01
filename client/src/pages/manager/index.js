import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';

import UsersList from './users/List';
import UserEdit from './users/Edit';

import BikesList from './bikes/List';
import BikeEdit from './bikes/Edit';

export default function ManagerUser() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Dashboard />} />

        <Route path='/users' element={<UsersList />} />
        <Route path='/users/add' element={<UserEdit />} />
        <Route path='/users/:id' element={<UserEdit />} />

        <Route path='/bikes' element={<BikesList />} />
        <Route path='/bikes/add' element={<BikeEdit />} />
        <Route path='/bikes/:id' element={<BikeEdit />} />

      </Routes>
    </>
  );
}
