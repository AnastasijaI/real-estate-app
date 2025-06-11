import axios from "axios";

const baseUrl = "https://localhost:7026/api/";

const API = {
  user(url = baseUrl + "users/") {
    return {
      fetchAll: () => axios.get(url),
      fetchById: (id) => axios.get(url + id),
      create: (newUser) =>
        axios.post(url, newUser, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
      update: (id, updateUser) => axios.put(url + id, updateUser),
      delete: (id) =>
        axios.delete(url + id, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
      }),
    };
  },

  property(url = baseUrl + "properties/") {
    return {
      fetchAll: () => axios.get(url),
      fetchById: (id) => axios.get(url + id),
      create: (newProperty) =>axios.post(url, newProperty), 
      update: (id, updateUser) => axios.put(url + id, updateUser),
      delete: (id) => axios.delete(url + id),
    };
  },
};

export default API;
