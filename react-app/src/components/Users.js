import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as actions from "../actions/user";
import {
  Grid,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import UserForm from "./UserForm";
import { useNavigate } from "react-router-dom";

const Users = (props) => {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    props.fetchAllUsers();
  }, []);

  const handleToggleForm = () => {
    setShowForm((prev) => !prev);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      console.log("Deleting user with id:", id);
      props.deleteUser(id, () => props.fetchAllUsers());
    }
  };

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    const initials = parts.map(p => p[0]).join("");
    return initials.substring(0, 2).toUpperCase(); 
  };
  

  return (
    <Paper sx={{ m: 4, p: 4, boxShadow: 3, borderRadius: 3, backgroundColor: "#f4f4f4" }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          User Management
        </Typography>
        <Button variant="contained" onClick={handleToggleForm}>
          {showForm ? "Close Form" : "Add user"}
        </Button>
      </Grid>

      <Grid container spacing={4}>
        {showForm && (
          <Grid item xs={12}>
            <UserForm />
          </Grid>
        )}

        <Grid item xs={12}>
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: "#424242", color: "#fff" }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: "#424242", color: "#fff" }}>FullName</TableCell>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: "#424242", color: "#fff" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: "#424242", color: "#fff" }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: "#424242", color: "#fff" }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: "#424242", color: "#fff" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.userList.map((record, index) => (
                  <TableRow key={index} hover sx={{ backgroundColor:index % 2 === 0 ? "#fafafa" : "#f0f0f0" }}>
                   <TableCell>
                    {record.profileImage ? (
                      <img
                        src={`https://localhost:7026${record.profileImage}`}
                        alt={record.fullName}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          objectFit: "cover"
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          backgroundColor: "#ccc",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          fontSize: 14,
                          color: "#333"
                        }}
                      >
                        {getInitials(record.fullName)}
                      </div>
                    )}
                  </TableCell>

                     <TableCell
                      onClick={() => navigate(`/users/${record.userId}`)}
                      sx={{
                        cursor: "pointer",
                        color: "#1976d2",
                        textDecoration: "underline",
                        fontWeight: 500,
                      }}
                    >
                      {record.fullName}
                    </TableCell>
                    <TableCell>{record.email}</TableCell>
                    <TableCell>
                      {record.contact ? record.contact : <i style={{ color: "#999" }}>Not provided</i>}
                    </TableCell>
                    <TableCell>{record.role}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(record.userId)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Paper>
  );
};

const mapStateToProps = (state) => ({
  userList: state.user.list,
});

const mapActionToProps = {
  fetchAllUsers: actions.fetchAll,
  deleteUser: actions.Delete
};

export default connect(mapStateToProps, mapActionToProps)(Users);
