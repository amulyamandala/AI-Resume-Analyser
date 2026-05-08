
import {
  pageWrapper,
  centeredFlex,
  featureCard,
  heroTitle,
  bodyText,
  mutedText,
  textInput,
  primaryBtn,
  tertiaryBtn,
} from "../styles/common";
import {useForm} from 'react-hook-form'
import { NavLink, useNavigate, useLocation } from "react-router";
import { useAuthStore } from "../store/authStore.js";
import { useEffect } from "react";
import {toast} from 'react-hot-toast'

function Login() {
      const {register,handleSubmit,formState: { errors }} = useForm();
      const navigate=useNavigate()
      const {login,currentUser,loading,error,isAuthenticated}=useAuthStore((state)=>state)
      const onUserLogin=(userCredObj)=>{
      login(userCredObj)
      }
      useEffect(()=>{
        if(isAuthenticated===true){
        toast.success("Login success and Redirecting to Home")
        navigate("/")
      }
      },[isAuthenticated])
      if (loading) {
       return <p className="text-center py-10">Loading...</p>;
      }
  return (
    <div className={`${pageWrapper} ${centeredFlex} px-4 py-20`}>
      
      {/* Login Card */}
      <div className={`${featureCard} w-full max-w-md`}>
        
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className={heroTitle}>
            Welcome
          </h1>

          <p className={`${bodyText} mt-3`}>
            Sign in to continue analyzing resumes
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit(onUserLogin)}>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#171717] mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              className={textInput}
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">Email is required</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#171717] mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className={textInput}
              {...register("password", { required: true })}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">Password is required</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              type="button"
              className={tertiaryBtn}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`${primaryBtn} w-full`}
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className={`${mutedText} text-center mt-6`}>
          Don&apos;t have an account?{" "}
          
          <NavLink
            to="/register"
            className={tertiaryBtn}
          >
            Create one
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;