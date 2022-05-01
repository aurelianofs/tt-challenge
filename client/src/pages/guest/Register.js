import PrimaryBtn from "components/PrimaryBtn";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "services/api";

const handleChange = setter => e => setter(e.target.value);

export default function Register() {
  const navigate = useNavigate();
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');

  const handleSubmit = (username, password) => async e => {
    e.preventDefault();
    const res = await signup(username, password);

    if(res.name === "AxiosError") return alert(res.response?.data?.message);

    navigate('/?registered');
  }

  return (
    <>
      <h1 className="text-3xl mb-8">Register to Bike Rentals VIP</h1>

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

        <PrimaryBtn>Register</PrimaryBtn>
      </form>

      <p className="mt-4">Are you a old user? <Link to="/" className="text-sky-600">Login here</Link></p>
    </>
  )
}
