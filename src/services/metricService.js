import axios from "axios";

// Base URL for API calls
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337/api";

const getMetric = async () => {
  const response = await axios.get(`${API_URL}/system-info/metrics`);
  return response.data?.data || {};
}

export { getMetric };
