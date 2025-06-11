import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Paper, Typography } from "@mui/material";
import { connect } from "react-redux";
import * as actions from "../actions/property";
import usePropForm from "./usePropForm";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

const initialValues = {
    propertyId: 0,
    title: "",
    description: "",
    price: "",
    rooms: "",
    size: "",
    location: "",
    isSold: false,
    categoryId: "",
    userId: "",
    imageUrls: []
};

const PropertyForm = (props) => {
    const { propertyToEdit } = props;
    const { id } = useParams();
    const navigate = useNavigate();
    const [existingImageUrls, setExistingImageUrls] = useState([]);

    // useEffect(() => {
    //     if (id) {
    //         fetch(`https://localhost:7026/api/properties/${id}`)
    //             .then(res => res.json())
    //             .then(data => setValues({ ...data }));
    //     }
    // }, [id]);
    useEffect(() => {
  if (id) {
    const token = localStorage.getItem("token");

    fetch(`https://localhost:7026/api/properties/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setValues(data);

        if (Array.isArray(data.images)) {
          setExistingImageUrls(
            data.images.map((img) => ({
              id: img.imageId,
              url: `https://localhost:7026${img.imageUrl}`,
            }))
          );
        }
      })
      .catch((err) => console.error("Failed to load property:", err));
  }
}, [id]);


    const handleFormSubmit = async () => {
        const imageUrls = await uploadImages();
        const formattedValues = {
            ...values,
            // imageUrls: imageUrls.length > 0 ? imageUrls : ["/no_image.jpg"],
            imageUrls: [
              ...existingImageUrls.map(img => {
                const filename = img.url.split("/images/properties/")[1];
                return filename ? `/images/properties/${filename}` : img.url;
              }),
              ...imageUrls
            ],

            price: parseFloat(values.price),
            rooms: parseInt(values.rooms),
            size: parseFloat(values.size),
            categoryId: parseInt(values.categoryId),
            userId: JSON.parse(localStorage.getItem("loggedUser"))?.userId,
            isSold: values.isSold === "true" || values.isSold === true
        };

        console.log("Formatted values:", formattedValues);
        const onSuccess = () => {
            resetForm();
            props.fetchAllProperties();
            navigate("/properties"); 
        };


        if (values.propertyId === 0) {
            props.createProperty(formattedValues, onSuccess);
        } else {
            props.updateProperty(values.propertyId, formattedValues, onSuccess);
        }
    }
    
    const {
        values, setValues, handleChange, handleSubmit, resetForm
    } = usePropForm(initialValues, handleFormSubmit);

    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        fetch("https://localhost:7026/api/users")
            .then(res => res.json())
            .then(data => {
            console.log("Users fetched:", data); // 👈
            setUsers(data);
        });

        fetch("https://localhost:7026/api/Categories")
            .then(res => res.json())
            .then(data => {
            console.log("Categories fetched:", data); // 👈
            setCategories(data);
        });
    }, []);
    const uploadImages = async () => {
        if (selectedFiles.length === 0) return [];

        const formData = new FormData();
        selectedFiles.forEach(file => formData.append("images", file));

        const response = await fetch("https://localhost:7026/api/upload", {
            method: "POST",
            body: formData
        });

        const fileNames = await response.json();
        return fileNames;
    };

    useEffect(() => {
        if (!propertyToEdit) return;

        setValues({ ...propertyToEdit });

        if (Array.isArray(propertyToEdit.images) && propertyToEdit.images.length > 0) {
            setSelectedFiles([]);
        }
    }, [propertyToEdit]);


    const handleImageUpload = (files) => {
        const fileArray = Array.from(files);
        setSelectedFiles(fileArray);
    };

    const handleDeleteImage = (imageId) => {
      fetch(`https://localhost:7026/api/PropertyImages/${imageId}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to delete image");
          setExistingImageUrls((prev) => prev.filter((img) => img.id !== imageId));
        })
        .catch((err) => alert("Error deleting image: " + err.message));
    };


    const {
      ready,
      value: autoValue,
      suggestions: { status, data },
      setValue: setAutoValue,
      clearSuggestions,
    } = usePlacesAutocomplete();

    useEffect(() => {
      if (values.location) {
        setAutoValue(values.location, false);
      }
    }, [values.location]);

    const handleLocationSelect = async (address) => {
      setAutoValue(address, false);
      clearSuggestions();
      setValues((prev) => ({ ...prev, location: address }));

      try {
        const results = await getGeocode({ address });
        const { lat, lng } = await getLatLng(results[0]);
        console.log("Selected coordinates:", lat, lng);
      } catch (error) {
        console.error("Geocode error:", error);
      }
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
    <Paper elevation={4} sx={{ width: 500, margin: "20px", p: 4, borderRadius: 3, background: "linear-gradient(to bottom right, #ffffff, #f1f1f1)", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
      <Typography
        variant="h4"
        textAlign="center"
        fontWeight="bold"
        gutterBottom
        sx={{ color: "#1565c0", letterSpacing: 1 }}
      >
        {values.propertyId === 0 ? "Add New Property" : "Edit Property"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
        <TextField label="Title" name="title" value={values.title} onChange={handleChange} required />
        <TextField label="Description" name="description" value={values.description} onChange={handleChange} multiline rows={3} />
        <TextField label="Price (€)" type="number" name="price" value={values.price} onChange={handleChange} required />
        <TextField label="Rooms" type="number" name="rooms" value={values.rooms} onChange={handleChange} required />
        <TextField label="Size (m²)" type="number" name="size" value={values.size} onChange={handleChange} required />
        <Box sx={{ position: "relative" }}>
          <TextField
            label="Location"
            value={autoValue}
            onChange={(e) => {
              setAutoValue(e.target.value);
              setValues((prev) => ({ ...prev, location: e.target.value }));
            }}
            disabled={!ready}
            fullWidth
            required
          />
          {status === "OK" && (
            <Box sx={{
              border: "1px solid #ccc",
              borderRadius: 1,
              backgroundColor: "#fff",
              zIndex: 10,
              position: "absolute",
              maxHeight: 200,
              overflowY: "auto",
              width: "100%",
            }}>
              {data.map(({ place_id, description }) => (
                <Box
                  key={place_id}
                  onClick={() => handleLocationSelect(description)}
                  sx={{ px: 2, py: 1, cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }}
                >
                  {description}
                </Box>
              ))}
            </Box>
          )}
        </Box>


        <TextField select label="Sold?" name="isSold" value={values.isSold} onChange={handleChange} SelectProps={{ native: true }}>
          <option value={false}>No</option>
          <option value={true}>Yes</option>
        </TextField>

        <TextField select label="Category" name="categoryId" value={values.categoryId} onChange={handleChange} required SelectProps={{ native: true }}>
          <option value="">-- Select --</option>
          {categories.map(cat => (
            <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
          ))}
        </TextField>

        <label>Upload Images:</label>
        <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e.target.files)} />

        {selectedFiles.length > 0 && (
          <Box display="flex" gap={2} flexWrap="wrap" mt={1}>
            {selectedFiles.map((file, idx) => (
              <Box key={idx} sx={{ width: 100, height: 100, overflow: "hidden", borderRadius: 2 }}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview-${idx}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            ))}
          </Box>
        )}
        {existingImageUrls.length > 0 && (
          <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
            {existingImageUrls.map((img, idx) => (
              <Box key={idx} sx={{ position: "relative", width: 100, height: 100 }}>
                <img
                  src={img.url}
                  alt={`existing-${idx}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }}
                />
                <Button
                  size="small"
                  color="error"
                  sx={{ position: "absolute", top: 0, right: 0, minWidth: 0 }}
                  onClick={() => handleDeleteImage(img.id)}
                >
                  ×
                </Button>
              </Box>
            ))}
          </Box>
        )}
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          sx={{
            mt: 3,
            backgroundColor: "#1976d2",
            fontWeight: "bold",
            ":hover": {
              backgroundColor: "#115293"
            }
          }}
        >
          {values.propertyId === 0 ? "Save Property" : "Update Property"}
        </Button>

      </Box>
    </Paper>
    </Box>
  );
};



const mapDispatchToProps = {
    createProperty: actions.create,
    updateProperty: actions.update,
    fetchAllProperties: actions.fetchAll
};

export default connect(null, mapDispatchToProps)(PropertyForm);
