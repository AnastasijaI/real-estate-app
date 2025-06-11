import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useForm = (initialValues, onSubmit, onSuccess) => {
  const [values, setValues] = useState(initialValues);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    //formData.append("ProfileImage", values.profileImage);
    formData.append("FullName", values.fullName);
    formData.append("Email", values.email);
    formData.append("Password", values.password);
    formData.append("Role", values.role);
    formData.append("contact", values.contact);
    if (values.profileImage) {
      formData.append("profileImage", values.profileImage); // image key останува како што е
    }

    console.log("FormData being sent:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      await onSubmit(formData);
      if (onSuccess) onSuccess();
      if (values.userId) {
        navigate(`/users/${values.userId}`); 
      }
    } catch (err) {
      console.error("Create/Update failed:", err);
    }
  };

  return {
    values,
    setValues,
    handleChange,
    handleSubmit
  };
};


export default useForm;
