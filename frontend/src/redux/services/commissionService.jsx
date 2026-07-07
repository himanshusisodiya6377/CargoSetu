import axios from "axios";
import { BACKEND_URL } from "../../utils/url";

const COMMISSION_URL = `${BACKEND_URL}/commission/`;

const getConfig = async () => {
  const response = await axios.get(`${COMMISSION_URL}config`);
  return response.data;
};

const updateConfig = async (percentage) => {
  const response = await axios.put(`${COMMISSION_URL}config`, { percentage }, { withCredentials: true });
  return response.data;
};

const getRevenue = async () => {
  const response = await axios.get(`${COMMISSION_URL}revenue`, { withCredentials: true });
  return response.data;
};

const commissionService = { getConfig, updateConfig, getRevenue };

export default commissionService;
