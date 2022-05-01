import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Reserve from './Reserve';
import ReservationList from './ReservationList';

export default function BasicUser() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/reserve/:bikeId' element={<Reserve />} />
        <Route path='/reservations' element={<ReservationList />} />
      </Routes>
    </>
  );
}
