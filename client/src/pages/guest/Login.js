import PrimaryBtn from "components/PrimaryBtn";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { login } from "services/api";
import { setUser } from "store/user.slice";

const handleChange = setter => e => setter(e.target.value);

export default function Login() {
  const dispatch = useDispatch();
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');

  const registered = (new URLSearchParams(document.location.search)).get('registered');

  const handleSubmit = (username, password) => async e => {
    e.preventDefault();
    const user = await login(username, password);

    dispatch(setUser(user));
  }

  return (
    <>
      <h1 className="text-3xl mb-5">Login to Bike Rentals VIP</h1>

      { registered !== null ? (
        <p className="my-4">You are now registered.</p>
      ) : null }

      <form onSubmit={handleSubmit(username, password)}>
        <div className="mb-4">
          <label className="block mb-2">Username:</label>
          <input
            type="text"
            name="username"
            required
            value={username}
            onChange={handleChange(setUsername)}
            className="rounded-md border px-4 py-1 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Password:</label>
          <input
            type="password"
            name="password"
            autoComplete="on"
            required
            value={password}
            onChange={handleChange(setPassword)}
            className="rounded-md border px-4 py-1 w-full"
          />
        </div>

        <PrimaryBtn>Login</PrimaryBtn>
      </form>

      <p className="mt-4">Are you a new user? <Link to="/register" className="text-sky-600">Register here</Link></p>
    </>
  )
}
