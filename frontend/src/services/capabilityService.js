import axios from "axios";

const API = "http://localhost:5000/api";

export const getParents = () => {
  return axios.get(`${API}/parents`);
};

export const getCapabilities = (parentId) => {
  return axios.get(`${API}/capabilities/${parentId}`);
};
/*
export const getCapability = async () => {
  const response = await axios.get("http://localhost:5000/api/capabilities");

  // ✅ Ensure ALWAYS returns array
  return response.data.data || response.data;
};*/
export const updateCapability = (id, data) => {
 return axios.put(`http://localhost:5000/api/capabilities/${id}`, data);
};

export const saveAllCapabilities = (data) => {
return axios.post("http://localhost:5000/api/capabilities/save-all", data);
};
