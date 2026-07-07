import axios from "axios";
import { BACKEND_URL } from "../../utils/url";

const PAYMENT_URL = `${BACKEND_URL}/payments/`;

const createOrder = async (loadId) => {
  const response = await axios.post(
    `${PAYMENT_URL}create-order`,
    { loadId },
    { withCredentials: true }
  );
  return response.data;
};

const verifyPayment = async (paymentData) => {
  const response = await axios.post(
    `${PAYMENT_URL}verify`,
    paymentData,
    { withCredentials: true }
  );
  return response.data;
};

const getPaymentDetails = async (loadId) => {
  const response = await axios.get(
    `${PAYMENT_URL}load/${loadId}`,
    { withCredentials: true }
  );
  return response.data;
};

const getPaymentHistory = async () => {
  const response = await axios.get(
    `${PAYMENT_URL}history`,
    { withCredentials: true }
  );
  return response.data;
};

const paymentService = { createOrder, verifyPayment, getPaymentDetails, getPaymentHistory };

export default paymentService;