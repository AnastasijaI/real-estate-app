import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserForm from "./UserForm";

const EditUserPage = () => {
  const { id } = useParams();
  const [userToEdit, setUserToEdit] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`https://localhost:7026/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUserToEdit(data))
      .catch(err => console.error("Failed to load user:", err));
  }, [id]);

  if (!userToEdit) return <div>Loading...</div>;

  return <UserForm userToEdit={userToEdit} />;
};

export default EditUserPage;
