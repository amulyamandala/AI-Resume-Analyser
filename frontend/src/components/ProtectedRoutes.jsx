import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

function ProtectedRoute({ children }) {
  const {
    loading,
    isAuthenticated,
  } = useAuthStore();

  // Show toast only once
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("Please login first", {
        id: "auth-error",
      });
    }
  }, [loading, isAuthenticated]);

  // Loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-black text-lg">
          Loading...
        </p>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;