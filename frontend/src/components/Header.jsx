import React from 'react'
import { NavLink, useNavigate } from 'react-router'
import { useAuthStore } from "../store/authStore.js"
import toast from "react-hot-toast";
import {
  container,
  flexBetween,
  navLogo,
  navLinks,
  navLink,
  activeNavLink,
} from "../styles/common";
function Header() {
  const navigate=useNavigate()
  const {isAuthenticated,logout}=useAuthStore()
  const handleLogout = async()=>{

  /* CLEAR OLD USER DATA */
  localStorage.removeItem(
    "resumeId"
  );

  localStorage.removeItem(
    "analysis"
  );

  await logout();
  toast.error("Successfully logged out");

  navigate("/");

}
  return (
    <header className="w-full h-20 bg-white border-b border-[#f0f0f3] sticky top-0 z-50">
      <div className={`${container} ${flexBetween} h-full px-6 md:px-12`}>
        {/* Logo */}
        <NavLink
          to="/"
          className={`${navLogo} text-4xl`}
        >
          ReZure
        </NavLink>
        {/* Navigation */}
        <nav className={`${navLinks} gap-8`}>
          {/* PUBLIC HEADER */}
          {!isAuthenticated && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? `${activeNavLink} text-[17px] font-bold`
                    : `${navLink} text-[15px] font-medium`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive
                    ? `${activeNavLink} text-[17px] font-bold`
                    : `${navLink} text-[15px] font-medium`
                }
              >
                Register
              </NavLink>

            </>
          )}

          {/* PRIVATE HEADER */}
          {isAuthenticated && (
            <>
             <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? `${activeNavLink} text-[17px] font-bold`
                    : `${navLink} text-[15px] font-medium`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? `${activeNavLink} text-[17px] font-bold`
                    : `${navLink} text-[15px] font-medium`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/user-profile"
                className={({ isActive }) =>
                  isActive
                    ? `${activeNavLink} text-[17px] font-bold`
                    : `${navLink} text-[15px] font-medium`
                }
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="h-11 px-6 rounded-md bg-black hover:bg-[#1a1a1a] text-white text-sm font-medium transition duration-200"
              >
                Logout
              </button>

            </>
          )}

        </nav>

      </div>

    </header>
  )
}

export default Header