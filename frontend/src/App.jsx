import RootLayout from "./components/RootLayout";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoutes";
import Register from "./components/Register";
import UserProfile from "./components/UserProfile";
import Login from "./components/Login";
import React from 'react'
import { useContext } from "react";
function App() {
  return (
    <RootLayout/>
  )
}

export default App