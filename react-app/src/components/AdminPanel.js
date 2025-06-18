import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  IconButton,
  Paper,
  Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CategoryIcon from "@mui/icons-material/Category";
import GroupIcon from "@mui/icons-material/Group";
import HomeWorkIcon from "@mui/icons-material/HomeWork";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "Admin") {
        return navigate("/unauthorized");
      }
    } catch (err) {
      return navigate("/login");
    }

    fetchCategories();
    fetch("https://localhost:7026/api/appsurveys/all", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSurveys(data))
      .catch((err) => console.error("Failed to load surveys", err));
  }, [navigate]);

  const fetchCategories = () => {
    fetch("https://localhost:7026/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Failed to load categories", err));
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    fetch("https://localhost:7026/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategoryName })
    }).then(() => {
      setNewCategoryName("");
      fetchCategories();
    });
  };

  const handleDeleteCategory = (id) => {
    fetch(`https://localhost:7026/api/categories/${id}`, { method: "DELETE" }).then(() =>
      fetchCategories()
    );
  };

  const handleEditCategory = (category) => {
    setEditingId(category.categoryId);
    setEditingName(category.name);
  };

  const handleSaveCategory = () => {
    fetch(`https://localhost:7026/api/categories/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId: editingId, name: editingName })
    }).then(() => {
      setEditingId(null);
      setEditingName("");
      fetchCategories();
    });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        ⚙️ Admin Panel
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Welcome, Admin! Use the options below to manage your platform content.
      </Typography>

      <Box display="flex" gap={2} mb={5}>
        <Button
          variant="contained"
          startIcon={<GroupIcon />}
          onClick={() => navigate("/users")}
          sx={{ backgroundColor: "#1976d2", textTransform: "none" }}
        >
          Manage Users
        </Button>
        <Button
          variant="contained"
          startIcon={<HomeWorkIcon />}
          onClick={() => navigate("/properties")}
          sx={{ backgroundColor: "#388e3c", textTransform: "none" }}
        >
          Manage Properties
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h5" fontWeight="bold" gutterBottom>
        <CategoryIcon sx={{ verticalAlign: "middle", mr: 1 }} />
        Manage Categories
      </Typography>

      <Box display="flex" gap={2} mb={3} mt={1}>
        <TextField
          label="New Category"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          size="small"
        />
        <Button
          variant="contained"
          onClick={handleAddCategory}
          sx={{ backgroundColor: "#5e35b1", textTransform: "none" }}
        >
          Add Category
        </Button>
      </Box>

      <Paper elevation={3} sx={{backgroundColor:"lightgray"}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.categoryId}>
                <TableCell>{cat.categoryId}</TableCell>
                <TableCell>
                  {editingId === cat.categoryId ? (
                    <TextField
                      size="small"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                    />
                  ) : (
                    cat.name
                  )}
                </TableCell>
                <TableCell align="right">
                  {editingId === cat.categoryId ? (
                    <IconButton onClick={handleSaveCategory} color="primary">
                      <SaveIcon />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => handleEditCategory(cat)} color="primary">
                      <EditIcon />
                    </IconButton>
                  )}
                  <IconButton onClick={() => handleDeleteCategory(cat.categoryId)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Divider sx={{ my: 5 }} />
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          📝 Survey Responses
        </Typography>

        {surveys.map((s) => (
          <Paper key={s.id} elevation={2} sx={{ p: 2, mb: 2, backgroundColor: "#f9f9f9" }}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ cursor: "pointer", color: "#1976d2", "&:hover": { textDecoration: "underline" } }}
              onClick={() => navigate(`/users/${s.userId}`)}
            >
              {s.fullName} ({s.email})
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Likes most:</strong> {s.likesMost}
            </Typography>
            <Typography variant="body2">
              <strong>Would improve:</strong> {s.improvements}
            </Typography>
            <Typography variant="body2">
              <strong>Would recommend:</strong> {s.wouldRecommend ? "Yes" : "No"}
            </Typography>
            <Typography variant="body2">
              <strong>Rating:</strong> {s.rating} ⭐
            </Typography>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Submitted at: {new Date(s.submittedAt).toLocaleString()}
            </Typography>
          </Paper>
        ))}
    </Box>
  );
};
export default AdminPanel;
