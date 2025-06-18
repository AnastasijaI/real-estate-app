import React, {useState, useEffect} from "react";
import { Box, Button, Typography, Divider, Grid, Fade } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Rating } from "@mui/material";

const Home = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp > currentTime) {
        setIsAuthenticated(true);
        if (decoded.role === "Admin") {
        console.log("Admin logged in");
      }
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      setIsAuthenticated(false);
    }
  }, []);
  useEffect(() => {
    fetch("https://localhost:7026/api/appsurveys/average-rating")
      .then((res) => res.json())
      .then((data) => {
        setAverageRating(data.averageRating || 0);
      })
      .catch((err) => console.error("Failed to fetch rating:", err));
  }, []);
  return (
    <Box sx={{ width: "100%", backgroundColor: "#f5f5f5" }} >
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: "url('/pexels-photo-731082.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start", 
          textAlign: "left", 
          px: 10,
          pt: 12,
          pb: 6
        }}
      >
        <Fade in timeout={1000}>
          <Box>
            <Typography variant="h2" fontWeight="bold" gutterBottom sx={{ textShadow: "1px 1px 3px #000" }}>
              Welcome to LiveIn
            </Typography>

            <Typography variant="h6" sx={{ mb: 4, maxWidth: 600, mx: "auto", textShadow: "1px 1px 2px #000" }}>
              Explore, manage and connect with real estate listings in one simple platform.
            </Typography>

            <Button
              onClick={() => navigate(isAuthenticated ? "/properties" : "/login")}
              sx={{
                backgroundColor: "#fff",
                color: "#000",
                fontWeight: "bold",
                px: 4,
                py: 1.5,
                borderRadius: "30px",
                textTransform: "none",
                fontSize: "1rem",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                transition: "all 0.3s ease-in-out",
                ":hover": {
                  backgroundColor: "#e0e0e0",
                  transform: "scale(1.05)"
                }
              }}
            >
              Explore Properties
            </Button>
          </Box>
        </Fade>
      </Box>

      <Box sx={{ py: 6, px: 3, backgroundColor: "lightgray" }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
          Discover Properties Tailored for You
        </Typography>
        <Grid container spacing={4} mt={2} justifyContent="center">
          {[
            {
              title: "Modern Apartments",
              img: "/apartment.jpg",
              desc: "Browse a wide selection of modern apartments in top locations."
            },
            {
              title: "Family Houses",
              img: "/house.jpg",
              desc: "Find spacious homes perfect for your growing family."
            },
            {
              title: "Vacation Rentals",
              img: "/vacation.jpg",
              desc: "Plan your next getaway with beautiful rental homes."
            }
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <img
                  src={feature.img}
                  alt={feature.title}
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
                  }}
                />
                <Typography variant="h6" fontWeight="bold" mt={2}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {feature.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ py: 6, px: 3, backgroundColor: "#fff", textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Popular Areas You’ll Love
        </Typography>
        <Grid container spacing={4} justifyContent="center" mt={2}>
          {[
            {
              name: "Vodno, Skopje",
              img: "/vodno.jpg",
              desc: "Peaceful green zone with modern villas and great city view."
            },
            {
              name: "Debar Maalo, Skopje",
              img: "/debar_maalo.jpg",
              desc: "Lively neighborhood with cafes, walkable streets and culture."
            },
            {
              name: "Ohrid Lakeside",
              img: "/ohrid.jpg",
              desc: "Perfect for vacation homes with stunning lake views."
            }
          ].map((area, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Box sx={{ p: 2 }}>
                <img
                  src={area.img}
                  alt={area.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
                  }}
                />
                <Typography variant="h6" fontWeight="bold" mt={2}>
                  {area.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {area.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ py: 6, px: 3, backgroundColor: "#ECEFF1", textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          How It Works
        </Typography>
        <Grid container spacing={4} justifyContent="center" mt={2}>
          {[
            { step: "1", title: "Search", desc: "Find listings based on your preferences." },
            { step: "2", title: "Connect", desc: "Get in touch with property managers or owners." },
            { step: "3", title: "Move In", desc: "Seal the deal and move into your new place." }
          ].map((s, i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h3" color="primary">{s.step}</Typography>
                <Typography variant="h6" fontWeight="bold">{s.title}</Typography>
                <Typography variant="body2" mt={1}>{s.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ backgroundColor: "#263238", color: "#fff", py: 6, px: 3, textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Stay updated with new listings
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "12px 16px",
              borderRadius: "25px 0 0 25px",
              border: "none",
              outline: "none",
              width: "300px"
            }}
          />
          <Button
            variant="contained"
            onClick={async () => {
              if (email.trim()) {
                try {
                  const response = await fetch("https://localhost:7026/api/subscribe", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(email)
                  });

                  if (response.ok) {
                    alert("Thank you for subscribing!");
                    setEmail("");
                  } else {
                    alert("Failed to subscribe.");
                  }
                } catch (err) {
                  alert("An error occurred while subscribing.");
                  console.error(err);
                }
              } else {
                alert("Please enter a valid email.");
              }
            }}

            sx={{
              borderRadius: "0 25px 25px 0",
              backgroundColor: "#00acc1",
              px: 4,
              ":hover": { backgroundColor: "#00838f" }
            }}
          >
            Subscribe
          </Button>
        </Box>
      </Box>
      <Box sx={{ backgroundColor: "#37474F", color: "#fff", py: 6, px: 3, textAlign: "center" }}>
        <img 
          src="/logo2_transparent.png"
          alt="LiveIn Logo"
          style={{ width: 120, height: 100 }}
        />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 800, mx: "auto", opacity: 0.9 }}>
          LiveIn is your go-to platform for finding and managing real estate listings.
          Whether you're a buyer, renter, or property manager, our tools are designed to help
          you connect efficiently and securely. We aim to make real estate experiences simpler,
          smarter, and more accessible.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            What users think:
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
            <Rating value={averageRating} precision={0.5} readOnly />
            <Typography variant="body1" sx={{ ml: 1 }}>
              {averageRating}/5
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ backgroundColor: "#ffffff55", my: 4 }} />

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 600, mx: "auto", opacity: 0.9 }}>
          📍 Skopje, Macedonia<br />
          📞 +389 70 123 456<br />
          ✉️ contact@livein.com
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
