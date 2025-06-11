import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Paper, Typography, Box, Grid, Divider, Button } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const PropertyDetails = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [coordinates, setCoordinates] = useState(null);
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
        try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserRole(decoded.role);
        } catch (err) {
        console.error("Failed to decode token", err);
        }
    }
    }, []);
    useEffect(() => {
        fetch(`https://localhost:7026/api/properties/${id}`)
            .then(res => res.json())
            .then(data => {
                setProperty(data);

                if (data.location) {
                    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
                    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(data.location)}&key=${apiKey}`;

                    fetch(geocodeUrl)
                    .then(res => res.json())
                    .then(geo => {
                        if (geo.status === "OK" && geo.results.length > 0) {
                        const { lat, lng } = geo.results[0].geometry.location;
                        setCoordinates([lat, lng]);
                        } else {
                        setCoordinates([41.9981, 21.4254]);
                        }
                    });
                }
            })
            .catch(err => console.error("Failed to fetch property:", err));
    }, [id]);
    if (!property) return <Typography>Loading...</Typography>;

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this property?")) {
            fetch(`https://localhost:7026/api/properties/${property.propertyId}`, {
                method: "DELETE"
            }).then(() => {
                navigate("/"); 
            });
        }
    };
    const handleAddToFavourites = () => {
        const user = JSON.parse(localStorage.getItem("loggedUser"));
        if (!user) return alert("Please log in to add favourites.");

        fetch(`https://localhost:7026/api/favourites/user/${user.userId}`)
            .then((res) => res.json())
            .then((favourites) => {
            const alreadyExists = favourites.some(
                (fav) => fav.propertyId === property.propertyId
            );
            if (alreadyExists) {
                alert("This property is already in your favourites.");
            } else {
                fetch("https://localhost:7026/api/favourites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.userId,
                    propertyId: property.propertyId,
                }),
                })
                .then(async (res) => {
                    const msg = await res.text();
                    if (res.ok) alert("Added to favourites!");
                    else alert("Failed to add: " + msg);
                })
                .catch((err) => alert("Error: " + err.message));
            }
            })
            .catch((err) => alert("Failed to check favourites: " + err.message));
        };


    return (
        <Box sx={{ maxWidth: "1000px", margin: "auto", mt: 4, px: 2 }}>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: "whitesmoke", }}>
                <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                    {property.images?.length > 0 && (
                        <Swiper
                            navigation
                            modules={[Navigation]}
                            spaceBetween={10}
                            slidesPerView={1}
                            style={{ width: "550px", height: "350px", borderRadius: "10px" }}
                        >
                            {property.images.map((img, index) => (
                                <SwiperSlide key={index}>
                                   <img
                                        src={
                                          img.imageUrl.includes("no_image.jpg")
                                            ? "/no_image.jpg"
                                            : `https://localhost:7026${img.imageUrl}`
                                        }

                                        alt={`Image ${index + 1}`}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            borderRadius: "10px",
                                            backgroundColor: "#f2f2f2" 
                                        }}
                                    />

                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                    <Box sx={{ flex: 1, minWidth: 300 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h4" gutterBottom sx={{ color: "darkblue" }}>
                                {property.title}
                            </Typography>
                            {userRole !== "Admin" && (
                            <Button
                                onClick={handleAddToFavourites}
                                sx={{ minWidth: 0 }}
                                title="Add to Favourites"
                                >
                                <FavoriteBorderIcon sx={{ color: "red" }} />
                            </Button>
                            )}
                        </Box>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            {property.location}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
                            <Typography variant="h5" color="darkgreen" sx={{ fontWeight: "bold" }}>
                                {(property.size * property.price).toLocaleString()} €
                            </Typography>
                            {property.isSold && (
                                <Typography sx={{ color: "red", fontWeight: "bold" }}>
                                SOLD
                                </Typography>
                            )}
                            </Box>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body1" gutterBottom>{property.description}</Typography>

                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={6}>
                                <Typography><strong> m²:</strong> €{property.price}</Typography>
                                <Typography><strong>Rooms:</strong> {property.rooms}</Typography>
                                <Typography
                                    sx={{ cursor: "pointer", color: "#1976d2" }}
                                    onClick={(e) => {
                                        e.stopPropagation(); 
                                        navigate(`/user/${property.userId}`);
                                    }}
                                    >
                                    </Typography>

                                <Typography><strong>Size:</strong> {property.size} m²</Typography>
                                <Typography><strong>Sold:</strong> {property.isSold ? "Yes" : "No"}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography><strong>Category:</strong> {property.category?.name}</Typography>
                                <Box display="flex" alignItems="center" mt={1}>
                                    <Typography>
                                        <strong>Posted by: </strong>
                                        <a
                                            href={`/users/${property.user?.userId}`}
                                            style={{ textDecoration: "none", color: "#1976d2", fontWeight: "bold" }}
                                        >
                                            {property.user?.fullName}
                                        </a>
                                    </Typography>
                                     <img
                                        src={
                                            property.user?.profileImage
                                                ? `https://localhost:7026${property.user.profileImage}`
                                                : "/default_user.png"
                                        }
                                        alt="User"
                                        style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 10 }}
                                    />
                                </Box>

                                <Typography sx={{ mt: 1 }}>
                                    <strong>Contact me:</strong> {property.user?.phoneNumber || "DM me"}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                {coordinates && (
                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>Location Map</Typography>
                    <MapContainer
                    center={coordinates}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: "300px", borderRadius: "8px" }}
                    >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={coordinates}>
                        <Popup>{property.location}</Popup>
                    </Marker>
                    </MapContainer>
                </Box>
                )}


                {userRole === "Admin" && (
                    <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                        <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate(`/property/edit/${property.propertyId}`)}
                        >
                        Edit
                        </Button>
                        <Button variant="outlined" color="error" onClick={handleDelete}>
                        Delete
                        </Button>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default PropertyDetails;
