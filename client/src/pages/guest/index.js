import { Routes, Route } from 'react-router-dom';
import Login from "./Login";
import Register from "./Register";
import GuestFormPageWrapper from 'components/GuestFormPageWrapper';

export default function GuestUser() {
  return (
    <GuestFormPageWrapper>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </GuestFormPageWrapper>
  );
}
