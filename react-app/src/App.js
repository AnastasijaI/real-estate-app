import logo from './logo.svg';
import './App.css';
import React from 'react';
import { store } from "./actions/store";
import { Provider } from "react-redux";
import Users from './components/Users';
import Properties from './components/Properties';
import { Container } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PropertyForm from './components/PropertyForm';
import Layout from "./components/Layout";
import PropertyDetails from "./components/PropertyDetails";
import Login from "./components/Login";
import Register from "./components/Register"; 
import UserDetails from "./components/UserDetails";
import Home from "./components/Home";
import PrivateRoute from "./components/PrivateRoute";
import AdminPanel from "./components/AdminPanel";
import Favourites from "./components/Favourites";
import EditUserPage from './components/EditUserPage';
import AppSurvey from './components/AppSurvey';
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/property/edit/:id" element={<PropertyForm />} />
            <Route path="/properties" element={<PrivateRoute><Properties /></PrivateRoute>} />
            <Route path="/property/new" element={<PrivateRoute><PropertyForm /></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
            <Route path="/property/details/:id" element={<PropertyDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/users/:id" element={<UserDetails />} />
            <Route path="/" element={<Home />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
            <Route path="/favourites" element={<Favourites />} /> 
            <Route path="/users/edit/:id" element={<EditUserPage />} />
            <Route path="/survey" element={<PrivateRoute><AppSurvey /></PrivateRoute>} />
         </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
