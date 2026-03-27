import axios from "axios";

const API = "http://localhost:5000/api";

export const getParents = () => {
  return axios.get(`${API}/parents`);
};

export const getCapabilities = (parentId) => {
  return axios.get(`${API}/capabilities/${parentId}`);
};
export const updateCapability = (id, data) => {
 return axios.put(`http://localhost:5000/api/capabilities/${id}`, data);
};

export const saveAllCapabilities = (data) => {
return axios.post("http://localhost:5000/api/capabilities/save-all", data);
};
