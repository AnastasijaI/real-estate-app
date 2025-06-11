import api from "./api";
export const ACTION_TYPES = {
    CREATE : 'CREATE',
    UPDATE : 'UPDATE',
    DELETE : 'DELETE',
    FETCH_ALL : 'FETCH_ALL'
}

export const fetchAll = () => dispach =>{
    api.user().fetchAll()
    .then(response => {
        dispach({
            type: ACTION_TYPES.FETCH_ALL,
            payload: response.data
        })
    }
    ).catch(err => console.log(err))
        
}

export const create = (formData) => dispatch => {
    api.user().create(formData)
      .then(res => {
        dispatch({ type: ACTION_TYPES.CREATE, payload: res.data });
        return res;
      })
      .catch(err => {console.log("Create error:", err);
      throw err;
    });
  };
  
export const update = (id, formData) => dispatch => {
  api.user().update(id, formData)
    .then(res => {
      dispatch({ type: ACTION_TYPES.UPDATE, payload: res.data });
    })
    .catch(err => console.log("Update error:", err));
};

export const Delete = (id, onSuccess) => dispatch => {
  api.user().delete(id)
    .then(res => {
      dispatch({ type: ACTION_TYPES.DELETE, payload: id });
      if (onSuccess) onSuccess();
    })
    .catch(err => console.log("Delete error:", err));
};
