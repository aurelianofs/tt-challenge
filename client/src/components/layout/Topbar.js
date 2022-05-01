import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from 'services/api';
import { setUser } from 'store/user.slice';

export default function Topbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <nav className="flex border-b">
      <button
        onClick={() => {
          logout();
          dispatch(setUser({}));
          navigate('/');
        }}
        className="ml-auto px-5 py-3"
      >
        Log Out
      </button>
    </nav>
  )
}
