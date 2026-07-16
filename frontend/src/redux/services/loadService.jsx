import axios from "axios";
import { BACKEND_URL } from "../../utils/url";

const LOAD_URL = `${BACKEND_URL}/Loads/`;

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const createLoad = async (formData) =>{
  const response = await axios.post(LOAD_URL, formData, {
    headers: authHeader(),
    withCredentials: true,
  });
  return response.data;
};

const getLoads = async () =>{
  const response = await axios.get(LOAD_URL, {
    withCredentials: true,
  });
  return response.data;
};

const getUserLoads = async () =>{
  const response = await axios.get(`${LOAD_URL}user`, {
    headers: authHeader(),
    withCredentials: true,
  });
  return response.data;
};

export const getLoad = async (id) =>{

  const response = await axios.get(
    `${LOAD_URL}${id}`,
    { withCredentials: true }
  );

  return response.data;

};

const updateLoad = async (id, formData) =>{

  const response = await axios.patch(
    `${LOAD_URL}${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        ...authHeader(),
      },
      withCredentials: true,
    }
  );

  return response.data;

};

const deleteLoad = async (id) =>{
  const response = await axios.delete(`${LOAD_URL}${id}`, {
    headers: authHeader(),
    withCredentials: true,
  });
  return response.data;
};

const placeBid = async (id, amount) =>{
  const response = await axios.post(
    `${BACKEND_URL}/bidding/`,
    { loadId: id, amount },
    {
      headers: authHeader(),
      withCredentials: true,
    }
  );
  return response.data;
};

const getWonBids = async () =>{
  const response = await axios.get(
    `${BACKEND_URL}/bidding/won`,
    {
      headers: authHeader(),
      withCredentials: true,
    }
  );
  return response.data;
};

const updateTracking = async (loadId, status) =>{
  const response = await axios.patch(
    `${BACKEND_URL}/bidding/track`,
    { loadId, status },
    {
      headers: authHeader(),
      withCredentials: true,
    }
  );
  return response.data;
};

const getActiveLoads = async () =>{
  const response = await axios.get(`${LOAD_URL}active`, {
    headers: authHeader(),
    withCredentials: true,
  });
  return response.data;
};

const getCompletedLoads = async () =>{
  const response = await axios.get(`${LOAD_URL}completed`, {
    headers: authHeader(),
    withCredentials: true,
  });
  return response.data;
};

const BIDDING_URL = `${BACKEND_URL}/bidding/`;

const getMyBids = async () =>{
  const response = await axios.get(`${BIDDING_URL}my-bids`, {
    headers: authHeader(),
    withCredentials: true,
  });
  return response.data;
};

const updateBid = async (id, amount) =>{
  const response = await axios.patch(`${BIDDING_URL}${id}`, { amount }, {
    headers: authHeader(),
    withCredentials: true,
  });
  return response.data;
};

const deleteBid = async (id) =>{
  const response = await axios.delete(`${BIDDING_URL}${id}`, {
    headers: authHeader(),
    withCredentials: true,
  });
  return response.data;
};

const getAllLoadsAdmin = async () =>{
  const response = await axios.get(`${LOAD_URL}admin/all`, {
    headers: authHeader(),
    withCredentials: true,
  });
  return response.data;
};

const deleteLoadByAdmin = async (id) =>{
  const response = await axios.delete(`${LOAD_URL}admin/${id}`, {
    headers: authHeader(),
    withCredentials: true,
  });
  return response.data;
};

const deleteBidByAdmin = async (id) =>{
  const response = await axios.delete(`${BIDDING_URL}admin/${id}`, {
    headers: authHeader(),
    withCredentials: true,
  });
  return response.data;
};

const getLoadBids = async (loadId) =>{
  const response = await axios.get(`${BIDDING_URL}${loadId}`, { withCredentials: true });
  return response.data;
};

const loadService = {createLoad,getLoads,getUserLoads,getLoad,updateLoad,deleteLoad,placeBid, getWonBids, updateTracking, getActiveLoads, getCompletedLoads,getMyBids, updateBid, deleteBid,getAllLoadsAdmin, deleteLoadByAdmin, deleteBidByAdmin, getLoadBids};

export default loadService;