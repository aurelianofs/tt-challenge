import axios from "axios";

const basePath = process.env.REACT_APP_API_HOST;

// Authentication
const authHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.accessToken) {
    return { 'x-access-token': user.accessToken };
  } else {
    return {};
  }
};

export const signup = (username, password) => {
  return axios.post(`${basePath}/auth/signup`, {
    username,
    password
  });
};

export const login = async (username, password) => {
  try {

    const { data: user } = await axios.post(`${basePath}/auth/login`, {
      username,
      password
    });

    localStorage.setItem("user", JSON.stringify(user));
    return user;

  } catch (error) {
    console.log(error);
  }
};

export const logout = () => {
  localStorage.removeItem("user");
};

const apiCall = method => async (path, params = {}, payload) => {
  try {
    const args = []
    args.push(`${basePath}/${path}`);
    if(payload) args.push(payload);
    args.push({ ...params, headers: authHeader() });

    const response = await axios[method](...args);

    return response.data;

  } catch (error) {
    return error;
  }
};

const apiGet = apiCall('get');
const apiPost = apiCall('post');
const apiDelete = apiCall('delete');

// Bikes
export const getBikes = async (query) => {
  return apiGet('bikes', { params: query });
};

export const getBike = async (id) => {
  return apiGet(`bikes/${id}`);
};

export const updateBike = async (id, bike) => {
  return apiPost(`bikes/${id}`, {}, bike);
};

export const createBike = async (bike) => {
  return apiPost(`bikes/create`, {}, bike);
};

export const deleteBike = async (id) => {
  return apiDelete(`bikes/${id}`);
};

export const getBikesColors = async () => {
  return apiGet('bikes/colors');
};

export const getBikesModels = async () => {
  return apiGet('bikes/models');
};

export const rateBike = async (id, rating) => {
  return apiPost(`bikes/${id}/rate/${rating}`, {}, {});
};

export const reserveBike = async (id, from, to) => {
  return apiPost(`bikes/${id}/reserve/${from}/${to}`, {}, {});
};

// Locations
export const getLocations = async () => {
  return apiGet('locations');
};

// Reservations
export const getReservations = async (query) => {
  return apiGet('reservations', { params: query });
};

export const deleteReservation = async (id) => {
  return apiDelete(`reservations/${id}`);
};

// Roles
export const getRoles = async () => {
  return apiGet('roles');
};

// Users
export const getUsers = async (query) => {
  return apiGet('users', { params: query });
};

export const getUser = async (id) => {
  return apiGet(`users/${id}`);
};

export const updateUser = async (id, user) => {
  return apiPost(`users/${id}`, {}, user);
};

export const createUser = async (user) => {
  return apiPost(`users/create`, {}, user);
};

export const deleteUser = async (id) => {
  return apiDelete(`users/${id}`);
};


const api = {
  signup,
  logout,
  login
};

export default api;
