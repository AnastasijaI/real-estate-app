import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Paper } from "@mui/material";
import { connect } from "react-redux";
import * as actions from "../actions/user";
import useForm from "./useForm";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

const initialValues = {
  fullName: "",
  email: "",
  password: "",
  role: "",
  contact: "",
  profileImage: null
};

const UserForm = (props) => {
  const {
    values,
    setValues,
    handleChange,
    handleSubmit
  } = useForm(
    initialValues,
    props.userToEdit
      ? (formData) => props.updateUser(props.userToEdit.userId, formData)
      : props.createUser,
    props.fetchAllUsers
  );

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (props.userToEdit) {
      setValues({
        fullName: props.userToEdit.fullName || "",
        email: props.userToEdit.email || "",
        password: props.userToEdit.password || "",
        role: props.userToEdit.role || "",
        contact: props.userToEdit.contact || "",
        profileImage: null,
        userId: props.userToEdit.userId,
      });

      if (props.userToEdit.profileImage) {
        setPreviewImage(`https://localhost:7026${props.userToEdit.profileImage}`);
      }
    }
  }, [props.userToEdit, setValues]);

  return (
    <Paper sx={{ p: 3 }}>
      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
        <TextField label="Full Name" name="fullName" value={values.fullName} onChange={handleChange} required />
        <TextField label="Email" name="email" type="email" value={values.email} onChange={handleChange} required />
        {!props.userToEdit && (
          <TextField
            label="Password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            required
          />
        )}

        <FormControl fullWidth required>
          <InputLabel>Role</InputLabel>
          <Select name="role" value={values.role} label="Role" onChange={handleChange}>
            <MenuItem value="Buyer">Buyer</MenuItem>
            <MenuItem value="Seller">Seller</MenuItem>
          </Select>
        </FormControl>

        <TextField label="Phone Number" name="contact" value={values.contact} onChange={handleChange} />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setValues((prev) => ({ ...prev, profileImage: file }));
              setPreviewImage(URL.createObjectURL(file));
              console.log("📸 Selected file:", file);
            }
          }}
        />

        {previewImage && (
          <Box mt={2}>
            <img
              src={previewImage}
              alt="Profile preview"
              style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover" }}
            />
            <p style={{ fontSize: "0.9rem", color: "#555" }}>
              {values.profileImage ? "New selected image" : "Current profile picture"}
            </p>
          </Box>
        )}

        <Button type="submit" variant="contained">Зачувај</Button>
      </Box>
    </Paper>
  );
};

const mapDispatchToProps = {
  createUser: actions.create,
  updateUser: actions.update,
  fetchAllUsers: actions.fetchAll
};

export default connect(null, mapDispatchToProps)(UserForm);
