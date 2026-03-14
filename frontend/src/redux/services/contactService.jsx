import axios from "axios";
import { BACKEND_URL } from "../../utils/url";

const CONTACT_URL = `${BACKEND_URL}/contact`;

const submitContact = async (formData) => {
  const response = await axios.post(CONTACT_URL, formData);
  return response.data;
};

const contactService = { submitContact };
export default contactService;
