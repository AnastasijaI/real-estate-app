import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedUser");
    const token = localStorage.getItem("token");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (err) {
        setUserRole(null);
      }
    }
  }, []);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("token"); 
    setUser(null);
    navigate("/login");
  };



  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };


  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#37474F" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" gap={2}>
            <img src="/logo2_transparent.png" alt="Logo" width={60} height={60} />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              color="inherit"
              sx={{ textDecoration: "none" }}
            >
              LiveIn
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Button color="inherit" component={Link} to="/properties">
              Properties
            </Button>
            <Button color="inherit" component={Link} to="/property/new">
              Add Property
            </Button>
            {user && userRole !== "Admin" && (
              <Button
                color="inherit"
                component={Link}
                to="/favourites"
                startIcon={<FavoriteIcon />}
              >
                Favourites
              </Button>
            )}
            {userRole === "Admin" && (
              <Button color="inherit" component={Link} to="/admin-panel">
                Admin Panel
              </Button>
            )}
            {user ? (
              <>
                <Avatar
                  src={
                    user.profileImage
                      ? `https://localhost:7026${user.profileImage}`
                      : undefined
                  }
                  alt="User"
                  sx={{ width: 32, height: 32, cursor: "pointer", bgcolor: "#1976d2", color: "white", fontSize: 14 }}
                  onClick={handleAvatarClick}
                >
                  {!user.profileImage && getInitials(user.fullName)}
                </Avatar>

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  {userRole !== "Admin" && (
                    <MenuItem
                      onClick={() => {
                        navigate(`/users/${user.userId}`);
                        handleMenuClose();
                      }}
                    >
                      My Profile
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout} sx={{
                    backgroundColor: "white",
                    color: "black",
                    ":hover": {
                      backgroundColor: "red",
                    },
                  }}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Box p={3}>{children}</Box>
    </>
  );
};

export default Layout;
