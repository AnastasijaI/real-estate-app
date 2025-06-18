import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch("https://localhost:7026/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus("Check your email for reset instructions.");
      } else {
        setStatus("User not found or failed to send email.");
      }
    } catch (err) {
      console.error(err);
      setStatus("An error occurred.");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>Forgot Password</Typography>
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" fullWidth onClick={handleSubmit}>Send Reset Link</Button>
        {status && <Typography mt={2}>{status}</Typography>}
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
