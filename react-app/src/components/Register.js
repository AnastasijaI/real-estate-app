import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Avatar } from "@mui/material";
import { Card, CardActionArea, CardContent } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    contact: "",
    role: "Buyer",
    profileImage: null
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage" && files.length > 0) {
      const file = files[0];
      setFormData(prev => ({ ...prev, profileImage: file }));
      setPreviewUrl(URL.createObjectURL(file)); 
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("FullName", formData.fullName);
    data.append("Email", formData.email);
    data.append("Password", formData.password);
    data.append("Contact", formData.contact);
    data.append("Role", formData.role);
    if (formData.profileImage) {
      data.append("profileImage", formData.profileImage);
    }

    fetch("https://localhost:7026/api/users", {
      method: "POST",
      body: data
    })
      .then(async res => {
        if (!res.ok) {
          const message = await res.text();
          throw new Error(message);
        }
        return res.json();
      })
      .then(data => {
        alert("User successfully registered!");
        navigate("/login");
      })
      .catch(err => {
        if (err.message.includes("Email already exists")) {
          setEmailError("This email is already registered.");
        } else {
          setEmailError("");
          alert("Something went wrong.");
        }
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
    <Paper sx={{ width: 400, margin: 5, p: 4 }}>
      <Box textAlign="center" mb={3}>
        <img src="/logo2_transparent.png" alt="LiveIn Logo" width={90} style={{ animation: "spin 1s ease-in-out" }} />
        <Typography variant="h5" mt={2} fontWeight="bold">Register now!</Typography>
        <Typography variant="body2" color="text.secondary">Create your new account</Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
        <TextField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
        <TextField label="Email" name="email" type="email" value={formData.email} onChange={(e) => {
            handleChange(e);
            setEmailError(""); 
          }}
          required
          error={!!emailError}
          helperText={emailError}
        />
        <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
        <TextField label="Contact" name="contact" value={formData.contact} onChange={handleChange} />
        <Typography variant="subtitle1" align="center" fontWeight="bold" mt={2}>
          How do you intend to use the platform?
        </Typography>
        <Box display="flex" justifyContent="center" gap={3} mt={1} mb={2}>
          <Card
            sx={{
              width: 150,
              border: formData.role === "Buyer" ? "2px solid #1976d2" : "1px solid #ccc",
              boxShadow: formData.role === "Buyer" ? 4 : 1,
              cursor: "pointer",
              transition: "0.3s"
            }}
            onClick={() => setFormData(prev => ({ ...prev, role: "Buyer" }))}
          >
            <CardActionArea>
              <CardContent sx={{ textAlign: "center" }}>
                <HomeIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="body1" fontWeight="bold">Buyer</Typography>
                <Typography variant="body2" color="text.secondary">Looking to buy</Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card
            sx={{
              width: 150,
              border: formData.role === "Seller" ? "2px solid #9c27b0" : "1px solid #ccc",
              boxShadow: formData.role === "Seller" ? 4 : 1,
              cursor: "pointer",
              transition: "0.3s"
            }}
            onClick={() => setFormData(prev => ({ ...prev, role: "Seller" }))}
          >
            <CardActionArea>
              <CardContent sx={{ textAlign: "center" }}>
                <StoreIcon color="secondary" sx={{ fontSize: 40 }} />
                <Typography variant="body1" fontWeight="bold">Seller</Typography>
                <Typography variant="body2" color="text.secondary">Looking to sell</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>

        <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={1} mb={2}>
          <Avatar
            src={previewUrl || "/default_user.png"}
            sx={{ width: 56, height: 56 }}
          />
          <Button
            variant="outlined"
            component="label"
          >
            Upload Profile Image
            <input
              hidden
              type="file"
              accept="image/*"
              name="profileImage"
              onChange={handleChange}
            />
          </Button>
        </Box>

        <Button variant="contained" type="submit">Register</Button>
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

export default Register;
