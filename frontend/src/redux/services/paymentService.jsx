import axios from "axios";
import { BACKEND_URL } from "../../utils/url";

const PAYMENT_URL = `${BACKEND_URL}/payments/`;

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const createOrder = async (loadId) => {
  const response = await axios.post(
    `${PAYMENT_URL}create-order`,
    { loadId },
    { headers: authHeader(), withCredentials: true }
  );
  return response.data;
};

const verifyPayment = async (paymentData) => {
  const response = await axios.post(
    `${PAYMENT_URL}verify`,
    paymentData,
    { headers: authHeader(), withCredentials: true }
  );
  return response.data;
};

const getPaymentDetails = async (loadId) => {
  const response = await axios.get(
    `${PAYMENT_URL}load/${loadId}`,
    { headers: authHeader(), withCredentials: true }
  );
  return response.data;
};

const getPaymentHistory = async () => {
  const response = await axios.get(
    `${PAYMENT_URL}history`,
    { headers: authHeader(), withCredentials: true }
  );
  return response.data;
};

const paymentService = { createOrder, verifyPayment, getPaymentDetails, getPaymentHistory };

export default paymentService;