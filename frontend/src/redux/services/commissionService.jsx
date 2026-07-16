import axios from "axios";
import { BACKEND_URL } from "../../utils/url";

const COMMISSION_URL = `${BACKEND_URL}/commission/`;

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getConfig = async () => {
  const response = await axios.get(`${COMMISSION_URL}config`);
  return response.data;
};

const updateConfig = async (percentage) => {
  const response = await axios.put(`${COMMISSION_URL}config`, { percentage }, {
    headers: authHeader(),
    withCredentials: true,
  });
  return response.data;
};

const getRevenue = async () => {
  const response = await axios.get(`${COMMISSION_URL}revenue`, {
    headers: authHeader(),
    withCredentials: true,
  });
  return response.data;
};

const commissionService = { getConfig, updateConfig, getRevenue };

export default commissionService;
