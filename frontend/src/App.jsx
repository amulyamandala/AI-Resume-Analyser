import RootLayout from "./components/RootLayout";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./components/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoutes";
import Register from "./components/Register";
import UserProfile from "./components/UserProfile";
import Login from "./components/Login";
import StudyPlan from "./components/studyplan";
import react from 'react'
import {Toaster} from "react-hot-toast";
import { useContext } from "react";
import Dashboard from "./components/Dashboard";
function App() {
const routerObj=createBrowserRouter([
  {
    path:"/",
    element:<RootLayout />,
    children:[
      {
        path:"",
        element:<Home />,
      },
      {
        path:"register",
        element:<Register />,
      },
      {
        path:"login",
        element:<Login />,
      },
      {
        path:"dashboard",
        element:<Dashboard />
      },
      {
        path:"study-plan",
        element:<StudyPlan />
      },
      {
        path: "user-profile",
          element: (
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserProfile />
            </ProtectedRoute>
          ),
        },
    ]
  }
])
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={routerObj} />
    </div>
  )
}

export default App