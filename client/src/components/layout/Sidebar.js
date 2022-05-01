import { useSelector } from "react-redux";
import { useResolvedPath, useMatch, Link } from "react-router-dom";

const basicRoutes = [
  {
    title: 'Home',
    path: '/'
  },
  {
    title: 'My Reservations',
    path: '/reservations'
  },
];

const managerRoutes = [
  {
    title: 'Dashboard',
    path: '/'
  },
  {
    title: 'Users',
    path: '/users'
  },
  {
    title: 'Bikes',
    path: '/bikes'
  },
];

const SidebarLink = (props) => {
  const { pathname } = useResolvedPath(props.to);
  const match = useMatch({ path: pathname, end: true });

  return (
    <Link {...props} className={"block px-3 py-1" + (match ? ' font-bold' : '')} />
  )
};

export default function Sidebar() {

  const { user } = useSelector(state => state.user);
  const routes = user.role === 'manager' ? managerRoutes : basicRoutes;

  return (
    <nav className="w-48 bg-sky-900 text-white py-4 shrink-0">
      {routes.map(({ title, path }, i) => (
        <SidebarLink to={path} key={i}>- {title}</SidebarLink>
      ))}
    </nav>
  )
}
