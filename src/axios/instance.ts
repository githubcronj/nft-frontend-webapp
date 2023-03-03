import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://nft.cronj.com/api/v1",
});
// export const apiClient = axios.create({
//   baseURL: "http://localhost:15000/api/v1/",
// });

