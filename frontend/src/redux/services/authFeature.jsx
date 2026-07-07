import axios from "axios";
import { BACKEND_URL } from "../../utils/url";

export const AUTH_URL = `${BACKEND_URL}/users/`;

const register = async (userData) =>{
  const response = await axios.post(`${AUTH_URL}register`, userData,{
    withCredentials:true,
  });
  return response.data;
};

const login = async (userData) =>{
  const response = await axios.post(`${AUTH_URL}login`, userData,{
    withCredentials:true,
  });
   if (response.data.token) {
    localStorage.setItem("token", response.data.token); 
  }
  return response.data;
};

const logout = async () =>{
  const response = await axios.get(
    `${AUTH_URL}logout`,
    {
      withCredentials: true,
    }
  );

  localStorage.removeItem("token");

  return response.data;
};

const getLoginStatus = async () =>{
  const response = await axios.get(
    `${AUTH_URL}loggedin`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

const getUserProfile = async () =>{
  const token = localStorage.getItem("token");   // get stored token

  const response = await axios.get(`${AUTH_URL}getuser`, {
    headers: {
      Authorization: `Bearer ${token}`,   // send token
    },
    withCredentials: true,
  });

  return response.data;
};

const loginUserAsSeller = async (userData) =>{
  const response = await axios.post(
    `${AUTH_URL}sender`,
    userData,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

const getCurrentUser = async () =>{
  const token = localStorage.getItem("token");

  const response = await axios.get(`${AUTH_URL}me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return response.data;
};

const getAllUser = async () =>{
   const token = localStorage.getItem("token");
  const response = await axios.get(`${AUTH_URL}users`, {headers: {
      Authorization: `Bearer ${token}`,        
    },
    withCredentials: true,
  });
  // console.log("API RESPONSE:", response.data); 
  return response.data;
};

const updateProfile = async (userData) =>{
  const token = localStorage.getItem("token");
  const response = await axios.put(`${AUTH_URL}update`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
};

const deleteUser = async (id) =>{
  const response = await axios.delete(`${AUTH_URL}${id}`, { withCredentials: true });
  return response.data;
};

const becomeSender = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${AUTH_URL}become-sender`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    }
  );
  return response.data;
};

const authService ={register,login,logout,getCurrentUser,getLoginStatus,getUserProfile,loginUserAsSeller,getAllUser,updateProfile,deleteUser,becomeSender};

export default authService;