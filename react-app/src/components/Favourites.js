import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Paper,
  colors,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

const Favourites = () => {
  const [properties, setProperties] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedUser"));
    if (!user) return;

    setUserId(user.userId);

    fetch(`https://localhost:7026/api/favourites/user/${user.userId}`)
      .then((res) => res.json())
      .then((favProperties) => {
        setProperties(favProperties);
      })
      .catch((err) => {
        console.error("Failed to load favourites:", err);
      });
  }, []);

  const handleRemoveFavourite = (propertyId) => {
    fetch(`https://localhost:7026/api/favourites/remove/${userId}/${propertyId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to remove");
        setProperties((prev) => prev.filter((p) => p.propertyId !== propertyId));
      })
      .catch((err) => alert("Failed to remove from favourites: " + err.message));
  };

  return (
    <Box
          sx={{
            minHeight: "80vh",
            display: "flex",
            backgroundImage: "url('/pexels-photo.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            px: 2,
          }}
        >
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{color:"white"}}>
        ♡ My Favourite Properties ♡ 
      </Typography>

      {properties.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          You haven’t saved any properties yet. Start browsing and tap the ❤️ icon!
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {properties.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property.propertyId}>
             <Card
                sx={{
                  position: "relative",
                  cursor: "pointer",
                  height: 260,
                  width: 200,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >

                <CardMedia
                  component="img"
                  height="180"
                  image={
                    property.images && property.images.length > 0
                      ? `https://localhost:7026${property.images[0].imageUrl}`
                      : "/default-property.jpg"
                  }

                  alt={property.title}
                  onClick={() => navigate(`/property/details/${property.propertyId}`)}
                />
                <CardContent
                  onClick={() => navigate(`/property/details/${property.propertyId}`)}
                >
                  <Typography variant="h6">{property.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {property.location} – €{property.price}
                  </Typography>
                </CardContent>
                <IconButton
                  onClick={() => handleRemoveFavourite(property.propertyId)}
                  sx={{ position: "absolute", top: 8, right: 8 }}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
    </Box>
  );
};

export default Favourites;
