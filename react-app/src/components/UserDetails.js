import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Divider
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`https://localhost:7026/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or not found");
        return res.json();
      })
      .then(setUser)
      .catch((err) => console.error("Failed to fetch user:", err));

    fetch("https://localhost:7026/api/properties", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const userProps = data.filter((p) => p.userId === parseInt(id));
        setProperties(userProps);
      })
      .catch((err) => console.error("Failed to fetch properties:", err));
  }, [id]);

  if (!user)
    return <Typography sx={{ mt: 5, textAlign: "center" }}>Loading...</Typography>;

  const handleDelete = (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      fetch(`https://localhost:7026/api/properties/${propertyId}`, {
        method: "DELETE",
      })
        .then(() => {
          setProperties((prev) =>
            prev.filter((p) => p.propertyId !== propertyId)
          );
        })
        .catch((err) => alert("Failed to delete: " + err.message));
    }
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${user.contact}`;

    fetch("https://localhost:7026/api/interactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        buyerId: loggedUser.userId,
        sellerId: user.userId,
        timestamp: new Date(),
        method: "phone"
      }),
    }).catch((err) => console.error("Interaction not saved:", err));
  };

  
  return (
    <Paper sx={{ p: 3, backgroundImage: `url("/pexels-photo.jpg")`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
           <Typography variant="h5" fontWeight="bold" sx={{ color: "whitesmoke" }}>
              LiveIn Platform
            </Typography>
          <Typography variant="body1" sx={{ color: "whitesmoke" }}>Find your next perfect place to live.</Typography>
      </Box>
    <Box sx={{ maxWidth: "1100px", mx: "auto", mt: 5, px: 2 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          background: "linear-gradient(to right, #e3f2fd, #bbdefb)",
          borderRadius: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Avatar
            src={user.profileImage ? `https://localhost:7026${user.profileImage}` : "/default_user.png"}
            sx={{ width: 100, height: 100 }}
          />
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {user.fullName}
              {loggedUser?.userId === user.userId && (
                <IconButton size="small" onClick={() => navigate(`/users/edit/${user.userId}`)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </Typography>
            <Typography><strong>Email:</strong> {user.email}</Typography>
            <Typography>
              <strong>Phone:</strong>{" "}
              {user.contact ? (
                <span onClick={handlePhoneClick} style={{ color: "#1976d2", cursor: "pointer", textDecoration: "underline" }}>
                  {user.contact}
                </span>
              ) : (
                "Not provided"
              )}
            </Typography>

          </Box>
        </Box>
      </Paper>

      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{color: "white"}}>
        Properties posted by {user.fullName}
      </Typography>
      <Divider sx={{ mb: 3, backgroundColor: "white" }} />

      {properties.length === 0 ? (
        <Typography>No properties found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {properties.map((property) => {
            const imageUrl =
              property.images?.[0]?.imageUrl
                ? `https://localhost:7026${property.images[0].imageUrl}`
                : "/no_image.jpg";

            return (
              <Grid item xs={12} sm={6} md={4} key={property.propertyId}>
                <Card
                  sx={{
                    height: 350,
                    width:  200,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: 3,
                    boxShadow: 3,
                  }}
                >
                  <CardActionArea onClick={() => navigate(`/property/details/${property.propertyId}`)}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={imageUrl}
                      alt={property.title}
                    />
                    <CardContent>
                      <Typography variant="h6" noWrap>{property.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {property.location}
                      </Typography>
                      <Typography variant="body2">
                        {property.rooms} rooms — {property.size} m²
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color="green">
                        {(property.price * property.size).toLocaleString()} €
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                 {loggedUser?.userId === user.userId && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", px: 2, pb: 2 }}>
                    <Typography
                      onClick={() => navigate(`/property/edit/${property.propertyId}`)}
                      sx={{ color: "#1976d2", cursor: "pointer" }}
                    >
                      Edit
                    </Typography>
                    <Typography
                      onClick={() => handleDelete(property.propertyId)}
                      sx={{ color: "red", cursor: "pointer" }}
                    >
                      Delete
                    </Typography>
                  </Box>
                )}
              </Card>
            </Grid>
          );
        })}
</Grid>
      )}
    </Box>
    </Paper>
  );
};

export default UserDetails;
