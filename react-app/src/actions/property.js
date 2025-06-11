import api from "./api";
import axios from "axios";

export const ACTION_TYPES = {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    FETCH_ALL: 'FETCH_ALL'
};


export const fetchAll = () => dispatch => {
  const token = localStorage.getItem("token");

  fetch("https://localhost:7026/api/properties", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    })
    .then(data => {
        console.log("Fetched from API:", data);
      dispatch({
        type: ACTION_TYPES.FETCH_ALL,
        payload: data
      });
    })
    .catch(error => {
      console.error("Error fetching properties:", error);
    });
};

export const create = (data, onSuccess) => dispatch => {
    api.property().create(data)
        .then(res => {
            dispatch({
                type: ACTION_TYPES.CREATE,
                payload: res.data
            });
            if (onSuccess) onSuccess();
        })
        .catch(err => console.log(err));
};

export const update = (id, data, onSuccess) => dispatch => {
    api.property().update(id, data)
        .then(res => {
            dispatch({
                type: ACTION_TYPES.UPDATE,
                payload: { id, ...data }
            });
            onSuccess?.();
        })
        .catch(err => console.log(err));
};

export const deleteProperty = (id, onSuccess) => dispatch => {
    api.property().delete(id)
        .then(res => {
            dispatch({
                type: ACTION_TYPES.DELETE,
                payload: id
            });
            onSuccess?.();
        })
        .catch(err => console.log(err));
};