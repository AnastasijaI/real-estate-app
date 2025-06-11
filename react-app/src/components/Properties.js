import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as actions from "../actions/property";
import { Grid, Paper, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Properties = (props) => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState(""); 


   const { fetchAllProperties } = props;

    useEffect(() => {
        fetchAllProperties();
    }, [fetchAllProperties]);

    useEffect(() => {
        console.log("Fetched properties:", props.propertyList);
    }, [props.propertyList]);

    const handleEdit = (property) => {
        navigate(`/property/edit/${property.propertyId}`);
    };

    const handleNewProperty = () => {
        navigate("/property/new");
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this property?")) {
            props.deleteProperty(id, () => {
                props.fetchAllProperties();
            });
        }
    };

    const filteredList = [...(props.propertyList || [])]
       .filter(item => {
            const title = item.title?.toLowerCase() || "";
            const location = item.location?.toLowerCase() || "";
            const keyword = search.toLowerCase();
            return title.includes(keyword) || location.includes(keyword);
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "priceAsc":
                    return (a.price * a.size) - (b.price * b.size);
                case "priceDesc":
                    return (b.price * b.size) - (a.price * a.size);
                case "titleAsc":
                    return a.title.localeCompare(b.title);
                case "titleDesc":
                    return b.title.localeCompare(a.title);
                default:
                    return 0;
            }
    });

    return (
        <Paper sx={{ p: 3, backgroundImage: `url("/pexels-photo-1612351.webp")`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Box display="flex" alignItems="center" gap={2}>
                    <img src="/logo2.png" alt="Logo" style={{ width: 90, height: 80 }} />
                    <Typography variant="h4" sx={{ fontWeight: "bold", color: "whitesmoke" }}>LiveIn Property Listings</Typography>
                </Box>
                <Typography variant="body1" sx={{ color: "whitesmoke" }}>Find your next perfect place to live.</Typography>
            </Box>
            <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                <input
                    type="text"
                    placeholder="Search by title or location"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ padding: "8px", width: "250px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                >
                    <option value="">Sort By</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                    <option value="titleAsc">Title A-Z</option>
                    <option value="titleDesc">Title Z-A</option>
                </select>
            </Box>

            <Grid container spacing={3}>
                {filteredList.length > 0 ? (
                    filteredList.map((item) => {
                        const firstImage = item.images?.[0]?.imageUrl
                            ? `https://localhost:7026${item.images[0].imageUrl}`
                            : "/no_image.jpg";

            return (
                <Grid item xs={12} sm={6} md={4} key={item.propertyId}>
                    <Box 
                        onClick={() => navigate(`/property/details/${item.propertyId}`)}
                        sx={{ cursor: "pointer", '&:hover': { boxShadow: 6 } }}
                    >
                            <Paper
                                sx={{
                                    p: 2,
                                    height: "325px",
                                    width: "230px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    backgroundColor: "#fdfdfd", 
                                    border: "1px solid #e0e0e0",
                                    borderRadius: 2,
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)", 
                                    transition: "transform 0.2s ease-in-out",
                                    "&:hover": {
                                    transform: "scale(1.02)",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                                    }
                                }}
                            >
                            <Box
                                component="img"
                                src={firstImage}
                                alt={item.title}
                                sx={{
                                    width: "100%",
                                    height: 180,
                                    objectFit: "cover",
                                    borderRadius: 1,
                                    mb: 2,
                                    backgroundColor: "#f0f0f0"
                                }}
                            />
                            <Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: "bold",
                                        color: "#1a237e" 
                                    }}
                                >
                                    {item.title}
                                </Typography>
                                <Typography>Location: {item.location}</Typography>
                                <Typography>Rooms: {item.rooms}</Typography>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography>Size: {item.size} m²</Typography>
                                    <Typography sx={{color: "darkgreen"}}>
                                        <strong>{(item.size * item.price).toLocaleString()} €</strong>
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                </Grid>
            );
        })
            ) : (
                <Grid item xs={12}>
                    <Typography>No properties available.</Typography>
                </Grid>
            )}
         </Grid>
        </Paper>
    );
};

const mapStateToProps = (state) => ({
    propertyList: state.property.list || []
});


const mapDispatchToProps = {
    fetchAllProperties: actions.fetchAll,
    deleteProperty: actions.deleteProperty
};

export default connect(mapStateToProps, mapDispatchToProps)(Properties);
