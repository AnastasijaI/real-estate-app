import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("https://localhost:7026/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Login failed");
        return res.json();
      })
      .then(data => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("loggedUser", JSON.stringify(data.user));
        navigate("/");
        window.location.reload();
      })
      .catch(err => {
        console.error(err);
        setErrorMessage("Invalid email or password.");
      });

  };

  return (
    <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundImage: "url('/pexels-photo-1612351.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            px: 2,
          }}
        >
    <Paper sx={{ width: 350, margin: 10, p: 4, boxShadow: 6 }}>
      <Box textAlign="center" mb={3}>
        <img src="/logo2_transparent.png" alt="LiveIn Logo" width={80} style={{ animation: "spin 1s ease-in-out" }} />
        <Typography variant="h5" mt={2} fontWeight="bold">
          Welcome back
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Log in to your account
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          required
        />
        <Button variant="contained" type="submit" fullWidth>
          Login
        </Button>
      </Box>

      {errorMessage && (
        <Typography color="error" fontSize={14} mt={2} textAlign="center">
          {errorMessage}
        </Typography>
      )}

      <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
        <Link href="#" underline="hover" fontSize={14}>
          Forgot password?
        </Link>
        <Link
          component="button"
          onClick={() => navigate("/register")}
          underline="hover"
          fontSize={14}
        >
          Don't have an account?
        </Link>
      </Box>
    </Paper>
    </Box>
  );
};

const style = document.createElement("style");
style.innerHTML = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`;
document.head.appendChild(style);

export default Login;
