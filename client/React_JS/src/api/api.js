import axios from "axios";

function createApiInstance() {
  return axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      Authorization: JSON.parse(localStorage.getItem("auth")),
    },
  });
}
export const api = createApiInstance;
